import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { THEATER_CHAINS } from "../../../mockAPI/cinemaMock.tsx";
import type { DisplayBranch } from "../Cinemas/CinemaBranches/CinemaBranches.tsx";
import CinemaHeader from "./CinemaHeader/CinemaHeader.tsx";
import DateSelector from "./DateSelector/DateSelector.tsx";
import type { DateOption } from "./DateSelector/DateSelector.tsx";
import MovieShowtimesList from "./MovieShowtimesList/MovieShowtimesList.tsx";
import { Search } from "lucide-react";

export default function CinemaDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<DateOption | null>(null);

    // Scroll to top on mount or when cinema ID changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Find the current cinema branch and include chain logos and names
    const activeBranch = useMemo(() => {
        if (!id) return null;
        const targetId = parseInt(id, 10);

        for (const chain of THEATER_CHAINS) {
            const branch = chain.branches.find(b => b.id === targetId);
            if (branch) {
                return {
                    ...branch,
                    chainName: chain.name,
                    chainLogo: chain.logo
                } as DisplayBranch;
            }
        }
        return null;
    }, [id]);

    if (!activeBranch) {
        return (
            <div className="bg-[#FAF9FC] min-h-screen py-16 px-4 md:px-8 font-sans flex items-center justify-center">
                <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-lg max-w-md w-full">
                    <div className="h-16 w-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-500">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Cinema branch not found</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Sorry, this link does not exist or the cinema has ceased operations.
                    </p>
                    <button
                        onClick={() => navigate("/cinemas")}
                        className="mt-6 text-sm font-bold text-violet-600 hover:text-white bg-violet-50 hover:bg-violet-600 px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer w-full border border-violet-100 hover:border-violet-600"
                    >
                        Go back to cinemas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#EFEBF4] min-h-screen pb-16 font-sans">
            {/* Full-bleed Cinema info banner */}
            <CinemaHeader branch={activeBranch} />

            {/* Main Content Area - constrained to elegant max-w-5xl */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 mt-8">
                {/* Day option scheduler select row */}
                <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                {/* Grid schedule display */}
                <h2 className="text-xs font-extrabold text-slate-800 mb-6 tracking-widest uppercase border-l-4 border-[#6C5CE7] pl-3">
                    Showtimes at {activeBranch.name}
                </h2>
                <MovieShowtimesList selectedDate={selectedDate} cinemaName={activeBranch.name} />
            </div>
        </div>
    );
}
