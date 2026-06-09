import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Processor('analysis_cron_queue')
@Injectable()
export class AnalysisProcessor extends WorkerHost {
  constructor(
    @Inject('RECOMMENDATION_SERVICE') private readonly recommendationClient: ClientProxy,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`[BullMQ] [${job.name}] Bắt đầu tự động kích hoạt thuật toán AI phân tích (Job ID: ${job.id})...`);
    
    // Bắn sự kiện sang RabbitMQ để Python Worker xử lý
    this.recommendationClient.emit('TRIGGER_ANALYSIS', { timestamp: new Date() });
    
    console.log(`[BullMQ] [${job.name}] Đã gửi tín hiệu TRIGGER_ANALYSIS sang RabbitMQ thành công.`);
  }
}
