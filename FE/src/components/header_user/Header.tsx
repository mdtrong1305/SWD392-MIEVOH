import { useState, useEffect } from "react";
import { User, Menu, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/index.tsx";
import { logout } from "../../pages/User/Login/slice.ts";
import { useLocation, Link } from "react-router-dom";
import Button from "../Button/Button";

type NavItem = {
    label: string;
    href: string;
};

type HeaderProps = {
    navItems?: NavItem[];
};

export default function Header({
    navItems = [
        { label: "Movies", href: "/movies" },
        { label: "Cinemas", href: "/cinemas" },
        { label: "News", href: "/news" },
    ],
}: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, user } = useSelector((state: any) => state.login || { isAuthenticated: false, user: null });
    const location = useLocation();

    const isAnimatedPath = true;

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        if (!isAnimatedPath) {
            setIsVisible(true);
            return;
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down -> hide header
                setIsVisible(false);
            } else {
                // Scrolling up -> show header
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isAnimatedPath]);

    const redirectQuery = `?redirect=${encodeURIComponent(location.pathname + location.search)}`;

    return (
        <header className={`sticky top-0 z-50 w-full bg-[#F6F3F9] shadow-sm ${
            isAnimatedPath 
                ? "transition-transform duration-300 animate__animated animate__fadeInDown" 
                : ""
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
            <div className="mx-auto flex max-w-[85%] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Left: Logo and Brand Name */}
                <Link to="/" className={`flex items-center gap-0 ${isAnimatedPath ? "group" : ""}`} aria-label="Mievoh Homepage">
                    <img
                        src="/images/mievoh_logo.png"
                        alt="Mievoh Logo"
                        className={`h-12 w-12 rounded-full object-cover ${isAnimatedPath ? "group-hover:scale-105 transition-transform duration-200" : ""}`}
                    />
                    <img
                        src="/images/mievoh_text.png"
                        alt="mievoh"
                        className={`h-48 w-auto object-contain my-[-4.6rem] ml-[-1.5rem] ${isAnimatedPath ? "transition-transform duration-200 group-hover:scale-[1.02]" : ""}`}
                    />
                </Link>

                {/* Center: Nav links */}
                <nav className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => {
                        // Determine if current link is active
                        const isActive =
                            location.pathname === item.href ||
                            (location.pathname.startsWith(item.href) && item.href !== "/");

                        return (
                            <Link
                                key={item.label}
                                to={item.href}
                                className={`relative py-2 text-base transition-all duration-200 ${isActive
                                        ? "text-[#6D28D9] font-bold"
                                        : "text-gray-600 font-semibold hover:text-[#5B21B6]"
                                    }`}
                            >
                                {item.label}
                                {isActive && (
                                    <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#6D28D9] rounded-full ${isAnimatedPath ? "animate-slide-in" : ""}`} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Search, Auth actions and Hamburger */}
                <div className="flex items-center gap-6">
                    {/* Search Bar (desktop only) */}
                    <div className="relative hidden items-center lg:flex">
                        <span className="absolute left-4 text-violet-500 pointer-events-none">
                            <Search className="h-4 w-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-72 rounded-full border border-violet-100/80 bg-violet-50/10 py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-violet-300 hover:bg-violet-50/20 hover:shadow-[0_4px_12px_rgba(124,58,237,0.05)] focus:w-[26rem] focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                        />
                    </div>

                    {/* Auth Actions (desktop only) */}
                    <div className="hidden items-center gap-4 md:flex">
                        {isAuthenticated ? (
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    onClick={() => setUserMenuOpen((v) => !v)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user?.name || "avatar"}
                                            className="h-6 w-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                                            <User className="h-4 w-4" />
                                        </span>
                                    )}
                                    <span>{user?.name || "Account"}</span>
                                </Button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-xl z-50">
                                        <div className="px-3 py-2 border-b border-gray-50">
                                            <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
                                            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                                        </div>
                                        <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">Profile</Link>
                                        <Button
                                            variant="danger"
                                            onClick={() => { setUserMenuOpen(false); dispatch(logout()); }}
                                            className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="outline-purple"
                                    href={`/login${redirectQuery}`}
                                    size="sm"
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    href={`/register${redirectQuery}`}
                                    size="md"
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="inline-flex items-center rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 md:hidden transition-colors cursor-pointer"
                        onClick={() => setIsOpen((v) => !v)}
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile nav dropdown */}
            {isOpen && (
                <div className={`absolute right-6 top-20 w-64 rounded-xl border border-gray-100 bg-white p-4 shadow-xl z-50 md:hidden ${
                    isAnimatedPath ? "animate-in fade-in slide-in-from-top-2 duration-200" : ""
                }`}>
                    <nav className="flex flex-col gap-2">
                        {/* Mobile Search input */}
                        <div className="relative flex items-center mb-2">
                            <span className="absolute left-3 text-violet-500">
                                <Search className="h-4 w-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-full border border-violet-100 bg-violet-50/10 py-2 pl-9 pr-3 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-violet-500 focus:bg-white"
                            />
                        </div>

                        {navItems.map((item) => {
                            const isActive =
                                location.pathname === item.href ||
                                (location.pathname.startsWith(item.href) && item.href !== "/");

                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive
                                            ? "bg-violet-50 text-violet-700"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-violet-600"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="mt-2 border-t border-gray-100 pt-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="px-2 pb-2">
                                        <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
                                        <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Button
                                        variant="danger"
                                        onClick={() => { setIsOpen(false); dispatch(logout()); }}
                                        className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-red-50"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline-purple"
                                        href={`/login${redirectQuery}`}
                                        className="w-full text-center py-2 text-sm"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="primary"
                                        href={`/register${redirectQuery}`}
                                        className="w-full text-center py-2 text-sm"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
