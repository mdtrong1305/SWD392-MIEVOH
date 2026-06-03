import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../../../contextAPI/LanguageContext.tsx";
import DetailHero from "./DetailHero/DetailHero.tsx";
import DetailReviews from "./DetailReviews/DetailReviews.tsx";
import type { Review } from "./DetailReviews/DetailReviews.tsx";
import ScrollReveal from "../../../components/ScrollReveal/ScrollReveal.tsx";
import { ArrowLeft } from "lucide-react";
// Imports from central mock API
import { MOVIES_DETAILS, INITIAL_REVIEWS } from "../../../mockAPI/movieMock.tsx";

export default function MovieDetail() {
    const { t, language } = useLanguage();
    const { id } = useParams<{ id: string }>();
    const movieId = Number(id);

    // Automatically scroll to top when movie ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [movieId]);

    // Look up the movie details
    const movie = useMemo(() => {
        const rawMovie = MOVIES_DETAILS[movieId] || null;
        if (!rawMovie) return null;
        return {
            ...rawMovie,
            title: language === "vi" ? (rawMovie.title_vi || rawMovie.title) : (rawMovie.title_en || rawMovie.title),
            description: language === "vi" ? (rawMovie.description_vi || rawMovie.description) : (rawMovie.description_en || rawMovie.description),
            language: language === "vi" ? (rawMovie.language_vi || rawMovie.language) : (rawMovie.language_en || rawMovie.language),
        };
    }, [movieId, language]);

    // Local review state pre-populated with default reviews
    const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

    const handleAddReview = (newReview: Omit<Review, "id" | "date">) => {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        
        const reviewWithMeta: Review = {
            id: Date.now(),
            ...newReview,
            date: formattedDate
        };

        setReviews((prev) => [reviewWithMeta, ...prev]);
    };

    if (!movie) {
        return (
            <div className="w-full bg-[#EFEBF4] py-20 flex flex-col items-center justify-center text-center px-4 min-h-[60vh]">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{t("movie_not_found")}</h2>
                <p className="text-gray-500 mb-6 font-medium">{t("movie_not_found_desc")}</p>
                <Link to="/movies" className="inline-flex items-center gap-2 bg-[#6D28D9] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#5B21B6] transition-colors duration-200">
                    <ArrowLeft className="h-4 w-4" />
                    {t("back_to_movie_list")}
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#EFEBF4] pb-16">
            {/* 1. Hero banner */}
            <DetailHero movie={movie} />

            {/* Content Container */}
            <div className="mx-auto max-w-[90%] px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8">
                {/* 2. Ratings and reviews section */}
                <ScrollReveal animationClass="animate__fadeInUp">
                    <DetailReviews reviews={reviews} onAddReview={handleAddReview} />
                </ScrollReveal>
            </div>
        </div>
    );
}
