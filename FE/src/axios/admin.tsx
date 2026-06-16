import api from '../config/axios/axiosConfig';

// ==========================================
// INTERFACES
// ==========================================

export interface BaseResponse<T> {
    message: string;
    statusCode: number;
    data: T;
}

export interface PaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface Movie {
    movieId: string;
    title_vi: string | null;
    title_en: string | null;
    trailerUrl: string | null;
    imageUrl: string | null;
    description_vi: string | null;
    description_en: string | null;
    releaseDate: string | null;
    duration: number | null;
    language_vi: string | null;
    language_en: string | null;
    ageRestriction: string | null;
    genres: string | null;
    director: string | null;
    cast: string | null;
    averageRating: number | null;
    totalReviews: number | null;
    isHot: boolean | null;
    isShowing: boolean | null;
    isComingSoon: boolean | null;
    createdAt: string;
    updatedAt: string;
}

export interface CinemaSystem {
    cinemaSystemId: string;
    name: string | null;
    logo: string | null;
    createdAt: string;
    updatedAt: string;
    CinemaComplexes?: CinemaComplex[];
}

export interface CinemaComplex {
    cinemaComplexId: string;
    name: string | null;
    address: string | null;
    cinemaSystemId: string | null;
    createdAt: string;
    updatedAt: string;
    CinemaSystem?: CinemaSystem;
    Cinemas?: Cinema[];
}

export interface Cinema {
    cinemaId: string;
    name: string | null;
    cinemaComplexId: string | null;
    createdAt: string;
    updatedAt: string;
    CinemaComplex?: CinemaComplex;
}

export interface Seat {
    seatId: string;
    name: string;
    seatType: string;
    cinemaId: string;
}

export interface Showtime {
    showtimeId: string;
    cinemaId: string | null;
    movieId: string | null;
    showDateTime: string | null;
    format: string | null;
    ticketPrice: number | null;
    status: string | null;
    createdAt: string;
    updatedAt: string;
    Cinema?: Cinema;
    Movie?: Movie;
}

export interface Food {
    foodId: string;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isActive: boolean;
    cinemaComplexId: string;
    createdAt: string;
    updatedAt: string;
    CinemaComplex?: CinemaComplex;
}

export interface Banner {
    bannerId: string;
    movieId: string | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: string;
    Movie?: Movie;
}

// ==========================================
// HELPERS
// ==========================================

/**
 * Một số endpoint danh sách ở backend trả về dạng { data: [...], total }.
 * Sau khi đi qua ResponseSuccessInterceptor, response.data có dạng:
 *   { message, statusCode, data: { data: [...], total } }  -> cần lấy data.data
 * hoặc với endpoint trả mảng trực tiếp:
 *   { message, statusCode, data: [...] }                   -> data đã là mảng
 * Hàm này chuẩn hóa để luôn trả về BaseResponse<T[]> với .data là mảng.
 */
function normalizeListResponse<T>(raw: BaseResponse<any>): BaseResponse<T[]> {
    const inner = raw?.data;
    const arr: T[] = Array.isArray(inner) ? inner : (Array.isArray(inner?.data) ? inner.data : []);
    return {
        message: raw?.message,
        statusCode: raw?.statusCode,
        data: arr,
    };
}

// ==========================================
// MOVIES API (Admin/Staff)
// ==========================================

export interface GetMoviesParams {
    page?: number;
    pageSize?: number;
    filters?: string;
}

/** GET /api/movies - Lấy toàn bộ phim (admin, staff) */
export const getMoviesAdminApi = async (params?: GetMoviesParams): Promise<BaseResponse<PaginatedData<Movie>>> => {
    const response = await api.get<BaseResponse<PaginatedData<Movie>>>('/movies', { params });
    return response.data;
};

