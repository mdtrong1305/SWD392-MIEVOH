# 📚 Mievoh Booking System – Tài Liệu API Đầy Đủ

> **Base URL (Local):** `http://localhost:3069/api`  
> **Base URL (Production):** `https://api.mievoh.io.vn/api`  
> **Swagger UI:** `http://localhost:3069/api/docs`

---

## 📌 Quy ước chung

### Xác thực (Authentication)

Hầu hết các API yêu cầu gửi kèm JWT Token trong Header:

```
Authorization: Bearer <jwt_token>
```

### Phân quyền (Roles)

| Tag              | Mô tả                              |
| ---------------- | ---------------------------------- |
| `[PUBLIC]`       | Không cần đăng nhập                |
| `[AUTH]`         | Cần JWT Token (user, staff, admin) |
| `[ADMIN]`        | Chỉ tài khoản Admin                |
| `[STAFF]`        | Chỉ tài khoản Staff                |
| `[ADMIN, STAFF]` | Admin hoặc Staff                   |

### Định dạng ngày tháng

Hệ thống sử dụng 2 định dạng tùy theo từng loại trường:

| Định dạng              | Ví dụ                  | Áp dụng cho                                                     |
| ---------------------- | ---------------------- | --------------------------------------------------------------- |
| `DD/MM/YYYY`           | `09/06/2026`           | Ngày (date only): `date`, `startDate`, `endDate`, `dateOfBirth` |
| `YYYY-MM-DDThh:mm:ssZ` | `2026-06-09T14:00:00Z` | Ngày giờ đầy đủ (datetime): `showDateTime`                      |

---

## 1. 🔐 Authentication – Xác thực

### `POST /auth/register` [PUBLIC]

Đăng ký tài khoản mới.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `username` | string | ✅ | Tên đăng nhập (duy nhất) |
| `password` | string | ✅ | Mật khẩu (tối thiểu 6 ký tự) |
| `fullName` | string | ✅ | Họ và tên |
| `email` | string | ❌ | Địa chỉ email |

---

### `POST /auth/login` [PUBLIC]

Đăng nhập và nhận JWT Token.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `username` | string | ✅ | Tên đăng nhập |
| `password` | string | ✅ | Mật khẩu |

**Response trả về JWT Token.**

---

### `GET /auth/google` [PUBLIC]

Đăng nhập bằng Google OAuth. Redirect trình duyệt tới trang xác thực Google.

### `GET /auth/google/callback` [PUBLIC]

Callback URL sau khi Google xác thực thành công. Tự động trả về JWT Token.

---

## 2. 👤 Users – Quản lý người dùng

### `GET /users/profile` [AUTH]

Lấy thông tin cá nhân của tài khoản đang đăng nhập.

---

### `PUT /users/profile` [AUTH]

Cập nhật thông tin cá nhân. Form-data (multipart/form-data).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `fullName` | string | ❌ | Họ và tên |
| `phoneNumber` | string | ❌ | Số điện thoại |
| `dateOfBirth` | string (ISO) | ❌ | Ngày sinh. Ví dụ: `1995-10-25T00:00:00Z` |
| `address` | string | ❌ | Địa chỉ |
| `gender` | string | ❌ | Giới tính (`Nam`, `Nữ`, `Khác`) |
| `cccd` | string | ❌ | Số CCCD / CMND |
| `avatar` | file (binary) | ❌ | Ảnh đại diện mới |

---

### `GET /users` [ADMIN]

Lấy danh sách tất cả người dùng (có phân trang).

**Query Params:**
| Tham số | Kiểu | Mặc định | Mô tả |
|---------|------|----------|-------|
| `page` | number | `1` | Số trang |
| `limit` | number | `10` | Số bản ghi / trang |
| `userType` | string | - | Lọc theo loại: `user`, `staff`, `admin` |

---

### `GET /users/:username` [ADMIN]

Lấy chi tiết 1 người dùng theo username.

---

