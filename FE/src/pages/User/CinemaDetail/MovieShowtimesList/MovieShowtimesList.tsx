import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { INITIAL_MOVIES, MOVIES_DETAILS } from "../../../../mockAPI/movieMock.tsx";
import type { DateOption } from "../DateSelector/DateSelector.tsx";
import { Clock, Film, User, Star } from "lucide-react";

interface MovieShowtimesListProps {
    selectedDate: DateOption | null;
    cinemaName: string;
}

export default function MovieShowtimesList({ selectedDate, cinemaName }: MovieShowtimesListProps) {
    const navigate = useNavigate();

    // Filter active movies
    const activeMovies = useMemo(() => {
        return INITIAL_MOVIES.filter(movie => movie.status === "now_showing");
    }, []);

    // Check if selected date is today
    const isToday = useMemo(() => {
        if (!selectedDate) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        return selectedDate.dateString === todayStr;
    }, [selectedDate]);

    // Check if time slot is expired (for today)
    const isExpired = (timeStr: string) => {
        if (!isToday) return false;
        const [hours, minutes] = timeStr.split(":").map(Number);
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        return currentHours > hours || (currentHours === hours && currentMinutes >= minutes);
    };

    const handleSelectShowtime = (movieId: number, format: string, time: string) => {
        navigate(`/movies/${movieId}/book/seats`, {
            state: {
                branchName: cinemaName,
                format,
                time,
                date: selectedDate?.dateString,
                dateLabel: selectedDate?.label,
                dayOfWeek: selectedDate?.dayOfWeek
            }
        });
    };

    // Predefined mock showtimes lists
    const showtimes2DDubbed = ["10:00", "12:00", "13:00", "14:00", "15:00", "16:00", "16:30", "18:00", "19:00", "20:00", "21:00", "22:00"];
    const showtimes2DSubbed = ["09:30", "11:00", "13:30", "15:45", "17:00", "18:30", "20:15", "22:30", "23:45"];

    const getAgeBadgeStyle = (ageRating: string) => {
        const cleanRating = ageRating.toUpperCase();
        if (cleanRating.includes("P")) return "bg-emerald-500 text-white";
        if (cleanRating.includes("T13")) return "bg-amber-500 text-white";
        if (cleanRating.includes("T16")) return "bg-orange-500 text-white";
        return "bg-rose-500 text-white";
    };

    return (
        <div className="space-y-6 animate__animated animate__fadeIn">
            {activeMovies.map(movie => {
                const details = MOVIES_DETAILS[movie.id] || {
                    duration: "120 mins",
                    ageRating: "T13",
                    language: "English Subtitles",
                    director: "TBA"
                };

                // Dubbing is generally only for animated and family/kids movies
                const hasDubbing = movie.genres.includes("Animation") ||
                    movie.genres.includes("Family") ||
                    movie.id === 4 ||
                    movie.id === 6;

                return (
                    <div
                        key={movie.id}
                        className="bg-white border border-slate-100/80 rounded-3xl p-6 shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-indigo-100/20 hover:border-indigo-200/50 transition-all duration-300 flex flex-col md:flex-row gap-6 group"
                    >
                        {/* Poster with hover scale and age tag */}
                        <div className="w-full md:w-32 aspect-[2/3] md:h-48 rounded-2xl overflow-hidden shrink-0 shadow-md relative group/poster border border-slate-100">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform duration-500"
                            />
                            {/* Age badge */}
                            <div className={`absolute top-3 left-3 font-extrabold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm ${getAgeBadgeStyle(details.ageRating)}`}>
                                {details.ageRating}
                            </div>

                            {/* Rating overlay badge */}
                            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span>{movie.rating}</span>
                            </div>
                        </div>

                        {/* Details & Showtimes */}
                        <div className="flex-grow flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-[#6C5CE7] transition-colors duration-200">
                                    {movie.title}
                                </h3>

                                {/* Info tags row */}
                                <div className="flex flex-wrap gap-2.5 mb-5">
                                    <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 text-amber-800 font-bold px-3 py-1.5 rounded-xl text-xs">
                                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                                        {details.duration}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/50 text-indigo-800 font-bold px-3 py-1.5 rounded-xl text-xs">
                                        <Film className="h-3.5 w-3.5 text-indigo-600" />
                                        {movie.genres.join(", ")}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs">
                                        <User className="h-3.5 w-3.5 text-slate-500" />
                                        Director: {details.director}
                                    </span>
                                </div>

                                {/* Formats & time buttons grid */}
                                <div className="space-y-5 pt-5 border-t border-slate-100">
                                    {/* 2D Long Tieng - only shown if hasDubbing is true */}
                                    {hasDubbing && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="h-3 w-1.5 bg-[#6C5CE7] rounded-full animate-pulse" />
                                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                                    2D Dubbed
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2.5">
                                                {showtimes2DDubbed.map(time => {
                                                    const expired = isExpired(time);
                                                    return (
                                                        <button
                                                            key={time}
                                                            disabled={expired}
                                                            onClick={() => handleSelectShowtime(movie.id, "2D Dubbed", time)}
                                                            className={`px-5.5 py-2.5 text-xs font-black rounded-xl border transition-all duration-200 ${expired
                                                                    ? "bg-slate-50 border-slate-100/65 text-slate-300 cursor-not-allowed line-through text-[11px] font-bold"
                                                                    : "bg-slate-50/80 border-slate-200 text-slate-900 hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white hover:scale-[1.03] cursor-pointer shadow-sm active:scale-95"
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2D Phu De Viet */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="h-3 w-1.5 bg-[#6C5CE7] rounded-full animate-pulse" />
                                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                                2D Subbed
                                            </h4>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {showtimes2DSubbed.map(time => {
                                                const expired = isExpired(time);
                                                return (
                                                    <button
                                                        key={time}
                                                        disabled={expired}
                                                        onClick={() => handleSelectShowtime(movie.id, "2D Subbed", time)}
                                                        className={`px-5.5 py-2.5 text-xs font-black rounded-xl border transition-all duration-200 ${expired
                                                                ? "bg-slate-50 border-slate-100/65 text-slate-300 cursor-not-allowed line-through text-[11px] font-bold"
                                                                : "bg-slate-50/80 border-slate-200 text-slate-900 hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white hover:scale-[1.03] cursor-pointer shadow-sm active:scale-95"
                                                            }`}
                                                    >
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
