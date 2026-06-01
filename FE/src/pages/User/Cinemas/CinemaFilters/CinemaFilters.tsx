import { useState } from "react";
import { Search, Film, ChevronDown, Check } from "lucide-react";
import { THEATER_CHAINS } from "../../../../mockAPI/cinemaMock.tsx";
import type { TheaterChain } from "../../../../mockAPI/cinemaMock.tsx";
import CityFilter from "../../../../components/CityFilter/CityFilter.tsx";

interface CinemaFiltersProps {
    selectedCity: string;
    onSelectCity: (city: string) => void;
    selectedChainId: string;
    onSelectChain: (chainId: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredChains: TheaterChain[];
    totalMatchingBranches: number;
}

export default function CinemaFilters({
    selectedCity,
    onSelectCity,
    selectedChainId,
    onSelectChain,
    searchQuery,
    onSearchChange,
    filteredChains,
    totalMatchingBranches,
}: CinemaFiltersProps) {
    const [isChainOpen, setIsChainOpen] = useState(false);

    const activeChain = THEATER_CHAINS.find(c => c.id === selectedChainId);

    const handleSelectChain = (chainId: string) => {
        onSelectChain(chainId);
        setIsChainOpen(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-violet-100/80 shadow-xl shadow-violet-100/10 mb-8 relative z-30">
            {/* Global overlay to close dropdowns when clicking outside */}
            {isChainOpen && (
                <div 
                    className="fixed inset-0 z-45 bg-transparent" 
                    onClick={() => {
                        setIsChainOpen(false);
                    }}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-50">
                {/* Location Dropdown */}
                <CityFilter
                    selectedCity={selectedCity}
                    onSelectCity={onSelectCity}
                    label="Select Location:"
                />

                {/* Chain Selector Dropdown */}
                <div className="flex flex-col gap-2 relative">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Cinema Chain:
                    </span>
                    <button
                        onClick={() => {
                            setIsChainOpen(!isChainOpen);
                        }}
                        className={`w-full flex items-center justify-between pl-4 pr-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer outline-none border ${
                            isChainOpen 
                                ? "bg-white border-violet-500 text-violet-700 shadow-sm" 
                                : "bg-[#F5F3F7]/80 border-violet-100 hover:bg-[#EBE8F0] text-gray-700"
                        }`}
                    >
                        <div className="flex items-center gap-2.5">
                            {activeChain ? (
                                <img src={activeChain.logo} alt={activeChain.name} className="h-6 w-6 rounded-full object-cover border border-gray-200 shrink-0" />
                            ) : (
                                <Film className={`h-6 w-6 shrink-0 transition-colors duration-300 ${isChainOpen ? "text-violet-600" : "text-violet-500"}`} />
                            )}
                            <span className="truncate">
                                {activeChain ? activeChain.name : `All Chains (${totalMatchingBranches})`}
                            </span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isChainOpen ? "rotate-180 text-violet-500" : ""}`} />
                    </button>

                    {/* Dropdown Options List */}
                    {isChainOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-violet-200/90 shadow-2xl shadow-violet-950/15 rounded-2xl py-2 z-50 animate__animated animate__fadeIn max-h-60 overflow-y-auto">
                            <button
                                onClick={() => handleSelectChain("all")}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left transition-colors duration-150 cursor-pointer ${
                                    selectedChainId === "all" 
                                        ? "bg-violet-50 text-violet-755" 
                                        : "text-gray-700 hover:bg-violet-50/60 hover:text-violet-755"
                                }}`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Film className="h-6 w-6 text-gray-450 shrink-0" />
                                    <span>All Chains ({totalMatchingBranches} cinemas)</span>
                                </div>
                                {selectedChainId === "all" && <Check className="h-4 w-4 text-violet-600" />}
                            </button>
                            {THEATER_CHAINS.map(chain => {
                                const count = filteredChains.find(c => c.id === chain.id)?.branches.length || 0;
                                const isSelected = selectedChainId === chain.id;
                                return (
                                    <button
                                        key={chain.id}
                                        onClick={() => handleSelectChain(chain.id)}
                                        disabled={count === 0}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left transition-colors duration-150 ${
                                            count === 0 
                                                ? "opacity-40 cursor-not-allowed text-gray-400" 
                                                : isSelected 
                                                    ? "bg-violet-50 text-violet-755 cursor-pointer" 
                                                    : "text-gray-700 hover:bg-violet-50/60 hover:text-violet-755 cursor-pointer"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <img src={chain.logo} alt={chain.name} className="h-6 w-6 rounded-full object-cover border border-gray-200 shrink-0" />
                                            <span className="truncate">{chain.name} ({count})</span>
                                        </div>
                                        {isSelected && <Check className="h-4 w-4 text-violet-600 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Search Input */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Quick Search:
                    </span>
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-6 w-6 text-violet-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Enter cinema name, street..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 bg-[#F5F3F7]/70 border border-violet-100 hover:border-violet-300 rounded-2xl text-sm font-bold text-gray-755 outline-none placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all duration-300"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
