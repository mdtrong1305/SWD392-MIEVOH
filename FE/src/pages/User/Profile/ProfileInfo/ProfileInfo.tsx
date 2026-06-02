import React, { useState, useEffect } from "react";
import { Save, Check, Edit2, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../Login/slice.ts";
import { toast } from "../../../../components/Toast/Toast.tsx";
import Button from "../../../../components/Button/Button.tsx";
import { validateEmail, validatePhone, validateName, validateDateOfBirth, validateCccd } from "../../../../validation/validation";

interface ProfileInfoProps {
    user: any;
}

// Function to calculate age from Date of Birth string (DD-MM-YYYY, DD/MM/YYYY)
const calculateAge = (dobString: string): string => {
    if (!dobString) return "";
    const parts = dobString.split(/[-/.]/);
    if (parts.length !== 3) return "";
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-based month in JS Date
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return "";
    if (year < 1900 || year > new Date().getFullYear()) return "";
    
    const dob = new Date(year, month, day);
    // Validate date correctness (e.g. avoid 31-02-2020)
    if (dob.getFullYear() !== year || dob.getMonth() !== month || dob.getDate() !== day) return "";
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age >= 0 ? age.toString() : "";
};

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder: string;
    className?: string;
}

// Custom Select Dropdown that ALWAYS opens downwards
function CustomSelect({ value, onChange, options, placeholder, className = "" }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className={`relative flex-1 ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-transparent py-1 text-base text-gray-700 outline-none cursor-pointer text-left select-none"
            >
                <span className={value ? "text-gray-750 font-semibold" : "text-gray-400 font-normal italic"}>
                    {value || placeholder}
                </span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#7B68EE"
                    strokeWidth="2.5"
                    className={`h-3.5 w-3.5 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-[110%] left-0 right-0 max-h-48 overflow-y-auto bg-white border border-violet-100 rounded-xl shadow-lg z-50 py-1 custom-select-dropdown animate__animated animate__fadeIn animate__faster">
                    <button
                        type="button"
                        onClick={() => {
                            onChange("");
                            setIsOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-xs text-gray-400 hover:bg-violet-50 text-left font-medium select-none"
                    >
                        {placeholder}
                    </button>
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-sm text-left transition-colors duration-150 font-semibold select-none ${
                                value === opt 
                                    ? "bg-violet-500 text-white font-bold" 
                                    : "text-gray-750 hover:bg-violet-50"
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || user?.hoTen || "",
        email: user?.email || "",
        phone: user?.phone || user?.soDT || "",
        gender: user?.gender !== undefined ? (typeof user.gender === "boolean" ? (user.gender ? "Male" : "Female") : user.gender) : "",
        age: user?.age || "",
        dateOfBirth: user?.dateOfBirth || "",
        address: user?.address || "",
        cccd: user?.cccd || "",
        avatar: user?.avatar || "/images/avatar.jpg"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Sync state with user prop changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || user.hoTen || "",
                email: user.email || "",
                phone: user.phone || user.soDT || "",
                gender: user.gender !== undefined ? (typeof user.gender === "boolean" ? (user.gender ? "Male" : "Female") : user.gender) : "",
                age: user.age || "",
                dateOfBirth: user.dateOfBirth || "",
                address: user.address || "",
                cccd: user.cccd || "",
                avatar: user.avatar || "/images/avatar.jpg"
            });
        }
    }, [user]);

    // Parse dateOfBirth helper into separate parts
    const parseDob = (dobString: string) => {
        if (!dobString) return { day: "", month: "", year: "" };
        const parts = dobString.split(/[-/.]/);
        return {
            day: parts[0] || "",
            month: parts[1] || "",
            year: parts[2] || ""
        };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let filteredValue = value;
        if (name === "cccd" || name === "phone") {
            // Strip out non-digit characters
            filteredValue = value.replace(/[^0-9]/g, "");
        }

        setFormData(prev => ({
            ...prev,
            [name]: filteredValue
        }));
        if (errors[name]) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    const handleDobSelectChange = (part: "day" | "month" | "year", val: string) => {
        const { day, month, year } = parseDob(formData.dateOfBirth);
        
        let newDay = day;
        let newMonth = month;
        let newYear = year;
        
        if (part === "day") newDay = val;
        if (part === "month") newMonth = val;
        if (part === "year") newYear = val;
        
        const combined = (newDay && newMonth && newYear) 
            ? `${newDay.padStart(2, "0")}-${newMonth.padStart(2, "0")}-${newYear}` 
            : `${newDay || ""}-${newMonth || ""}-${newYear || ""}`.replace(/^-+|-+$/g, "");
            
        setFormData(prev => {
            const next = { ...prev, dateOfBirth: combined };
            const computedAge = calculateAge(combined);
            if (computedAge) {
                next.age = computedAge;
            }
            return next;
        });
        
        if (errors.dateOfBirth) {
            setErrors(prev => {
                const copy = { ...prev };
                delete copy.dateOfBirth;
                return copy;
            });
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || user?.hoTen || "",
            email: user?.email || "",
            phone: user?.phone || user?.soDT || "",
            gender: user?.gender !== undefined ? (typeof user.gender === "boolean" ? (user.gender ? "Male" : "Female") : user.gender) : "",
            age: user?.age || "",
            dateOfBirth: user?.dateOfBirth || "",
            address: user?.address || "",
            cccd: user?.cccd || "",
            avatar: user?.avatar || "/images/avatar.jpg"
        });
        setErrors({});
        setIsEditing(false);
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        
        const nameError = validateName(formData.name);
        if (nameError) errs.name = nameError;
        
        const emailError = validateEmail(formData.email);
        if (emailError) errs.email = emailError;
        
        const phoneError = validatePhone(formData.phone);
        if (phoneError) errs.phone = phoneError;
        
        const dobError = validateDateOfBirth(formData.dateOfBirth);
        if (dobError) errs.dateOfBirth = dobError;

        const cccdError = validateCccd(formData.cccd);
        if (cccdError) errs.cccd = cccdError;

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSaving(true);
        setIsSaved(false);

        // Simulate API network latency
        await new Promise((resolve) => setTimeout(resolve, 800));

        dispatch(updateUser({
            name: formData.name,
            hoTen: formData.name,
            email: formData.email,
            phone: formData.phone,
            soDT: formData.phone,
            gender: formData.gender,
            age: formData.age,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            cccd: formData.cccd,
            avatar: formData.avatar
        }));

        setIsSaving(false);
        setIsSaved(true);
        setIsEditing(false);
        toast.success("Profile updated successfully!");

        setTimeout(() => {
            setIsSaved(false);
        }, 3000);
    };

    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

    return (
        <div className="animate__animated animate__fadeIn">
            {/* Custom select dropdown scrollbar styling */}
            <style>{`
                .custom-select-dropdown::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-select-dropdown::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-select-dropdown::-webkit-scrollbar-thumb {
                    background: #E9D5FF;
                    border-radius: 9999px;
                }
                .custom-select-dropdown::-webkit-scrollbar-thumb:hover {
                    background: #D8B4FE;
                }
            `}</style>

            {!isEditing ? (
                /* Static Read-only Mode */
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {/* Full Name */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Full Name</span>
                                <span className={`text-base font-semibold select-all ${formData.name ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.name || "No name registered"}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Email</span>
                                <span className={`text-base font-semibold select-all truncate ${formData.email ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.email || "No email registered"}
                                </span>
                            </div>

                            {/* Phone Number */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Phone Number</span>
                                <span className={`text-base font-semibold select-all ${formData.phone ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.phone || "No phone number registered"}
                                </span>
                            </div>

                            {/* Gender */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Gender</span>
                                <span className={`text-base font-semibold select-all ${formData.gender ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.gender || "Gender not selected"}
                                </span>
                            </div>

                            {/* Age */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Age</span>
                                <span className={`text-base font-semibold select-all ${formData.age ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.age || "Age not provided"}
                                </span>
                            </div>

                            {/* Date of Birth */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Date of Birth</span>
                                <span className={`text-base font-semibold select-all ${formData.dateOfBirth ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.dateOfBirth || "Date of birth not set"}
                                </span>
                            </div>

                            {/* Address */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">Address</span>
                                <span className={`text-base font-semibold select-all leading-relaxed truncate-2-lines ${formData.address ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.address || "Address not set"}
                                </span>
                            </div>

                            {/* CCCD */}
                            <div className="bg-white/95 px-5 py-4 rounded-2xl border border-violet-100 hover:border-violet-250 hover:shadow-md transition-all duration-300 flex flex-col gap-1.5 justify-center min-h-[88px]">
                                <span className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest">CCCD</span>
                                <span className={`text-base font-semibold select-all ${formData.cccd ? "text-gray-700" : "text-gray-400 font-normal italic"}`}>
                                    {formData.cccd || "CCCD not linked"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Action Button */}
                    <div className="flex justify-end pt-4 border-t border-[#DCD7F5]/50">
                        <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            variant="primary"
                            size="md"
                            className="flex items-center gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
            ) : (
                /* Editable Form Mode */
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {/* Full Name */}
                            <div className={`p-4 px-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center ${
                                errors.name 
                                    ? "border-red-300 bg-red-50/10 focus-within:border-red-500" 
                                    : "border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md"
                            }`}>
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="No name registered"
                                    className="w-full bg-transparent py-1 text-base text-gray-700 outline-none"
                                />
                                {errors.name && <span className="text-xs font-bold text-red-500 mt-1">{errors.name}</span>}
                            </div>

                            {/* Email */}
                            <div className={`p-4 px-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center ${
                                errors.email 
                                    ? "border-red-300 bg-red-50/10 focus-within:border-red-500" 
                                    : "border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md"
                            }`}>
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="No email registered"
                                    className="w-full bg-transparent py-1 text-base text-gray-700 outline-none"
                                />
                                {errors.email && <span className="text-xs font-bold text-red-500 mt-1">{errors.email}</span>}
                            </div>

                            {/* Phone Number */}
                            <div className={`p-4 px-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center ${
                                errors.phone 
                                    ? "border-red-300 bg-red-50/10 focus-within:border-red-500" 
                                    : "border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md"
                            }`}>
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="No phone number registered"
                                    className="w-full bg-transparent py-1 text-base text-gray-700 outline-none"
                                />
                                {errors.phone && <span className="text-xs font-bold text-red-500 mt-1">{errors.phone}</span>}
                            </div>

                            {/* Gender */}
                            <div className="p-4 px-5 rounded-2xl border border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center">
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Gender</label>
                                <CustomSelect
                                    value={formData.gender}
                                    onChange={(val) => setFormData(prev => ({ ...prev, gender: val }))}
                                    options={["Male", "Female"]}
                                    placeholder="Select Gender"
                                />
                            </div>

                            {/* Age (Read-only, calculated from DOB) */}
                            <div className="p-4 px-5 rounded-2xl border border-violet-100 bg-violet-50/20 transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center select-none opacity-70">
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Age (Auto-calculated)</label>
                                <input
                                    type="text"
                                    name="age"
                                    value={formData.age}
                                    readOnly
                                    placeholder="Calculated from DOB"
                                    className="w-full bg-transparent py-1 text-base text-gray-500 outline-none cursor-not-allowed"
                                />
                            </div>

                            {/* Date of Birth (Day, Month, Year dropdowns) */}
                            <div className={`p-4 px-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center ${
                                errors.dateOfBirth 
                                    ? "border-red-300 bg-red-50/10 focus-within:border-red-500" 
                                    : "border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md"
                            }`}>
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Date of Birth</label>
                                <div className="flex items-center gap-2 py-1">
                                    <CustomSelect
                                        value={parseDob(formData.dateOfBirth).day}
                                        onChange={(val) => handleDobSelectChange("day", val)}
                                        options={days}
                                        placeholder="Day"
                                    />
                                    <span className="text-gray-300 font-light select-none">/</span>
                                    
                                    <CustomSelect
                                        value={parseDob(formData.dateOfBirth).month}
                                        onChange={(val) => handleDobSelectChange("month", val)}
                                        options={months}
                                        placeholder="Month"
                                    />
                                    <span className="text-gray-300 font-light select-none">/</span>
                                    
                                    <CustomSelect
                                        value={parseDob(formData.dateOfBirth).year}
                                        onChange={(val) => handleDobSelectChange("year", val)}
                                        options={years}
                                        placeholder="Year"
                                    />
                                </div>
                                {errors.dateOfBirth && <span className="text-xs font-bold text-red-500 mt-1">{errors.dateOfBirth}</span>}
                            </div>

                            {/* Address */}
                            <div className="p-4 px-5 rounded-2xl border border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center">
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={1}
                                    placeholder="Address not set"
                                    className="w-full bg-transparent py-1 text-base text-gray-700 outline-none resize-none"
                                />
                            </div>

                            {/* CCCD */}
                            <div className={`p-4 px-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 min-h-[88px] justify-center ${
                                errors.cccd 
                                    ? "border-red-300 bg-red-50/10 focus-within:border-red-500" 
                                    : "border-violet-100 bg-white/95 focus-within:border-violet-500 focus-within:shadow-md"
                            }`}>
                                <label className="text-[11px] font-black text-violet-400 dark:text-[#a599ff] uppercase tracking-widest select-none">CCCD</label>
                                <input
                                    type="text"
                                    name="cccd"
                                    value={formData.cccd}
                                    onChange={handleInputChange}
                                    placeholder="CCCD not linked"
                                    className="w-full bg-transparent py-1 text-base text-gray-700 outline-none"
                                />
                                {errors.cccd && <span className="text-xs font-bold text-red-500 mt-1">{errors.cccd}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#DCD7F5]/50">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            variant="outline"
                            size="md"
                            className="flex items-center gap-1.5"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        
                        <Button
                            type="submit"
                            disabled={isSaving}
                            variant="primary"
                            size="md"
                            className={`flex items-center gap-2 ${isSaved ? "!bg-emerald-600 !bg-none" : ""}`}
                        >
                            {isSaving ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Saving...
                                </>
                            ) : isSaved ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