### `POST /users/staff` [ADMIN]

Tạo tài khoản nhân viên (Staff) mới.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `username` | string | ✅ | Tên đăng nhập |
| `fullName` | string | ✅ | Họ và tên |
| `email` | string | ✅ | Email |
| `cinemaComplexId` | string (ObjectId) | ✅ | ID Cụm rạp mà Staff này phụ trách |
| `password` | string | ❌ | Mật khẩu. Mặc định: `123456` |

---

### `PUT /users/staff/:username` [ADMIN]

Cập nhật thông tin hoặc luân chuyển cụm rạp cho Staff.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `fullName` | string | ❌ | Họ và tên mới |
| `email` | string | ❌ | Email mới |
| `cinemaComplexId` | string | ❌ | ID Cụm rạp mới (Luân chuyển) |
| `isActive` | boolean | ❌ | Trạng thái hoạt động |

---

### `DELETE /users/:username` [ADMIN]

Vô hiệu hóa tài khoản (Không xóa vật lý).

---

## 3. 🎬 Movies – Quản lý phim

### `GET /movies` [PUBLIC]

Lấy danh sách phim (có phân trang và lọc).

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `page` | number | Số trang (mặc định: 1) |
| `pageSize` | number | Số lượng / trang (mặc định: 10) |
| `isShowing` | boolean | Lọc phim đang chiếu |
| `isComingSoon` | boolean | Lọc phim sắp chiếu |
| `isHot` | boolean | Lọc phim hot |
| `search` | string | Tìm kiếm theo tên phim |

---

### `GET /movies/:id` [PUBLIC]

Lấy chi tiết 1 bộ phim kèm điểm đánh giá trung bình.

---

### `POST /movies` [ADMIN, STAFF]

Thêm phim mới. Form-data (multipart/form-data).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `title_vi` | string | ❌ | Tên phim tiếng Việt |
| `title_en` | string | ❌ | Tên phim tiếng Anh |
| `description_vi` | string | ❌ | Mô tả phim (Tiếng Việt) |
| `description_en` | string | ❌ | Mô tả phim (Tiếng Anh) |
| `trailerUrl` | string | ❌ | Link trailer YouTube |
| `releaseDate` | string (ISO) | ❌ | Ngày khởi chiếu |
| `duration` | number | ❌ | Thời lượng (phút) |
| `language_vi` | string | ❌ | Ngôn ngữ âm thanh |
| `language_en` | string | ❌ | Ngôn ngữ phụ đề |
| `ageRestriction` | string | ❌ | Phân loại độ tuổi (C13, C18, P) |
| `genres` | string[] | ❌ | Thể loại. Ví dụ: `["Hành động", "Viễn tưởng"]` |
| `director` | string | ❌ | Đạo diễn |
| `cast` | string | ❌ | Diễn viên |
| `isShowing` | boolean | ❌ | Đang chiếu? (mặc định: true) |
| `isComingSoon` | boolean | ❌ | Sắp chiếu? (mặc định: false) |
| `isHot` | boolean | ❌ | Phim hot? (mặc định: false) |
| `image` | file (binary) | ❌ | Ảnh poster phim |

---

### `PUT /movies/:id` [ADMIN, STAFF]

Cập nhật thông tin phim. Form-data (multipart/form-data). Tất cả trường đều optional.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `title_vi` | string | ❌ | Tên phim tiếng Việt |
| `title_en` | string | ❌ | Tên phim tiếng Anh |
| `description_vi` | string | ❌ | Mô tả phim (Tiếng Việt) |
| `description_en` | string | ❌ | Mô tả phim (Tiếng Anh) |
| `trailerUrl` | string | ❌ | Link trailer YouTube |
| `releaseDate` | string (DD/MM/YYYY) | ❌ | Ngày khởi chiếu |
| `duration` | number | ❌ | Thời lượng (phút) |
| `language_vi` | string | ❌ | Ngôn ngữ âm thanh |
| `language_en` | string | ❌ | Ngôn ngữ phụ đề |
| `ageRestriction` | string | ❌ | Phân loại độ tuổi (C13, C18, P) |
| `genres` | string[] | ❌ | Thể loại |
| `director` | string | ❌ | Đạo diễn |
| `cast` | string | ❌ | Diễn viên |
| `isShowing` | boolean | ❌ | Đang chiếu? |
| `isComingSoon` | boolean | ❌ | Sắp chiếu? |
| `isHot` | boolean | ❌ | Phim hot? |
| `image` | file (binary) | ❌ | Ảnh poster phim mới |

