import { useState, useEffect, useRef } from "react";
import { User, Menu, X, Ticket, LogOut, Lock, Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/index.tsx";
import { logout } from "../../pages/User/Login/slice.ts";
import { useLocation, Link } from "react-router-dom";
import Button from "../Button/Button";
import { useTheme } from "../../contextAPI/ThemeContext.tsx";
import SearchInput from "../SearchInput/SearchInput";

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
    const { theme, toggleTheme } = useTheme();

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuOpen]);

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
        <header className={`sticky top-0 z-50 w-full bg-[#F6F3F9] dark:bg-zinc-900 border-b border-[#EAE6F0] dark:border-zinc-800/50 shadow-sm ${
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
                    <span
                        className={`logo-text-gradient h-48 w-auto my-[-4.6rem] ml-[-1.5rem] ${isAnimatedPath ? "transition-transform duration-200 group-hover:scale-[1.02]" : ""}`}
                        aria-label="mievoh"
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
                                        ? "nav-active font-bold"
                                        : "text-gray-600 dark:text-violet-400 font-semibold hover:text-[#5B21B6] dark:hover:text-violet-200"
                                    }`}
                            >
                                {item.label}
                                {isActive && (
                                    <span className={`nav-active-underline absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isAnimatedPath ? "animate-slide-in" : ""}`} />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Search, Auth actions and Hamburger */}
                <div className="flex items-center gap-6">
                    {/* Search Bar (desktop only) */}
                    <SearchInput
                        containerClassName="hidden lg:flex"
                        className="w-72 border-violet-100/80 dark:border-zinc-800 bg-violet-50/10 dark:bg-zinc-800/30 hover:border-violet-300 hover:bg-violet-50/20 hover:shadow-[0_4px_12px_rgba(124,58,237,0.05)] focus:w-[26rem] focus:ring-2 focus:ring-violet-100 dark:focus:ring-zinc-800"
                    />

                    {/* Auth Actions (desktop only) */}
                    <div className="hidden items-center gap-4 md:flex">
                        {/* Light/Dark Toggle Icon Button */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center h-9 w-9 rounded-full bg-[#F1F3F5] dark:bg-zinc-800 hover:bg-[#E9ECEF] dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline-none border-none shrink-0"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? (
                                <Moon className="h-4.5 w-4.5 text-[#343A40] fill-[#343A40]" />
                            ) : (
                                <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                            )}
                        </button>

                        {isAuthenticated ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setUserMenuOpen((v) => !v)}
                                    className="flex items-center gap-2.5 px-4 py-1.5 text-sm font-extrabold bg-white dark:bg-zinc-800 border border-violet-200/80 dark:border-zinc-700 hover:border-violet-300 text-violet-800 dark:!text-violet-400 hover:bg-violet-50/50 dark:hover:bg-zinc-700/50 shadow-sm rounded-full transition-all duration-300 hover:scale-[1.04] active:scale-[0.96] select-none cursor-pointer outline-none"
                                >
                                    <img
                                        src={user?.avatar || "/images/avatar.jpg"}
                                        alt={user?.name || "avatar"}
                                        className="h-6.5 w-6.5 rounded-full object-cover border border-violet-100 dark:border-zinc-700"
                                    />
                                    <span className="font-extrabold text-violet-850 dark:!text-violet-400">{user?.name || "Account"}</span>
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-violet-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl z-50 animate__animated animate__fadeIn animate__faster">
                                        {/* User Header */}
                                        <div className="flex items-center gap-3 px-3 py-3 border-b border-violet-50/60 dark:border-zinc-800 mb-1">
                                            <img
                                                src={user?.avatar || "/images/avatar.jpg"}
                                                alt={user?.name || "avatar"}
                                                className="h-10 w-10 rounded-full object-cover border-2 border-violet-200 dark:border-zinc-700"
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <div className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate">{user?.name}</div>
                                                <div className="text-xs text-gray-400 dark:text-zinc-400 truncate">{user?.email}</div>
                                            </div>
                                        </div>
                                        
                                        {/* Menu List */}
                                        <div className="flex flex-col gap-0.5">
                                            <Link 
                                                to="/profile?tab=info" 
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-200"
                                            >
                                                <User className="h-4.5 w-4.5 text-violet-500" />
                                                <span>Profile</span>
                                            </Link>
                                            
                                            <Link 
                                                to="/profile?tab=tickets" 
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-200"
                                            >
                                                <Ticket className="h-4.5 w-4.5 text-violet-500" />
                                                <span>Booked Tickets</span>
                                            </Link>

                                            <Link 
                                                to="/profile?tab=password" 
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-700 dark:hover:text-violet-400 transition-all duration-200"
                                            >
                                                <Lock className="h-4.5 w-4.5 text-violet-500" />
                                                <span>Change Password</span>
                                            </Link>
                                        </div>
                                        
                                        <div className="border-t border-violet-50/60 dark:border-zinc-800 mt-1 pt-1">
                                            <button
                                                onClick={() => { setUserMenuOpen(false); dispatch(logout()); }}
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-850 dark:hover:text-violet-200 transition-all duration-200 cursor-pointer"
                                            >
                                                <LogOut className="h-4.5 w-4.5 text-violet-500" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
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

                    {/* Mobile Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center h-9 w-9 rounded-full bg-[#F1F3F5] dark:bg-zinc-800 hover:bg-[#E9ECEF] dark:hover:bg-zinc-700 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline-none border-none shrink-0 md:hidden"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? (
                            <Moon className="h-4.5 w-4.5 text-[#343A40] fill-[#343A40]" />
                        ) : (
                            <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
                        )}
                    </button>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="inline-flex items-center rounded-lg border border-gray-200 dark:border-zinc-800 p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-zinc-200 md:hidden transition-colors cursor-pointer"
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
                <div className={`absolute right-6 top-20 w-64 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xl z-50 md:hidden ${
                    isAnimatedPath ? "animate-in fade-in slide-in-from-top-2 duration-200" : ""
                }`}>
                    <nav className="flex flex-col gap-2">
                        {/* Mobile Search input */}
                        <SearchInput
                            size="sm"
                            containerClassName="mb-2 w-full"
                            className="w-full border-violet-100 dark:border-zinc-800 bg-violet-50/10 dark:bg-zinc-800/30"
                        />

                        {navItems.map((item) => {
                            const isActive =
                                location.pathname === item.href ||
                                (location.pathname.startsWith(item.href) && item.href !== "/");

                            return (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive
                                            ? "bg-violet-50 dark:bg-zinc-800 text-violet-700 dark:text-violet-400"
                                            : "text-gray-700 dark:text-violet-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-violet-600 dark:hover:text-violet-200"
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="mt-2 border-t border-gray-100 dark:border-zinc-800 pt-3">
                             {isAuthenticated ? (
                                  <>
                                      <div className="flex items-center gap-3 px-2 py-2 border-b border-violet-50 dark:border-zinc-800 mb-2">
                                          <img
                                              src={user?.avatar || "/images/avatar.jpg"}
                                              alt={user?.name || "avatar"}
                                              className="h-10 w-10 rounded-full object-cover border-2 border-violet-200 dark:border-zinc-700"
                                          />
                                          <div className="flex flex-col min-w-0">
                                              <div className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate">{user?.name}</div>
                                              <div className="text-xs text-gray-400 dark:text-zinc-400 truncate">{user?.email}</div>
                                          </div>
                                      </div>
                                      <Link
                                          to="/profile?tab=info"
                                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                                          onClick={() => setIsOpen(false)}
                                      >
                                          <User className="h-4 w-4 text-violet-500" />
                                          <span>Profile</span>
                                      </Link>
                                      <Link
                                          to="/profile?tab=tickets"
                                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                                          onClick={() => setIsOpen(false)}
                                      >
                                          <Ticket className="h-4 w-4 text-violet-500" />
                                          <span>Booked Tickets</span>
                                      </Link>
                                      <Link
                                          to="/profile?tab=password"
                                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                                          onClick={() => setIsOpen(false)}
                                      >
                                          <Lock className="h-4 w-4 text-violet-500" />
                                          <span>Change Password</span>
                                      </Link>
                                      <div className="border-t border-violet-50 dark:border-zinc-800 mt-2 pt-2">
                                          <button
                                              onClick={() => { setIsOpen(false); dispatch(logout()); }}
                                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-zinc-800 hover:text-violet-850 dark:hover:text-violet-200 transition-colors cursor-pointer"
                                          >
                                              <LogOut className="h-4 w-4 text-violet-500" />
                                              <span>Logout</span>
                                          </button>
                                      </div>
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
