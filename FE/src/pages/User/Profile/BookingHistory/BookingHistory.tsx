import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Ticket, Calendar, Clock, MapPin, Receipt, CheckCircle, Info } from "lucide-react";
import type { RootState } from "../../../../store/index.tsx";
import { resetBooking } from "../../SelectSeat/slice.ts";
import { MOVIES_DETAILS } from "../../../../mockAPI/movieMock.tsx";
import { toast } from "../../../../components/Toast/Toast.tsx";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";

import type { BookingRecord } from "../../../../mockAPI/historyMock.tsx";
import { DEFAULT_BOOKING_HISTORY } from "../../../../mockAPI/historyMock.tsx";

export default function BookingHistory() {
    const { t, language } = useLanguage();
    const dispatch = useDispatch();
    const [history, setHistory] = useState<BookingRecord[]>([]);
    const [selectedRecordForModal, setSelectedRecordForModal] = useState<BookingRecord | null>(null);
    
    // Check if there is an active successful booking in the current state
    const booking = useSelector((state: RootState) => state.booking);

    useEffect(() => {
        // Load history from localStorage or load defaults
        const stored = localStorage.getItem("mievoh_booking_history");
        let currentHistory = stored ? JSON.parse(stored) : DEFAULT_BOOKING_HISTORY;
        
        if (booking.bookingSuccess && booking.bookingCode && booking.movieId) {
            // Check if this bookingCode already exists in the history list to prevent duplication
            const alreadyExists = currentHistory.some((rec: BookingRecord) => rec.bookingCode === booking.bookingCode);
            
            if (!alreadyExists) {
                const movieInfo = MOVIES_DETAILS[booking.movieId];
                const movieTitle = movieInfo ? movieInfo.title : "Unknown Movie";
                const movieImage = movieInfo ? movieInfo.image : "🍿";

                // Format combos
                const comboNames = [
                    { id: 1, name: "Combo Solo" },
                    { id: 2, name: "Combo Buddy" },
                    { id: 3, name: "Combo Family" }
                ];
                const selectedCombos = comboNames
                    .filter(c => (booking.comboQuantities[c.id] || 0) > 0)
                    .map(c => `${booking.comboQuantities[c.id]}x ${c.name}`)
                    .join(", ") || "None";

                // Calculate total price
                let seatPrice = 0;
                booking.selectedSeats.forEach(seat => {
                    const row = seat[0];
                    if (row === "J") seatPrice += 220000;
                    else if (["A", "B", "C", "D"].includes(row)) seatPrice += 80000;
                    else seatPrice += 110000;
                });
                let comboPrice = 0;
                const comboPrices: Record<number, number> = { 1: 75000, 2: 115000, 3: 165000 };
                Object.entries(booking.comboQuantities).forEach(([idStr, qty]) => {
                    const id = Number(idStr);
                    comboPrice += (qty || 0) * (comboPrices[id] || 0);
                });
                const totalPrice = seatPrice + comboPrice;

                const newBookingRecord: BookingRecord = {
                    id: "booking-" + Date.now(),
                    bookingCode: booking.bookingCode,
                    movieId: booking.movieId,
                    movieTitle,
                    movieImage,
                    branchName: booking.branchName || "CGV Vincom Center Dong Khoi",
                    time: booking.time || "18:30",
                    date: booking.date || new Date().toISOString().split("T")[0],
                    seats: booking.selectedSeats,
                    combos: selectedCombos,
                    totalPrice,
                    status: "Paid",
                    dateBooked: new Date().toLocaleDateString("vi-VN")
                };

                currentHistory = [newBookingRecord, ...currentHistory];
                localStorage.setItem("mievoh_booking_history", JSON.stringify(currentHistory));
                
                // Clear current booking state so it doesn't duplicate
                dispatch(resetBooking());
                toast.success(t("booking_saved_history_success", { code: booking.bookingCode }));
            } else {
                // If already recorded, clean up Redux state
                dispatch(resetBooking());
            }
        }

        setHistory(currentHistory);
    }, [booking, dispatch]);

    const formatPrice = (value: number) => {
        return value.toLocaleString("vi-VN") + " VND";
    };

    return (
        <div className="flex flex-col gap-6 animate__animated animate__fadeIn">
            <style>{`
                .custom-booking-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-booking-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-booking-scrollbar::-webkit-scrollbar-thumb {
                    background: #E9D5FF;
                    border-radius: 9999px;
                }
                .custom-booking-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D8B4FE;
                }
                div.mievoh-barcode-modal {
                    background-color: #ffffff !important;
                }
                .dark div.mievoh-barcode-modal {
                    background-color: var(--color-dark-obsidian) !important;
                    border-color: #223047 !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
                }
                div.mievoh-barcode-frame {
                    background-color: #ffffff !important;
                    border-color: #e5e7eb !important;
                }
                .dark div.mievoh-barcode-frame {
                    background-color: #ffffff !important;
                    border-color: #a78bfa !important;
                    box-shadow: 0 0 25px rgba(167, 139, 250, 0.45) !important;
                }
                div.mievoh-barcode-frame .mievoh-barcode-text,
                .dark div.mievoh-barcode-frame .mievoh-barcode-text {
                    color: #5b21b6 !important;
                    letter-spacing: 0.1em !important;
                }
                div.mievoh-barcode-frame .mievoh-barcode-img,
                div.mievoh-barcode-frame svg,
                .dark div.mievoh-barcode-frame .mievoh-barcode-img,
                .dark div.mievoh-barcode-frame svg {
                    filter: none !important;
                }
            `}</style>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                    <Ticket className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-550">{t("no_tickets_booked")}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-h-[560px] overflow-y-auto pr-2 custom-booking-scrollbar">
                    {history.map((record) => (
                        <div 
                            key={record.id} 
                            className="flex flex-col lg:flex-row border border-[#EAE6F0] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 shrink-0"
                        >
                            {/* Movie Banner - Smaller */}
                            <div className="w-full lg:w-36 h-40 lg:h-auto relative shrink-0">
                                <img
                                    src={record.movieImage}
                                    alt={record.movieTitle}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Ticket Details */}
                            <div className="flex-grow p-5 flex flex-col justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                        <h4 className="text-base font-black text-gray-900">
                                            {(() => {
                                                const mInfo = MOVIES_DETAILS[record.movieId];
                                                if (!mInfo) return record.movieTitle;
                                                return language === "vi" ? (mInfo.title_vi || mInfo.title) : (mInfo.title_en || mInfo.title);
                                            })()}
                                        </h4>
                                        <span className="inline-flex self-start items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            {record.status === "Paid" ? t("paid_status") : record.status}
                                        </span>
                                    </div>
                                    
                                    {/* Info grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 font-medium mt-1">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-violet-500 dark:text-[#a599ff] shrink-0" />
                                            <span className="truncate text-xs sm:text-sm">{record.branchName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-violet-500 dark:text-[#a599ff] shrink-0" />
                                            <span className="text-xs sm:text-sm">{record.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-violet-500 dark:text-[#a599ff] shrink-0" />
                                            <span className="text-xs sm:text-sm">{t("booking_showtime")}: {record.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-violet-500 dark:text-[#a599ff] shrink-0" />
                                            <span className="text-xs sm:text-sm">{t("booking_seats")}: <strong className="text-gray-900 dark:text-white">{record.seats.join(", ")}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dash divider */}
                                <div className="border-t border-dashed border-[#EAE6F0] my-1" />

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                                        <Info className="h-3.5 w-3.5 text-gray-400" />
                                        <span>{t("booking_combo")}: {record.combos} | {t("booked_on")}: {record.dateBooked}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Receipt className="h-4 w-4 text-violet-650 dark:text-[#a599ff]" />
                                        <span className="text-base font-black text-[#6D28D9] dark:text-[#a599ff] whitespace-nowrap">
                                            {formatPrice(record.totalPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Stub Action Column */}
                            <div className="flex flex-col items-center justify-center p-5 border-t lg:border-t-0 lg:border-l border-dashed border-[#EAE6F0] bg-violet-50/10 shrink-0 lg:w-36 gap-3">
                                <div className="h-12 w-12 rounded-full bg-violet-50 dark:bg-[#a599ff]/10 text-violet-600 dark:text-[#a599ff] flex items-center justify-center shadow-inner">
                                    <Ticket className="h-6 w-6" />
                                </div>
                                <button
                                    onClick={() => setSelectedRecordForModal(record)}
                                    className="px-4 py-2 text-xs font-black text-violet-800 dark:text-violet-950 bg-violet-100 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-500 dark:hover:text-white rounded-xl transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                                >
                                    {t("view_ticket_code")}
                                </button>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">{t("click_to_scan")}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ticket Modal */}
            {selectedRecordForModal && (
                <div 
                    className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate__animated animate__fadeIn animate__faster"
                    onClick={() => setSelectedRecordForModal(null)}
                >
                    <div 
                        className="bg-white mievoh-barcode-modal rounded-3xl max-w-[380px] w-full p-7 shadow-2xl flex flex-col items-center relative border border-violet-100/50 animate__animated animate__zoomIn animate__faster"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full flex flex-col items-center gap-5">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{t("ticket_receipt_code")}</span>
                            
                            {/* Barcode Frame */}
                            <div className="bg-white mievoh-barcode-frame p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col items-center w-full">
                                <img
                                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${selectedRecordForModal.bookingCode}&scale=2&rotate=N&includetext=false`}
                                    alt="Barcode"
                                    className="h-24 w-full object-fill mievoh-barcode-img"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        const fallback = e.currentTarget.nextSibling as HTMLElement;
                                        if (fallback) fallback.style.display = "flex";
                                    }}
                                />
                                {/* Offline Barcode Fallback SVG */}
                                <div className="hidden w-full h-24 flex-col justify-between">
                                    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                                        <rect x="2" width="2" height="30" fill="#111827" />
                                        <rect x="5" width="1" height="30" fill="#111827" />
                                        <rect x="7" width="3" height="30" fill="#111827" />
                                        <rect x="12" width="1" height="30" fill="#111827" />
                                        <rect x="15" width="4" height="30" fill="#111827" />
                                        <rect x="20" width="2" height="30" fill="#111827" />
                                        <rect x="23" width="1" height="30" fill="#111827" />
                                        <rect x="26" width="3" height="30" fill="#111827" />
                                        <rect x="31" width="2" height="30" fill="#111827" />
                                        <rect x="35" width="1" height="30" fill="#111827" />
                                        <rect x="38" width="4" height="30" fill="#111827" />
                                        <rect x="44" width="2" height="30" fill="#111827" />
                                        <rect x="48" width="1" height="30" fill="#111827" />
                                        <rect x="51" width="3" height="30" fill="#111827" />
                                        <rect x="56" width="2" height="30" fill="#111827" />
                                        <rect x="60" width="1" height="30" fill="#111827" />
                                        <rect x="63" width="4" height="30" fill="#111827" />
                                        <rect x="69" width="2" height="30" fill="#111827" />
                                        <rect x="73" width="1" height="30" fill="#111827" />
                                        <rect x="76" width="3" height="30" fill="#111827" />
                                        <rect x="81" width="2" height="30" fill="#111827" />
                                        <rect x="85" width="1" height="30" fill="#111827" />
                                        <rect x="88" width="4" height="30" fill="#111827" />
                                        <rect x="94" width="2" height="30" fill="#111827" />
                                    </svg>
                                </div>
                                <div className="flex justify-between w-full px-2 mt-5 font-mono font-black text-xl sm:text-2xl text-gray-900 mievoh-barcode-text tracking-normal select-all">
                                    {selectedRecordForModal.bookingCode.toUpperCase().split("").map((char, index) => (
                                        <span key={index}>{char}</span>
                                    ))}
                                </div>
                            </div>

                            <span className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wider">
                                {t("scan_at_counter_desc")}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