### `DELETE /movies/:id` [ADMIN]

Xóa phim.

---

## 4. 🏢 Cinema Systems – Hệ thống rạp (CGV, Lotte...)

### `GET /cinema-systems` [PUBLIC]

Lấy danh sách các thương hiệu rạp.

### `POST /cinema-systems` [ADMIN]

Thêm hệ thống rạp mới. Form-data (multipart/form-data).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `name` | string | ✅ | Tên hệ thống rạp (VD: CGV) |
| `logo` | file (binary) | ❌ | File ảnh logo |

### `PUT /cinema-systems` [ADMIN]

Cập nhật thông tin hệ thống rạp. Form-data (multipart/form-data).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `cinemaSystemId` | string (ObjectId) | ✅ | ID hệ thống rạp cần cập nhật |
| `name` | string | ❌ | Tên mới |
| `logo` | file (binary) | ❌ | File ảnh logo mới |

### `DELETE /cinema-systems/:id` [ADMIN]

Xóa hệ thống rạp.

---

## 5. 🗺️ Cinema Complexes – Cụm rạp

### `GET /cinema-complexes` [PUBLIC]

Lấy danh sách cụm rạp. Có thể lọc theo hệ thống rạp hoặc thành phố.

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `cinemaSystemId` | string | Lọc theo ID hệ thống rạp |

---

### `POST /cinema-complexes` [ADMIN]

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `name` | string | ✅ | Tên cụm rạp (VD: CGV Vincom Thủ Đức) |
| `address` | string | ❌ | Địa chỉ cụm rạp |
| `cinemaSystemId` | string (ObjectId) | ❌ | Thuộc hệ thống rạp nào |

### `PUT /cinema-complexes/:id` [ADMIN]

Cập nhật cụm rạp.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `cinemaComplexId` | string (ObjectId) | ✅ | ID cụm rạp cần cập nhật |
| `name` | string | ❌ | Tên cụm rạp mới |
| `address` | string | ❌ | Địa chỉ mới |
| `cinemaSystemId` | string (ObjectId) | ❌ | ID hệ thống rạp mới |

### `DELETE /cinema-complexes/:id` [ADMIN]

Xóa cụm rạp.

---

## 6. 🎭 Cinemas – Phòng chiếu

### `GET /cinemas` [ADMIN, STAFF]

Lấy danh sách phòng chiếu. Có thể lọc theo cụm rạp.

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `cinemaComplexId` | string | Lọc phòng chiếu theo cụm rạp |

---

### `POST /cinemas` [ADMIN, STAFF]

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `name` | string | ✅ | Tên phòng chiếu (VD: Phòng 1, IMAX Hall) |
| `cinemaComplexId` | string (ObjectId) | ✅ | ID Cụm rạp chứa phòng này |

### `PUT /cinemas/:id` [ADMIN, STAFF]

Cập nhật phòng chiếu.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `cinemaId` | string (ObjectId) | ✅ | ID phòng chiếu cần cập nhật |
| `name` | string | ❌ | Tên phòng chiếu mới |
| `cinemaComplexId` | string (ObjectId) | ❌ | ID Cụm rạp mới (chuyển phòng sang cụm khác) |

### `DELETE /cinemas/:id` [ADMIN, STAFF]

Xóa phòng chiếu.

---

## 7. 💺 Seats – Ghế ngồi

