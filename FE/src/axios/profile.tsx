import api from '../config/axios/axiosConfig';

export interface BaseResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export interface UserProfile {
  username: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  avatar: string | null;
  userType: string | null;
  cinemaComplexId: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: string | null;
  cccd: string | null;
  rewardPoints: number;
  favoriteGenres: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileParams {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  cccd?: string;
  avatar?: string;
}

/**
 * Lấy thông tin cá nhân (Profile)
 * GET /api/users/profile
 */
export const getProfileApi = async (): Promise<BaseResponse<UserProfile>> => {
  const response = await api.get<BaseResponse<UserProfile>>('/users/profile');
  return response.data;
};

/**
 * Cập nhật thông tin cá nhân (Profile)
 * PUT /api/users/profile
 */
export const updateProfileApi = async (data: UpdateProfileParams): Promise<BaseResponse<UserProfile>> => {
  const response = await api.put<BaseResponse<UserProfile>>('/users/profile', data);
  return response.data;
};

export interface BookingDetail {
  Seat: {
    name: string;
    seatType: string;
  };
}

export interface BookingFood {
  quantity: number;
  Food: {
    name: string;
    imageUrl: string | null;
  };
}

export interface ShowtimeInfo {
  showtimeId: string;
  cinemaId: string;
  movieId: string;
  showDateTime: string;
  format: string;
  Movie: {
    title_vi: string;
    title_en: string;
    imageUrl: string;
  };
  Cinema: {
    CinemaComplex: {
      name: string;
      address: string;
    };
  };
}

export interface BookingHistoryItem {
  bookingId: string;
  username: string;
  showtimeId: string;
  bookingDate: string;
  totalPrice: number;
  paymentStatus: "Success" | "Failed" | "Pending" | string;
  paymentMethod: string | null;
  ticketCode: string;
  createdAt: string;
  updatedAt: string;
  Showtime: ShowtimeInfo;
  BookingDetails: BookingDetail[];
  BookingFoods: BookingFood[];
}

/**
 * Lấy lịch sử đặt vé của người dùng hiện tại
 * GET /api/bookings/my-history
 */
export const getBookingHistoryApi = async (): Promise<BaseResponse<BookingHistoryItem[]>> => {
  const response = await api.get<BaseResponse<BookingHistoryItem[]>>('/bookings/my-history');
  return response.data;
};
