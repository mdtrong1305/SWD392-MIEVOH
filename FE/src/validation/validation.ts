// Common form validation utility functions for Mievoh Application

export const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
        return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return "Invalid email address (e.g. example@gmail.com)";
    }
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone.trim()) {
        return "Phone number is required";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim())) {
        return "Phone number must be exactly 10 digits";
    }
    return null;
};

export const validateName = (name: string): string | null => {
    if (!name.trim()) {
        return "Full name is required";
    }
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) {
        return "Password is required";
    }
    if (password.length < 5) {
        return "Password must be at least 5 characters";
    }
    return null;
};

export const validateConfirmPassword = (password: string, confirm: string): string | null => {
    if (!confirm) {
        return "Confirm password is required";
    }
    if (password !== confirm) {
        return "Passwords do not match";
    }
    return null;
};

export const validateDateOfBirth = (dobString: string): string | null => {
    if (!dobString.trim()) return null; // Date of birth is optional
    const parts = dobString.trim().split(/[-/.]/);
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
        return "Please fill day, month, and year";
    }
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const dob = new Date(year, month, day);
    if (isNaN(day) || isNaN(month) || isNaN(year) || dob.getFullYear() !== year || dob.getMonth() !== month || dob.getDate() !== day) {
        return "Invalid date of birth";
    }
    return null;
};

export const validateCccd = (cccd: string): string | null => {
    if (!cccd.trim()) return null; // CCCD is optional
    const hasNonDigits = /[^0-9]/.test(cccd.trim());
    if (hasNonDigits) {
        return "CCCD must contain only digits";
    }
    if (cccd.trim().length !== 12) {
        return "CCCD must be exactly 12 digits";
    }
    return null;
};
