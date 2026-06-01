import { ArrowLeft, ChevronRight, LayoutGrid, ShoppingBag, CreditCard, Ticket } from "lucide-react";
import SeatSelection from "./SeatSelection/SeatSelection.tsx";
import PopcornSelection from "./PopcornSelection/PopcornSelection.tsx";
import PaymentMethods from "./PaymentMethods/PaymentMethods.tsx";
import QRTransferPage from "./QRTransferPage/QRTransferPage.tsx";
import TicketSuccess from "./TicketSuccess/TicketSuccess.tsx";
import BookingSidebar from "./BookingSidebar/BookingSidebar.tsx";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal.tsx";
import useSelectSeat from "../../../hooks/useSelectSeat.ts";

export default function SelectSeat() {
    const {
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
    } = useSelectSeat();

    return (
        <div className="w-full bg-[#EFEBF4] min-h-screen pb-16 font-sans">
            {/* Header info banner with movie backdrops */}
            <div className="relative w-full overflow-hidden bg-[#0F0C15] text-white py-8 border-b border-violet-950/20">
                <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-[6px] scale-105 opacity-50 pointer-events-none"
                    style={{ backgroundImage: `url(${movie.backdrop || movie.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90" />

                <div className="relative max-w-7xl mx-auto px-4 z-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(-1)} 
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                                    {movie.title}
                                    <span className="text-xs font-extrabold px-2 py-0.5 bg-rose-500 rounded-md">
                                        {movie.ageRating}
                                    </span>
                                </h1>
                                <p className="text-violet-300 text-xs font-bold mt-1 uppercase tracking-wider flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span>{branchName}</span>
                                    <span className="text-violet-500">•</span>
                                    <span>{roomName}</span>
                                    <span className="text-violet-500">•</span>
                                    <span>{dayOfWeek}, {dateLabel}</span>
                                    <span className="text-violet-500">•</span>
                                    <span className="text-emerald-400 font-extrabold">{time}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
                
                {/* Stepper Header */}
                <div className="bg-white border border-slate-100 rounded-3xl py-4 shadow-sm mb-6 flex items-center justify-center gap-2 sm:gap-6 md:gap-12 animate__animated animate__fadeIn">
                    <div className={`flex items-center gap-2 transition-all duration-300 ${activeStep === 1 ? "text-[#8E7EFE]" : "text-slate-450 font-bold"}`}>
                        <div className={`p-2 rounded-xl flex items-center justify-center ${activeStep === 1 ? "bg-violet-50 text-[#8E7EFE]" : "bg-transparent text-slate-400"}`}>
                            <LayoutGrid className="h-5 w-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Select Seat</span>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300" />

                    <div className={`flex items-center gap-2 transition-all duration-300 ${activeStep === 2 ? "text-[#8E7EFE]" : "text-slate-455 font-bold"}`}>
                        <div className={`p-2 rounded-xl flex items-center justify-center ${activeStep === 2 ? "bg-violet-50 text-[#8E7EFE]" : "bg-transparent text-slate-400"}`}>
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Combos</span>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300" />

                    <div className={`flex items-center gap-2 transition-all duration-300 ${activeStep === 3 ? "text-[#8E7EFE]" : "text-slate-455 font-bold"}`}>
                        <div className={`p-2 rounded-xl flex items-center justify-center ${activeStep === 3 ? "bg-violet-50 text-[#8E7EFE]" : "bg-transparent text-slate-400"}`}>
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Payment</span>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300" />

                    <div className={`flex items-center gap-2 transition-all duration-300 ${activeStep >= 4 ? "text-[#8E7EFE]" : "text-slate-455 font-bold"}`}>
                        <div className={`p-2 rounded-xl flex items-center justify-center ${activeStep >= 4 ? "bg-violet-50 text-[#8E7EFE]" : "bg-transparent text-slate-400"}`}>
                            <Ticket className="h-5 w-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Ticket Info</span>
                    </div>
                </div>

                {activeStep < 4 ? (
                    showQRTransfer ? (
                        <QRTransferPage
                            isVerifying={isVerifying}
                            paymentTimeLeft={paymentTimeLeft}
                            formatTimeLeft={formatTimeLeft}
                            bookingCode={bookingCode}
                            totalPrice={totalPrice}
                            formatPrice={formatPrice}
                            setShowQRTransfer={setShowQRTransfer}
                            setIsVerifying={setIsVerifying}
                            setActiveStep={setActiveStep}
                        />
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                {activeStep === 1 && (
                                    <SeatSelection
                                        selectedSeats={selectedSeats}
                                        handleSeatClick={handleSeatClick}
                                        seatRows={seatRows}
                                        standardRows={standardRows}
                                        vipRows={vipRows}
                                        bookedSeats={bookedSeats}
                                    />
                                )}
                                {activeStep === 2 && (
                                    <PopcornSelection
                                        combos={combos}
                                        comboQuantities={comboQuantities}
                                        updateComboQuantity={updateComboQuantity}
                                        setActiveStep={setActiveStep}
                                        formatPrice={formatPrice}
                                    />
                                )}
                                {activeStep === 3 && (
                                    <PaymentMethods
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                        isAuthenticated={isAuthenticated}
                                        guestName={guestName}
                                        guestPhone={guestPhone}
                                        guestEmail={guestEmail}
                                        guestErrors={guestErrors}
                                        handleGuestChange={handleGuestChange}
                                        setActiveStep={setActiveStep}
                                    />
                                )}
                            </div>

                            <BookingSidebar
                                movie={movie}
                                branchName={branchName}
                                roomName={roomName}
                                time={time}
                                dayOfWeek={dayOfWeek}
                                dateLabel={dateLabel}
                                format={format}
                                selectedSeats={selectedSeats}
                                ticketBreakdown={ticketBreakdown}
                                comboPrice={comboPrice}
                                combos={combos}
                                comboQuantities={comboQuantities}
                                totalPrice={totalPrice}
                                formatPrice={formatPrice}
                                activeStep={activeStep}
                                setActiveStep={setActiveStep}
                                isBooking={isBooking}
                                handleCheckout={handleCheckout}
                            />
                        </div>
                    )
                ) : (
                    <TicketSuccess
                        movie={movie}
                        branchName={branchName}
                        roomName={roomName}
                        selectedSeats={selectedSeats}
                        time={time}
                        dayOfWeek={dayOfWeek}
                        dateLabel={dateLabel}
                        format={format}
                        comboPrice={comboPrice}
                        combos={combos}
                        comboQuantities={comboQuantities}
                        totalPrice={totalPrice}
                        formatPrice={formatPrice}
                        bookingCode={bookingCode}
                    />
                )}
            </div>

            <ConfirmationModal
                showConfirmModal={showConfirmModal}
                isClosing={isClosing}
                closeModal={closeModal}
                branchName={branchName}
                movie={movie}
                time={time}
                dayOfWeek={dayOfWeek}
                dateLabel={dateLabel}
                selectedSeats={selectedSeats}
                isAuthenticated={isAuthenticated}
                userFullName={userFullName}
                userPhone={userPhone}
                userEmailAddress={userEmailAddress}
                guestName={guestName}
                guestPhone={guestPhone}
                guestEmail={guestEmail}
                paymentMethod={paymentMethod}
                totalPrice={totalPrice}
                formatPrice={formatPrice}
                executeCheckout={executeCheckout}
            />
        </div>
    );
}
