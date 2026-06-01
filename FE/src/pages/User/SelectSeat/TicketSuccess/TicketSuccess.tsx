import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { type ComboItem } from "../../../../mockAPI/bookingMock.tsx";
import type { MovieDetailInfo } from "../../MovieDetail/DetailHero/DetailHero.tsx";

interface TicketSuccessProps {
    movie: MovieDetailInfo;
    branchName: string;
    roomName: string;
    selectedSeats: string[];
    time: string;
    dayOfWeek: string;
    dateLabel: string;
    format: string;
    comboPrice: number;
    combos: ComboItem[];
    comboQuantities: Record<number, number>;
    totalPrice: number;
    formatPrice: (value: number) => string;
    bookingCode: string;
}

export default function TicketSuccess({
    movie,
    branchName,
    roomName,
    selectedSeats,
    time,
    dayOfWeek,
    dateLabel,
    format,
    comboPrice,
    combos,
    comboQuantities,
    totalPrice,
    formatPrice,
    bookingCode
}: TicketSuccessProps) {
    return (
        <div className="max-w-4xl mx-auto py-8 animate__animated animate__zoomIn">
            <div className="bg-white border border-slate-150 rounded-[2.5rem] shadow-xl overflow-hidden relative flex flex-col md:flex-row">
                {/* Top colored accent line */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-violet-500 via-[#8E7EFE] to-indigo-500" />
                
                {/* Decorative punches/notches on top and bottom of divider (only visible on md screens) */}
                <div className="absolute top-0 right-80 w-8 h-8 rounded-full bg-[#EFEBF4] -mt-4 border-b border-slate-150/70 z-20 hidden md:block" />
                <div className="absolute bottom-0 right-80 w-8 h-8 rounded-full bg-[#EFEBF4] -mb-4 border-t border-slate-150/70 z-20 hidden md:block" />

                {/* Left Side: Ticket Main Body */}
                <div className="flex-1 p-8 md:p-10 text-left flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-slate-200">
                    <div>
                        <div className="flex items-center gap-4.5 mb-6">
                            {/* Success Checkmark */}
                            <div className="w-12 h-12 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 animate__animated animate__bounceIn">
                                <Check className="h-6 w-6 stroke-[3]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-850">Booking Successful!</h2>
                                <p className="text-sm text-slate-500 font-bold mt-0.5">Thank you for choosing Mievoh. Your showtime awaits you.</p>
                            </div>
                        </div>
 
                        {/* Movie details header row */}
                        <div className="flex gap-6 items-start pb-6 border-b border-slate-100">
                            <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-md">
                                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2.5">
                                <h3 className="font-black text-xl text-slate-850 leading-snug">{movie.title}</h3>
                                <p className="text-[#8E7EFE] font-black text-sm">{movie.genres.join(" / ")} • {movie.duration}</p>
                                <span className="inline-block text-xs font-black bg-rose-500 text-white px-3 py-1 rounded-xl">{movie.ageRating}</span>
                            </div>
                        </div>
 
                        {/* Grid of ticket details with larger sizes */}
                        <div className="grid grid-cols-2 gap-y-5 gap-x-8 py-6 text-sm font-bold text-slate-655">
                            <div>
                                <span className="text-slate-400 block mb-1 font-black uppercase tracking-wider text-[10px]">Cinema</span>
                                <span className="text-slate-850 font-black text-base">{branchName}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1 font-black uppercase tracking-wider text-[10px]">Hall & Seats</span>
                                <span className="text-slate-850 font-black text-base">{roomName} • <span className="text-[#8E7EFE] bg-violet-50 px-2.5 py-1 rounded-lg">{selectedSeats.join(", ")}</span></span>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1 font-black uppercase tracking-wider text-[10px]">Showtime</span>
                                <span className="text-slate-850 font-black text-base">{time} • {dayOfWeek}, {dateLabel}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1 font-black uppercase tracking-wider text-[10px]">Format</span>
                                <span className="text-slate-850 font-black text-base">{format}</span>
                            </div>
 
                            {comboPrice > 0 && (
                                <div className="col-span-2 border-t border-slate-100/80 pt-4">
                                    <span className="text-slate-400 block mb-1.5 font-black uppercase tracking-wider text-[10px]">Attached Combos</span>
                                    <span className="text-slate-850 font-black text-base bg-slate-50 px-3 py-1.5 rounded-xl inline-block">
                                        {combos.filter(c => comboQuantities[c.id] > 0).map(c => `${c.name} (x${comboQuantities[c.id]})`).join(", ")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
 
                    <div className="border-t border-slate-100 pt-5 flex justify-between items-center text-base font-black text-slate-855">
                        <span>Total Amount Paid:</span>
                        <span className="text-2xl text-[#8E7EFE] font-black">{formatPrice(totalPrice)}</span>
                    </div>
                </div>
 
                {/* Right Side: Ticket stub with barcode scanner */}
                <div className="w-full md:w-80 bg-slate-50/50 p-8 md:p-10 flex flex-col items-center justify-between text-center relative shrink-0 pt-10 md:pt-14">
                    <div className="w-full flex flex-col items-center space-y-6 my-auto">
                        {/* Horizontal Barcode */}
                        <div className="bg-white px-4 py-6.5 rounded-3xl shadow-sm border border-slate-150/80 flex flex-col items-center justify-center w-full">
                            <svg className="w-full h-24 text-slate-850" viewBox="0 0 200 50" fill="currentColor" preserveAspectRatio="none">
                                <rect x="10" y="5" width="3" height="40" />
                                <rect x="15" y="5" width="1" height="40" />
                                <rect x="18" y="5" width="4" height="40" />
                                <rect x="24" y="5" width="2" height="40" />
                                <rect x="28" y="5" width="1" height="40" />
                                <rect x="31" y="5" width="3" height="40" />
                                <rect x="36" y="5" width="1" height="40" />
                                <rect x="39" y="5" width="5" height="40" />
                                <rect x="46" y="5" width="2" height="40" />
                                <rect x="50" y="5" width="1" height="40" />
                                <rect x="53" y="5" width="3" height="40" />
                                <rect x="58" y="5" width="1" height="40" />
                                <rect x="61" y="5" width="4" height="40" />
                                <rect x="67" y="5" width="2" height="40" />
                                <rect x="71" y="5" width="1" height="40" />
                                <rect x="74" y="5" width="3" height="40" />
                                
                                <rect x="80" y="5" width="1" height="40" />
                                <rect x="83" y="5" width="1" height="40" />
                                
                                <rect x="87" y="5" width="3" height="40" />
                                <rect x="92" y="5" width="1" height="40" />
                                <rect x="95" y="5" width="4" height="40" />
                                <rect x="101" y="5" width="2" height="40" />
                                <rect x="105" y="5" width="1" height="40" />
                                <rect x="108" y="5" width="3" height="40" />
                                <rect x="113" y="5" width="1" height="40" />
                                <rect x="116" y="5" width="5" height="40" />
                                <rect x="123" y="5" width="2" height="40" />
                                <rect x="127" y="5" width="1" height="40" />
                                <rect x="130" y="5" width="3" height="40" />
                                <rect x="135" y="5" width="1" height="40" />
                                <rect x="138" y="5" width="4" height="40" />
                                <rect x="144" y="5" width="2" height="40" />
                                <rect x="148" y="5" width="1" height="40" />
                                <rect x="151" y="5" width="3" height="40" />
                                <rect x="156" y="5" width="1" height="40" />
                                <rect x="159" y="5" width="5" height="40" />
                                <rect x="166" y="5" width="2" height="40" />
                                <rect x="170" y="5" width="1" height="40" />
                                <rect x="173" y="5" width="3" height="40" />
                                <rect x="178" y="5" width="1" height="40" />
                                <rect x="181" y="5" width="4" height="40" />
                                <rect x="187" y="5" width="3" height="40" />
                            </svg>
                            <span className="text-2xl font-mono tracking-[0.3em] text-slate-855 font-black mt-4">{bookingCode}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-455 uppercase tracking-widest leading-normal">Scan barcode at the cinema<br />to print ticket entry pass</span>
                    </div>
 
                    <div className="flex flex-col gap-2.5 w-full mt-8 md:mt-10">
                        <Link 
                            to="/" 
                            className="py-3.5 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-sm text-center"
                        >
                            Back to Homepage
                        </Link>
                        <Link 
                            to={`/movies/${movie.id}`} 
                            className="py-3.5 px-4 bg-[#8E7EFE] hover:bg-[#7d6dfc] text-white font-extrabold text-xs rounded-2xl transition-all cursor-pointer shadow-lg shadow-violet-100 hover:scale-[1.01] active:scale-95 text-center"
                        >
                            Movie Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
