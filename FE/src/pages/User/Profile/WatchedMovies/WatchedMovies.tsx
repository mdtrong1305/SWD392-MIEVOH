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
    const [activeSubTab, setActiveSubTab] = useState<"watched" | "rated">("watched");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");

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

            <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2 p-1 bg-gray-100/80 dark:bg-zinc-800/80 rounded-2xl border border-gray-200/50 dark:border-zinc-700/50 shadow-inner">
                    <button
                        onClick={() => setActiveSubTab("watched")}
                        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                            activeSubTab === "watched" 
                                ? "bg-white dark:bg-zinc-900 text-violet-700 dark:text-violet-400 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-700 scale-100"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50 scale-95 hover:scale-100"
                        }`}
                    >
                        <Film className="h-4 w-4" />
                        <span>{language === "vi" ? "Đã xem" : "Watched"}</span>
                    </button>
                    <button
                        onClick={() => setActiveSubTab("rated")}
                        className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                            activeSubTab === "rated" 
                                ? "bg-white dark:bg-zinc-900 text-violet-700 dark:text-violet-400 shadow-sm ring-1 ring-gray-200 dark:ring-zinc-700 scale-100"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50 scale-95 hover:scale-100"
                        }`}
                    >
                        <Star className="h-4 w-4" />
                        <span>{language === "vi" ? "Đã đánh giá" : "Rated"}</span>
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm animate__animated animate__fadeIn">
                <div className="flex-[2] flex flex-col gap-2">
                    <div className="flex items-center justify-between pl-1 pr-2">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                            {language === "vi" ? "Khoảng thời gian" : "Time Period"}
                        </label>
                    </div>
                    <div className="flex items-center gap-3 bg-[#F8F7FA] dark:bg-zinc-800/50 border border-[#EAE6F0] dark:border-zinc-700/50 rounded-xl px-4 py-3 hover:border-violet-300 transition-colors">
                        <Calendar className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400 shrink-0" />
                        <div className="flex items-center gap-2 w-full">
                            <input 
                                type="date" 
                                className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-zinc-200 w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            <span className="text-gray-400 dark:text-zinc-500 font-medium">—</span>
                            <input 
                                type="date" 
                                className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-zinc-200 w-full cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 text-right"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
                        {language === "vi" ? "Tất cả" : "All"}
                    </label>
                    <button 
                        onClick={() => { setFromDate(""); setToDate(""); }}
                        className="flex items-center justify-between gap-2 bg-[#F8F7FA] dark:bg-zinc-800/50 border border-[#EAE6F0] dark:border-zinc-700/50 rounded-xl px-4 py-3 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-300 w-full cursor-pointer group"
                    >
                        <div className="flex items-center gap-2">
                            <Clock className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400 shrink-0 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-bold text-gray-700 dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                                {language === "vi" ? "Tất cả thời gian" : "All Time"}
                            </span>
                        </div>
                    </button>
                </div>

                {activeSubTab === "rated" && (
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider pl-1">
                            {language === "vi" ? "Đánh giá" : "Rating"}
                        </label>
                        <div className="flex items-center gap-2 bg-[#F8F7FA] dark:bg-zinc-800/50 border border-[#EAE6F0] dark:border-zinc-700/50 rounded-xl px-4 py-3 hover:border-violet-300 transition-colors relative">
                            <Star className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400 shrink-0" />
                            <select 
                                className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 dark:text-zinc-200 w-full cursor-pointer appearance-none pr-6"
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                            >
                                <option value="all">{language === "vi" ? "Tất cả đánh giá" : "All ratings"}</option>
                                <option value="5">5 Sao</option>
                                <option value="4">4 Sao</option>
                                <option value="3">3 Sao</option>
                                <option value="2">2 Sao</option>
                                <option value="1">1 Sao</option>
                            </select>
                            <div className="absolute right-4 pointer-events-none text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {activeSubTab === "watched" && (() => {
                const filteredHistory = history.filter(record => {
                    if (!record.rawShowDateTime) return true;
                    const showTime = new Date(record.rawShowDateTime);
                    showTime.setHours(0, 0, 0, 0);

                    if (fromDate) {
                        const fDate = new Date(fromDate);
                        fDate.setHours(0, 0, 0, 0);
                        if (showTime < fDate) return false;
                    }

                    if (toDate) {
                        const tDate = new Date(toDate);
                        tDate.setHours(23, 59, 59, 999);
                        if (showTime > tDate) return false;
                    }

                    return true;
                });

                return filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                        <Film className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-sm font-medium text-gray-550">{language === "vi" ? "Không có bộ phim nào trong khoảng thời gian này." : "No movies found in this date range."}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-booking-scrollbar">
                        {filteredHistory.map((record) => (
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
                );
            })()}

            {activeSubTab === "rated" && (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <Star className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-550">{language === "vi" ? "Bạn chưa đánh giá bộ phim nào." : "You haven't rated any movies."}</p>
                </div>
            )}
        </div>
    );
}
