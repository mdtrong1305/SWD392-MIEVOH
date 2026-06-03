import api from '../config/axios/axiosConfig';

// Định nghĩa các Interface cho dữ liệu Auth tương ứng với DTO của Backend
export interface LoginPayload {
  username: string; // Tên đăng nhập (Backend kiểm tra trường username)
  password: string; // Mật khẩu
}

export interface RegisterPayload {
  username: string;    // Tên đăng nhập (có thể dùng email làm username)
  fullName: string;    // Họ tên đầy đủ
  email: string;       // Địa chỉ email
  phoneNumber: string; // Số điện thoại
  password: string;    // Mật khẩu
}

export interface UserResponse {
  username: string;
  fullName: string | null;
  email: string | null;
  avatar: string | null;
  userType: string | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: TokenResponse;
}

/**
 * API đăng nhập cục bộ (Local Login)
 * Endpoint: POST /api/auth/login
 */
export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

/**
 * API đăng ký tài khoản cục bộ (Local Register)
 * Endpoint: POST /api/auth/register
 */
export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

/**
 * Khởi tạo quá trình đăng nhập bằng tài khoản Google.
 * Endpoint: GET /api/auth/google
 * Phương pháp này sẽ chuyển hướng trình duyệt của người dùng đến trang xác thực Google qua Backend.
 */
export const redirectToGoogleApi = (): void => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3069/api';
  window.location.href = `${apiBaseUrl}/auth/google`;
};

/**
 * API nhận thông tin xác thực sau khi Google redirect thành công (nếu cần gọi từ Client)
 * Endpoint: GET /api/auth/google/callback
 */
export const googleCallbackApi = async (): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>('/auth/google/callback');
  return response.data;
};

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/**
 * API kiểm tra email tồn tại để khôi phục mật khẩu (Forgot Password - Step 1)
 * Endpoint: POST /api/auth/verify-email
 */
export const verifyEmailApi = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/verify-email', { email });
  return response.data;
};

/**
 * API đặt lại mật khẩu mới cho người dùng (Forgot Password - Step 2)
 * Endpoint: POST /api/auth/reset-password
 */
export const resetPasswordApi = async (payload: ResetPasswordPayload): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/reset-password', payload);
  return response.data;
};

/**
 * API thay đổi mật khẩu khi đã đăng nhập (Change Password)
 * Endpoint: POST /api/auth/change-password
 */
export const changePasswordApi = async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/change-password', payload);
  return response.data;
};

