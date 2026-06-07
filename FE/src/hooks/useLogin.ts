import { useLanguage } from "../contextAPI/LanguageContext.tsx";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '../components/Toast/Toast.tsx';
import { loginUser, clearError, setAuthenticated } from '../pages/User/Login/slice.ts';
import type { AppDispatch } from '../store/index.tsx';
import { validateEmail, validatePassword, validateConfirmPassword } from '../validation/validation';
import { verifyEmailApi, resetPasswordApi } from '../axios/auth.tsx';

export interface LoginForm {
    username: string;
    password: string;
}

interface LoginSliceState {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: any | null;
}

export default function useLogin(initialSliding: boolean) {
    const { t } = useLanguage();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [isSliding, setIsSliding] = useState(initialSliding);
    const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
    const [showLoginPwd, setShowLoginPwd] = useState(false);

    // Forgot Password States
    const [forgotStep, setForgotStep] = useState<'none' | 'email' | 'reset'>('none');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotNewPassword, setForgotNewPassword] = useState('');
    const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
    const [forgotErrors, setForgotErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
    const [showForgotPwd, setShowForgotPwd] = useState(false);
    const [showForgotConfirmPwd, setShowForgotConfirmPwd] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);

    const { loading: loginLoading, error: loginError, isAuthenticated } = useSelector(
        (state: { login: LoginSliceState }) => state.login
    );

    useEffect(() => {
        dispatch(clearError());
        if (isAuthenticated) {
            const redirect = params.get('redirect');
            const pendingStr = localStorage.getItem('pendingBooking');
            if (pendingStr) {
                try {
                    const pending = JSON.parse(pendingStr);
                    if (pending.redirect) {
                        navigate(pending.redirect, { replace: true });
                    } else {
                        navigate('/');
                    }
                } catch {
                    navigate(redirect || '/', { replace: true });
                }
            } else {
                navigate(redirect || '/', { replace: true });
            }
        }
    }, [isAuthenticated, navigate, params, dispatch]);

    // Handle Google OAuth redirect credentials
    useEffect(() => {
        const token = params.get('token');
        const username = params.get('username');
        const fullName = params.get('fullName');
        const email = params.get('email');
        const avatar = params.get('avatar');

        if (token && username) {
            // Prevent duplicate toast/processing in StrictMode (development)
            if ((window as any).__google_oauth_processed__ === token) {
                return;
            }
            (window as any).__google_oauth_processed__ = token;

            // Check if user agent is mobile / emulator
            const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobileUA) {
                const deepLinkUrl = `mievohmobile://login?token=${token}&username=${username}&fullName=${encodeURIComponent(fullName || '')}&email=${email || ''}&avatar=${encodeURIComponent(avatar || '')}`;
                window.location.href = deepLinkUrl;
                return;
            }

            // Write to localStorage
            localStorage.setItem('accessToken', token);
            localStorage.setItem('auth_isAuthenticated', 'true');
            
            const userObj = {
                username,
                name: fullName || username,
                email: email || username,
                fullName: fullName || username,
                hoTen: fullName || username,
                role: "USER",
                avatar: avatar || "/images/avatar.jpg",
                token
            };
            localStorage.setItem('auth_user', JSON.stringify(userObj));
            
            // Dispatch action to update Redux store
            dispatch(setAuthenticated(userObj));

            toast.success(t("toast_google_login_success"));

            // Clear query params by navigating to homepage or redirect target
            const redirect = params.get('redirect') || '/';
            navigate(redirect, { replace: true });
        }
    }, [params, dispatch, navigate]);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailErr = validateEmail(forgotEmail);
        if (emailErr) {
            setForgotErrors({ email: emailErr });
            return;
        }
        
        setForgotLoading(true);
        setForgotErrors({});
        try {
            await verifyEmailApi(forgotEmail);
            toast.success(t("toast_email_verified_success"));
            setForgotStep('reset');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to verify email';
            setForgotErrors({ email: message });
        } finally {
            setForgotLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: typeof forgotErrors = {};
        
        const newPasswordError = validatePassword(forgotNewPassword);
        if (newPasswordError) {
            errs.password = newPasswordError;
        }
        
        const confirmError = validateConfirmPassword(forgotNewPassword, forgotConfirmPassword);
        if (confirmError) {
            errs.confirmPassword = confirmError;
        }

        if (Object.keys(errs).length > 0) {
            setForgotErrors(errs);
            return;
        }

        setForgotLoading(true);
        setForgotErrors({});
        try {
            await resetPasswordApi({ email: forgotEmail, newPassword: forgotNewPassword });
            toast.success(t("toast_password_reset_success"));
            setForgotStep('none');
            setForgotEmail('');
            setForgotNewPassword('');
            setForgotConfirmPassword('');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to reset password';
            setForgotErrors({ password: message });
        } finally {
            setForgotLoading(false);
        }
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loginForm.username.trim()) {
            toast.error(t("toast_username_required"));
            return;
        }
        if (!loginForm.password.trim()) {
            toast.error(t("toast_password_required"));
            return;
        }
        dispatch(loginUser(loginForm));
    };

    const handleSwitchToRegister = () => {
        setIsSliding(true);
        const redirect = params.get('redirect');
        const redirectQuery = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
        window.history.pushState(null, '', `/register${redirectQuery}`);
    };

    const handleSwitchToLogin = () => {
        setIsSliding(false);
        const redirect = params.get('redirect');
        const redirectQuery = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
        window.history.pushState(null, '', `/login${redirectQuery}`);
    };

    return {
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
    };
}