### `GET /seats` [PUBLIC]

Lấy sơ đồ ghế của một phòng chiếu.

**Query Params:**
| Tham số | Kiểu | Bắt buộc | Mô tả |
|---------|------|----------|-------|
| `cinemaId` | string | ✅ | ID Phòng chiếu cần xem sơ đồ |

---

### `POST /seats/generate` [ADMIN, STAFF]

Tự động sinh sơ đồ ghế hàng loạt cho phòng chiếu.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `cinemaId` | string (ObjectId) | ✅ | ID Phòng chiếu cần sinh ghế |
| `rowLetterStart` | string | ✅ | Ký tự hàng bắt đầu (VD: `A`) |
| `rowLetterEnd` | string | ✅ | Ký tự hàng kết thúc (VD: `J`) |
| `seatsPerRow` | number | ✅ | Số ghế mỗi hàng (tối đa 50) |
| `vipRows` | string[] | ❌ | Danh sách hàng VIP. VD: `["G", "H"]` |
| `sweetboxRows` | string[] | ❌ | Danh sách hàng ghế Đôi. VD: `["J"]` |

---

### `POST /seats` [ADMIN, STAFF]

Thêm thủ công 1 ghế.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `name` | string | ✅ | Tên ghế (VD: A1, B5) |
| `cinemaId` | string (ObjectId) | ✅ | ID Phòng chiếu |
| `seatType` | string | ✅ | Loại ghế (`Thường`, `VIP`, `Đôi`) |

### `PUT /seats/:id` [ADMIN, STAFF]

Cập nhật ghế.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `seatId` | string (ObjectId) | ✅ | ID ghế cần cập nhật |
| `name` | string | ❌ | Tên ghế mới (VD: A1) |
| `seatType` | string | ❌ | Loại ghế mới (`Thường`, `VIP`, `Đôi`) |

### `DELETE /seats/:id` [ADMIN, STAFF]

Xóa ghế.

---

## 8. 🗓️ Showtimes – Lịch chiếu

### `GET /showtimes` [PUBLIC]

Lấy danh sách suất chiếu. Hỗ trợ lọc theo phim và rạp.

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `movieId` | string | Lọc theo ID phim |
| `cinemaId` | string | Lọc theo ID phòng chiếu |
| `date` | string (DD/MM/YYYY) | Lọc theo ngày chiếu. Ví dụ: `09/06/2026` |

---

### `GET /showtimes/:id` [PUBLIC]

Lấy chi tiết suất chiếu kèm trạng thái ghế còn trống / đã đặt.

---

### `POST /showtimes` [ADMIN, STAFF]

Tạo lịch chiếu mới.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `cinemaId` | string (ObjectId) | ✅ | ID Phòng chiếu |
| `movieId` | string (ObjectId) | ✅ | ID Bộ phim |
| `showDateTime` | string (ISO) | ✅ | Ngày giờ chiếu. Ví dụ: `2026-06-10T14:00:00Z` |
| `format` | string | ❌ | Định dạng chiếu (mặc định: `2D Phụ Đề`) |
| `ticketPrice` | number | ❌ | Giá vé cơ bản của suất chiếu (VNĐ) |

---

### `PUT /showtimes` [ADMIN, STAFF]

Cập nhật lịch chiếu.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `showtimeId` | string (ObjectId) | ✅ | ID suất chiếu cần cập nhật |
| `cinemaId` | string | ❌ | ID Phòng chiếu mới |
| `movieId` | string | ❌ | ID Phim mới |
| `showDateTime` | string (ISO) | ❌ | Thời gian mới |
| `format` | string | ❌ | Định dạng mới |
| `ticketPrice` | number | ❌ | Giá vé mới |
| `status` | string | ❌ | Trạng thái (`Active`, `Cancelled`) |

### `DELETE /showtimes/:id` [ADMIN, STAFF]

Xóa suất chiếu.

---

