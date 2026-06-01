import { ChevronLeft } from "lucide-react";
import { type ComboItem } from "../../../../mockAPI/bookingMock.tsx";

interface PopcornSelectionProps {
    combos: ComboItem[];
    comboQuantities: Record<number, number>;
    updateComboQuantity: (id: number, delta: number) => void;
    setActiveStep: (step: number) => void;
    formatPrice: (value: number) => string;
}

export default function PopcornSelection({
    combos,
    comboQuantities,
    updateComboQuantity,
    setActiveStep,
    formatPrice
}: PopcornSelectionProps) {
    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm animate__animated animate__fadeIn flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    🍿 Popcorn, Drinks & Combos
                </h3>
                <span className="text-xs font-bold text-[#8E7EFE] bg-[#8E7EFE]/10 px-3 py-1 rounded-full">Save up to 20% when purchased together</span>
            </div>

            <div className="flex flex-col gap-4">
                {combos.map(combo => {
                    const qty = comboQuantities[combo.id] || 0;
                    return (
                        <div key={combo.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-slate-100 rounded-2xl hover:border-violet-100 transition-colors gap-3.5 bg-slate-50/40">
                            <div className="flex items-start gap-4">
                                <div className="w-24 h-12 rounded-xl bg-violet-50 flex items-center justify-center select-none shrink-0 shadow-inner overflow-hidden text-lg">
                                    <span className="whitespace-nowrap tracking-tight">{combo.image}</span>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-base text-slate-850">{combo.name}</h4>
                                    <p className="text-sm text-slate-500 font-medium mt-0.5 leading-snug">{combo.description}</p>
                                    <span className="text-base font-black text-[#8E7EFE] block mt-1.5">{formatPrice(combo.price)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 self-end sm:self-auto border border-slate-200/80 bg-white rounded-xl p-1 shadow-sm shrink-0">
                                <button 
                                    disabled={qty === 0}
                                    onClick={() => updateComboQuantity(combo.id, -1)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-base transition-colors cursor-pointer ${qty > 0 ? "text-slate-700 hover:bg-slate-100 active:scale-90" : "text-slate-350 cursor-not-allowed"}`}
                                >
                                    -
                                </button>
                                <span className="w-6 text-center text-sm font-black text-slate-800 select-none">{qty}</span>
                                <button 
                                    onClick={() => updateComboQuantity(combo.id, 1)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-90 font-black text-base cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation buttons */}
            <div className="border-t border-slate-100 pt-6 flex justify-start">
                <button
                    onClick={() => setActiveStep(1)}
                    className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-extrabold text-xs rounded-2xl transition-all cursor-pointer flex items-center gap-2 hover:bg-slate-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to seat selection
                </button>
            </div>
        </div>
    );
}
