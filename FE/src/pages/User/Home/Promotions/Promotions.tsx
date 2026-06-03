import { useState, useEffect } from "react";
import { Users, Ticket, GraduationCap } from "lucide-react";
import Button from "../../../../components/Button/Button.tsx";
import { useLanguage } from "../../../../contextAPI/LanguageContext.tsx";
import Slider from "react-slick";
import { slickPromotionsSettings } from "../../../../config/slick/slickConfig.tsx";

interface Promotion {
    id: number;
    title: string;
    description: string;
    type: "family" | "vip" | "student";
    image: string;
}



export default function Promotions() {
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        const offsets = [50, 150, 300, 500, 1000];
        const timers = offsets.map(delay => 
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, delay)
        );

        return () => {
            window.removeEventListener("resize", handleResize);
            timers.forEach(clearTimeout);
        };
    }, []);

    const getSlidesToShow = () => {
        if (windowWidth < 768) return 1;
        return 3;
    };

    const sliderSettings = {
        ...slickPromotionsSettings,
        slidesToShow: getSlidesToShow(),
        responsive: undefined
    };
    

    const promotions: Promotion[] = [
        {
            id: 1,
            title: t("promo_family_title"),
            description: t("promo_family_desc"),
            type: "family",
            image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 2,
            title: t("promo_vip_title"),
            description: t("promo_vip_desc"),
            type: "vip",
            image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 3,
            title: t("promo_student_title"),
            description: t("promo_student_desc"),
            type: "student",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 4,
            title: t("promo_night_title"),
            description: t("promo_night_desc"),
            type: "vip",
            image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
        },
        {
            id: 5,
            title: t("promo_couple_title"),
            description: t("promo_couple_desc"),
            type: "family",
            image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
        },
    ];
    const [claimedPromos, setClaimedPromos] = useState<number[]>([]);

    const handleClaimPromo = (id: number) => {
        if (!claimedPromos.includes(id)) {
            setClaimedPromos([...claimedPromos, id]);
        }
    };

    const getIcon = (type: string) => {
        const iconClass = "h-5 w-5 text-[#6D28D9]";
        switch (type) {
            case "family":
                return <Users className={iconClass} />;
            case "vip":
                return <Ticket className={iconClass} />;
            case "student":
                return <GraduationCap className={iconClass} />;
            default:
                return <Ticket className={iconClass} />;
        }
    };

    const SlickSlider = (Slider as any).default || Slider;

    return (
        <section className="mx-auto max-w-[85%] px-4 py-16 sm:py-20 font-sans">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    {t("special_promotions")}
                </h2>
            </div>

            {/* Promotions Slider */}
            <div className="relative promotions-slider">
                {mounted && (
                    <SlickSlider {...sliderSettings}>
                    {promotions.map((promo) => {
                        const isClaimed = claimedPromos.includes(promo.id);
                        return (
                            <div key={promo.id} className="px-3 pb-6">
                                <div 
                                    className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-[#F6F3F9] p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-[#EAE6F0] hover:scale-[1.02] h-full cursor-pointer"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                                        <img
                                            src={promo.image}
                                            alt={promo.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {/* Floating Badge with Icon */}
                                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white/20">
                                            {getIcon(promo.type)}
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-col flex-grow text-center items-center">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#6D28D9] transition-colors duration-200">
                                            {promo.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 leading-relaxed min-h-[60px] max-w-[95%]">
                                            {promo.description}
                                        </p>
                                    </div>

                                    {/* Button */}
                                    <div className="mt-4 flex justify-center">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleClaimPromo(promo.id)}
                                            className={`px-8 py-2 w-full text-center ${
                                                isClaimed 
                                                    ? "border-green-300 text-green-600 bg-green-50 hover:bg-green-100/50 hover:text-green-700 hover:border-green-400" 
                                                    : "border-gray-200 hover:border-[#6D28D9]"
                                            }`}
                                        >
                                            {isClaimed ? t("claimed") : t("claim_code")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </SlickSlider>
                )}
            </div>
        </section>
    );
}
