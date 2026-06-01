import { MapPin, Star, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CinemaBranch } from "../../../../mockAPI/cinemaMock.tsx";

export interface DisplayBranch extends CinemaBranch {
    chainName: string;
    chainLogo: string;
}

interface CinemaBranchesProps {
    branches: DisplayBranch[];
    onResetFilters: () => void;
}

export default function CinemaBranches({ branches, onResetFilters }: CinemaBranchesProps) {
    const navigate = useNavigate();

    if (branches.length === 0) {
        return (
            <div className="bg-white border border-gray-100 p-12 rounded-3xl text-center shadow-sm animate__animated animate__fadeIn">
                <div className="h-16 w-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-500">
                    <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No cinemas found</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                    Sorry, no cinemas match your current filters. Please try again with other options.
                </p>
                <button
                    onClick={onResetFilters}
                    className="mt-5 text-sm font-bold text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-5 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer"
                >
                    Clear Filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate__animated animate__fadeIn">
            {branches.map(branch => (
                <div
                    key={branch.id}
                    onClick={() => navigate(`/cinemas/${branch.id}`)}
                    className="bg-white rounded-3xl overflow-hidden border border-violet-100/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                >
                    {/* Cover Image with Brand Badge */}
                    <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                            src={branch.image}
                            alt={branch.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Chain overlay tag */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white py-1.5 px-3 rounded-full flex items-center gap-1.5 border border-white/10 text-xs font-bold">
                            <img src={branch.chainLogo} alt={branch.chainName} className="h-4 w-4 rounded-full object-cover border border-white/20" />
                            <span>{branch.chainName}</span>
                        </div>
                        {/* Rating badge */}
                        <div className="absolute top-4 right-4 bg-violet-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Star className="h-3.5 w-3.5 fill-white text-white" />
                            <span>{branch.rating}</span>
                        </div>
                    </div>

                    {/* Information Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2 py-0.5 rounded-md w-fit mb-2.5 block">
                                {branch.city}
                            </span>
                            
                            <h3 className="text-base font-extrabold text-gray-900 group-hover:text-violet-700 transition-colors duration-200 line-clamp-1 mb-2">
                                {branch.name}
                            </h3>

                            <div className="space-y-2 mt-2 text-xs text-gray-500">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                                    <span className="leading-relaxed line-clamp-3">{branch.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
