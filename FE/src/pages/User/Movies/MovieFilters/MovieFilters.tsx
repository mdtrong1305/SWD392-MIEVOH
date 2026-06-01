import { Search } from "lucide-react";

interface MovieFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedStatus: "all" | "now_showing" | "coming_soon";
    setSelectedStatus: (status: "all" | "now_showing" | "coming_soon") => void;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    genres: string[];
}

export default function MovieFilters({
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    genres,
}: MovieFiltersProps) {
    return (
        <div className="w-full bg-white rounded-2xl border border-[#EAE6F0] p-6 shadow-sm mb-8 flex flex-col gap-6 animate__animated animate__fadeIn">
            {/* Top row: Search, Status Tabs, Sorting */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Status Tabs */}
                <div className="flex bg-[#F6F3F9] p-1.5 rounded-full border border-[#EAE6F0] w-full md:w-max select-none">
                    <button
                        type="button"
                        onClick={() => setSelectedStatus("all")}
                        className={`flex-grow md:flex-grow-0 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                            selectedStatus === "all"
                                ? "bg-gradient-to-r from-[#9370DB] to-[#7B68EE] text-white shadow-sm"
                                : "text-gray-600 hover:text-[#6D28D9]"
                        }`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedStatus("now_showing")}
                        className={`flex-grow md:flex-grow-0 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                            selectedStatus === "now_showing"
                                ? "bg-gradient-to-r from-[#9370DB] to-[#7B68EE] text-white shadow-sm"
                                : "text-gray-600 hover:text-[#6D28D9]"
                        }`}
                    >
                        Now Showing
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedStatus("coming_soon")}
                        className={`flex-grow md:flex-grow-0 px-6 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                            selectedStatus === "coming_soon"
                                ? "bg-gradient-to-r from-[#9370DB] to-[#7B68EE] text-white shadow-sm"
                                : "text-gray-600 hover:text-[#6D28D9]"
                        }`}
                    >
                        Coming Soon
                    </button>
                </div>

                {/* Search & Sort Container */}
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative flex items-center flex-grow sm:flex-grow-0">
                        <span className="absolute left-4 text-violet-500 pointer-events-none">
                            <Search className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search movies..."
                            className="w-full sm:w-64 rounded-full border border-violet-100 bg-[#F6F3F9]/50 py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label htmlFor="sortBy" className="text-sm font-bold text-gray-600 shrink-0">
                            Sort by:
                        </label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full sm:w-48 rounded-full border border-violet-100 bg-[#F6F3F9]/50 py-2.5 px-4 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 cursor-pointer"
                        >
                            <option value="rating-desc">Highest Rating</option>
                            <option value="title-asc">Title (A - Z)</option>
                            <option value="title-desc">Title (Z - A)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bottom row: Genre Filters */}
            <div className="border-t border-[#EAE6F0]/60 pt-4">
                <span className="block text-sm font-bold text-gray-600 mb-3">Genre:</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setSelectedGenre("")}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                            selectedGenre === ""
                                ? "bg-[#6D28D9] text-white shadow-sm"
                                : "bg-[#F3E8FF]/60 text-[#6D28D9] hover:bg-[#E9D5FF]/80"
                        }`}
                    >
                        All
                    </button>
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            type="button"
                            onClick={() => setSelectedGenre(genre)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                                selectedGenre === genre
                                    ? "bg-[#6D28D9] text-white shadow-sm"
                                    : "bg-[#F3E8FF]/60 text-[#6D28D9] hover:bg-[#E9D5FF]/80"
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
