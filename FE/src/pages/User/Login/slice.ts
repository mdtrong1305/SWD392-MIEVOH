import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


import { MOCK_USERS } from "../../../mockAPI/userMock.tsx";

// Types
export type LoginCredentials = {
    email: string;
    password: string;
};

export type AuthUser = any;

type LoginState = {
    loading: boolean;
    user: AuthUser | null;
    error: string | null;
    isAuthenticated: boolean;
};

const getInitialUser = () => {
    try {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

const getInitialIsAuthenticated = () => {
    try {
        return localStorage.getItem('auth_isAuthenticated') === 'true';
    } catch {
        return false;
    }
};

const initialState: LoginState = {
    loading: false,
    user: getInitialUser(),
    error: null,
    isAuthenticated: getInitialIsAuthenticated(),
};

export const loginUser = createAsyncThunk<
    any,
    LoginCredentials,
    { rejectValue: string }
>(
    "login/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            // Simulated network delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Verify basic fields are provided
            if (!credentials.email || !credentials.password) {
                return rejectWithValue("Email and password cannot be empty");
            }

            // Check if credentials match any predefined mock user
            const foundUser = MOCK_USERS.find(
                u => u.email.toLowerCase() === credentials.email.toLowerCase()
            );

            if (foundUser) {
                // If it is a predefined mock user, validate password
                if (foundUser.matKhau !== credentials.password) {
                    return rejectWithValue("Incorrect password");
                }
                return {
                    content: {
                        user: {
                            id: foundUser.id,
                            email: foundUser.email,
                            name: foundUser.hoTen,
                            hoTen: foundUser.hoTen,
                            soDT: foundUser.soDT,
                            phone: foundUser.soDT,
                            role: foundUser.role,
                            avatar: foundUser.avatar || "/images/avatar.jpg"
                        },
                        token: "mock-jwt-token-xyz789"
                    }
                };
            }

            const username = credentials.email.split('@')[0];
            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);

            // Return mock response matching Redux store expectation for other emails
            return {
                content: {
                    user: {
                        id: "mock-user-123",
                        email: credentials.email,
                        name: capitalizedName,
                        hoTen: capitalizedName,
                        role: "USER",
                        avatar: "/images/avatar.jpg"
                    },
                    token: "mock-jwt-token-xyz789"
                }
            };
        } catch (err: any) {
            return rejectWithValue(err.message || "Login failed");
        }
    }
);

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            try {
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_isAuthenticated');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('lastActivity');
            } catch { }
        },
        setAuthenticated: (state, action: PayloadAction<AuthUser | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                try {
                    localStorage.setItem('auth_user', JSON.stringify(state.user));
                } catch { }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                // API format: prefer content.user then content, else root
                const payload = action.payload as any;
                const user = payload?.content?.user ?? payload?.content ?? payload?.user ?? null;
                // Persist access token from API if available (for authenticated endpoints like /binh-luan)
                const token = payload?.content?.token || payload?.token || user?.token || user?.accessToken;
                if (user && token) {
                    (user as any).token = token;
                }
                state.user = user;
                state.isAuthenticated = !!user;
                state.error = null;
                // Persist to localStorage for reload resilience
                try {
                    if (user) {
                        localStorage.setItem('auth_user', JSON.stringify(user));
                        localStorage.setItem('auth_isAuthenticated', 'true');
                        if (token) localStorage.setItem('accessToken', token);
                    } else {
                        localStorage.removeItem('auth_user');
                        localStorage.removeItem('auth_isAuthenticated');
                        localStorage.removeItem('accessToken');
                    }
                } catch { }
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? "Login failed";
                state.isAuthenticated = false;
            });
    },
});

export const { clearError, logout, setAuthenticated, updateUser } = loginSlice.actions;
export default loginSlice.reducer; 