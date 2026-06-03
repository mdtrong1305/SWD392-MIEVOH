import {
    User,
    Lock,
    Mail,
    Phone,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    Clapperboard,
    Film,
    Ticket,
    Sparkles
} from 'lucide-react';
import Button from '../../../components/Button/Button.tsx';
import useLogin from '../../../hooks/useLogin.ts';
import useRegister from '../../../hooks/useRegister.ts';
import { redirectToGoogleApi } from '../../../axios/auth.tsx';
import '../../../CSS/Login.css';

export default function Login() {
    const loginProps = useLogin(false);
    const registerProps = useRegister(loginProps.handleSwitchToLogin);

    const {
        isSliding,
        loginLoading,
        loginError,
        loginForm,
        showLoginPwd,
        setShowLoginPwd,
        forgotStep,
        setForgotStep,
        forgotEmail,
        setForgotEmail,
        forgotNewPassword,
        setForgotNewPassword,
        forgotConfirmPassword,
        setForgotConfirmPassword,
        forgotErrors,
        setForgotErrors,
        showForgotPwd,
        setShowForgotPwd,
        showForgotConfirmPwd,
        setShowForgotConfirmPwd,
        forgotLoading,
        handleVerifyEmail,
        handleResetPassword,
        handleLoginChange,
        handleLoginSubmit,
        handleSwitchToRegister,
        handleSwitchToLogin
    } = loginProps;

    const {
        regLoading,
        regError,
        emailTaken,
        registerForm,
        errors,
        showRegPwd,
        setShowRegPwd,
        showRegConfirmPwd,
        setShowRegConfirmPwd,
        handleRegisterChange,
        handleRegisterSubmit,
        isUsernameValid,
        isHoTenValid,
        isEmailValid,
        isSoDTValid,
        isMatKhauValid,
        isXacNhanMatKhauValid
    } = registerProps;

    return (
        <div
            className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/movie_theater_bg.png')" }}
        >
            {/* Soft, fully transparent overlay tint to ensure forms are legible without blurring the background cinema seats */}
            <div className="absolute inset-0 bg-[#f3f0ff]/30 pointer-events-none" />

            {/* Animated Glowing Orbs Background */}
            <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-violet-400/20 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />
            <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-pink-400/15 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />

            {/* Desktop Double-Sliding Layout container */}
            <div className={`relative hidden md:block auth-container ${isSliding ? 'right-panel-active' : ''}`}>

                {/* 1. SIGN UP FORM PANEL */}
                <div className="form-container sign-up-container">
                    <form
                        onSubmit={handleRegisterSubmit}
                        className="h-full px-12 py-8 flex flex-col justify-center bg-white/95 backdrop-blur-md"
                        noValidate
                    >
                        <div className="absolute top-6 left-8 flex items-center gap-1.5">
                            <img src="/images/mievoh_logo.png" alt="Mievoh" className="h-6 w-6 object-cover rounded-full" />
                            <span className="logo-text-gradient h-22 w-auto my-[-2.1rem] ml-[-0.7rem]" aria-label="Mievoh" />
                        </div>

                        <h2 className="text-4xl font-extrabold text-violet-950 text-center mb-1.5">Sign Up</h2>
                        <p className="text-base text-violet-600/70 text-center mb-6">Join the Mievoh cinema community</p>

                        <div className="space-y-2.5 pr-1">
                            {/* Username */}
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        value={registerForm.username}
                                        onChange={handleRegisterChange}
                                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.username && errors.username ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                            }`}
                                        placeholder="Username"
                                    />
                                </div>
                                {errors.username && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Họ Tên */}
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                        <User className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="hoTen"
                                        type="text"
                                        required
                                        value={registerForm.hoTen}
                                        onChange={handleRegisterChange}
                                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.hoTen && errors.hoTen ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                            }`}
                                        placeholder="Full Name"
                                    />
                                </div>
                                {errors.hoTen && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> {errors.hoTen}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                        <Mail className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={registerForm.email}
                                        onChange={handleRegisterChange}
                                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.email && (errors.email || emailTaken) ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                            }`}
                                        placeholder="Email Address"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> {errors.email}
                                    </p>
                                )}
                                {!errors.email && emailTaken && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> This email is already registered
                                    </p>
                                )}
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                        <Phone className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="soDT"
                                        type="tel"
                                        required
                                        value={registerForm.soDT}
                                        onChange={handleRegisterChange}
                                        className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.soDT && errors.soDT ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                            }`}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                {errors.soDT && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> {errors.soDT}
                                    </p>
                                )}
                            </div>

                            {/* Mật khẩu */}
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                        <Lock className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="matKhau"
                                        type={showRegPwd ? "text" : "password"}
                                        required
                                        value={registerForm.matKhau}
                                        onChange={handleRegisterChange}
                                        className={`w-full pl-11 pr-11 py-2.5 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.matKhau && errors.matKhau ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                            }`}
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegPwd(!showRegPwd)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors"
                                    >
                                        {showRegPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.matKhau && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> {errors.matKhau}
                                    </p>
                                )}
                            </div>

                            {/* Xác nhận mật khẩu */}
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500">
                                        <Lock className="h-4 w-4" />
                                    </span>
                                    <input
                                        name="xacNhanMatKhau"
                                        type={showRegConfirmPwd ? "text" : "password"}
                                        required
                                        value={registerForm.xacNhanMatKhau}
                                        onChange={handleRegisterChange}
                                        className={`w-full pl-11 pr-11 py-2.5 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.xacNhanMatKhau && errors.xacNhanMatKhau ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                            }`}
                                        placeholder="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegConfirmPwd(!showRegConfirmPwd)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors"
                                    >
                                        {showRegConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.xacNhanMatKhau && (
                                    <p className="mt-1 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                        <span>⚠️</span> {errors.xacNhanMatKhau}
                                    </p>
                                )}
                            </div>
                        </div>

                        {regError && (
                            <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-center">
                                <p className="text-red-600 text-xs">{regError}</p>
                            </div>
                        )}


                        <div className="mt-6">
                            <Button
                                type="submit"
                                disabled={regLoading}
                                variant="primary"
                                className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:from-violet-300 disabled:to-violet-400"
                            >
                                {regLoading ? 'Signing up...' : 'SIGN UP'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* 2. SIGN IN FORM PANEL */}
                <div className="form-container sign-in-container">
                    <form
                        onSubmit={
                            forgotStep === 'email'
                                ? handleVerifyEmail
                                : forgotStep === 'reset'
                                ? handleResetPassword
                                : handleLoginSubmit
                        }
                        className="h-full px-12 py-8 flex flex-col justify-center pt-16 bg-white/95 backdrop-blur-md"
                        noValidate
                    >
                        <div className="absolute top-6 left-8 flex items-center gap-1.5">
                            <img src="/images/mievoh_logo.png" alt="Mievoh" className="h-6 w-6 object-cover rounded-full" />
                            <span className="logo-text-gradient h-22 w-auto my-[-2.1rem] ml-[-0.7rem]" aria-label="Mievoh" />
                        </div>

                        {forgotStep === 'email' ? (
                            <>
                                <h2 className="text-4xl font-extrabold text-violet-950 text-center mb-1.5">Forgot Password</h2>
                                <p className="text-base text-violet-600/70 text-center mb-7">Enter your email address to recover your account</p>

                                <div className="space-y-5">
                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-[18px] text-violet-500">
                                                <Mail className="h-4.5 w-4.5" />
                                            </span>
                                            <input
                                                name="forgotEmail"
                                                type="email"
                                                required
                                                value={forgotEmail}
                                                onChange={(e) => {
                                                    setForgotEmail(e.target.value);
                                                    setForgotErrors({});
                                                }}
                                                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-lg placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Enter your email address"
                                            />
                                        </div>
                                        {forgotErrors.email && (
                                            <p className="mt-1.5 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                                <span>⚠️</span> {forgotErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={forgotLoading}
                                        variant="primary"
                                        className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3.5 text-base"
                                    >
                                        {forgotLoading ? 'Verifying...' : 'VERIFY EMAIL'}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep('none')}
                                        className="text-sm text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                                    >
                                        Back to Sign In
                                    </button>
                                </div>
                            </>
                        ) : forgotStep === 'reset' ? (
                            <>
                                <h2 className="text-4xl font-extrabold text-violet-950 text-center mb-1.5">Reset Password</h2>
                                <p className="text-base text-violet-600/70 text-center mb-7">Enter your new secure password</p>

                                <div className="space-y-5">
                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-[18px] text-violet-500">
                                                <Lock className="h-4.5 w-4.5" />
                                            </span>
                                            <input
                                                name="forgotNewPassword"
                                                type={showForgotPwd ? "text" : "password"}
                                                required
                                                value={forgotNewPassword}
                                                onChange={(e) => {
                                                    setForgotNewPassword(e.target.value);
                                                    setForgotErrors({});
                                                }}
                                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-lg placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPwd(!showForgotPwd)}
                                                className="absolute right-4 top-[18px] text-violet-400 hover:text-violet-600 transition-colors"
                                            >
                                                {showForgotPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5 text-violet-600" />}
                                            </button>
                                        </div>
                                        {forgotErrors.password && (
                                            <p className="mt-1.5 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                                <span>⚠️</span> {forgotErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-[18px] text-violet-500">
                                                <Lock className="h-4.5 w-4.5" />
                                            </span>
                                            <input
                                                name="forgotConfirmPassword"
                                                type={showForgotConfirmPwd ? "text" : "password"}
                                                required
                                                value={forgotConfirmPassword}
                                                onChange={(e) => {
                                                    setForgotConfirmPassword(e.target.value);
                                                    setForgotErrors({});
                                                }}
                                                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-lg placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotConfirmPwd(!showForgotConfirmPwd)}
                                                className="absolute right-4 top-[18px] text-violet-400 hover:text-violet-600 transition-colors"
                                            >
                                                {showForgotConfirmPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5 text-violet-600" />}
                                            </button>
                                        </div>
                                        {forgotErrors.confirmPassword && (
                                            <p className="mt-1.5 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                                <span>⚠️</span> {forgotErrors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <Button
                                        type="submit"
                                        disabled={forgotLoading}
                                        variant="primary"
                                        className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3.5 text-base"
                                    >
                                        {forgotLoading ? 'Resetting...' : 'RESET PASSWORD'}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setForgotStep('none')}
                                        className="text-sm text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-extrabold text-violet-950 text-center mb-1.5">Sign In</h2>
                                <p className="text-base text-violet-600/70 text-center mb-7">Welcome back to Mievoh Cinema</p>

                                <div className="space-y-5">
                                    {/* Username */}
                                    <div className="relative">
                                        <span className="absolute left-4 top-[18px] text-violet-500">
                                            <User className="h-4.5 w-4.5" />
                                        </span>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            value={loginForm.username}
                                            onChange={handleLoginChange}
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-lg placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                            placeholder="Enter your username"
                                        />
                                    </div>

                                    {/* Mật khẩu */}
                                    <div className="relative">
                                        <span className="absolute left-4 top-[18px] text-violet-500">
                                            <Lock className="h-4.5 w-4.5" />
                                        </span>
                                        <input
                                            name="password"
                                            type={showLoginPwd ? "text" : "password"}
                                            required
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                            className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-lg placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPwd(!showLoginPwd)}
                                            className="absolute right-4 top-[18px] text-violet-400 hover:text-violet-600 transition-colors"
                                        >
                                            {showLoginPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5 text-violet-600" />}
                                        </button>
                                    </div>

                                    {/* Forgot Password Link */}
                                    <div className="flex justify-end mt-2">
                                        <a
                                            href="#forgot-password"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setForgotStep('email');
                                            }}
                                            className="text-sm text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                {loginError && (
                                    <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-center">
                                        <p className="text-red-600 text-xs">{loginError}</p>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <Button
                                        type="submit"
                                        disabled={loginLoading}
                                        variant="primary"
                                        className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3.5 text-base"
                                    >
                                        {loginLoading ? 'Signing in...' : 'SIGN IN'}
                                    </Button>
                                </div>

                                {/* Google Sign In Divider & Button */}
                                <div className="relative my-4 flex items-center">
                                    <div className="flex-grow border-t border-violet-100"></div>
                                    <span className="flex-shrink mx-4 text-xs text-violet-400 uppercase tracking-wider font-semibold bg-white px-2">or</span>
                                    <div className="flex-grow border-t border-violet-100"></div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => redirectToGoogleApi()}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-violet-200 hover:border-violet-300 hover:bg-violet-50/10 text-violet-700 font-bold transition-all text-base cursor-pointer"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.04c1.74 0 3.3.6 4.53 1.78l3.39-3.39C17.9 1.48 15.15.5 12 .5 7.37.5 3.38 3.16 1.48 7.06l3.96 3.07C6.39 7.07 9 5.04 12 5.04z"
                                        />
                                        <path
                                            fill="#4285F4"
                                            d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.47-1.11 2.71-2.35 3.55l3.66 2.84c2.14-1.97 3.74-4.88 3.74-8.5z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.44 14.93c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.48 7.34C.53 9.24 0 11.36 0 13.5s.53 4.26 1.48 6.16l3.96-3.07z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23.5c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.76 1.08-3 0-5.54-2.03-6.44-4.79L1.48 17.1c1.9 3.9 5.89 6.4 10.52 6.4z"
                                        />
                                    </svg>
                                    Sign in with Google
                                </button>
                            </>
                        )}
                    </form>
                </div>

                {/* 3. SLIDING OVERLAY CONTAINER */}
                <div className="overlay-container">
                    <div className="overlay">
                        {/* Overlay Panel Left */}
                        <div className="overlay-panel overlay-left">
                            <div className="absolute top-12 left-10 text-white/20 animate-bounce duration-[3000ms]"><Ticket className="h-8 w-8" /></div>
                            <div className="absolute bottom-16 right-12 text-white/20 animate-spin duration-[10000ms]"><Film className="h-10 w-10" /></div>

                            <img src="/images/mievoh_logo.png" alt="Mievoh" className="h-24 w-24 object-cover rounded-full mb-6 border border-white/20 shadow-md" />

                            <h2 className="text-3xl md:text-4xl font-black mb-4 flex items-center gap-1.5 text-white text-center">
                                Welcome Back! <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                            </h2>
                            <p className="text-base md:text-lg text-violet-100 max-w-[360px] mb-10 leading-relaxed text-center">
                                To continue connecting with us, please sign in
                            </p>

                            <button
                                type="button"
                                onClick={handleSwitchToLogin}
                                className="px-12 py-3.5 border border-white/40 rounded-full font-bold hover:bg-white/10 hover:border-white transition-all flex items-center gap-2.5 text-lg cursor-pointer"
                            >
                                <ArrowLeft className="h-5 w-5" /> SIGN IN
                            </button>
                        </div>

                        {/* Overlay Panel Right */}
                        <div className="overlay-panel overlay-right">
                            <div className="absolute top-14 right-14 text-white/20 animate-bounce duration-[4000ms]"><Clapperboard className="h-8 w-8" /></div>
                            <div className="absolute bottom-14 left-12 text-white/20 animate-pulse"><Film className="h-10 w-10" /></div>

                            <img src="/images/mievoh_logo.png" alt="Mievoh" className="h-24 w-24 object-cover rounded-full mb-6 border border-white/20 shadow-md" />

                            <h2 className="text-3xl md:text-4xl font-black mb-4 flex items-center gap-1.5 text-white text-center">
                                Hello New Friend! <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
                            </h2>
                            <p className="text-base md:text-lg text-violet-100 max-w-[360px] mb-10 leading-relaxed text-center">
                                Enter your personal details to start your journey
                            </p>

                            <button
                                type="button"
                                onClick={handleSwitchToRegister}
                                className="px-12 py-3.5 border border-white/40 rounded-full font-bold hover:bg-white/10 hover:border-white transition-all flex items-center gap-2.5 text-lg cursor-pointer"
                            >
                                SIGN UP NOW <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* MOBILE & TABLET RESPONSIVE FALLBACK LAYOUT */}
            <div className="relative md:hidden w-full max-w-sm">

                {/* 1. Mobile Sign In Panel */}
                {!isSliding && (
                    <div className="w-full bg-white/95 backdrop-blur-xl border border-violet-100 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <form
                            onSubmit={
                                forgotStep === 'email'
                                    ? handleVerifyEmail
                                    : forgotStep === 'reset'
                                    ? handleResetPassword
                                    : handleLoginSubmit
                            }
                            noValidate
                        >
                            <div className="flex flex-col items-center mb-6">
                                <img src="/images/mievoh_logo.png" alt="Mievoh Logo" className="h-14 w-14 rounded-full object-cover mb-2 shadow-sm border border-violet-100" />
                                <span className="logo-text-gradient h-32 w-auto my-[-3.2rem]" aria-label="Mievoh" />
                                <p className="text-xs text-violet-600/80">Welcome back!</p>
                            </div>

                            {forgotStep === 'email' ? (
                                <>
                                    <h2 className="text-2xl font-bold text-violet-950 mb-5 text-center">Forgot Password</h2>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-violet-500">
                                                <Mail className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="forgotEmail"
                                                type="email"
                                                required
                                                value={forgotEmail}
                                                onChange={(e) => {
                                                    setForgotEmail(e.target.value);
                                                    setForgotErrors({});
                                                }}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Email Address"
                                            />
                                            {forgotErrors.email && (
                                                <p className="mt-1.5 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                                    <span>⚠️</span> {forgotErrors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            disabled={forgotLoading}
                                            variant="primary"
                                            className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3 text-sm"
                                        >
                                            {forgotLoading ? 'Verifying...' : 'VERIFY EMAIL'}
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setForgotStep('none')}
                                            className="text-xs text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                                        >
                                            Back to Sign In
                                        </button>
                                    </div>
                                </>
                            ) : forgotStep === 'reset' ? (
                                <>
                                    <h2 className="text-2xl font-bold text-violet-950 mb-5 text-center">Reset Password</h2>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-violet-500">
                                                <Lock className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="forgotNewPassword"
                                                type={showForgotPwd ? "text" : "password"}
                                                required
                                                value={forgotNewPassword}
                                                onChange={(e) => {
                                                    setForgotNewPassword(e.target.value);
                                                    setForgotErrors({});
                                                }}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="New Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotPwd(!showForgotPwd)}
                                                className="absolute right-3 top-3 text-violet-400 hover:text-violet-600 transition-colors"
                                            >
                                                {showForgotPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                            </button>
                                            {forgotErrors.password && (
                                                <p className="mt-1.5 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                                    <span>⚠️</span> {forgotErrors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-violet-500">
                                                <Lock className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="forgotConfirmPassword"
                                                type={showForgotConfirmPwd ? "text" : "password"}
                                                required
                                                value={forgotConfirmPassword}
                                                onChange={(e) => {
                                                    setForgotConfirmPassword(e.target.value);
                                                    setForgotErrors({});
                                                }}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Confirm Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowForgotConfirmPwd(!showForgotConfirmPwd)}
                                                className="absolute right-3 top-3 text-violet-400 hover:text-violet-600 transition-colors"
                                            >
                                                {showForgotConfirmPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                            </button>
                                            {forgotErrors.confirmPassword && (
                                                <p className="mt-1.5 ml-1 text-2xs text-violet-950 flex items-center gap-1 font-semibold">
                                                    <span>⚠️</span> {forgotErrors.confirmPassword}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            disabled={forgotLoading}
                                            variant="primary"
                                            className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3 text-sm"
                                        >
                                            {forgotLoading ? 'Resetting...' : 'RESET PASSWORD'}
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setForgotStep('none')}
                                            className="text-xs text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-violet-950 mb-5 text-center">Sign In</h2>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-violet-500">
                                                <User className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="username"
                                                type="text"
                                                required
                                                value={loginForm.username}
                                                onChange={handleLoginChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Username"
                                            />
                                        </div>

                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-violet-500">
                                                <Lock className="h-4 w-4" />
                                            </span>
                                            <input
                                                name="password"
                                                type={showLoginPwd ? "text" : "password"}
                                                required
                                                value={loginForm.password}
                                                onChange={handleLoginChange}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl border border-violet-100 bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                                                placeholder="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowLoginPwd(!showLoginPwd)}
                                                className="absolute right-3 top-3 text-violet-400 hover:text-violet-600 transition-colors"
                                            >
                                                {showLoginPwd ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                            </button>
                                        </div>

                                        {/* Forgot Password Link */}
                                        <div className="flex justify-end mt-2">
                                            <a
                                                href="#forgot-password"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setForgotStep('email');
                                                }}
                                                className="text-xs text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                                            >
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>

                                    {loginError && (
                                        <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-center">
                                            <p className="text-red-600 text-xs">{loginError}</p>
                                        </div>
                                    )}

                                    <div className="mt-5">
                                        <Button
                                            type="submit"
                                            disabled={loginLoading}
                                            variant="primary"
                                            className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3 text-sm"
                                        >
                                            {loginLoading ? 'Signing in...' : 'SIGN IN'}
                                        </Button>
                                    </div>

                                    {/* Google Sign In Divider & Button */}
                                    <div className="relative my-4 flex items-center">
                                        <div className="flex-grow border-t border-violet-100"></div>
                                        <span className="flex-shrink mx-3 text-2xs text-violet-400 uppercase tracking-wider font-semibold bg-white px-2">or</span>
                                        <div className="flex-grow border-t border-violet-100"></div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => redirectToGoogleApi()}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-violet-200 hover:border-violet-300 hover:bg-violet-50/10 text-violet-700 font-bold transition-all text-sm cursor-pointer"
                                    >
                                        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.04c1.74 0 3.3.6 4.53 1.78l3.39-3.39C17.9 1.48 15.15.5 12 .5 7.37.5 3.38 3.16 1.48 7.06l3.96 3.07C6.39 7.07 9 5.04 12 5.04z"
                                            />
                                            <path
                                                fill="#4285F4"
                                                d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.47-1.11 2.71-2.35 3.55l3.66 2.84c2.14-1.97 3.74-4.88 3.74-8.5z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.44 14.93c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.48 7.34C.53 9.24 0 11.36 0 13.5s.53 4.26 1.48 6.16l3.96-3.07z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23.5c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.08-3.76 1.08-3 0-5.54-2.03-6.44-4.79L1.48 17.1c1.9 3.9 5.89 6.4 10.52 6.4z"
                                            />
                                        </svg>
                                        Sign in with Google
                                    </button>
                                </>
                            )}
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-violet-600/60">New to Mievoh?</span>
                            <button
                                onClick={handleSwitchToRegister}
                                className="ml-1.5 text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                            >
                                Sign up now
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. Mobile Sign Up Panel */}
                {isSliding && (
                    <div className="w-full bg-white/95 backdrop-blur-xl border border-violet-100 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <form onSubmit={handleRegisterSubmit} noValidate>
                            <div className="flex flex-col items-center mb-5">
                                <img src="/images/mievoh_logo.png" alt="Mievoh Logo" className="h-14 w-14 rounded-full object-cover mb-2 shadow-sm border border-violet-100" />
                                <span className="logo-text-gradient h-32 w-auto my-[-3.2rem]" aria-label="Mievoh" />
                                <p className="text-xs text-violet-600/80">Create a new account</p>
                            </div>

                            <h2 className="text-2xl font-bold text-violet-950 mb-4 text-center">Sign Up</h2>

                            <div className="space-y-2 overflow-y-auto pr-1 max-h-[390px]">
                                {/* Username */}
                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
                                            <User className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="username"
                                            type="text"
                                            required
                                            value={registerForm.username}
                                            onChange={handleRegisterChange}
                                            className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.username && errors.username ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                                }`}
                                            placeholder="Username"
                                        />
                                    </div>
                                    {errors.username && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> {errors.username}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
                                            <User className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="hoTen"
                                            type="text"
                                            required
                                            value={registerForm.hoTen}
                                            onChange={handleRegisterChange}
                                            className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.hoTen && errors.hoTen ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                                }`}
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    {errors.hoTen && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> {errors.hoTen}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
                                            <Mail className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={registerForm.email}
                                            onChange={handleRegisterChange}
                                            className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.email && (errors.email || emailTaken) ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                                }`}
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> {errors.email}
                                        </p>
                                    )}
                                    {!errors.email && emailTaken && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> This email is already registered
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
                                            <Phone className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="soDT"
                                            type="tel"
                                            required
                                            value={registerForm.soDT}
                                            onChange={handleRegisterChange}
                                            className={`w-full pl-10 pr-4 py-2 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.soDT && errors.soDT ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                                }`}
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    {errors.soDT && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> {errors.soDT}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
                                            <Lock className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="matKhau"
                                            type={showRegPwd ? "text" : "password"}
                                            required
                                            value={registerForm.matKhau}
                                            onChange={handleRegisterChange}
                                            className={`w-full pl-10 pr-10 py-2 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.matKhau && errors.matKhau ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                                }`}
                                            placeholder="Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegPwd(!showRegPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors"
                                        >
                                            {showRegPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.matKhau && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> {errors.matKhau}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500">
                                            <Lock className="h-4 w-4" />
                                        </span>
                                        <input
                                            name="xacNhanMatKhau"
                                            type={showRegConfirmPwd ? "text" : "password"}
                                            required
                                            value={registerForm.xacNhanMatKhau}
                                            onChange={handleRegisterChange}
                                            className={`w-full pl-10 pr-10 py-2 rounded-xl border bg-violet-50/20 text-violet-950 text-base placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all ${registerForm.xacNhanMatKhau && errors.xacNhanMatKhau ? 'border-violet-300 focus:border-violet-500' : 'border-violet-100 focus:border-violet-400'
                                                }`}
                                            placeholder="Confirm Password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegConfirmPwd(!showRegConfirmPwd)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-600 transition-colors"
                                        >
                                            {showRegConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {errors.xacNhanMatKhau && (
                                        <p className="mt-1 ml-1 text-[10px] text-violet-950 flex items-center gap-1 font-semibold">
                                            <span>⚠️</span> {errors.xacNhanMatKhau}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {regError && (
                                <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 text-center">
                                    <p className="text-red-600 text-xs">{regError}</p>
                                </div>
                            )}


                            <div className="mt-6">
                                <Button
                                    type="submit"
                                    disabled={regLoading}
                                    variant="primary"
                                    className="w-full shadow-[0_6px_20px_rgba(123,104,238,0.25)] py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {regLoading ? 'Signing up...' : 'SIGN UP'}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-violet-600/60">Already have an account?</span>
                            <button
                                onClick={handleSwitchToLogin}
                                className="ml-1.5 text-violet-600 hover:text-violet-500 font-semibold underline cursor-pointer"
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}