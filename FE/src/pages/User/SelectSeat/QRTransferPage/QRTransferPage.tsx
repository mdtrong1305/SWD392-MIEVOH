import { useState } from "react";
import { Loader2, Copy } from "lucide-react";
import { toast } from "../../../../components/Toast/Toast.tsx";
import Loading from "../../../../components/Loading/Loading.tsx";

interface QRTransferPageProps {
    isVerifying: boolean;
    paymentTimeLeft: number;
    formatTimeLeft: (sec: number) => string;
    bookingCode: string;
    totalPrice: number;
    formatPrice: (value: number) => string;
    setShowQRTransfer: (show: boolean) => void;
    setIsVerifying: (verifying: boolean) => void;
    setActiveStep: (step: number) => void;
}

export default function QRTransferPage({
    isVerifying,
    paymentTimeLeft,
    formatTimeLeft,
    bookingCode,
    totalPrice,
    formatPrice,
    setShowQRTransfer,
    setIsVerifying,
    setActiveStep
}: QRTransferPageProps) {
    const [qrLoaded, setQrLoaded] = useState(false);

    return (
        <div className="max-w-4xl mx-auto py-6 animate__animated animate__fadeIn w-full">
            {isVerifying && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 text-white">
                    <Loading size="lg" className="mb-4" />
                    <p className="text-lg font-bold">Verifying bank transfer transaction...</p>
                    <p className="text-sm text-slate-350 mt-2">Please wait a moment</p>
                </div>
            )}
            <div className="bg-white dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800/80 rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                    {/* Left Column: Bank account details */}
                    <div className="md:col-span-3 space-y-6">
                        <div className="border-b border-slate-100 dark:border-zinc-800/80 pb-5 text-left">
                            <h2 className="text-xl font-black text-slate-850 dark:text-white">Transfer money to the following account</h2>
                            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed">
                                You need to transfer within{" "}
                                <span className="text-[#E13D53] font-black text-base tracking-wider bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-xl">
                                    {formatTimeLeft(paymentTimeLeft)}
                                </span>{" "}
                                otherwise your seats will be released.
                            </p>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="py-3.5 border-b border-slate-100/80 dark:border-zinc-800/60 flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase text-slate-455 dark:!text-white/80 tracking-wider">Bank</span>
                                <span className="text-slate-800 dark:!text-white font-extrabold text-base text-left">Military Commercial Joint Stock Bank (MB Bank)</span>
                            </div>
                            
                            <div className="py-3.5 border-b border-slate-100/80 dark:border-zinc-800/60 flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase text-slate-455 dark:!text-white/80 tracking-wider">Account Number</span>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-slate-800 dark:!text-white font-extrabold text-base tracking-wider">86870029</span>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText("86870029");
                                            toast.success("Account number copied!");
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-zinc-800 hover:bg-violet-100 dark:hover:bg-zinc-700 text-[#8E7EFE] transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        <span>Copy</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="py-3.5 border-b border-slate-100/80 dark:border-zinc-800/60 flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase text-slate-455 dark:!text-white/80 tracking-wider">Account Holder</span>
                                <span className="text-slate-800 dark:!text-white font-extrabold text-base">CONG TY TNHH MONET</span>
                            </div>
                            
                            <div className="py-3.5 border-b border-slate-100/80 dark:border-zinc-800/60 flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase text-slate-455 dark:!text-white/80 tracking-wider">Transfer Content</span>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-slate-805 dark:!text-white font-extrabold text-base tracking-widest bg-violet-50/50 dark:bg-zinc-800/60 px-2 py-0.5 rounded text-[#8E7EFE]">{bookingCode}</span>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(bookingCode);
                                            toast.success("Transfer content copied!");
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-zinc-800 hover:bg-violet-100 dark:hover:bg-zinc-700 text-[#8E7EFE] transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                        <span>Copy</span>
                                    </button>
                                </div>
                                <span className="text-xs text-rose-500 font-bold mt-1 text-left">Enter exact content to receive the ticket code.</span>
                            </div>
                            
                            <div className="py-3.5 border-b border-slate-100/80 dark:border-zinc-800/60 flex flex-col items-start gap-1">
                                <span className="text-[10px] font-black uppercase text-slate-455 dark:!text-white/80 tracking-wider">Amount</span>
                                <span className="text-slate-850 dark:!text-white font-black text-xl text-[#8E7EFE]">{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                        
                        <div className="text-left space-y-1.5 text-xs font-bold text-slate-500 dark:text-zinc-400 pt-2 leading-relaxed">
                            <p className="text-[#E13D53]">The system automatically issues the ticket code within 30s after your successful transfer.</p>
                            <p>Please contact hotline <span className="text-[#8E7EFE] dark:!text-[#8E7EFE] font-black">024 7308 8890</span> if you do not receive the ticket code.</p>
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                            <button 
                                onClick={() => setShowQRTransfer(false)}
                                className="px-6 py-3.5 border border-slate-200 dark:border-zinc-700 hover:border-slate-355 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-650 dark:text-zinc-300 hover:text-slate-800 dark:hover:text-white font-extrabold text-sm rounded-2xl transition-all cursor-pointer"
                            >
                                Cancel Transaction
                            </button>
                            <button 
                                onClick={() => {
                                    setIsVerifying(true);
                                    setTimeout(() => {
                                        setIsVerifying(false);
                                        setShowQRTransfer(false);
                                        setActiveStep(4);
                                        toast.success("Payment successful! Your ticket has been issued.");
                                    }, 2200);
                                }}
                                className="flex-1 py-3.5 bg-[#8E7EFE] hover:bg-[#7d6dfc] text-white font-extrabold text-sm rounded-2xl transition-all cursor-pointer shadow-lg shadow-violet-100 dark:shadow-none text-center"
                            >
                                I have successfully transferred
                            </button>
                        </div>
                    </div>
                    
                    {/* Right Column: VietQR Code display */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-zinc-800/80 pt-8 md:pt-0 md:pl-8 w-full">
                        <div className="flex flex-col items-center mb-6">
                            <div className="flex items-center justify-center gap-0.5 text-lg font-black italic tracking-tight">
                                <span className="text-rose-600 text-2xl">V</span>
                                <span className="text-rose-500">iet</span>
                                <span className="text-[#0F3B84] dark:text-sky-400 text-2xl ml-0.5">QR</span>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-transparent p-4 dark:p-0 rounded-3xl shadow-md dark:shadow-none border border-slate-100/90 dark:border-none flex flex-col items-center justify-center w-64 h-64 relative">
                            {!qrLoaded && (
                                <Loading className="absolute inset-0 flex items-center justify-center" />
                            )}
                            <img 
                                src={`https://img.vietqr.io/image/MB-86870029-compact.png?amount=${totalPrice}&addInfo=${bookingCode}&accountName=CONG%20TY%20TNHH%20MONET`} 
                                alt="VietQR Payment Code" 
                                className={`w-64 h-64 object-contain rounded-2xl transition-opacity duration-500 ${qrLoaded ? "opacity-100" : "opacity-0 absolute"}`} 
                                onLoad={() => setQrLoaded(true)}
                                onError={(e) => {
                                    e.currentTarget.src = "https://placehold.co/250x250/fff/8E7EFE?text=VietQR+Code";
                                    setQrLoaded(true);
                                }}
                            />
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 mt-6 border-t border-slate-100 dark:border-zinc-800/85 pt-4 w-full">
                            <div className="text-[9px] font-black text-[#004A9C] tracking-wider uppercase px-2.5 py-1 bg-blue-50 rounded-lg">napas 247</div>
                            <div className="text-[9px] font-black text-white tracking-wider uppercase px-2.5 py-1 bg-[#1A3B8B] rounded-lg">MB Bank</div>
                        </div>
                        
                        <button 
                            onClick={() => toast.success("Screenshot captured! Please open your banking app to scan.")}
                            className="text-xs text-rose-500 font-bold underline mt-5 hover:text-rose-600 cursor-pointer"
                        >
                            Take a screenshot to scan the QR code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
