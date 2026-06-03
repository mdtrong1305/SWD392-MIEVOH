import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Button from "../../../../components/Button/Button.tsx";
import Slider from "react-slick";
import { slickHotMoviesSettings } from "../../../../config/slick/slickConfig.tsx";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";
import { toast } from "../../../../components/Toast/Toast.tsx";
import { HOT_MOVIES } from "../../../../mockAPI/movieMock.tsx";

export default function HotMovies() {
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        const offsets = [50, 150, 300, 500, 1000];
        const timers = offsets.map(delay => 
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, delay)
        );

        return () => {
            window.removeEventListener("resize", handleResize);
            timers.forEach(clearTimeout);
        };
    }, []);

    const getSlidesToShow = () => {
        if (windowWidth < 420) return 1;
        if (windowWidth < 768) return 2;
        if (windowWidth < 1024) return 3;
        return 4;
    };

    const sliderSettings = {
        ...slickHotMoviesSettings,
        slidesToShow: getSlidesToShow(),
        responsive: undefined
    };

    // Resolve default export for react-slick in Vite environment
    const SlickSlider = (Slider as any).default || Slider;
    const CountUpComponent = (CountUp as any).default || CountUp;


    const renderMovieCard = (movie: typeof HOT_MOVIES[0]) => (
        <Link 
            to={`/movies/${movie.id}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#F6F3F9] p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-[#EAE6F0] hover:scale-[1.02] h-full cursor-pointer block no-underline text-inherit"
        >
            {/* Movie Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Rating Badge */}
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>
                        <CountUpComponent end={movie.rating} decimals={1} duration={1.5} enableScrollSpy scrollSpyOnce />
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-col flex-grow">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-[#6D28D9] transition-colors duration-200 mb-2">
                    {movie.title}
                </h3>

                {/* Genres */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {movie.genres.map((genre, idx) => (
                        <span 
                            key={idx}
                            className="inline-block rounded-md bg-[#F3E8FF] px-2 py-0.5 text-xs font-semibold text-[#6D28D9]"
                        >
                            {genre}
                        </span>
                    ))}
                </div>
            </div>

            {/* {t("quick_book")} Button */}
            <div className="mt-auto">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-center border-gray-200 hover:border-[#6D28D9]"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toast.success(t("opening_booking_for", { title: movie.title }) || `Opening ticket booking for: ${movie.title}`);
                    }}
                >
                    {t("quick_book")}
                </Button>
            </div>
        </Link>
    );

    return (
        <section className="mx-auto max-w-[85%] px-4 py-16 sm:py-20 font-sans">
            {/* Header section with heading */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {t("trending_movies")}
                </h2>
            </div>

            {/* Movies Slider */}
            <div className="relative slider-container">
                {mounted && (
                    <SlickSlider {...sliderSettings}>
                        {HOT_MOVIES.map((movie) => (
                            <div key={movie.id} className="px-2 pb-4">
                                {renderMovieCard(movie)}
                            </div>
                        ))}
                    </SlickSlider>
                )}
            </div>
        </section>
    );
}
