import DateSelector from "../CinemaDetail/DateSelector/DateSelector.tsx";
import { useLanguage } from "../../../contextAPI/LanguageContext.tsx";
import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Star, ChevronDown } from "lucide-react";
import { MOVIES_DETAILS } from "../../../mockAPI/movieMock.tsx";
import { THEATER_CHAINS } from "../../../mockAPI/cinemaMock.tsx";
import CityFilter from "../../../components/CityFilter/CityFilter.tsx";

interface DateOption {
    label: string;      // e.g. "29/5"
    dayOfWeek: string;  // e.g. "Th 6"
    dateString: string;  // e.g. "2026-05-29"
}

interface ChainTheme {
    bgGradient: string;
    textColor: string;
    titleColor: string;
    badgeBg: string;
    badgeText: string;
    buttonActive: string;
    borderColor: string;
    glowColor: string;
    branchBg: string;
}

const CHAIN_THEMES: Record<string, ChainTheme> = {
    cgv: {
        bgGradient: "from-violet-50/60 to-violet-50/30", titleColor: "text-slate-800 dark:text-white group-hover:text-[#8E7EFE] dark:group-hover:text-violet-400",
        textColor: "group-hover:text-[#8E7EFE] text-[#8E7EFE]/80 dark:text-violet-400",
        badgeBg: "bg-[#8E7EFE]/10",
        badgeText: "text-[#8E7EFE]",
        buttonActive: "hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white",
        borderColor: "border-violet-100 dark:border-zinc-800/80 hover:border-violet-200 dark:hover:border-zinc-700",
        glowColor: "#8E7EFE", branchBg: "bg-white dark:bg-zinc-900/40 hover:bg-violet-50/10 dark:hover:bg-zinc-800/30"
    },
    bhd: {
        bgGradient: "from-violet-50/60 to-violet-50/30", titleColor: "text-slate-800 dark:text-white group-hover:text-[#8E7EFE] dark:group-hover:text-violet-400",
        textColor: "group-hover:text-[#8E7EFE] text-[#8E7EFE]/80 dark:text-violet-400",
        badgeBg: "bg-[#8E7EFE]/10",
        badgeText: "text-[#8E7EFE]",
        buttonActive: "hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white",
        borderColor: "border-violet-100 dark:border-zinc-800/80 hover:border-violet-200 dark:hover:border-zinc-700",
        glowColor: "#8E7EFE", branchBg: "bg-white dark:bg-zinc-900/40 hover:bg-violet-50/10 dark:hover:bg-zinc-800/30"
    },
    lotte: {
        bgGradient: "from-violet-50/60 to-violet-50/30", titleColor: "text-slate-800 dark:text-white group-hover:text-[#8E7EFE] dark:group-hover:text-violet-400",
        textColor: "group-hover:text-[#8E7EFE] text-[#8E7EFE]/80 dark:text-violet-400",
        badgeBg: "bg-[#8E7EFE]/10",
        badgeText: "text-[#8E7EFE]",
        buttonActive: "hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white",
        borderColor: "border-violet-100 dark:border-zinc-800/80 hover:border-violet-200 dark:hover:border-zinc-700",
        glowColor: "#8E7EFE", branchBg: "bg-white dark:bg-zinc-900/40 hover:bg-violet-50/10 dark:hover:bg-zinc-800/30"
    },
    cinestar: {
        bgGradient: "from-violet-50/60 to-violet-50/30", titleColor: "text-slate-800 dark:text-white group-hover:text-[#8E7EFE] dark:group-hover:text-violet-400",
        textColor: "group-hover:text-[#8E7EFE] text-[#8E7EFE]/80 dark:text-violet-400",
        badgeBg: "bg-[#8E7EFE]/10",
        badgeText: "text-[#8E7EFE]",
        buttonActive: "hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white",
        borderColor: "border-violet-100 dark:border-zinc-800/80 hover:border-violet-200 dark:hover:border-zinc-700",
        glowColor: "#8E7EFE", branchBg: "bg-white dark:bg-zinc-900/40 hover:bg-violet-50/10 dark:hover:bg-zinc-800/30"
    },
    beta: {
        bgGradient: "from-violet-50/60 to-violet-50/30", titleColor: "text-slate-800 dark:text-white group-hover:text-[#8E7EFE] dark:group-hover:text-violet-400",
        textColor: "group-hover:text-[#8E7EFE] text-[#8E7EFE]/80 dark:text-violet-400",
        badgeBg: "bg-[#8E7EFE]/10",
        badgeText: "text-[#8E7EFE]",
        buttonActive: "hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white",
        borderColor: "border-violet-100 dark:border-zinc-800/80 hover:border-violet-200 dark:hover:border-zinc-700",
        glowColor: "#8E7EFE", branchBg: "bg-white dark:bg-zinc-900/40 hover:bg-violet-50/10 dark:hover:bg-zinc-800/30"
    }
};

