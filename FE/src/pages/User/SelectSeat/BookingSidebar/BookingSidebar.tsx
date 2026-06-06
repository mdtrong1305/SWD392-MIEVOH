import { MapPin, Film, Calendar, Clock, Info, ChevronRight, Loader2, CreditCard } from "lucide-react";

import type { MovieDetailInfo } from "../../MovieDetail/DetailHero/DetailHero.tsx";
import Button from "../../../../components/Button/Button.tsx";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";

interface BookingSidebarProps {
    movie: MovieDetailInfo;
    branchName: string;
    roomName: string;
    time: string;
    dayOfWeek: string;
    dateLabel: string;
    format: string;
    selectedSeats: string[];
    ticketBreakdown: { standardCount: number; vipCount: number; coupleCount: number; ticketPrice: number };
    comboPrice: number;
    combos: any[];
    comboQuantities: Record<string, number>;
    totalPrice: number;
    formatPrice: (value: number) => string;
    activeStep: number;
    setActiveStep: (step: number) => void;
    isBooking: boolean;
    handleCheckout: () => void;
}

export default function BookingSidebar({
    movie,
    branchName,
    roomName,
    time,
    dayOfWeek,
    dateLabel,
    format,
    selectedSeats,
    ticketBreakdown,
    comboPrice,
    combos,
    comboQuantities,
    totalPrice,
    formatPrice,
    activeStep,
    setActiveStep,
    isBooking,
    handleCheckout
}: BookingSidebarProps) {
    const { t } = useLanguage();
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm flex flex-col gap-5 sticky top-24">
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4">{t("booking_summary")}</h3>
                
                {/* Movie details summary card */}
                <div className="flex gap-4 items-start pb-4 border-b border-slate-100 dark:border-zinc-800/80">
                    <div className="w-16 h-24 rounded-xl overflow-hidden shrink-0 shadow-md">
                        <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-base text-slate-800 dark:text-white leading-snug line-clamp-2">{movie.title}</h4>
                        <p className="text-xs text-[#8E7EFE] font-extrabold mt-1">{movie.genres.join(" / ")}</p>
                        {movie.ageRating && (
                            <span className="inline-block text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded mt-2">{movie.ageRating}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Showtime breakdowns */}
            <div className="flex flex-col gap-3.5 text-sm font-bold text-slate-650 dark:text-zinc-300 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1.5"><MapPin className="h-4.5 w-4.5 shrink-0 text-[#8E7EFE]" /> {t("booking_cinema")}:</span>
                    <span className="text-slate-800 dark:text-zinc-100 font-extrabold max-w-[70%] text-right truncate" title={branchName}>{branchName}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1.5"><Film className="h-4.5 w-4.5 shrink-0 text-[#8E7EFE]" /> {t("booking_hall")}:</span>
                    <span className="text-slate-800 dark:text-zinc-100 font-extrabold">{roomName}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1.5"><Calendar className="h-4.5 w-4.5 shrink-0 text-[#8E7EFE]" /> {t("booking_showtime")}:</span>
                    <span className="text-slate-800 dark:text-zinc-100 font-extrabold">{time} • {dayOfWeek}, {dateLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 dark:text-zinc-500 flex items-center gap-1.5"><Clock className="h-4.5 w-4.5 shrink-0 text-[#8E7EFE]" /> {t("booking_format")}:</span>
                    <span className="text-slate-800 dark:text-zinc-100 font-extrabold">{format}</span>
                </div>
            </div>

            {/* Ticket Summary */}
            <div className="pb-4 border-b border-slate-100 dark:border-zinc-800/80 flex flex-col gap-3 text-sm font-bold">
                <div className="flex justify-between items-start">
                    <span className="text-slate-400 dark:text-zinc-500">{t("booking_seats")} ({selectedSeats.length}):</span>
                    <div className="text-right">
                        <span className="text-slate-850 dark:text-white font-black block max-w-[180px] break-words text-base">
                            {selectedSeats.length > 0 ? selectedSeats.join(", ") : t("no_seats_selected")}
                        </span>
                        {selectedSeats.length > 0 && (
                            <span className="text-xs text-slate-455 dark:text-zinc-400 font-bold block mt-0.5">
                                {ticketBreakdown.standardCount > 0 && `${ticketBreakdown.standardCount} Standard `}
                                {ticketBreakdown.vipCount > 0 && `${ticketBreakdown.vipCount} VIP `}
                                {ticketBreakdown.coupleCount > 0 && `${ticketBreakdown.coupleCount} Sweetbox`}
                            </span>
                        )}
                    </div>
                </div>
                
                {selectedSeats.length > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 dark:text-zinc-500">{t("ticket_price")}:</span>
                        <span className="text-slate-855 dark:text-white font-extrabold text-base">{formatPrice(ticketBreakdown.ticketPrice)}</span>
                    </div>
                )}

                {/* Selected F&B */}
                {comboPrice > 0 && (
                    <div className="flex justify-between items-start pt-1">
                        <span className="text-slate-400 dark:text-zinc-500">{t("booking_combo")}:</span>
                        <div className="text-right">
                            <span className="text-slate-855 dark:text-white font-extrabold text-base block">{formatPrice(comboPrice)}</span>
                            <span className="text-xs text-slate-450 dark:text-zinc-400 font-bold block mt-0.5">
                                {combos.filter(c => comboQuantities[c.id] > 0).map(c => `${c.name} (x${comboQuantities[c.id]})`).join(", ")}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Grand Total */}
            <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-800 dark:text-white">{t("booking_total")}:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#8E7EFE] tracking-tight">{formatPrice(totalPrice)}</span>
            </div>

            {/* Action Buttons based on activeStep */}
            {activeStep === 1 && (
                <Button
                    disabled={selectedSeats.length === 0}
                    onClick={() => setActiveStep(2)}
                    className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 px-2"
                >
                    {t("choose_combo")}
                    <ChevronRight className="h-4.5 w-4.5" />
                </Button>
            )}

            {activeStep === 2 && (
                <Button
                    onClick={() => setActiveStep(3)}
                    className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 px-2"
                >
                    {t("proceed_to_pay")}
                    <ChevronRight className="h-4.5 w-4.5" />
                </Button>
            )}

            {activeStep === 3 && (
                <Button
                    disabled={isBooking}
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-2xl text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center gap-2 px-2"
                >
                    {isBooking ? (
                        <>
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                            {t("creating_transaction")}
                        </>
                    ) : (
                        <>
                            <CreditCard className="h-4.5 w-4.5" />
                            {t("pay_now")}
                        </>
                    )}
                </Button>
            )}

            {/* Terms reminder */}
            <div className="flex gap-2.5 items-start text-xs font-medium text-slate-500 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-950/40 p-4 rounded-xl border border-slate-100 dark:border-zinc-850">
                <Info className="h-4 w-4 text-[#8E7EFE] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    {t("booking_terms_reminder")}
                </p>
            </div>
        </div>
    );
}
