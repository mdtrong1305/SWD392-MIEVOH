import { useState, useEffect } from "react";
import { Play, Info, X } from "lucide-react";
import Button from "../../../../components/Button/Button.tsx";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";
import { getNowShowingMoviesApi, getComingSoonMoviesApi } from "../../../../axios/cinemas.tsx";

export default function Hero() {
    const { t, language } = useLanguage();
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [topMovie, setTopMovie] = useState<any>(null);

    useEffect(() => {
        const fetchTopMovie = async () => {
            try {
                const [nowShowingRes, comingSoonRes] = await Promise.all([
                    getNowShowingMoviesApi({ pageSize: 100 }),
                    getComingSoonMoviesApi({ pageSize: 100 })
                ]);
                
                const nowShowing = (nowShowingRes as any).data?.movies || (nowShowingRes as any).data?.data || [];
                const comingSoon = (comingSoonRes as any).data?.movies || (comingSoonRes as any).data?.data || [];
                
                const allMoviesList = [...nowShowing, ...comingSoon];
                
                if (allMoviesList.length > 0) {
                    const sorted = [...allMoviesList].sort((a, b) => {
                        const ratingA = a.averageRating || 0;
                        const ratingB = b.averageRating || 0;
                        return ratingB - ratingA;
                    });
                    setTopMovie(sorted[0]);
                }
            } catch (err) {
                console.error("Error fetching top movie:", err);
            }
        };
        fetchTopMovie();
    }, []);

    const getMovieImage = (movie: any) => {
        let image = movie.imageUrl || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80";
        if (movie.imageUrl && !movie.imageUrl.startsWith('http')) {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.mievoh.io.vn/api';
            const domain = apiBase.replace('/api', '');
            image = `${domain}/movies/${movie.imageUrl}`;
        }
        return image;
    };

    const getEmbedUrl = (url: string | null) => {
        if (!url) return "";
        let videoId = "";
        if (url.includes("youtube.com/watch")) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get("v") || "";
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
        } else if (url.includes("youtube.com/embed/")) {
            return url;
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
        return url;
    };

    const title = topMovie
        ? (language === "vi" ? (topMovie.title_vi || topMovie.title_en) : (topMovie.title_en || topMovie.title_vi))
        : t("infinite_journey");

    const description = topMovie
        ? (language === "vi" ? (topMovie.description_vi || topMovie.description_en) : (topMovie.description_en || topMovie.description_vi))
        : t("hero_desc");

    const bgImage = topMovie
        ? getMovieImage(topMovie)
        : "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80";

    const trailerUrl = topMovie
        ? getEmbedUrl(topMovie.trailerUrl)
        : "https://www.youtube.com/embed/dQw4w9WgXcQ";

    return (
        <div className="relative mx-auto max-w-[85%] px-4 pt-16 sm:pt-24 animate__animated animate__fadeIn">
            {/* Main Banner Card */}
            <div className="relative h-[55vh] min-h-[450px] sm:h-[75vh] sm:min-h-[550px] w-full overflow-hidden rounded-3xl bg-black dark:bg-gradient-to-br dark:from-[#090416] dark:via-[#140b2d] dark:to-[#06020f] shadow-2xl flex items-center border border-transparent dark:border-violet-500/20 dark:shadow-[0_0_40px_rgba(139,92,246,0.15)] transition-all duration-500">
                {/* Ambient Blurred Background Image (only active in dark mode) */}
                <img
                    src={bgImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-0 dark:opacity-80 blur-3xl scale-125 pointer-events-none transition-opacity duration-500"
                />
                
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent dark:from-black/95 dark:via-black/55 dark:to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
 
                {/* Content and Poster Flex Layout */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between gap-8 p-6 sm:p-12 lg:p-16">
                    {/* Left content block */}
                    <div className="flex-1 max-w-2xl flex flex-col items-start text-left text-white">
                        {/* Glowing Neon Badge */}
                        <span className="inline-block rounded-full bg-white/10 text-purple-200 border border-white/10 dark:bg-gradient-to-r dark:from-violet-600/25 dark:to-fuchsia-600/25 dark:text-violet-200 dark:border-violet-500/35 backdrop-blur-md px-4 py-1 text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4 border border-white/10 animate__animated animate__fadeInDown">
                            {t("explore_now")}
                        </span>
     
                        {/* Gradient Movie Title */}
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-violet-100 dark:to-violet-300 drop-shadow-md animate__animated animate__fadeInLeft leading-tight">
                            {title}
                        </h1>
     
                        {/* Description */}
                        <p className="mt-2.5 sm:mt-4 text-xs sm:text-lg text-gray-300 dark:text-violet-200/80 leading-relaxed font-medium animate__animated animate__fadeInLeft animate__delay-1s line-clamp-3">
                            {description}
                        </p>
     
                        {/* Action Buttons */}
                        <div className="mt-5 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 animate__animated animate__fadeInUp animate__delay-1s">
                            {topMovie?.trailerUrl && (
                                <Button 
                                    variant="primary" 
                                    size="md"
                                    onClick={() => setShowTrailerModal(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Play className="h-4 w-4 fill-current" />
                                    <span>{t("watch_trailer")}</span>
                                </Button>
                            )}
                            <Button 
                                variant="outline" 
                                size="md"
                                href={topMovie ? `/movies/${topMovie.movieId}` : "/movies"}
                                className="flex items-center gap-2 border-white/40 text-white hover:bg-white/10 hover:border-white hover:text-white"
                            >
                                <Info className="h-4 w-4" />
                                <span>{t("more_info")}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Right poster card block */}
                    {topMovie && (
                        <div className="hidden md:flex justify-center items-center animate__animated animate__fadeInRight animate__delay-1s shrink-0">
                            <div className="relative group">
                                {/* Glowing neon gradient border container */}
                                <div className="absolute -inset-1 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 rounded-2xl blur opacity-25 dark:opacity-50 group-hover:opacity-45 dark:group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
                                <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-violet-500/20 shadow-xl dark:shadow-2xl w-56 sm:w-64 lg:w-80 aspect-[2/3]">
                                    <img
                                        src={bgImage}
                                        alt={title}
                                        className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Additional Ambient Neon Glow Spheres */}
                <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-violet-600/10 dark:bg-violet-600/20 blur-[120px] pointer-events-none" />
                <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-fuchsia-600/10 dark:bg-fuchsia-600/15 blur-[120px] pointer-events-none" />
            </div>
 
            {/* Video Trailer Modal */}
            {showTrailerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate__animated animate__fadeIn animate__faster">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#1A1A1C] shadow-2xl border border-white/10 animate__animated animate__zoomIn animate__faster">
                        <button
                            onClick={() => setShowTrailerModal(false)}
                            className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:bg-black/90 hover:text-white transition-all border border-white/10"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                src={trailerUrl}
                                title="Movie Trailer"
                                className="h-full w-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
