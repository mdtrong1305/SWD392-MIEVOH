import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../contextAPI/LanguageContext.tsx';
import { useTheme } from '../../contextAPI/ThemeContext.tsx';

export default function NotFound() {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-[#EFEBF4] text-gray-800'}`}>
            <div className="text-center animate__animated animate__fadeInUp flex flex-col items-center">
                <AlertCircle className={`w-24 h-24 mb-6 ${isDark ? 'text-blue-400' : 'text-blue-600'} animate-bounce`} />
                <h1 className="text-8xl font-black mb-4 tracking-tighter">404</h1>
                <h2 className="text-3xl font-bold mb-4">
                    {t('movie_not_found') || "Page Not Found"}
                </h2>
                <p className={`text-lg mb-8 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('movie_not_found_desc') || "Oops! The page you are looking for does not exist. It might have been moved or deleted."}
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/30"
                >
                    <Home className="w-5 h-5" />
                    <span>{t('back_to_homepage') || "Back to Homepage"}</span>
                </Link>
            </div>
        </div>
    );
}
