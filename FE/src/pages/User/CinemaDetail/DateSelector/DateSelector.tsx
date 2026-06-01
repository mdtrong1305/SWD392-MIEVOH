import { useMemo } from "react";
import { Calendar } from "lucide-react";

export interface DateOption {
    label: string;      // e.g. "29/5"
    dayOfWeek: string;  // e.g. "Th 6"
    dateString: string;  // e.g. "2026-05-29"
}

interface DateSelectorProps {
    selectedDate: DateOption | null;
    onSelectDate: (date: DateOption) => void;
}

export default function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
    const dates = useMemo(() => {
        const daysList: DateOption[] = [];
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dayOfWeek = weekdays[d.getDay()];
            const label = `${d.getDate()}/${d.getMonth() + 1}`;
            
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dateVal = String(d.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${dateVal}`;

            daysList.push({ label, dayOfWeek, dateString });
        }
        return daysList;
    }, []);

    // Set first day as default if not selected
    if (dates.length > 0 && !selectedDate) {
        onSelectDate(dates[0]);
    }

    return (
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm mb-6 animate__animated animate__fadeIn">
            {/* Header label */}
            <div className="flex items-center gap-2 mb-4 text-slate-800">
                <Calendar className="h-5 w-5 text-[#6C5CE7]" />
                <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Select Date</span>
            </div>

            {/* Dates list row */}
            <div className="flex items-center md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {dates.map((dateOpt) => {
                    const isSelected = selectedDate?.dateString === dateOpt.dateString;
                    return (
                        <button
                            key={dateOpt.dateString}
                            onClick={() => onSelectDate(dateOpt)}
                            className={`flex flex-col items-center justify-center min-w-[80px] py-3 px-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                isSelected
                                    ? "bg-gradient-to-tr from-[#9E90FD] to-[#806DF6] border-[#806DF6] text-white shadow-md shadow-[#806DF6]/20 scale-[1.02]"
                                    : "bg-slate-50/50 border-slate-100 hover:bg-slate-100 hover:text-slate-900 text-slate-600 hover:border-slate-200"
                            }`}
                        >
                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                                {dateOpt.label}
                            </span>
                            <span className="text-sm font-extrabold">
                                {dateOpt.dayOfWeek}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