/** POST /api/movies - Tạo phim mới (admin, staff) */
export const createMovieApi = async (formData: FormData): Promise<BaseResponse<Movie>> => {
    const response = await api.post<BaseResponse<Movie>>('/movies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** PUT /api/movies/:movieId - Cập nhật phim (admin, staff) */
export const updateMovieApi = async (movieId: string, formData: FormData): Promise<BaseResponse<Movie>> => {
    const response = await api.put<BaseResponse<Movie>>(`/movies/${movieId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** DELETE /api/movies/:movieId - Xóa phim (admin, staff) */
export const deleteMovieApi = async (movieId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/movies/${movieId}`);
    return response.data;
};

// ==========================================
// CINEMA SYSTEMS API (Admin only)
// ==========================================

/** GET /api/cinema-systems - Lấy danh sách hệ thống rạp */
export const getCinemaSystemsApi = async (): Promise<BaseResponse<CinemaSystem[]>> => {
    const response = await api.get<BaseResponse<any>>('/cinema-systems');
    return normalizeListResponse<CinemaSystem>(response.data);
};

/** POST /api/cinema-systems - Tạo hệ thống rạp mới (admin) */
export const createCinemaSystemApi = async (formData: FormData): Promise<BaseResponse<CinemaSystem>> => {
    const response = await api.post<BaseResponse<CinemaSystem>>('/cinema-systems', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** PUT /api/cinema-systems - Cập nhật hệ thống rạp (admin) */
export const updateCinemaSystemApi = async (formData: FormData): Promise<BaseResponse<CinemaSystem>> => {
    const response = await api.put<BaseResponse<CinemaSystem>>('/cinema-systems', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** DELETE /api/cinema-systems/:id - Xóa hệ thống rạp (admin) */
export const deleteCinemaSystemApi = async (cinemaSystemId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/cinema-systems/${cinemaSystemId}`);
    return response.data;
};

// ==========================================
// CINEMA COMPLEXES API (Admin only)
// ==========================================

/** GET /api/cinema-complexes - Lấy danh sách cụm rạp */
export const getCinemaComplexesApi = async (cinemaSystemId?: string): Promise<BaseResponse<CinemaComplex[]>> => {
    const params = cinemaSystemId ? { cinemaSystemId } : undefined;
    const response = await api.get<BaseResponse<any>>('/cinema-complexes', { params });
    return normalizeListResponse<CinemaComplex>(response.data);
};

/** POST /api/cinema-complexes - Tạo cụm rạp mới (admin) */
export const createCinemaComplexApi = async (data: { name: string; address: string; cinemaSystemId: string }): Promise<BaseResponse<CinemaComplex>> => {
    const response = await api.post<BaseResponse<CinemaComplex>>('/cinema-complexes', data);
    return response.data;
};

/** PUT /api/cinema-complexes - Cập nhật cụm rạp (admin) */
export const updateCinemaComplexApi = async (data: { cinemaComplexId: string; name?: string; address?: string; cinemaSystemId?: string }): Promise<BaseResponse<CinemaComplex>> => {
    const response = await api.put<BaseResponse<CinemaComplex>>('/cinema-complexes', data);
    return response.data;
};

/** DELETE /api/cinema-complexes/:id - Xóa cụm rạp (admin) */
export const deleteCinemaComplexApi = async (cinemaComplexId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/cinema-complexes/${cinemaComplexId}`);
    return response.data;
};

// ==========================================
// CINEMAS (Phòng chiếu) API (Admin, Staff)
// ==========================================

/** GET /api/cinemas?cinemaComplexId= - Lấy danh sách phòng chiếu */
export const getCinemasApi = async (cinemaComplexId: string): Promise<BaseResponse<Cinema[]>> => {
    const response = await api.get<BaseResponse<any>>('/cinemas', { params: { cinemaComplexId } });
    return normalizeListResponse<Cinema>(response.data);
};

/** POST /api/cinemas - Tạo phòng chiếu mới (admin, staff) */
export const createCinemaApi = async (data: { name: string; cinemaComplexId: string }): Promise<BaseResponse<Cinema>> => {
    const response = await api.post<BaseResponse<Cinema>>('/cinemas', data);
    return response.data;
};

/** PUT /api/cinemas - Cập nhật phòng chiếu (admin, staff) */
export const updateCinemaApi = async (data: { cinemaId: string; name?: string; cinemaComplexId?: string }): Promise<BaseResponse<Cinema>> => {
    const response = await api.put<BaseResponse<Cinema>>('/cinemas', data);
    return response.data;
};

/** DELETE /api/cinemas/:id - Xóa phòng chiếu (admin, staff) */
export const deleteCinemaApi = async (cinemaId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/cinemas/${cinemaId}`);
    return response.data;
};

// ==========================================
// SEATS API (Admin, Staff)
// ==========================================

/** GET /api/seats?cinemaId= - Lấy sơ đồ ghế */
export const getSeatsApi = async (cinemaId: string): Promise<BaseResponse<Seat[]>> => {
    const response = await api.get<BaseResponse<any>>('/seats', { params: { cinemaId } });
    return normalizeListResponse<Seat>(response.data);
};

/** POST /api/seats/generate - Tạo sơ đồ ghế tự động */
export const generateSeatsApi = async (data: { cinemaId: string; rows: number; seatsPerRow: number; vipRows?: number[]; coupleRow?: number }): Promise<BaseResponse<Seat[]>> => {
    const response = await api.post<BaseResponse<Seat[]>>('/seats/generate', data);
    return response.data;
};

/** POST /api/seats - Tạo 1 ghế thủ công */
export const createSeatApi = async (data: { name: string; seatType: string; cinemaId: string }): Promise<BaseResponse<Seat>> => {
    const response = await api.post<BaseResponse<Seat>>('/seats', data);
    return response.data;
};

/** PUT /api/seats - Cập nhật ghế */
export const updateSeatApi = async (data: { seatId: string; name?: string; seatType?: string }): Promise<BaseResponse<Seat>> => {
    const response = await api.put<BaseResponse<Seat>>('/seats', data);
    return response.data;
};

/** DELETE /api/seats/:id - Xóa ghế */
export const deleteSeatApi = async (seatId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/seats/${seatId}`);
    return response.data;
};

// ==========================================
// SHOWTIMES API (Admin, Staff)
// ==========================================

/** POST /api/showtimes - Tạo suất chiếu */
export const createShowtimeApi = async (data: { cinemaId: string; movieId: string; showDateTime: string; format?: string; ticketPrice?: number }): Promise<BaseResponse<Showtime>> => {
    const response = await api.post<BaseResponse<Showtime>>('/showtimes', data);
    return response.data;
};

/** PUT /api/showtimes - Cập nhật suất chiếu */
export const updateShowtimeApi = async (data: { showtimeId: string; cinemaId?: string; movieId?: string; showDateTime?: string; format?: string; ticketPrice?: number; status?: string }): Promise<BaseResponse<Showtime>> => {
    const response = await api.put<BaseResponse<Showtime>>('/showtimes', data);
    return response.data;
};

/** DELETE /api/showtimes/:id - Xóa suất chiếu */
export const deleteShowtimeApi = async (showtimeId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/showtimes/${showtimeId}`);
    return response.data;
};

/** GET /api/showtimes/:id - Lấy chi tiết suất chiếu */
export const getShowtimeDetailApi = async (showtimeId: string): Promise<BaseResponse<Showtime>> => {
    const response = await api.get<BaseResponse<Showtime>>(`/showtimes/${showtimeId}`);
    return response.data;
};

// ==========================================
// FOODS API (Admin, Staff)
// ==========================================

/** GET /api/foods/complex/:complexId - Lấy menu đồ ăn của cụm rạp */
export const getFoodsByComplexApi = async (complexId: string): Promise<BaseResponse<Food[]>> => {
    const response = await api.get<BaseResponse<any>>(`/foods/complex/${complexId}`);
    return normalizeListResponse<Food>(response.data);
};

/** POST /api/foods - Tạo món ăn mới (admin, staff) */
export const createFoodApi = async (formData: FormData): Promise<BaseResponse<Food>> => {
    const response = await api.post<BaseResponse<Food>>('/foods', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** PUT /api/foods/:foodId - Cập nhật món ăn (admin, staff) */
export const updateFoodApi = async (foodId: string, formData: FormData): Promise<BaseResponse<Food>> => {
    const response = await api.put<BaseResponse<Food>>(`/foods/${foodId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** DELETE /api/foods/:foodId - Xóa món ăn (admin, staff) */
export const deleteFoodApi = async (foodId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/foods/${foodId}`);
    return response.data;
};

// ==========================================
// BANNERS API (Admin, Staff)
// ==========================================

/** GET /api/banners - Lấy danh sách banner */
export const getBannersApi = async (): Promise<BaseResponse<Banner[]>> => {
    const response = await api.get<BaseResponse<any>>('/banners');
    return normalizeListResponse<Banner>(response.data);
};

/** POST /api/banners - Upload banner mới (admin, staff) */
export const createBannerApi = async (formData: FormData): Promise<BaseResponse<Banner>> => {
    const response = await api.post<BaseResponse<Banner>>('/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

/** DELETE /api/banners/:bannerId - Xóa banner (admin, staff) */
export const deleteBannerApi = async (bannerId: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/banners/${bannerId}`);
    return response.data;
};

// ==========================================
// STAFF API (Admin only)
// ==========================================

export interface Staff {
    email: string;
    fullName: string | null;
    phoneNumber: string | null;
    userType: string | null;
    cinemaComplexId: string | null;
    authProvider?: string | null;
    createdAt?: string;
    CinemaComplex?: CinemaComplex | null;
}

export interface CreateStaffPayload {
    email: string;
    fullName: string;
    phoneNumber?: string;
    password: string;
    cinemaComplexId: string;
}

export interface UpdateStaffPayload {
    fullName?: string;
    phoneNumber?: string;
    password?: string;
    cinemaComplexId?: string;
}

/** GET /api/staff - Lấy danh sách nhân viên (admin) */
export const getStaffApi = async (): Promise<BaseResponse<Staff[]>> => {
    const response = await api.get<BaseResponse<any>>('/staff');
    return normalizeListResponse<Staff>(response.data);
};

/** POST /api/staff - Tạo nhân viên mới (admin) */
export const createStaffApi = async (data: CreateStaffPayload): Promise<BaseResponse<Staff>> => {
    const response = await api.post<BaseResponse<Staff>>('/staff', data);
    return response.data;
};

/** PATCH /api/staff/:email - Cập nhật nhân viên (admin) */
export const updateStaffApi = async (email: string, data: UpdateStaffPayload): Promise<BaseResponse<Staff>> => {
    const response = await api.patch<BaseResponse<Staff>>(`/staff/${email}`, data);
    return response.data;
};

/** DELETE /api/staff/:email - Xóa nhân viên (admin) */
export const deleteStaffApi = async (email: string): Promise<BaseResponse<any>> => {
    const response = await api.delete<BaseResponse<any>>(`/staff/${email}`);
    return response.data;
};
