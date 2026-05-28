# Mievoh - Hệ Thống Đặt Vé Xem Phim (Mievoh)

<p align="center">
  <img src="FE/public/mievoh_logo_rounded.svg" alt="Mievoh Logo" height="80" align="middle" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="FE/public/mievoh_text_cropped.png" alt="Mievoh Text" height="40" align="middle" />
</p>

Dự án này là hệ thống Mievoh - Đặt Vé Xem Phim bao gồm hai phần chính:
- **Backend (BE)**: Được xây dựng bằng **NestJS**, **Prisma ORM**, và **MongoDB**.
- **Frontend (FE)**: Được xây dựng bằng **React**, **TypeScript**, và **Vite**.

---

## 📂 Cấu trúc dự án (Project Structure)

```text
mievoh/
├── BE/                           # Backend API (NestJS)
│   ├── src/                      # Source code của Backend
│   ├── prisma/                   # Cấu hình Prisma ORM
│   └── package.json              # Các dependencies của Backend
│
├── FE/                           # Frontend Web App (React + Vite)
│   ├── src/                      # Source code của Frontend
│   ├── public/                   # Tài nguyên tĩnh (Static assets)
│   └── package.json              # Các dependencies của Frontend
│
└── README.md                     # File hướng dẫn chung (Tài liệu này)
```

---

## ⚙️ Cài đặt & Khởi chạy (Setup & Run)

### 1. Yêu cầu hệ thống (Prerequisites)
- Đảm bảo đã cài đặt **Node.js** (Khuyên dùng phiên bản LTS mới nhất).
- Đã cài đặt **NestJS CLI** (nếu chưa có, chạy lệnh: `npm install -g @nestjs/cli`).

---

### 💻 Hướng dẫn chạy Backend (BE)

1. Di chuyển vào thư mục Backend:
   ```bash
   cd BE
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Thiết lập biến môi trường:
   Tạo file `.env` nằm trong thư mục `BE` và thiết lập các giá trị sau:
   ```env
   # Cổng chạy ứng dụng (Mặc định: 3069)
   PORT=3069

   # Chuỗi bí mật dùng để mã hóa và giải mã JWT
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here

   # Chuỗi kết nối đến MongoDB
   # Ví dụ MongoDB Atlas: mongodb+srv://<username>:<password_encoded>@<cluster_url>/<database_name>?appName=<app_name>
   # Ví dụ MongoDB Local: mongodb://localhost:27017/cinema-booking
   DATABASE_URL="mongodb://localhost:27017/cinema-booking"
   ```

4. Đồng bộ Prisma Client:
   Sinh mã Prisma Client phục vụ cho dự án:
   ```bash
   npx prisma generate
   ```

5. Khởi chạy ở chế độ Development:
   ```bash
   npm run start:dev
   ```
   API Backend sẽ chạy tại địa chỉ: `http://localhost:3069/api`.

---

### 🎨 Hướng dẫn chạy Frontend (FE)

1. Di chuyển vào thư mục Frontend:
   ```bash
   cd FE
   ```

2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```

3. Khởi chạy ở chế độ Development:
   ```bash
   npm run dev
   ```
   Ứng dụng Frontend sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc cổng được hiển thị trong terminal).

---

## 🚀 Công nghệ sử dụng chính

### Backend
- **Framework**: NestJS (v11)
- **Database**: MongoDB Atlas
- **ORM**: Prisma (v6)
- **Authentication**: JWT (JSON Web Token)

### Frontend
- **Framework & Build Tool**: React 19 + Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **HTTP Client**: Axios (Kết nối APIs)
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4)
- **UI Components & Icons**: Lucide React, Animate.css, React Hot Toast, React Slick & Slick Carousel
