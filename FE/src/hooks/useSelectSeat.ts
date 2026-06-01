import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/index.tsx";
import { MOVIES_DETAILS } from "../mockAPI/movieMock.tsx";
import { BOOKED_SEATS_MOCK, BOOKING_COMBOS } from "../mockAPI/bookingMock.tsx";
import { toast } from "../components/Toast/Toast.tsx";
import {
    initBooking,
    toggleSeat,
    updateCombo,
    startBooking,
    bookingFinished
} from "../pages/User/SelectSeat/slice.ts";

interface LocationState {
    branchName?: string;
    format?: string;
    time?: string;
    date?: string;
    dateLabel?: string;
    dayOfWeek?: string;
}

const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "J"];
const standardRows = ["A", "B", "C", "D"];
const vipRows = ["E", "F", "G", "H"];
const bookedSeats = BOOKED_SEATS_MOCK;
const combos = BOOKING_COMBOS;

export default function useSelectSeat() {
    const { id } = useParams<{ id: string }>();
    const movieId = Number(id);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get parameters passed from BookTicket or use defaults
    const state = (location.state as LocationState) || {};
    const routeBranchName = state.branchName || "CGV Vincom Center Dong Khoi";
    const routeFormat = state.format || "2D Subtitles";
    const routeTime = state.time || "18:30";
    const routeDate = state.date || new Date().toISOString().split("T")[0];
    const routeDateLabel = state.dateLabel || `${new Date().getDate()}/${new Date().getMonth() + 1}`;
    const routeDayOfWeek = state.dayOfWeek || "Mon";

    const [activeStep, setActiveStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("qr");
    const { isAuthenticated, user: authUser } = useSelector((state: RootState) => state.login);
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [guestErrors, setGuestErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
    const [isClosing, setIsClosing] = useState(false);
    const [paymentTimeLeft, setPaymentTimeLeft] = useState(600);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showQRTransfer, setShowQRTransfer] = useState(false);

    // Scroll to top and initialize booking state in Redux when page loaded
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(initBooking({
            movieId,
            branchName: routeBranchName,
            format: routeFormat,
            time: routeTime,
            date: routeDate,
            dateLabel: routeDateLabel,
            dayOfWeek: routeDayOfWeek
        }));
    }, [dispatch, movieId, routeBranchName, routeFormat, routeTime, routeDate, routeDateLabel, routeDayOfWeek]);

    // Seat hold countdown timer (10 mins) for Step 3 QR Transfer
    useEffect(() => {
        if (!showQRTransfer) return;
        const timer = setInterval(() => {
            setPaymentTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    toast.error("Seat hold time expired. Please select seats again!");
                    setShowQRTransfer(false);
                    setActiveStep(1);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [showQRTransfer]);

    const formatTimeLeft = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const booking = useSelector((state: RootState) => state.booking);
    
    const selectedSeats = booking.selectedSeats;
    const comboQuantities = booking.comboQuantities;
    const isBooking = booking.isBooking;
    const bookingCode = booking.bookingCode;

    const branchName = booking.branchName || routeBranchName;
    const format = booking.format || routeFormat;
    const time = booking.time || routeTime;
    const dateLabel = booking.dateLabel || routeDateLabel;
    const dayOfWeek = booking.dayOfWeek || routeDayOfWeek;

    // Load movie details
    const movie = useMemo(() => {
        return MOVIES_DETAILS[movieId] || MOVIES_DETAILS[1]; // default to 1 if not found
    }, [movieId]);

    // Room name
    const roomName = useMemo(() => {
        const num = ((movieId + time.charCodeAt(0) + time.charCodeAt(1)) % 5) + 1;
        return `Hall 0${num}`;
    }, [movieId, time]);

    const updateComboQuantity = (id: number, delta: number) => {
        dispatch(updateCombo({ id, delta }));
    };

    // Seat click handler
    const handleSeatClick = (row: string, num: number) => {
        const seatCode = row === "J" ? `J${num}` : `${row}${num}`;
        
        if (row !== "J" && bookedSeats.has(seatCode)) return;
        if (row === "J" && bookedSeats.has(`J${num}`)) return;

        if (selectedSeats.includes(seatCode)) {
            dispatch(toggleSeat(seatCode));
        } else {
            if (selectedSeats.length >= 8) {
                toast.error("You can only select up to 8 seats");
                return;
            }
            dispatch(toggleSeat(seatCode));
        }
    };

    // Calculated amounts
    const ticketBreakdown = useMemo(() => {
        let standardCount = 0;
        let vipCount = 0;
        let coupleCount = 0;
        let price = 0;

        selectedSeats.forEach(seat => {
            const row = seat[0];
            if (row === "J") {
                coupleCount++;
                price += 220000;
            } else if (standardRows.includes(row)) {
                standardCount++;
                price += 80000;
            } else if (vipRows.includes(row)) {
                vipCount++;
                price += 110000;
            }
        });

        return {
            standardCount,
            vipCount,
            coupleCount,
            ticketPrice: price
        };
    }, [selectedSeats]);

    const comboPrice = useMemo(() => {
        let total = 0;
        combos.forEach(c => {
            total += (comboQuantities[c.id] || 0) * c.price;
        });
        return total;
    }, [comboQuantities]);

    const totalPrice = ticketBreakdown.ticketPrice + comboPrice;

    // Checkout processing states
    const handleGuestChange = (name: "name" | "phone" | "email", value: string) => {
        if (name === "name") setGuestName(value);
        if (name === "phone") setGuestPhone(value);
        if (name === "email") setGuestEmail(value);
        
        const errs = { ...guestErrors };
        if (name === "name") {
            if (value.trim()) delete errs.name;
            else errs.name = "Full name is required";
        }
        if (name === "phone") {
            if (value.trim() && /^[0-9]{10}$/.test(value.trim())) delete errs.phone;
            else if (!value.trim()) errs.phone = "Phone number is required";
            else errs.phone = "Phone number must be exactly 10 digits";
        }
        if (name === "email") {
            if (value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) delete errs.email;
            else if (!value.trim()) errs.email = "Email is required";
            else errs.email = "Invalid email format (e.g. example@gmail.com)";
        }
        setGuestErrors(errs);
    };

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            toast.error("Please select at least one seat before paying");
            return;
        }

        if (!isAuthenticated) {
            const errs: { name?: string; phone?: string; email?: string } = {};
            if (!guestName.trim()) {
                errs.name = "Full name is required";
            }
            if (!guestPhone.trim()) {
                errs.phone = "Phone number is required";
            } else if (!/^[0-9]{10}$/.test(guestPhone.trim())) {
                errs.phone = "Phone number must be exactly 10 digits";
            }
            if (!guestEmail.trim()) {
                errs.email = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail.trim())) {
                errs.email = "Invalid email format (e.g. example@gmail.com)";
            }

            setGuestErrors(errs);

            if (Object.keys(errs).length > 0) {
                toast.error("Please fix personal info errors");
                return;
            }
        }

        setShowConfirmModal(true);
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowConfirmModal(false);
            setIsClosing(false);
        }, 300);
    };

    const executeCheckout = () => {
        setShowConfirmModal(false);
        setIsClosing(false);
        dispatch(startBooking());
        
        const randCode = "MV" + Math.floor(100000 + Math.random() * 900000);
        dispatch(bookingFinished(randCode));
        
        setShowQRTransfer(true);
        setPaymentTimeLeft(600);
        toast("Payment transaction initiated!");
    };

    const userPhone = authUser?.soDT || authUser?.phone || "Not updated";
    const userFullName = authUser?.hoTen || authUser?.name || "Guest";
    const userEmailAddress = authUser?.email || "Not updated";

    const formatPrice = (value: number) => {
        return value.toLocaleString("en-US") + " VND";
    };

    return {
        activeStep,
        setActiveStep,
        paymentMethod,
        setPaymentMethod,
        isAuthenticated,
        guestName,
        guestPhone,
        guestEmail,
        guestErrors,
        handleGuestChange,
        showConfirmModal,
        isClosing,
        closeModal,
        paymentTimeLeft,
        formatTimeLeft,
        isVerifying,
        setIsVerifying,
        showQRTransfer,
        setShowQRTransfer,
        movie,
        branchName,
        roomName,
        time,
        dayOfWeek,
        dateLabel,
        format,
        selectedSeats,
        handleSeatClick,
        ticketBreakdown,
        comboPrice,
        comboQuantities,
        updateComboQuantity,
        totalPrice,
        formatPrice,
        bookingCode,
        isBooking,
        handleCheckout,
        executeCheckout,
        userFullName,
        userPhone,
        userEmailAddress,
        navigate,
        seatRows,
        standardRows,
        vipRows,
        bookedSeats,
        combos
    };
}
