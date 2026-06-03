import { useState } from "react";
import { Play, Info, X } from "lucide-react";
import Button from "../../../../components/Button/Button.tsx";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";

export default function Hero() {
    const { t } = useLanguage();
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const trailerUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    return (
        <div className="relative mx-auto max-w-[85%] px-4 pt-16 sm:pt-24">
            {/* Main Banner Card */}
            <div className="relative h-[55vh] min-h-[450px] sm:h-[75vh] sm:min-h-[550px] w-full overflow-hidden rounded-3xl bg-black shadow-2xl">
                {/* Background Image with twilight skyscrapers */}
                <img
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80"
                    alt="City Skyline"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                
                {/* Pink/Purple ambient gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-purple-900/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Left/bottom aligned Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-16 max-w-2xl flex flex-col items-start text-white">
                    {/* Badge */}
                    <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-1 text-xs font-semibold uppercase tracking-wider text-purple-200 mb-3 sm:mb-4 border border-white/10 animate__animated animate__fadeInDown">
                        {t("explore_now")}
                    </span>

                    {/* Movie Title */}
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-md animate__animated animate__fadeInLeft">
                        {t("infinite_journey")}
                    </h1>

                    {/* Description */}
                    <p className="mt-2.5 sm:mt-4 text-xs sm:text-lg text-gray-300 leading-relaxed drop-shadow-sm font-medium animate__animated animate__fadeInLeft animate__delay-1s">
                        {t("hero_desc")}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-5 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 animate__animated animate__fadeInUp animate__delay-1s">
                        <Button 
                            variant="primary" 
                            size="md"
                            onClick={() => setShowTrailerModal(true)}
                            className="flex items-center gap-2"
                        >
                            <Play className="h-4 w-4 fill-current" />
                            <span>{t("watch_trailer")}</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="md"
                            className="flex items-center gap-2 border-white/40 text-white hover:bg-white/10 hover:border-white hover:text-white"
                        >
                            <Info className="h-4 w-4" />
                            <span>{t("more_info")}</span>
                        </Button>
                    </div>
                </div>

                {/* Interactive Neon Glow decoration */}
                <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
                <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />
            </div>

            {/* Video Trailer Modal */}
            {showTrailerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
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
