import { useState } from "react";
import { createReservation } from "@/lib/reservations/createReservation";
import { ReservationFormData, CountryOption } from "./useReservationForm";
import { VEHICLE_TYPE_MAP, PAYMENT_METHOD_MAP } from "./constants";
import { loadStripe } from "@stripe/stripe-js";

export function useReservationSubmission(t?: (key: string) => string) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string>("");
  const [reservationCode, setReservationCode] = useState<string>("");

  const buildReservationPayload = (
    formData: ReservationFormData,
    selectedCountry: CountryOption,
    start_time: string,
    end_time: string,
    totalPrice?: number
  ) => {
    return {
      user_name: `${formData.firstName} ${formData.lastName}`.trim(),
      user_email: formData.email,
      user_phone: `+${selectedCountry.dialCode}${formData.phone}`,
      vehicle_type_id: VEHICLE_TYPE_MAP[formData.vehicleType] || 0,
      payment_method_id: PAYMENT_METHOD_MAP[formData.paymentMethod] || 0,
      vehicle_plate: formData.licensePlate,
      vehicle_model: formData.vehicleModel,
      start_time,
      end_time,
      total_price: totalPrice ?? 0
    };
  };

  const submitReservation = async (
    formData: ReservationFormData,
    selectedCountry: CountryOption,
    start_time: string,
    end_time: string,
    totalPrice: number | null
  ) => {
    setSubmitting(true);
    setSubmissionError("");
    try {
      // Construir el payload para el backend
      const payload = buildReservationPayload(
        formData,
        selectedCountry,
        start_time,
        end_time,
        totalPrice ?? 0
      );
      // Llamar al backend para crear la reserva y obtener la session_id de Stripe
      const reservation = await createReservation(payload);
      if (reservation && reservation.session_id) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: reservation.session_id });
        } else {
          setSubmissionError(t ? t("submissionErrors.stripePaymentFailed") : "Stripe initialization failed.");
        }
      } else {
        setSubmissionError(t ? t("submissionErrors.stripePaymentFailed") : "Stripe session_id not received.");
      }
    } catch (e: any) {
      // Mejor manejo de errores: mostrar mensaje del backend si existe
      if (e instanceof Error && e.message) {
        setSubmissionError(e.message);
      } else if (typeof e === 'object' && e !== null && 'message' in e) {
        setSubmissionError(String((e as any).message));
      } else {
        setSubmissionError(t ? t("submissionErrors.reservationFailed") : "Failed to process reservation.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const generateReservationCode = () => {
    const mockReservationCode =
      "PK" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
    setReservationCode(mockReservationCode);
  };

  const clearSubmissionError = () => {
    setSubmissionError("");
  };

  return {
    submitting,
    submissionError,
    reservationCode,
    submitReservation,
    generateReservationCode,
    clearSubmissionError,
  };
}
