import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { ConfigCronDto, CronJobType } from './dto/recommendations.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class RecommendationsService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RECOMMENDATION_SERVICE')
    private readonly recommendationClient: ClientProxy,
    @InjectQueue('email_cron_queue') private readonly emailCronQueue: Queue,
    @InjectQueue('analysis_cron_queue')
    private readonly analysisCronQueue: Queue,
  ) {}

  async onModuleInit() {
    // Kéo toàn bộ cấu hình Cron đang lưu trong Redis ra
    const existingEmailJobs = await this.emailCronQueue.getRepeatableJobs();
    const hasEmailCron = existingEmailJobs.some(
      (job) => job.name === 'send_emails',
    );

    // Chỉ nạp lịch mặc định (8h sáng) nếu trong Redis chưa hề có
    if (!hasEmailCron) {
      await this.emailCronQueue.add(
        'send_emails',
        {},
        {
          jobId: 'default-email-cron',
          repeat: { pattern: '0 8 * * *', tz: 'Asia/Ho_Chi_Minh' },
        },
      );
    }

    const existingAnalysisJobs = await this.analysisCronQueue.getRepeatableJobs();
    const hasAnalysisCron = existingAnalysisJobs.some(
      (job) => job.name === 'run_analysis',
    );

    // Chỉ nạp lịch mặc định (2h sáng CN) nếu trong Redis chưa hề có
    if (!hasAnalysisCron) {
      await this.analysisCronQueue.add(
        'run_analysis',
        {},
        {
          jobId: 'default-analysis-cron',
          repeat: { pattern: '0 2 * * 0', tz: 'Asia/Ho_Chi_Minh' },
        },
      );
    }
  }

  async getMyMovies(username: string) {
    const recs = await this.prisma.userRecommendation.findMany({
      where: { username },
      include: {
        Movie: {
          select: { title_vi: true, imageUrl: true, averageRating: true },
        },
      },
      orderBy: { matchScore: 'desc' },
    });
    return { data: recs };
  }

  async triggerAnalysis() {
    this.recommendationClient.emit('TRIGGER_ANALYSIS', {
      timestamp: new Date(),
    });
    return true;
  }

  async triggerEmail() {
    // Đẩy một Job thường (không lặp) vào hàng đợi để Processor nhai ngay lập tức
    await this.emailCronQueue.add('send_emails', { manual: true });
    return true;
  }

  async configCron(configDto: ConfigCronDto) {
    const queue =
      configDto.type === CronJobType.EMAIL
        ? this.emailCronQueue
        : this.analysisCronQueue;
    const jobId =
      configDto.type === CronJobType.EMAIL
        ? 'default-email-cron'
        : 'default-analysis-cron';
    const jobName =
      configDto.type === CronJobType.EMAIL ? 'send_emails' : 'run_analysis';

    // Xóa job cũ dựa trên tên công việc (chắc chắn nhất)
    const existingJobs = await queue.getRepeatableJobs();
    for (const job of existingJobs) {
      if (job.name === jobName) {
        await queue.removeRepeatableByKey(job.key);
      }
    }

    // Thêm job mới
    await queue.add(
      jobName,
      {},
      {
        jobId: jobId,
        repeat: {
          pattern: configDto.cronExpression,
          tz: 'Asia/Ho_Chi_Minh',
        },
      },
    );

    return {
      message: `Cập nhật Cron Job [${configDto.type}] thành công!`,
      cronExpression: configDto.cronExpression,
    };
  }

  async getCampaignStats() {
    const totalSent = await this.prisma.userRecommendation.count({
      where: { isEmailSent: true },
    });
    const totalPending = await this.prisma.userRecommendation.count({
      where: { isEmailSent: false },
    });
    return { totalSent, totalPending };
  }

  async getListCronJobs() {
    const emailJobs = await this.emailCronQueue.getRepeatableJobs();
    const analysisJobs = await this.analysisCronQueue.getRepeatableJobs();
    
    return {
      emailCron: emailJobs.map(job => ({
        id: job.id,
        name: job.name,
        pattern: job.pattern,
        nextExecution: job.next ? new Date(job.next) : null,
      })),
      analysisCron: analysisJobs.map(job => ({
        id: job.id,
        name: job.name,
        pattern: job.pattern,
        nextExecution: job.next ? new Date(job.next) : null,
      })),
    };
  }
}