## 9. 🍿 Foods – Đồ ăn & Thức uống

### `GET /foods` [PUBLIC]

Lấy menu đồ ăn. Có thể lọc theo cụm rạp.

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `cinemaComplexId` | string | Lọc menu theo cụm rạp |

---

### `POST /foods` [ADMIN, STAFF]

Thêm sản phẩm đồ ăn mới.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `name` | string | ✅ | Tên sản phẩm (VD: Bắp Rang Bơ L) |
| `price` | number | ✅ | Giá (VNĐ) |
| `cinemaComplexId` | string (ObjectId) | ✅ | Thuộc cụm rạp nào |
| `description` | string | ❌ | Mô tả |
| `imageUrl` | string | ❌ | URL ảnh sản phẩm |
| `isActive` | boolean | ❌ | Đang bán? (mặc định: true) |

### `PUT /foods/:id` [ADMIN, STAFF]

Cập nhật sản phẩm. Tất cả trường đều optional.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `name` | string | ❌ | Tên sản phẩm |
| `price` | number | ❌ | Giá (VNĐ) |
| `cinemaComplexId` | string (ObjectId) | ❌ | ID cụm rạp |
| `description` | string | ❌ | Mô tả |
| `isActive` | boolean | ❌ | Đang bán? |
| `image` | file (binary) | ❌ | Ảnh sản phẩm mới |

### `DELETE /foods/:id` [ADMIN, STAFF]

Xóa sản phẩm khỏi menu.

---

## 10. 🎟️ Vouchers – Mã giảm giá

### `GET /vouchers/public` [PUBLIC]

Lấy danh sách mã giảm giá đang có hiệu lực để hiển thị trang khuyến mãi.

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `cinemaComplexId` | string | Lọc mã theo cụm rạp (bỏ trống = lấy tất cả toàn quốc) |

---

### `GET /vouchers/my-vouchers` [AUTH]

Lấy danh sách mã giảm giá mà người dùng hiện tại **CÒN CÓ THỂ SỬ DỤNG** (đã loại trừ mã đã dùng, hết số lượng).

---

### `POST /vouchers` [ADMIN, STAFF]

Tạo mã giảm giá mới.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `code` | string | ✅ | Mã giảm giá. Tự động viết hoa, xóa khoảng trắng |
| `discountType` | string | ✅ | Loại giảm: `PERCENTAGE` hoặc `FIXED` |
| `discountValue` | number | ✅ | Giá trị giảm (% hoặc VNĐ) |
| `startDate` | string (DD/MM/YYYY) | ✅ | Ngày bắt đầu hiệu lực. Ví dụ: `08/06/2026` |
| `endDate` | string (DD/MM/YYYY) | ✅ | Ngày hết hạn. Ví dụ: `08/07/2026` |
| `maxDiscount` | number | ❌ | Số tiền giảm tối đa (chỉ áp dụng cho PERCENTAGE) |
| `minPurchase` | number | ❌ | Tổng tiền đơn hàng tối thiểu để dùng mã |
| `usageLimit` | number | ❌ | Giới hạn tổng số lượt dùng trên toàn hệ thống |
| `cinemaComplexId` | string (ObjectId) | ❌ | Giới hạn áp dụng cho 1 cụm rạp. Để trống = Toàn quốc |
| `isBroadcast` | boolean | ❌ | Gửi thông báo In-app cho tất cả user ngay khi tạo (mặc định: false) |

> **Lưu ý:** Nếu tài khoản là **Staff**, trường `cinemaComplexId` sẽ tự động được gán theo cụm rạp của Staff đó.

---

### `PUT /vouchers/:id` [ADMIN, STAFF]

