import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../../../components/Button/Button.tsx";
import { toast } from "../../../../components/Toast/Toast.tsx";

export interface Movie {
    id: number;
    title: string;
    image: string;
    rating: number;
    genres: string[];
    status: "now_showing" | "coming_soon";
    releaseDate?: string;
}

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const isComingSoon = movie.status === "coming_soon";

    const handleAction = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isComingSoon) {
            toast.success(`Subscribed to notifications for "${movie.title}" when released!`);
        } else {
            toast.success(`Opening ticket booking for: ${movie.title}`);
        }
    };

    return (
        <Link to={`/movies/${movie.id}`} className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#F6F3F9] p-3 shadow-md hover:shadow-xl transition-all duration-300 border border-[#EAE6F0] hover:scale-[1.02] h-full cursor-pointer block no-underline text-inherit">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Status Badge */}
                <div className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm ${
                    isComingSoon ? "bg-violet-600/80" : "bg-green-600/80"
                }`}>
                    {isComingSoon ? "Coming Soon" : "Now Showing"}
                </div>

                {/* Rating Badge */}
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{movie.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* Movie Details */}
            <div className="flex flex-col flex-grow">
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#6D28D9] transition-colors duration-200 mb-2 min-h-[48px]">
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

                {/* Release date if coming soon */}
                {isComingSoon && movie.releaseDate && (
                    <div className="text-xs text-gray-500 mb-4 italic">
                        Release Date: {movie.releaseDate}
                    </div>
                )}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
                <Button
                    variant={isComingSoon ? "outline" : "primary"}
                    size="sm"
                    onClick={handleAction}
                    className="w-full text-center"
                >
                    {isComingSoon ? "Get Notified" : "Buy Ticket"}
                </Button>
            </div>
        </Link>
    );
}
