import { useLanguage } from "../contextAPI/LanguageContext.tsx";
import React, { useState, useEffect } from 'react';
import { toast } from '../components/Toast/Toast.tsx';
import { registerApi } from '../axios/auth.tsx';
import { 
    validateUsername,
    validateEmail, 
    validatePhone, 
    validateName, 
    validatePassword, 
    validateConfirmPassword 
} from '../validation/validation';

export interface RegisterForm {
    username: string;
    matKhau: string;
    xacNhanMatKhau: string;
    email: string;
    hoTen: string;
    soDT: string;
}

export interface FormErrors {
    username?: string;
    email?: string;
    matKhau?: string;
    xacNhanMatKhau?: string;
    hoTen?: string;
    soDT?: string;
}

export default function useRegister(onRegisterSuccess: () => void) {
    const { t } = useLanguage();
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState<string | null>(null);
    const [regSuccess, setRegSuccess] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        username: '',
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
        
        let filteredValue = value;
        if (name === 'soDT') {
            filteredValue = value.replace(/[^0-9]/g, "");
        }

        setRegisterForm(prev => ({ ...prev, [name]: filteredValue }));
        validateField(name as keyof RegisterForm, filteredValue);

        if (name === 'email') {
            if (filteredValue && validateEmail(filteredValue) === null) {
                checkEmailExists(filteredValue);
            } else {
                setEmailTaken(false);
            }
        }
    };

    const validateField = (fieldName: keyof RegisterForm, value: string) => {
        const newErrors: FormErrors = { ...errors };

        switch (fieldName) {
            case 'username': {
                const err = validateUsername(value);
                if (err) newErrors.username = err;
                else delete newErrors.username;
                break;
            }
            case 'matKhau': {
                const err = validatePassword(value);
                if (err) newErrors.matKhau = err;
                else delete newErrors.matKhau;
                
                if (registerForm.xacNhanMatKhau) {
                    const confirmErr = validateConfirmPassword(value, registerForm.xacNhanMatKhau);
                    if (confirmErr) newErrors.xacNhanMatKhau = confirmErr;
                    else delete newErrors.xacNhanMatKhau;
                }
                break;
            }
            case 'xacNhanMatKhau': {
                const confirmErr = validateConfirmPassword(registerForm.matKhau, value);
                if (confirmErr) newErrors.xacNhanMatKhau = confirmErr;
                else delete newErrors.xacNhanMatKhau;
                break;
            }
            case 'email': {
                const err = validateEmail(value);
                if (err) newErrors.email = err;
                else delete newErrors.email;
                break;
            }
            case 'hoTen': {
                const err = validateName(value);
                if (err) newErrors.hoTen = err;
                else delete newErrors.hoTen;
                break;
            }
            case 'soDT': {
                const err = validatePhone(value);
                if (err) newErrors.soDT = err;
                else delete newErrors.soDT;
                break;
            }
            default:
                break;
        }

        setErrors(newErrors);
    };

    const validateRegisterForm = () => {
        const newErrors: FormErrors = {};

        const usernameErr = validateUsername(registerForm.username);
        if (usernameErr) newErrors.username = usernameErr;

        const nameErr = validateName(registerForm.hoTen);
        if (nameErr) newErrors.hoTen = nameErr;

        const emailErr = validateEmail(registerForm.email);
        if (emailErr) newErrors.email = emailErr;

        const phoneErr = validatePhone(registerForm.soDT);
        if (phoneErr) newErrors.soDT = phoneErr;

        const passwordErr = validatePassword(registerForm.matKhau);
        if (passwordErr) newErrors.matKhau = passwordErr;

        const confirmErr = validateConfirmPassword(registerForm.matKhau, registerForm.xacNhanMatKhau);
        if (confirmErr) newErrors.xacNhanMatKhau = confirmErr;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkEmailExists = async (_emailStr: string) => {
        // Disabled real-time check since backend validates user existence during submit
        setEmailTaken(false);
    };

    const registerUserAPI = async (payload: any) => {
        setRegLoading(true);
        setRegError(null);
        setRegSuccess(false);
        try {
            await registerApi({
                username: payload.username,
                fullName: payload.fullName,
                email: payload.email,
                phoneNumber: payload.phoneNumber,
                password: payload.password
            });

            setRegSuccess(true);
            toast.success(t("toast_register_success"));
            setRegError(null);
            setRegisterForm({
                username: '',
                matKhau: '',
                xacNhanMatKhau: '',
                email: '',
                hoTen: '',
                soDT: ''
            });
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Registration failed";
            setRegError(errorMessage);
            setRegSuccess(false);
        } finally {
            setRegLoading(false);
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateRegisterForm()) return;

        const payload = {
            username: registerForm.username,
            fullName: registerForm.hoTen,
            email: registerForm.email,
            password: registerForm.matKhau,
            phoneNumber: registerForm.soDT,
        };
        registerUserAPI(payload);
    };

    const isUsernameValid = registerForm.username.trim() !== '' && !errors.username;
    const isHoTenValid = isUsernameValid && registerForm.hoTen.trim() !== '' && !errors.hoTen;
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
        isUsernameValid,
        isHoTenValid,
        isEmailValid,
        isSoDTValid,
        isMatKhauValid,
        isXacNhanMatKhauValid
    };
}