const DEFAULT_THEME: ChainTheme = {
    bgGradient: "from-violet-50/60 to-violet-50/30", titleColor: "text-slate-800 dark:text-white group-hover:text-[#8E7EFE] dark:group-hover:text-violet-400",
    textColor: "group-hover:text-[#8E7EFE] text-[#8E7EFE]/80 dark:text-violet-400",
    badgeBg: "bg-[#8E7EFE]/10",
    badgeText: "text-[#8E7EFE]",
    buttonActive: "hover:bg-[#6C5CE7] hover:border-[#6C5CE7] hover:text-white",
    borderColor: "border-violet-100 dark:border-zinc-800/80 hover:border-violet-200 dark:hover:border-zinc-700",
    glowColor: "#8E7EFE", branchBg: "bg-white dark:bg-zinc-900/40 hover:bg-violet-50/10 dark:hover:bg-zinc-800/30"
};

export default function BookTicket() {
    const { t, language } = useLanguage();
    const { id } = useParams<{ id: string }>();
    const movieId = Number(id);
    const navigate = useNavigate();

    const movie = useMemo(() => {
        return MOVIES_DETAILS[movieId] || null;
    }, [movieId]);

    // Scroll to top when page loaded
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>("All");

    const [expandedChains, setExpandedChains] = useState<Record<string, boolean>>({});
    const [expandedBranches, setExpandedBranches] = useState<Record<number, boolean>>({});

    const toggleChain = (chainId: string) => {
        setExpandedChains(prev => ({
            ...prev,
            [chainId]: !prev[chainId]
        }));
    };

    const toggleBranch = (branchId: number) => {
        setExpandedBranches(prev => ({
            ...prev,
            [branchId]: !prev[branchId]
        }));
    };

    // Group branches by theater chains based on selected city
    const groupedChains = useMemo(() => {
        const list: {
            chainId: string;
            chainName: string;
            chainLogo: string;
            branches: {
                id: number;
                name: string;
                address: string;
                city: string;
                rating: number;
            }[];
        }[] = [];

        THEATER_CHAINS.forEach(chain => {
            const matchingBranches = chain.branches.filter(branch => {
                return selectedCity === "All" || branch.city === selectedCity;
            });

            if (matchingBranches.length > 0) {
                list.push({
                    chainId: chain.id,
                    chainName: chain.name,
                    chainLogo: chain.logo,
                    branches: matchingBranches
                });
            }
        });

        return list;
    }, [selectedCity]);

    // Check if time slot is expired (for today)
    const isTodaySelected = useMemo(() => {
        if (!selectedDate) return false;
        const todayStr = new Date().toISOString().split('T')[0];
        return selectedDate.dateString === todayStr;
    }, [selectedDate]);

    const isExpired = (timeStr: string) => {
        if (!isTodaySelected) return false;
        const [hours, minutes] = timeStr.split(":").map(Number);
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        return currentHours > hours || (currentHours === hours && currentMinutes >= minutes);
    };

    const handleSelectShowtime = (branchName: string, format: string, time: string) => {
        navigate(`/movies/${movieId}/book/seats`, {
            state: {
                branchName,
                format,
                time,
                date: selectedDate?.dateString || "",
                dateLabel: selectedDate?.label || "",
                dayOfWeek: selectedDate?.dayOfWeek || ""
            }
        });
    };

    // Predefined showtime list templates
    const showtimes2DDubbed = ["10:00", "12:00", "13:00", "14:00", "15:00", "16:00", "16:30", "18:00", "19:00", "20:00", "21:00", "22:00"];
    const showtimes2DSubbed = ["09:30", "11:00", "13:30", "15:45", "17:00", "18:30", "20:15", "22:30", "23:45"];

    if (!movie) {
        return (
            <div className="w-full bg-[#EFEBF4] py-20 flex flex-col items-center justify-center text-center px-4 min-h-[60vh] font-sans">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Movie Not Found</h2>
                <p className="text-slate-500 mb-6 font-medium">Please go back and select a valid movie.</p>
                <Link to="/movies" className="inline-flex items-center gap-2 bg-[#6C5CE7] text-white font-extrabold px-6 py-2.5 rounded-full hover:bg-[#5f27cd] transition-colors duration-200 shadow-lg shadow-indigo-200">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Movie List
                </Link>
            </div>
        );
    }

    const hasDubbing = movie.genres.includes("Animation") || 
                       movie.genres.includes("Family") ||
                       movie.id === 4 || 
                       movie.id === 6;

    const getAgeBadgeStyle = (ageRating: string) => {
        const cleanRating = ageRating.toUpperCase();
        if (cleanRating.includes("P")) return "bg-emerald-500 text-white";
        if (cleanRating.includes("T13")) return "bg-amber-500 text-white";
        if (cleanRating.includes("T16")) return "bg-orange-500 text-white";
        return "bg-rose-500 text-white";
    };

    return (
        <div className="w-full bg-[#EFEBF4] min-h-screen pb-16 font-sans">
            {/* Header info banner with blurred backdrop image */}
            <div className="relative w-full overflow-hidden bg-[#0F0C15] text-white py-8 sm:py-10 border-b border-violet-955/20">
                {/* Backdrop Underlay */}
                <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-105 opacity-55 pointer-events-none"
                    style={{ backgroundImage: `url(${movie.backdrop || movie.image})` }}
                />
                {/* Dark gradient mask */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90" />

                <div className="relative max-w-5xl mx-auto px-4 z-10">
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start text-center sm:text-left">
                        {/* Movie Poster preview */}
                        <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-xl transition-transform duration-300 hover:scale-[1.02]">
                            <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Movie Details */}
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${getAgeBadgeStyle(movie.ageRating)}`}>
                                    {movie.ageRating}
                                </span>
                                <span className="bg-white/10 text-slate-200 text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-violet-400" />
                                    {movie.duration}
                                </span>
                                <span className="bg-white/10 text-amber-400 text-[11px] font-black px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    {movie.rating}/5
                                </span>
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-white">{movie.title}</h1>
                            
                            <p className="text-violet-300 font-extrabold text-xs uppercase tracking-wide">{movie.genres.join(" / ")}</p>
                            
                            {/* Additional Meta Information Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-350 border-t border-white/10 pt-3 max-w-2xl font-medium text-left">
                                <div>
                                    <span className="text-slate-450 font-bold block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">{t("release_date")}</span>
                                    <span className="text-slate-100 font-extrabold">{movie.releaseDate || "Now showing"}</span>
                                </div>
                                <div>
                                    <span className="text-slate-450 font-bold block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">{t("director")}</span>
                                    <span className="text-slate-100 font-extrabold">{movie.director}</span>
                                </div>
                                <div className="sm:col-span-1">
                                    <span className="text-slate-450 font-bold block text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">{t("cast")}</span>
                                    <span className="text-slate-100 font-semibold block truncate" title={movie.cast.join(", ")}>{movie.cast.join(", ")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 mt-8 flex flex-col gap-6">
                
                {/* 1. Date Selector Block */
                <DateSelector
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                />

                /* 2. City Filter Panel */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 dark:bg-zinc-900/50 border border-white/60 dark:border-zinc-800/80 backdrop-blur-md rounded-2xl px-5 py-4 shadow-sm relative z-30">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                        <span className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white">{t("cinema_locations_label")}</span>
                    </div>
                    
                    <CityFilter
                        selectedCity={selectedCity}
                        onSelectCity={setSelectedCity}
                        label=""
                        className="w-full sm:w-56"
                    />
                </div>

                {/* 3. Theater Chains & Branches & Showtimes List */}
                <div className="space-y-8">
                    {groupedChains.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-12 text-center border border-slate-100 dark:border-zinc-800/80 shadow-sm flex flex-col items-center">
                            <span className="text-4xl mb-3">📍</span>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">{t("no_cinemas_available")}</h3>
                            <p className="text-slate-500 dark:text-zinc-450 font-medium text-xs">{t("no_cinemas_available_desc")}</p>
                        </div>
                    ) : (
                        groupedChains.map(chain => {
                            const isChainExpanded = !!expandedChains[chain.chainId];
                            const theme = CHAIN_THEMES[chain.chainId.toLowerCase()] || DEFAULT_THEME;
                            return (
                                <div
                                    key={chain.chainId}
                                    className={`relative overflow-hidden bg-white/70 dark:bg-zinc-900/50 border border-white/60 dark:border-zinc-800/80 backdrop-blur-md shadow-sm animate__animated animate__fadeIn transition-all duration-300 ${
                                        isChainExpanded ? "p-6 rounded-3xl space-y-6" : "p-3 px-4 rounded-2xl"
                                    }`}
                                >
                                    {/* Content Wrapper */}
                                    <div className={`relative z-10 ${isChainExpanded ? "space-y-6" : ""}`}>
                                        {/* Theater Chain Header (Collapsible) */}
                                        <div
                                            onClick={() => toggleChain(chain.chainId)}
                                            className={`flex items-center justify-between cursor-pointer select-none group transition-all duration-300 ${
                                                isChainExpanded ? "pb-4 border-b border-slate-100 dark:border-zinc-800/80" : "pb-0"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                                                    <img src={chain.chainLogo} alt={chain.chainName} className="w-full h-full object-cover" />
                                                </div>
                                                <h2 className={`text-base sm:text-lg font-black ${theme.titleColor} transition-colors`}>{chain.chainName}</h2>
                                            </div>
                                            <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-350 ${isChainExpanded ? `${theme.textColor} rotate-180` : "-rotate-90 text-slate-400/60"}`} />
                                        </div>

                                        {/* Branches List */}
                                        {isChainExpanded && (
                                            <div className="space-y-6 animate__animated animate__fadeIn">
                                                {chain.branches.map(branch => {
                                                    const isBranchExpanded = !!expandedBranches[branch.id];
                                                    return (
                                                        <div
                                                            key={branch.id}
                                                            className={`relative overflow-hidden ${theme.branchBg} border ${theme.borderColor} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300`}
                                                        >
                                                            {/* Content on top */}
                                                            <div className="relative z-10">
                                                                {/* Branch Details (Collapsible) */}
                                                                <div
                                                                    onClick={() => toggleBranch(branch.id)}
                                                                    className="flex items-center justify-between cursor-pointer select-none group"
                                                                >
                                                                    <div className="flex items-center gap-3.5 min-w-0 pr-4">
                                                                        {/* Branch Logo */}
                                                                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105">
                                                                            <img src={chain.chainLogo} alt={chain.chainName} className="w-full h-full object-cover" />
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <h3 className={`text-base font-extrabold ${theme.titleColor} leading-snug transition-colors`}>
                                                                                {branch.name}
                                                                            </h3>
                                                                            <p className="text-slate-500 dark:text-zinc-400 font-medium text-xs mt-1 truncate">
                                                                                {branch.address}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <ChevronDown className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform duration-355 ${isBranchExpanded ? `${theme.textColor} rotate-180` : "-rotate-90 text-slate-400/60"}`} />
                                                                </div>

                                                                {/* Showtimes Formats */}
                                                                {isBranchExpanded && (
                                                                    <div className="space-y-5 mt-5 pt-5 border-t border-slate-100 dark:border-zinc-800/80 animate__animated animate__fadeIn">
                                                                        {/* {t("format_2d_dubbed")} - conditionally rendered */}
                                                                        {hasDubbing && (
                                                                            <div>
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <span className="h-3 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.glowColor }} />
                                                                                    <h4 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">
                                                                                        {t("format_2d_dubbed")}
                                                                                    </h4>
                                                                                </div>
                                                                                <div className="flex flex-wrap gap-2.5">
                                                                                    {showtimes2DDubbed.map(time => {
                                                                                        const expired = isExpired(time);
                                                                                        return (
                                                                                            <button
                                                                                                key={time}
                                                                                                disabled={expired}
                                                                                                onClick={() => handleSelectShowtime(branch.name, language === "vi" ? "2D Lồng Tiếng" : "2D Dubbed", time)}
                                                                                                className={`px-5.5 py-2.5 text-xs font-black rounded-xl border transition-all duration-200 ${
                                                                                                    expired
                                                                                                        ? "bg-slate-50 border-slate-100 text-slate-300 dark:bg-zinc-800/20 dark:border-zinc-805 dark:text-zinc-600 dark:line-through cursor-not-allowed line-through text-[11px] font-bold"
                                                                                                        : `bg-white border-slate-200 text-slate-800 dark:bg-zinc-800/50 dark:border-zinc-700/80 dark:text-zinc-200 ${theme.buttonActive} hover:scale-[1.03] cursor-pointer shadow-sm active:scale-95`
                                                                                                }`}
                                                                                            >
                                                                                                {time}
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* {t("format_2d_subbed")} */}
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <span className="h-3 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.glowColor }} />
                                                                                <h4 className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">
                                                                                    {t("format_2d_subbed")}
                                                                                </h4>
                                                                            </div>
                                                                            <div className="flex flex-wrap gap-2.5">
                                                                                {showtimes2DSubbed.map(time => {
                                                                                    const expired = isExpired(time);
                                                                                    return (
                                                                                        <button
                                                                                            key={time}
                                                                                            disabled={expired}
                                                                                            onClick={() => handleSelectShowtime(branch.name, language === "vi" ? "2D Phụ Đề" : "2D Subtitles", time)}
                                                                                            className={`px-5.5 py-2.5 text-xs font-black rounded-xl border transition-all duration-200 ${
                                                                                                expired
                                                                                                    ? "bg-slate-50 border-slate-100 text-slate-305 dark:bg-zinc-800/20 dark:border-zinc-805 dark:text-zinc-600 dark:line-through cursor-not-allowed line-through text-[11px] font-bold"
                                                                                                    : `bg-white border-slate-200 text-slate-800 dark:bg-zinc-800/50 dark:border-zinc-700/80 dark:text-zinc-200 ${theme.buttonActive} hover:scale-[1.03] cursor-pointer shadow-sm active:scale-95`
                                                                                            }`}
                                                                                        >
                                                                                            {time}
                                                                                        </button>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}
