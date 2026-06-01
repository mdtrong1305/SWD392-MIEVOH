import { useState, useMemo } from "react";
import { THEATER_CHAINS } from "../../../mockAPI/cinemaMock.tsx";
import CinemaHero from "./CinemaHero/CinemaHero.tsx";
import CinemaFilters from "./CinemaFilters/CinemaFilters.tsx";
import CinemaBranches from "./CinemaBranches/CinemaBranches.tsx";
import type { DisplayBranch } from "./CinemaBranches/CinemaBranches.tsx";

export default function CinemasPage() {
    const [selectedCity, setSelectedCity] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChainId, setSelectedChainId] = useState<string>("all");

    // Filter branches & chains based on city and search query
    const filteredChains = useMemo(() => {
        return THEATER_CHAINS.map(chain => {
            const matchingBranches = chain.branches.filter(branch => {
                const matchesCity = selectedCity === "All" || branch.city === selectedCity;
                const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      branch.address.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCity && matchesSearch;
            });
            return {
                ...chain,
                branches: matchingBranches
            };
        }).filter(chain => chain.branches.length > 0);
    }, [selectedCity, searchQuery]);

    // Gather all branches matching current search and city filters
    const allMatchingBranches = useMemo(() => {
        const branchesList: DisplayBranch[] = [];
        filteredChains.forEach(chain => {
            chain.branches.forEach(branch => {
                branchesList.push({
                    ...branch,
                    chainName: chain.name,
                    chainLogo: chain.logo
                });
            });
        });
        return branchesList;
    }, [filteredChains]);

    // Active branches to display in the main grid
    const displayBranches = useMemo(() => {
        if (selectedChainId === "all") {
            return allMatchingBranches;
        }
        const chain = filteredChains.find(c => c.id === selectedChainId);
        if (!chain) return [];
        return chain.branches.map(b => ({
            ...b,
            chainName: chain.name,
            chainLogo: chain.logo
        }));
    }, [selectedChainId, allMatchingBranches, filteredChains]);

    const handleResetFilters = () => {
        setSelectedCity("All");
        setSearchQuery("");
        setSelectedChainId("all");
    };

    return (
        <div className="bg-[#EFEBF4] min-h-screen pb-16 font-sans">
            {/* Page Header Banner */}
            <CinemaHero />

            {/* Main Content Area */}
            <div className="max-w-[90%] mx-auto px-4 md:px-8 relative z-10">
                {/* Filters Row */}
                <CinemaFilters 
                    selectedCity={selectedCity}
                    onSelectCity={(city) => {
                        setSelectedCity(city);
                        setSelectedChainId("all");
                    }}
                    selectedChainId={selectedChainId}
                    onSelectChain={setSelectedChainId}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filteredChains={filteredChains}
                    totalMatchingBranches={allMatchingBranches.length}
                />

                {/* Branches Display Grid */}
                <CinemaBranches 
                    branches={displayBranches}
                    onResetFilters={handleResetFilters}
                />
            </div>
        </div>
    );
}
