import { useState, useMemo, useEffect } from "react";
import CinemaHero from "./CinemaHero/CinemaHero.tsx";
import CinemaFilters from "./CinemaFilters/CinemaFilters.tsx";
import CinemaBranches from "./CinemaBranches/CinemaBranches.tsx";
import type { DisplayBranch } from "./CinemaBranches/CinemaBranches.tsx";
import type { TheaterChain } from "../../../axios/cinemas.tsx";
import { getCinemaSystemsApi, getCinemaComplexesApi } from "../../../axios/cinemas.tsx";
import { useLanguage } from "../../../contextAPI/LanguageContext.tsx";

export default function CinemasPage() {
    const { t } = useLanguage();
    const [selectedCity, setSelectedCity] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedChainId, setSelectedChainId] = useState<string>("all");
    
    const [theaterChains, setTheaterChains] = useState<TheaterChain[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCinemas = async () => {
            try {
                // Fetch systems and complexes in parallel
                const [systemsRes, complexesRes] = await Promise.all([
                    getCinemaSystemsApi(),
                    getCinemaComplexesApi()
                ]);

                const systems = (systemsRes.data as any)?.data || [];
                const complexes = (complexesRes.data as any)?.data || [];

                // Map complexes to their corresponding systems
                const mappedChains = systems.map((sys: any) => {
                    const sysNameLower = sys.name?.toLowerCase() || "";
                    
                    // Determine some defaults based on chain name for premium visuals
                    let rating = 4.5;
                    let priceRange = "70,000 VND - 120,000 VND";
                    let phone = "1900 1000";

                    if (sysNameLower.includes("cgv")) {
                        rating = 4.8;
                        priceRange = "80,000 VND - 160,000 VND";
                        phone = "1900 6017";
                    } else if (sysNameLower.includes("bhd")) {
                        rating = 4.6;
                        priceRange = "65,000 VND - 120,000 VND";
                        phone = "1900 2099";
                    } else if (sysNameLower.includes("lotte")) {
                        rating = 4.7;
                        priceRange = "70,000 VND - 130,000 VND";
                        phone = "028 3775 2524";
                    } else if (sysNameLower.includes("cine")) {
                        rating = 4.4;
                        priceRange = "45,000 VND - 90,000 VND";
                        phone = "028 7300 8881";
                    } else if (sysNameLower.includes("beta")) {
                        rating = 4.3;
                        priceRange = "50,000 VND - 100,000 VND";
                        phone = "024 7302 8885";
                    }

                    // Filter complexes belonging to this system
                    const systemComplexes = complexes.filter((comp: any) => comp.cinemaSystemId === sys.cinemaSystemId);

                    const branches = systemComplexes.map((comp: any, idx: number) => {
                        const address = comp.address || "";
                        // Determine city from address
                        let city = "Ho Chi Minh City";
                        if (address.toLowerCase().includes("hà nội") || address.toLowerCase().includes("hanoi")) {
                            city = "Hanoi";
                        } else if (address.toLowerCase().includes("đà nẵng") || address.toLowerCase().includes("da nang")) {
                            city = "Da Nang";
                        } else if (address.toLowerCase().includes("bình dương") || address.toLowerCase().includes("binh duong")) {
                            city = "Binh Duong";
                        }

                        // Alternate images for visual variety
                        const imagesList = [
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
                            "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
                            "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80",
                            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80",
                            "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
                        ];
                        const randomImage = imagesList[idx % imagesList.length];

                        return {
                            id: comp.cinemaComplexId,
                            name: comp.name,
                            address: comp.address,
                            phone,
                            city,
                            rating: parseFloat((rating + (idx % 3) * 0.1 - 0.1).toFixed(1)), // Subtle variation
                            priceRange,
                            image: randomImage
                        };
                    });

                    // Build full URL for system logo
                    let logoUrl = sys.logo || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=120&q=80";
                    if (sys.logo && !sys.logo.startsWith('http')) {
                        // Extract base domain from base url
                        const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3069/api';
                        const domain = apiBase.replace('/api', '');
                        logoUrl = `${domain}/cinema-system/${sys.logo}`;
                    }

                    return {
                        id: sys.cinemaSystemId,
                        name: sys.name,
                        logo: logoUrl,
                        description: `Hệ thống rạp ${sys.name} hiện đại, chất lượng âm thanh hình ảnh hàng đầu.`,
                        website: `www.${sysNameLower.replace(/\s+/g, '')}.vn`,
                        branches
                    };
                });

                setTheaterChains(mappedChains);
            } catch (error) {
                console.error("Lỗi khi tải thông tin hệ thống rạp:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCinemas();
    }, []);

    // Filter branches & chains based on city and search query
    const filteredChains = useMemo(() => {
        return theaterChains.map(chain => {
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
    }, [selectedCity, searchQuery, theaterChains]);

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
                    theaterChains={theaterChains}
                    filteredChains={filteredChains}
                    totalMatchingBranches={allMatchingBranches.length}
                />

                {/* Loading state or Branches Display Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-650 mb-4"></div>
                        <p className="text-gray-500 font-semibold">{t("loading" as any) || "Đang tải danh sách rạp..."}</p>
                    </div>
                ) : (
                    <CinemaBranches 
                        branches={displayBranches}
                        onResetFilters={handleResetFilters}
                    />
                )}
            </div>
        </div>
    );
}
