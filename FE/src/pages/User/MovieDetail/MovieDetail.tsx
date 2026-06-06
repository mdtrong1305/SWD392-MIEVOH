import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../../../contextAPI/LanguageContext.tsx";
import DetailHero from "./DetailHero/DetailHero.tsx";
import DetailReviews from "./DetailReviews/DetailReviews.tsx";
import type { Review } from "./DetailReviews/DetailReviews.tsx";
import ScrollReveal from "../../../components/ScrollReveal/ScrollReveal.tsx";
import { ArrowLeft } from "lucide-react";
import { getMovieDetailApi } from "../../../axios/movie.tsx";

export default function MovieDetail() {
    const { t, language } = useLanguage();
    const { id } = useParams<{ id: string }>();

    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Automatically scroll to top when movie ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getMovieDetailApi(id);
                const data = (res as any).data?.data || (res as any).data || res;
                if (data) {
                    let genresArr: string[] = [];
                    if (Array.isArray(data.genres)) {
                        genresArr = data.genres;
                    } else if (typeof data.genres === 'string') {
                        genresArr = data.genres.split(',').map((g: string) => g.trim());
                    }

                    let image = data.imageUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
                    if (data.imageUrl && !data.imageUrl.startsWith('http')) {
                        const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.mievoh.io.vn/api';
                        const domain = apiBase.replace('/api', '');
                        image = `${domain}/movies/${data.imageUrl}`;
                    }

                    const mapped = {
                        id: data.movieId,
                        title: language === "vi" ? (data.title_vi || data.title_en) : (data.title_en || data.title_vi),
                        title_vi: data.title_vi,
                        title_en: data.title_en,
                        description: language === "vi" ? (data.description_vi || data.description_en) : (data.description_en || data.description_vi),
                        description_vi: data.description_vi,
                        description_en: data.description_en,
                        image,
                        backdrop: image,
                        rating: data.averageRating ?? 4.5,
                        genres: genresArr,
                        status: data.status || "now_showing",
                        releaseDate: data.releaseDate ? new Date(data.releaseDate).toLocaleDateString("vi-VN") : "10/06/2026",
                        duration: data.duration ? `${data.duration} mins` : "120 mins",
                        ageRating: data.ageRestriction || "P",
                        language: data.language || "English",
                        language_vi: data.language === "vi" ? "Tiếng Việt" : "Tiếng Anh",
                        language_en: data.language === "vi" ? "Vietnamese" : "English",
                        director: data.director || "Unknown",
                        cast: data.cast ? (Array.isArray(data.cast) ? data.cast : data.cast.split(',')) : ["Various Artists"],
                        trailerUrl: data.trailerUrl || "",
                    };
                    setMovie(mapped);

                    const rawReviews = data.Reviews || [];
                    let reviewsList = [];
                    if (rawReviews.length > 0) {
                        reviewsList = rawReviews.map((r: any) => ({
                            id: r.reviewId || Date.now(),
                            name: r.author || "User",
                            rating: r.rating || 5,
                            comment: r.content || "",
                            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "06/06/2026"
                        }));
                    } else {
                        reviewsList = [
                            { id: 1, name: "Minh Anh", rating: 5, comment: "Phim quá hay, kỹ xảo đỉnh cao và nội dung rất ý nghĩa!", date: "05/06/2026" },
                            { id: 2, name: "John Doe", rating: 4, comment: "Great visuals and sound design. Highly recommended!", date: "04/06/2026" }
                        ];
                    }

                    // Load saved custom reviews from localStorage
                    const savedCustom = localStorage.getItem(`mievoh_custom_reviews_${id}`);
                    if (savedCustom) {
                        const customArray = JSON.parse(savedCustom);
                        setReviews([...customArray, ...reviewsList]);
                    } else {
                        setReviews(reviewsList);
                    }
                } else {
                    setMovie(null);
                }
            } catch (err) {
                console.error("Lỗi khi lấy chi tiết phim:", err);
                setMovie(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, language]);

    const handleAddReview = (newReview: Omit<Review, "id" | "date">) => {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        
        const reviewWithMeta: Review = {
            id: Date.now(),
            ...newReview,
            date: formattedDate
        };

        // Save custom review to localStorage
        const savedCustom = localStorage.getItem(`mievoh_custom_reviews_${id}`);
        const customArray = savedCustom ? JSON.parse(savedCustom) : [];
        const updatedCustom = [reviewWithMeta, ...customArray];
        localStorage.setItem(`mievoh_custom_reviews_${id}`, JSON.stringify(updatedCustom));

        setReviews((prev) => [reviewWithMeta, ...prev]);
    };

    if (loading) {
        return (
            <div className="w-full bg-[#EFEBF4] py-20 flex flex-col items-center justify-center text-center px-4 min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6D28D9] mb-4"></div>
                <p className="text-gray-500 font-semibold">{t("loading" as any) || "Đang tải thông tin phim..."}</p>
            </div>
        );
    }

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
            <DetailHero movie={movie} />

            <div className="mx-auto max-w-[90%] px-4 sm:px-6 lg:px-8 mt-8 flex flex-col gap-8">
                <ScrollReveal animationClass="animate__fadeInUp">
                    <DetailReviews reviews={reviews} onAddReview={handleAddReview} />
                </ScrollReveal>
            </div>
        </div>
    );
}
