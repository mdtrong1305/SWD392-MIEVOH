import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


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

            const username = credentials.email.split('@')[0];
            const capitalizedName = username.charAt(0).toUpperCase() + username.slice(1);

            // Return mock response matching Redux store expectation
            return {
                content: {
                    user: {
                        id: "mock-user-123",
                        email: credentials.email,
                        name: capitalizedName,
                        hoTen: capitalizedName,
                        role: "USER"
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

export const { clearError, logout, setAuthenticated } = loginSlice.actions;
export default loginSlice.reducer; 