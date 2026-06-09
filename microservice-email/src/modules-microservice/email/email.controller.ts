import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('SEND_CAMPAIGN_EMAIL')
  async handleSendCampaignEmail(
    @Payload() data: { email: string; movies: any[] },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.emailService.sendRecommendationEmail(data);
      // Xác nhận tin nhắn đã xử lý thành công
      channel.ack(originalMsg);
    } catch (error) {
      // Báo lỗi để RabbitMQ xử lý lại (hoặc đẩy vào Dead Letter Queue)
      channel.nack(originalMsg, false, false);
    }
  }
}
