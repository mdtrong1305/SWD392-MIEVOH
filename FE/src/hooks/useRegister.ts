import React, { useState, useEffect } from 'react';
import { toast } from '../components/Toast/Toast.tsx';

export interface RegisterForm {
    matKhau: string;
    xacNhanMatKhau: string;
    email: string;
    hoTen: string;
    soDT: string;
}

export interface FormErrors {
    email?: string;
    matKhau?: string;
    xacNhanMatKhau?: string;
    hoTen?: string;
    soDT?: string;
}

export default function useRegister(onRegisterSuccess: () => void) {
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState<string | null>(null);
    const [regSuccess, setRegSuccess] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        matKhau: '',
        xacNhanMatKhau: '',
        email: '',
        hoTen: '',
        soDT: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const [showRegPwd, setShowRegPwd] = useState(false);
    const [showRegConfirmPwd, setShowRegConfirmPwd] = useState(false);

    useEffect(() => {
        if (regSuccess) {
            const timer = setTimeout(() => {
                onRegisterSuccess();
                setRegSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [regSuccess, onRegisterSuccess]);

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));
        validateField(name as keyof RegisterForm, value);

        if (name === 'email') {
            if (value && validateEmail(value)) {
                checkEmailExists(value);
            } else {
                setEmailTaken(false);
            }
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validateField = (fieldName: keyof RegisterForm, value: string) => {
        const newErrors: FormErrors = { ...errors };

        switch (fieldName) {
            case 'matKhau':
                if (!value.trim()) newErrors.matKhau = 'Password is required';
                else delete newErrors.matKhau;
                if (registerForm.xacNhanMatKhau && value !== registerForm.xacNhanMatKhau) {
                    newErrors.xacNhanMatKhau = 'Passwords do not match';
                } else if (registerForm.xacNhanMatKhau) {
                    delete newErrors.xacNhanMatKhau;
                }
                break;
            case 'xacNhanMatKhau':
                if (!value.trim()) newErrors.xacNhanMatKhau = 'Please confirm your password';
                else if (value !== registerForm.matKhau) newErrors.xacNhanMatKhau = 'Passwords do not match';
                else delete newErrors.xacNhanMatKhau;
                break;
            case 'email':
                if (!value.trim()) newErrors.email = 'Email is required';
                else if (!validateEmail(value)) newErrors.email = 'Invalid email address (e.g. example@gmail.com)';
                else delete newErrors.email;
                break;
            case 'hoTen':
                if (!value.trim()) newErrors.hoTen = 'Full name is required';
                else delete newErrors.hoTen;
                break;
            case 'soDT':
                if (!value.trim()) newErrors.soDT = 'Phone number is required';
                else if (!validatePhone(value)) newErrors.soDT = 'Phone number must be exactly 10 digits';
                else delete newErrors.soDT;
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateRegisterForm = () => {
        const newErrors: FormErrors = {};

        if (!registerForm.matKhau.trim()) newErrors.matKhau = 'Password is required';
        if (!registerForm.xacNhanMatKhau.trim()) newErrors.xacNhanMatKhau = 'Please confirm your password';
        else if (registerForm.xacNhanMatKhau !== registerForm.matKhau) newErrors.xacNhanMatKhau = 'Passwords do not match';

        if (!registerForm.email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(registerForm.email)) newErrors.email = 'Invalid email address (e.g. example@gmail.com)';

        if (!registerForm.hoTen.trim()) newErrors.hoTen = 'Full name is required';

        if (!registerForm.soDT.trim()) newErrors.soDT = 'Phone number is required';
        else if (!validatePhone(registerForm.soDT)) newErrors.soDT = 'Phone number must be exactly 10 digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkEmailExists = async (emailStr: string) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setEmailTaken(emailStr.toLowerCase() === 'admin@gmail.com');
        } catch (err) {
            console.error(err);
        }
    };

    const registerUserAPI = async (payload: any) => {
        setRegLoading(true);
        setRegError(null);
        setRegSuccess(false);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            if (payload.email.toLowerCase() === 'error@gmail.com') {
                setRegError("Email is invalid or has been locked");
                setRegSuccess(false);
            } else {
                setRegSuccess(true);
                toast.success("Account registered successfully!");
                setRegError(null);
                setRegisterForm({
                    matKhau: '',
                    xacNhanMatKhau: '',
                    email: '',
                    hoTen: '',
                    soDT: ''
                });
            }
        } catch (err: any) {
            setRegError(err.message || "Registration failed");
            setRegSuccess(false);
        } finally {
            setRegLoading(false);
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateRegisterForm()) return;

        const payload = {
            name: registerForm.hoTen,
            email: registerForm.email,
            password: registerForm.matKhau,
            phone: registerForm.soDT,
            gender: true,
            role: 'USER',
        };
        registerUserAPI(payload);
    };

    const isHoTenValid = registerForm.hoTen.trim() !== '' && !errors.hoTen;
    const isEmailValid = isHoTenValid && registerForm.email.trim() !== '' && !errors.email && !emailTaken;
    const isSoDTValid = isEmailValid && registerForm.soDT.trim() !== '' && !errors.soDT;
    const isMatKhauValid = isSoDTValid && registerForm.matKhau.trim() !== '' && !errors.matKhau;
    const isXacNhanMatKhauValid = isMatKhauValid && registerForm.xacNhanMatKhau.trim() !== '' && !errors.xacNhanMatKhau;

    return {
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
        isHoTenValid,
        isEmailValid,
        isSoDTValid,
        isMatKhauValid,
        isXacNhanMatKhauValid
    };
}
