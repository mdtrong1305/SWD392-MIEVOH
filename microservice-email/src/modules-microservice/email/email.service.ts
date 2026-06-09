import { Injectable, Logger } from '@nestjs/common';
import { transporter } from '../../common/config/mailer';
import { EMAIL_USER, FRONTEND_URL } from '../../common/constant/app.constant';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendRecommendationEmail(data: { email: string; movies: any[] }) {
    try {
      const { email, movies } = data;

      let htmlContent = `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #110826; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #2e1a5a;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #4c1d95); padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">MIEVOH CINEMA</h1>
            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500;">Tuyệt tác điện ảnh dành riêng cho bạn</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #e4e4e7; margin-top: 0;">Chào bạn,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa;">Dựa trên gu thưởng thức điện ảnh tinh tế của bạn, Hệ thống của chúng tui đã chọn lọc ra những siêu phẩm sau đây. Đảm bảo bạn sẽ không thể rời mắt khỏi màn hình!</p>
            
            <div style="margin-top: 40px;">
      `;

      movies.forEach((movie) => {
        htmlContent += `
              <div style="background-color: #1a0f35; border-radius: 12px; overflow: hidden; margin-bottom: 24px; border: 1px solid #2e1a5a; display: table; width: 100%;">
                <div style="display: table-cell; width: 120px; vertical-align: middle;">
                  <img src="${movie.imageUrl}" alt="${movie.name}" style="width: 120px; height: 180px; display: block; object-fit: cover;" />
                </div>
                <div style="display: table-cell; padding: 20px; vertical-align: top;">
                  <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 20px; font-weight: 600;">${movie.name}</h3>
                  <div style="display: inline-block; background-color: rgba(139, 92, 246, 0.15); color: #a78bfa; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 700; border: 1px solid rgba(139, 92, 246, 0.3); margin-bottom: 20px;">
                    🔥 Độ phù hợp: ${movie.matchScore}%
                  </div>
                  <br>
                  <a href="${FRONTEND_URL}movies/${movie.movieId}/book" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center;">Đặt Vé Ngay</a>
                </div>
              </div>
        `;
      });

      htmlContent += `
            </div>
            <div style="text-align: center; margin-top: 50px; border-top: 1px solid #2e1a5a; padding-top: 30px;">
              <p style="color: #a1a1aa; font-size: 14px; margin: 0;">Trải nghiệm điện ảnh đỉnh cao chỉ có tại</p>
              <h2 style="color: #8b5cf6; margin: 8px 0 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">MIEVOH CINEMA</h2>
            </div>
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"MieVoh Cinema" <${EMAIL_USER}>`,
        to: email,
        subject:
          'HÓT HÒN HỌT ⚠️ Đừng bỏ lỡ 3 bộ phim mà chúng tuii đang dành cho bạn đây nháaa',
        html: htmlContent,
      });

      this.logger.log(
        `[+] Gửi Email thành công tới ${email}. Mã tin nhắn: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(`[-] Thất bại khi gửi Email tới ${data.email}`, error);
    }
  }
}
