import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '../components/Toast/Toast.tsx';
import { loginUser, clearError } from '../pages/User/Login/slice.ts';
import type { AppDispatch } from '../store/index.tsx';
import { validateEmail, validatePassword, validateConfirmPassword } from '../validation/validation';

export interface LoginForm {
    email: string;
    password: string;
}

interface LoginSliceState {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: any | null;
}

export default function useLogin(initialSliding: boolean) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [isSliding, setIsSliding] = useState(initialSliding);
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
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
            await new Promise((resolve) => setTimeout(resolve, 800));
            if (forgotEmail.toLowerCase() === 'error@gmail.com') {
                setForgotErrors({ email: 'This email is not registered' });
            } else {
                toast.success('Email verified successfully!');
                setForgotStep('reset');
            }
        } catch (err) {
            setForgotErrors({ email: 'Failed to verify email' });
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
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success('Password reset successfully!');
            setForgotStep('none');
            setForgotEmail('');
            setForgotNewPassword('');
            setForgotConfirmPassword('');
        } catch (err) {
            setForgotErrors({ password: 'Failed to reset password' });
        } finally {
            setForgotLoading(false);
        }
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailErr = validateEmail(loginForm.email);
        if (emailErr) {
            toast.error(emailErr);
            return;
        }
        if (!loginForm.password.trim()) {
            toast.error("Password is required!");
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
