import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BookingState {
    movieId: number | null;
    branchName: string;
    format: string;
    time: string;
    date: string;
    dateLabel: string;
    dayOfWeek: string;
    selectedSeats: string[];
    comboQuantities: Record<number, number>;
    isBooking: boolean;
    bookingSuccess: boolean;
    bookingCode: string;
}

const initialState: BookingState = {
    movieId: null,
    branchName: "",
    format: "",
    time: "",
    date: "",
    dateLabel: "",
    dayOfWeek: "",
    selectedSeats: [],
    comboQuantities: {
        1: 0,
        2: 0,
        3: 0
    },
    isBooking: false,
    bookingSuccess: false,
    bookingCode: ""
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        initBooking: (state, action: PayloadAction<{
            movieId: number;
            branchName: string;
            format: string;
            time: string;
            date: string;
            dateLabel: string;
            dayOfWeek: string;
        }>) => {
            state.movieId = action.payload.movieId;
            state.branchName = action.payload.branchName;
            state.format = action.payload.format;
            state.time = action.payload.time;
            state.date = action.payload.date;
            state.dateLabel = action.payload.dateLabel;
            state.dayOfWeek = action.payload.dayOfWeek;
            state.selectedSeats = [];
            state.comboQuantities = { 1: 0, 2: 0, 3: 0 };
            state.isBooking = false;
            state.bookingSuccess = false;
            state.bookingCode = "";
        },
        toggleSeat: (state, action: PayloadAction<string>) => {
            const seatCode = action.payload;
            if (state.selectedSeats.includes(seatCode)) {
                state.selectedSeats = state.selectedSeats.filter(s => s !== seatCode);
            } else {
                if (state.selectedSeats.length < 8) {
                    state.selectedSeats.push(seatCode);
                }
            }
        },
        updateCombo: (state, action: PayloadAction<{ id: number; delta: number }>) => {
            const { id, delta } = action.payload;
            const current = state.comboQuantities[id] || 0;
            state.comboQuantities[id] = Math.max(0, current + delta);
        },
        startBooking: (state) => {
            state.isBooking = true;
        },
        bookingFinished: (state, action: PayloadAction<string>) => {
            state.isBooking = false;
            state.bookingSuccess = true;
            state.bookingCode = action.payload;
        },
        resetBooking: (state) => {
            state.selectedSeats = [];
            state.comboQuantities = { 1: 0, 2: 0, 3: 0 };
            state.isBooking = false;
            state.bookingSuccess = false;
            state.bookingCode = "";
        }
    }
});

export const {
    initBooking,
    toggleSeat,
    updateCombo,
    startBooking,
    bookingFinished,
    resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;
