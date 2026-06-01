interface SeatSelectionProps {
    selectedSeats: string[];
    handleSeatClick: (row: string, num: number) => void;
    seatRows: string[];
    standardRows: string[];
    vipRows: string[];
    bookedSeats: Set<string>;
}

export default function SeatSelection({
    selectedSeats,
    handleSeatClick,
    seatRows,
    standardRows,
    vipRows,
    bookedSeats
}: SeatSelectionProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col items-center animate__animated animate__fadeIn">
            {/* Screen Visualizer */}
            <div className="w-[85%] max-w-lg mb-14 text-center relative">
                <div className="w-full h-1 border-t-4 border-[#8E7EFE] rounded-[50%] filter blur-[1px] shadow-[0_4px_12px_rgba(142,126,254,0.6)]" />
                <div className="w-full h-16 bg-gradient-to-b from-[#8E7EFE]/10 to-transparent absolute top-0 left-0 rounded-[50%] blur-md pointer-events-none" />
                <span className="text-[10px] font-black tracking-[0.3em] text-[#8E7EFE]/80 uppercase block mt-3">SCREEN</span>
            </div>

            {/* Grid container */}
            <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="min-w-[580px] flex flex-col gap-2.5 items-center px-4">
                    {seatRows.map(row => {
                        const isCoupleRow = row === "J";
                        const totalCols = isCoupleRow ? 5 : 10;
                        
                        return (
                            <div key={row} className="flex items-center gap-3.5">
                                <span className="w-5 text-center text-xs font-black text-slate-400 select-none">{row}</span>
                                <div className="flex gap-2">
                                    {Array.from({ length: totalCols }).map((_, index) => {
                                        const num = index + 1;
                                        const seatCode = isCoupleRow ? `J${num}` : `${row}${num}`;
                                        const isBooked = bookedSeats.has(seatCode);
                                        const isSelected = selectedSeats.includes(seatCode);
                                        let seatColorClass: string;

                                        if (isBooked) {
                                            seatColorClass = "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed";
                                        } else if (isSelected) {
                                            seatColorClass = "bg-[#8E7EFE] border-[#8E7EFE] text-white shadow-md shadow-[#8E7EFE]/30 scale-105 font-bold";
                                        } else {
                                            if (standardRows.includes(row)) {
                                                seatColorClass = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-violet-50 hover:text-[#8E7EFE] hover:border-violet-300";
                                            } else if (vipRows.includes(row)) {
                                                seatColorClass = "bg-indigo-50/50 border-indigo-300 text-indigo-700 hover:bg-indigo-100/70 hover:border-indigo-400 hover:text-indigo-900";
                                            } else {
                                                seatColorClass = "bg-rose-50/60 border-rose-300 text-rose-700 hover:bg-rose-100 hover:border-rose-400 hover:text-rose-900";
                                            }
                                        }

                                        if (isCoupleRow) {
                                            const pairLabel = `J${num * 2 - 1}-J${num * 2}`;
                                            return (
                                                <button
                                                    key={seatCode}
                                                    disabled={isBooked}
                                                    onClick={() => handleSeatClick(row, num)}
                                                    className={`w-[78px] h-8 rounded-xl border flex items-center justify-center text-[10px] font-extrabold tracking-tight transition-all duration-200 select-none cursor-pointer ${seatColorClass} ${isBooked ? "" : "active:scale-95"}`}
                                                >
                                                    {isBooked ? "✖" : pairLabel}
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                key={seatCode}
                                                disabled={isBooked}
                                                onClick={() => handleSeatClick(row, num)}
                                                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-semibold transition-all duration-200 select-none cursor-pointer ${seatColorClass} ${isBooked ? "" : "active:scale-95"}`}
                                            >
                                                {isBooked ? "✖" : num}
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="w-5 text-center text-xs font-black text-slate-400 select-none">{row}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Seat Legend */}
            <div className="w-full border-t border-slate-100 mt-6 pt-6 grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm font-bold text-slate-700 justify-items-center">
                <div className="flex items-center gap-2.5">
                    <div className="w-4.5 h-4.5 rounded bg-slate-50 border border-slate-200" />
                    <span>Standard</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-4.5 h-4.5 rounded bg-indigo-50/50 border border-indigo-300" />
                    <span>VIP Seat</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-4.5 rounded-md bg-rose-50/60 border border-rose-300" />
                    <span>Sweetbox (Double)</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-4.5 h-4.5 rounded bg-[#8E7EFE] border border-[#8E7EFE]" />
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-4.5 h-4.5 rounded bg-slate-250 border border-slate-250 flex items-center justify-center text-[9px] text-slate-450 font-black">✖</div>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
}
