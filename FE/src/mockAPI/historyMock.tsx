export interface BookingRecord {
    id: string;
    bookingCode: string;
    movieId: number;
    movieTitle: string;
    movieImage: string;
    branchName: string;
    time: string;
    date: string;
    seats: string[];
    combos: string;
    totalPrice: number;
    status: "Paid" | "Pending" | "Cancelled";
    dateBooked: string;
}

export const DEFAULT_BOOKING_HISTORY: BookingRecord[] = [
    {
        id: "hist-1",
        bookingCode: "MV849204",
        movieId: 1,
        movieTitle: "Kẻ Đánh Cắp Giấc Mơ",
        movieImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
        branchName: "CGV Vincom Center Dong Khoi",
        time: "18:30",
        date: "2026-05-28",
        seats: ["E5", "E6"],
        combos: "1x Combo Buddy",
        totalPrice: 335000,
        status: "Paid",
        dateBooked: "28/05/2026"
    },
    {
        id: "hist-2",
        bookingCode: "MV185304",
        movieId: 5,
        movieTitle: "Chiến Binh Vũ Trụ",
        movieImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        branchName: "CGV Vincom Plaza Go Vap",
        time: "20:00",
        date: "2026-05-15",
        seats: ["F1", "F2", "F3"],
        combos: "None",
        totalPrice: 330000,
        status: "Paid",
        dateBooked: "15/05/2026"
    }
];
