import api from '../config/axios/axiosConfig';

export interface BaseResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export interface SeatStatus {
  seatId: string;
  name: string;
  seatType: string;
  status: 'AVAILABLE' | 'SOLD' | 'HELD';
}

export interface Food {
  foodId: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  cinemaComplexId: string;
}

export interface FoodBookingInput {
  foodId: string;
  quantity: number;
}

export interface CreateBookingDto {
  showtimeId: string;
  seats: string[];
  foods?: FoodBookingInput[];
}

export interface CreateBookingResponse {
  message: string;
  booking: any;
  paymentUrl: string;
}

/**
 * Lấy trạng thái ghế của suất chiếu
 * GET /api/bookings/seats-status/:showtimeId
 */
export const getSeatsStatusApi = async (showtimeId: string): Promise<BaseResponse<SeatStatus[]>> => {
  const response = await api.get<BaseResponse<SeatStatus[]>>(`/bookings/seats-status/${showtimeId}`);
  return response.data;
};

/**
 * Lấy menu đồ ăn/combo của một cụm rạp
 * GET /api/foods/complex/:complexId
 */
export const getFoodsByComplexApi = async (complexId: string): Promise<BaseResponse<Food[]>> => {
  const response = await api.get<BaseResponse<Food[]>>(`/foods/complex/${complexId}`);
  return response.data;
};

/**
 * Đặt vé
 * POST /api/bookings
 */
export const createBookingApi = async (data: CreateBookingDto): Promise<BaseResponse<CreateBookingResponse>> => {
  const response = await api.post<BaseResponse<CreateBookingResponse>>('/bookings', data);
  return response.data;
};

/**
 * Xác minh kết quả thanh toán VNPay
 * GET /api/payments/vnpay-return
 */
export const verifyVNPayReturnApi = async (params: any): Promise<BaseResponse<{ code: string; message: string }>> => {
  const response = await api.get<BaseResponse<{ code: string; message: string }>>('/payments/vnpay-return', { params });
  return response.data;
};

/**
 * Lấy lịch sử đặt vé của user
 * GET /api/bookings/history
 * Wait! Let's check if there is an endpoint for booking history in backend.
 */