Cập nhật mã giảm giá.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `discountValue` | number | ❌ | Giá trị giảm mới |
| `maxDiscount` | number | ❌ | Số tiền giảm tối đa mới |
| `minPurchase` | number | ❌ | Đơn hàng tối thiểu mới |
| `startDate` | string (DD/MM/YYYY) | ❌ | Ngày bắt đầu mới. Ví dụ: `08/06/2026` |
| `endDate` | string (DD/MM/YYYY) | ❌ | Ngày hết hạn mới. Ví dụ: `08/07/2026` |
| `usageLimit` | number | ❌ | Giới hạn số lượt mới |
| `isActive` | boolean | ❌ | Kích hoạt / Vô hiệu hóa mã |

### `DELETE /vouchers/:id` [ADMIN, STAFF]

Xóa mã giảm giá.

---

### `POST /vouchers/apply` [AUTH]

Kiểm tra và tính toán số tiền được giảm trước khi thanh toán.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `code` | string | ✅ | Mã giảm giá cần áp dụng |
| `bookingId` | string (ObjectId) | ✅ | ID của Booking cần áp mã |

**Response trả về:**

```json
{
  "discountAmount": 50000,
  "originalPrice": 280000,
  "finalPrice": 230000,
  "voucherId": "..."
}
```

---

## 11. 🎫 Bookings – Đặt vé

### `GET /bookings/seats-status/:showtimeId` [PUBLIC]

Lấy trạng thái từng ghế (Trống / Đã đặt) của suất chiếu. Dùng để render sơ đồ ghế cho người dùng chọn chỗ.

---

### `POST /bookings` [AUTH]

Tạo đặt vé mới và sinh URL thanh toán VNPay.

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `showtimeId` | string (ObjectId) | ✅ | ID Suất chiếu |
| `seatIds` | string[] | ✅ | Danh sách ID ghế đã chọn. VD: `["id1", "id2"]` |
| `foodItems` | object[] | ❌ | Danh sách đồ ăn. Cấu trúc: `[{ foodId, quantity }]` |
| `voucherCode` | string | ❌ | Mã giảm giá muốn áp dụng |

**Response trả về URL VNPay để chuyển hướng thanh toán.**

---

### `GET /bookings/my-bookings` [AUTH]

Lấy lịch sử đặt vé của người dùng hiện tại (có phân trang).

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `page` | number | Số trang (mặc định: 1) |
| `pageSize` | number | Số bản ghi / trang (mặc định: 10) |

---

### `GET /bookings/:id` [AUTH]

Lấy chi tiết 1 booking (kèm thông tin ghế, đồ ăn, mã vé QR).

---

### `GET /bookings` [ADMIN, STAFF]

Xem tất cả booking của hệ thống (Admin xem toàn bộ, Staff chỉ xem rạp của mình). Không có Query Params - trả toàn bộ.

---

## 12. 💳 Payments – Thanh toán

### `GET /payments/vnpay-ipn` [PUBLIC – Chỉ VNPay gọi]

Endpoint nhận kết quả thanh toán từ VNPay (IPN Callback). **Không gọi trực tiếp.**  
Khi VNPay trả về `rspCode = 00` (Thành công), hệ thống tự động:

- Cập nhật trạng thái Booking → `Success`
- Ghi nhận VoucherUsage (nếu có)
- Gửi thông báo Socket Realtime cho người dùng

---

### `GET /payments/vnpay-return` [PUBLIC – Chỉ VNPay gọi]

URL Redirect sau khi người dùng thanh toán xong trên trang VNPay.

---

## 13. ⭐ Reviews – Đánh giá phim

### `GET /reviews/movie/:movieId` [PUBLIC]

Lấy danh sách đánh giá của một bộ phim.

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `page` | number | Số trang (mặc định: 1) |
| `limit` | number | Số bản ghi / trang (mặc định: 10) |

---

### `POST /reviews` [AUTH]

Đăng hoặc cập nhật đánh giá phim. **Bắt buộc phải có booking thành công cho bộ phim đó.** Nếu đã đánh giá rồi sẽ tự động cập nhật (upsert).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `movieId` | string (ObjectId) | ✅ | ID bộ phim muốn đánh giá |
| `rating` | number | ✅ | Số sao (1 đến 5) |
| `comment` | string | ❌ | Nội dung nhận xét |

