import { Injectable } from '@nestjs/common';
import { transporter } from '../../common/config/mailer';
import { EMAIL_USER } from '../../common/constant/app.constant';

@Injectable()
export class EmailService {
  async sendRecommendationEmail(data: { email: string; movies: any[] }) {
    try {
      const { email, movies } = data;

      let htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
          <div style="background: linear-gradient(135deg, #e50914, #83050c); padding: 30px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">MieVoh Cinema</h1>
            <p style="margin: 10px 0 0; color: #f1f1f1; font-size: 16px;">Phim hay dành riêng cho bạn</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #d1d1e0;">Chào bạn,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #d1d1e0;">Dựa trên gu thưởng thức điện ảnh tinh tế của bạn, Trí tuệ Nhân tạo của MieVoh đã chọn lọc ra những siêu phẩm sau đây. Đảm bảo bạn sẽ không thể rời mắt khỏi màn hình!</p>
            
            <div style="margin-top: 30px;">
      `;

      movies.forEach((movie) => {
        htmlContent += `
              <div style="background-color: #16213e; border-radius: 10px; overflow: hidden; margin-bottom: 20px; display: flex; align-items: center; border: 1px solid #2a2a4a;">
                <img src="${movie.imageUrl}" alt="${movie.name}" style="width: 100px; height: 150px; object-fit: cover; border-right: 1px solid #2a2a4a;" />
                <div style="padding: 20px; flex: 1;">
                  <h3 style="margin: 0 0 10px; color: #fff; font-size: 18px;">${movie.name}</h3>
                  <div style="display: inline-block; background-color: #e50914; color: #fff; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 15px;">
                    Độ phù hợp: ${movie.matchScore}%
                  </div>
                  <br>
                  <a href="http://localhost:3000/movies" style="display: inline-block; background-color: #ffffff; color: #e50914; text-decoration: none; padding: 8px 16px; border-radius: 5px; font-weight: bold; font-size: 14px;">Đặt Vé Ngay</a>
                </div>
              </div>
        `;
      });

      htmlContent += `
            </div>
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #2a2a4a; padding-top: 20px;">
              <p style="color: #8b8bac; font-size: 14px; margin: 0;">Trải nghiệm điện ảnh đỉnh cao chỉ có tại</p>
              <h2 style="color: #e50914; margin: 5px 0 0; font-size: 20px;">MieVoh Cinema</h2>
            </div>
          </div>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"MieVoh Cinema" <${EMAIL_USER}>`,
        to: email,
        subject: 'Phim cực cháy dành riêng cho bạn! 🔥',
        html: htmlContent,
      });

      console.log(`[+] Gửi Email thành công tới ${email}. Mã tin nhắn: ${info.messageId}`);
    } catch (error) {
      console.error(`[-] Thất bại khi gửi Email tới ${data.email}`, error);
    }
  }
}
