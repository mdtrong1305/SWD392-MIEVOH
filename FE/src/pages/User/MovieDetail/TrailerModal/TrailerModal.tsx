import { useEffect } from "react";

interface TrailerModalProps {
    isOpen: boolean;
    isClosing: boolean;
    onClose: () => void;
    trailerUrl: string;
    movieTitle: string;
}

export default function TrailerModal({ 
    isOpen, 
    isClosing, 
    onClose, 
    trailerUrl, 
    movieTitle 
}: TrailerModalProps) {
    
    // Prevent background scrolling and handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black/55 z-[9999] flex items-start justify-center pt-4 md:pt-8 p-4 animate__animated animate__faster ${
                isClosing ? "animate__fadeOut" : "animate__fadeIn"
            }`}
            onClick={onClose}
        >
            <div 
                className={`relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate__animated animate__faster ${
                    isClosing ? "animate__slideOutUp" : "animate__slideInDown"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Video iframe */}
                <iframe
                    src={`${trailerUrl}?autoplay=1&rel=0`}
                    title={`${movieTitle} - Official Trailer`}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
