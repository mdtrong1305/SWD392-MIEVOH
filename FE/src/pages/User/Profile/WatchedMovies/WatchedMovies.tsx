import { useEffect, useState } from "react";
import { Film, Star, Clock, MapPin, Calendar } from "lucide-react";
import { getBookingHistoryApi } from "../../../../axios/profile";
import { toast } from "../../../../components/Toast/Toast.tsx";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";

export interface WatchedMovieRecord {
    id: string;
    bookingCode: string;
    movieId: number;
    movieTitle: string;
    movieImage: string;
    branchName: string;
    time: string;
    date: string;
    status: "Paid" | "Pending" | "Cancelled";
    dateBooked: string;
    rawShowDateTime: string; // for comparing with current time
}

const mapApiHistoryToRecord = (item: any): WatchedMovieRecord => {
    let showtimeDate = "";
    let showtimeTime = "";
    let rawShowDateTime = "";

    if (item.Showtime?.showDateTime) {
        rawShowDateTime = item.Showtime.showDateTime;
        try {
            const d = new Date(item.Showtime.showDateTime);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            showtimeDate = `${day}/${month}/${year}`;

            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            showtimeTime = `${hours}:${minutes}`;
        } catch (e) {
            console.error(e);
        }
    }

    let dateBookedStr = "";
    if (item.createdAt) {
        try {
            const d = new Date(item.createdAt);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            dateBookedStr = `${day}/${month}/${year}`;
        } catch (e) {
            console.error(e);
        }
    }

    let statusMapped: "Paid" | "Pending" | "Cancelled" = "Pending";
    if (item.paymentStatus === "Success") {
        statusMapped = "Paid";
    } else if (item.paymentStatus === "Failed") {
        statusMapped = "Cancelled";
    }

    return {
        id: item.bookingId,
        bookingCode: item.ticketCode || "",
        movieId: item.Showtime?.Movie?.id || 0,
        movieTitle: item.Showtime?.Movie?.title_vi || item.Showtime?.Movie?.title_en || "Phim",
        movieImage: item.Showtime?.Movie?.imageUrl || "🍿",
        branchName: item.Showtime?.Cinema?.CinemaComplex?.name || "Rạp chiếu phim",
        time: showtimeTime || "12:00",
        date: showtimeDate || "",
        status: statusMapped,
        dateBooked: dateBookedStr || "",
        rawShowDateTime
    };
};

export default function WatchedMovies() {
    const { language } = useLanguage();
    const [history, setHistory] = useState<WatchedMovieRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const res = await getBookingHistoryApi();
                if (res && res.data) {
                    const now = new Date();
                    
                    const mapped = res.data
                        .map(mapApiHistoryToRecord)
                        .filter((record: WatchedMovieRecord) => {
                            // Only paid tickets
                            if (record.status !== "Paid") return false;
                            
                            // Only past showtimes
                            if (!record.rawShowDateTime) return false;
                            const showTime = new Date(record.rawShowDateTime);
                            return showTime < now;
                        });

                    // Remove duplicates by movie title to show a unique list of watched movies
                    const uniqueMovies = Array.from(new Map(mapped.map((m: WatchedMovieRecord) => [m.movieTitle, m])).values()) as WatchedMovieRecord[];
                    
                    // Sort by newest showtime first
                    uniqueMovies.sort((a, b) => new Date(b.rawShowDateTime).getTime() - new Date(a.rawShowDateTime).getTime());
                    
                    setHistory(uniqueMovies);
                }
            } catch (err) {
                console.error("Failed to load watched movies:", err);
                toast.error("Không thể tải danh sách phim đã xem");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleRateMovie = (movieTitle: string) => {
        // Placeholder for future rating functionality
        toast.success(language === "vi" ? `Cảm ơn bạn đã muốn đánh giá phim: ${movieTitle}. Tính năng này sắp ra mắt!` : `Thanks for rating: ${movieTitle}. Feature coming soon!`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate__animated animate__fadeIn">
            <style>{`
                .custom-booking-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-booking-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-booking-scrollbar::-webkit-scrollbar-thumb {
                    background: #E9D5FF;
                    border-radius: 9999px;
                }
                .custom-booking-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D8B4FE;
                }
            `}</style>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <Film className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-550">{language === "vi" ? "Bạn chưa xem bộ phim nào gần đây." : "You haven't watched any movies recently."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-booking-scrollbar">
                    {history.map((record) => (
                        <div
                            key={record.id}
                            className="flex flex-col border border-[#EAE6F0] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="w-full h-48 relative overflow-hidden bg-gray-100">
                                <img
                                    src={record.movieImage}
                                    alt={record.movieTitle}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <h4 className="text-base font-black leading-tight line-clamp-2">{record.movieTitle}</h4>
                                </div>
                            </div>

                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex flex-col gap-1.5 text-xs text-gray-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                                        <span className="truncate">{record.branchName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                                        <span>{language === "vi" ? "Đã xem ngày" : "Watched on"}: {record.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                                        <span>{language === "vi" ? "Suất chiếu" : "Showtime"}: {record.time}</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-[#EAE6F0]" />

                                <button
                                    onClick={() => handleRateMovie(record.movieTitle)}
                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-bold text-violet-600 bg-violet-50 hover:bg-violet-600 hover:text-white transition-colors duration-300 shadow-sm cursor-pointer"
                                >
                                    <Star className="h-4 w-4" />
                                    <span>{language === "vi" ? "Đánh giá phim" : "Rate Movie"}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
