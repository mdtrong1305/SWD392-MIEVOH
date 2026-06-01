import { useState, useMemo } from "react";
import MovieHero from "./MovieHero/MovieHero.tsx";
import MovieFilters from "./MovieFilters/MovieFilters.tsx";
import MovieGrid from "./MovieGrid/MovieGrid.tsx";
import { INITIAL_MOVIES } from "../../../mockAPI/movieMock.tsx";


export default function Movies() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<"all" | "now_showing" | "coming_soon">("all");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [sortBy, setSortBy] = useState("rating-desc");

    // Extract all unique genres from initial list
    const genres = useMemo(() => {
        const set = new Set<string>();
        INITIAL_MOVIES.forEach((movie) => {
            movie.genres.forEach((genre) => set.add(genre));
        });
        return Array.from(set);
    }, []);

    // Filter and Sort Movies
    const filteredMovies = useMemo(() => {
        return INITIAL_MOVIES.filter((movie) => {
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = selectedStatus === "all" || movie.status === selectedStatus;
            const matchesGenre = selectedGenre === "" || movie.genres.includes(selectedGenre);
            return matchesSearch && matchesStatus && matchesGenre;
        }).sort((a, b) => {
            if (sortBy === "rating-desc") {
                return b.rating - a.rating;
            }
            if (sortBy === "title-asc") {
                return a.title.localeCompare(b.title, "vi");
            }
            if (sortBy === "title-desc") {
                return b.title.localeCompare(a.title, "vi");
            }
            return 0;
        });
    }, [searchQuery, selectedStatus, selectedGenre, sortBy]);

    return (
        <div className="w-full bg-[#EFEBF4] pb-16">
            {/* Hero Section */}
            <MovieHero />

            {/* Content Section */}
            <div className="mx-auto max-w-[85%] px-4 sm:px-6 lg:px-8 mt-10">
                {/* Filters */}
                <div className="animate__animated animate__fadeInUp">
                    <MovieFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        selectedGenre={selectedGenre}
                        setSelectedGenre={setSelectedGenre}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        genres={genres}
                    />
                </div>

                {/* Movies Grid */}
                <div className="mt-8 animate__animated animate__fadeInUp [animation-delay:200ms]">
                    <MovieGrid movies={filteredMovies} />
                </div>
            </div>
        </div>
    );
}
