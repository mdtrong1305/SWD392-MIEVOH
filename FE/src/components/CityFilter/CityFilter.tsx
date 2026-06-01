import { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { CITIES } from "../../mockAPI/cinemaMock.tsx";

interface CityFilterProps {
    selectedCity: string;
    onSelectCity: (city: string) => void;
    className?: string;
    label?: string;
}

export default function CityFilter({
    selectedCity,
    onSelectCity,
    className = "",
    label = "Select Location:"
}: CityFilterProps) {
    const [isCityOpen, setIsCityOpen] = useState(false);

    const handleSelectCity = (city: string) => {
        onSelectCity(city);
        setIsCityOpen(false);
    };

    return (
        <div className={`flex flex-col gap-2 relative ${className}`}>
            {/* Click-outside overlay */}
            {isCityOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setIsCityOpen(false)}
                />
            )}

            {label && (
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {label}
                </span>
            )}
            <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className={`w-full flex items-center justify-between pl-4 pr-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer outline-none border relative z-50 ${
                    isCityOpen 
                        ? "bg-white border-[#6C5CE7] text-[#6C5CE7] shadow-sm" 
                        : "bg-[#F5F3F7]/80 border-violet-100 hover:bg-[#EBE8F0] text-gray-700"
                }`}
            >
                <div className="flex items-center gap-2.5">
                    <MapPin className={`h-5 w-5 shrink-0 transition-colors duration-300 ${isCityOpen ? "text-[#6C5CE7]" : "text-violet-500"}`} />
                    <span>{selectedCity === "All" ? "All Locations" : selectedCity}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isCityOpen ? "rotate-180 text-[#6C5CE7]" : ""}`} />
            </button>

            {/* Dropdown Options List */}
            {isCityOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-violet-200/90 shadow-2xl shadow-violet-955/15 rounded-2xl py-2 z-55 animate__animated animate__fadeIn max-h-60 overflow-y-auto">
                    <button
                        onClick={() => handleSelectCity("All")}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left transition-colors duration-150 cursor-pointer ${
                            selectedCity === "All" 
                                ? "bg-violet-50 text-[#6C5CE7]" 
                                : "text-gray-700 hover:bg-violet-50/60 hover:text-[#6C5CE7]"
                        }`}
                    >
                        <span>All Locations</span>
                        {selectedCity === "All" && <Check className="h-4 w-4 text-[#6C5CE7]" />}
                    </button>
                    {CITIES.filter(city => city !== "All").map(city => (
                        <button
                            key={city}
                            onClick={() => handleSelectCity(city)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left transition-colors duration-150 cursor-pointer ${
                                selectedCity === city 
                                    ? "bg-violet-50 text-[#6C5CE7]" 
                                    : "text-gray-700 hover:bg-violet-50/60 hover:text-[#6C5CE7]"
                            }`}
                        >
                            <span>{city}</span>
                            {selectedCity === city && <Check className="h-4 w-4 text-[#6C5CE7]" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