---

### `DELETE /reviews/:id` [ADMIN, STAFF]

Xóa đánh giá rác/spam. Chỉ ADMIN và STAFF mới được xóa.

---

## 14. 🖼️ Banners – Quảng cáo

### `GET /banners` [PUBLIC]

Lấy danh sách banner đang active để hiển thị trang chủ.

---

### `POST /banners` [ADMIN, STAFF]

Thêm banner mới. Form-data (multipart/form-data).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `movieId` | string (ObjectId) | ❌ | Gắn banner với bộ phim |
| `image` | file (binary) | ✅ | File ảnh banner |

### `PUT /banners/:id` [ADMIN, STAFF]

Cập nhật banner.

### `DELETE /banners/:id` [ADMIN, STAFF]

Xóa banner.

---

## 15. 🔔 Notifications – Thông báo

### `GET /notifications` [AUTH]

Lấy danh sách thông báo của người dùng hiện tại (có phân trang, sắp xếp mới nhất trước).

**Query Params:**
| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `page` | number | Số trang (mặc định: 1) |
| `pageSize` | number | Số bản ghi / trang (mặc định: 10) |

**Response cũng trả về `unreadCount` – số thông báo chưa đọc.**

---

### `PUT /notifications/:id/read` [AUTH]

Đánh dấu 1 thông báo là đã đọc. Đồng thời phát sự kiện Socket `mark_as_read` về Frontend.

---

### `PUT /notifications/read-all` [AUTH]

Đánh dấu TẤT CẢ thông báo của mình là đã đọc. Đồng thời phát sự kiện Socket `mark_all_as_read`.

---

### `POST /notifications/broadcast` [ADMIN]

Gửi thông báo thủ công tới toàn bộ hệ thống (Dành riêng Admin).

**Request Body:**
| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|----------|-------|
| `title` | string | ✅ | Tiêu đề thông báo |
| `message` | string | ✅ | Nội dung thông báo |
| `link` | string | ❌ | URL đính kèm (Ví dụ: link tới trang sự kiện) |

---

## 16. 🤖 Recommendations – Gợi ý phim AI

### `POST /recommendations/trigger-analysis` [ADMIN]

Kích hoạt thủ công quá trình phân tích hành vi người dùng. Hệ thống sẽ đẩy job vào hàng đợi (BullMQ), chạy ngầm bằng Python, và gửi Email gợi ý tự động.

---

### `GET /recommendations/my-recommendations` [AUTH]

Lấy danh sách phim được AI gợi ý riêng cho người dùng hiện tại.

---

## 🔌 Socket Events (Realtime)

Kết nối: `ws://localhost:3069` (Socket.io)

### Client → Server (Emit)

| Event        | Payload             | Mô tả                                    |
| ------------ | ------------------- | ---------------------------------------- |
| `join_room`  | `username` (string) | Tham gia phòng cá nhân sau khi đăng nhập |
| `leave_room` | `username` (string) | Rời phòng khi đăng xuất                  |

### Server → Client (Listen)

| Event                    | Payload                        | Mô tả                                        |
| ------------------------ | ------------------------------ | -------------------------------------------- |
| `notification`           | `{ title, message, link }`     | Nhận thông báo cá nhân mới                   |
| `broadcast_notification` | `{ title, message, link }`     | Nhận thông báo hệ thống toàn cầu             |
| `mark_as_read`           | `{ notificationId, username }` | Cập nhật UI khi 1 thông báo đã được đọc      |
| `mark_all_as_read`       | `{ username }`                 | Cập nhật UI khi tất cả thông báo đã được đọc |
| `analysis_progress`      | `{ progress }`                 | Tiến độ phân tích AI (0-100%)                |

---

_Tài liệu được tổng hợp dựa trên source code thực tế. Cập nhật lần cuối: 09/06/2026._
