"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { getReservation, type Reservation } from '@/lib/reservations/create/getReservation';
import { getVehicleTypeKeyFromId, getPaymentMethodKeyFromId } from '@/hooks/reservations/create/constants';
import { convertUTCToItaly } from '@/lib/italy-time';
import Step4 from '@/components/reservations/create/steps/Step4';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import StepNavigation from '@/components/reservations/create/StepNavigation';
import { Check, CreditCard, Calendar, User, ArrowLeft, Home } from "lucide-react";

const ReservationConfirm = () => {
  const t = useTranslations("Reservation");
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  // Pasos para la navegación (mismos que en Create.tsx)
  const steps = [
    {
      number: 1,
      title: t("step1Title"),
      icon: <Calendar className="h-5 w-5" />,
    },
    { number: 2, title: t("step2Title"), icon: <User className="h-5 w-5" /> },
    {
      number: 3,
      title: t("step3Title"),
      icon: <CreditCard className="h-5 w-5" />,
    },
    { number: 4, title: t("step4Title"), icon: <Check className="h-5 w-5" /> },
  ];

  const currentStep = 4; // Siempre estamos en el paso 4 (confirmación)

  // Query para obtener los datos de la reserva
  const { data: reservation, isLoading, error } = useQuery<Reservation>({
    queryKey: ['reservation', sessionId],
    queryFn: () => getReservation(sessionId!),
    enabled: !!sessionId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Función para manejar la impresión
  const handlePrint = () => {
    window.print();
  };

  // Función para convertir datos de la reserva al formato que espera Step4
  const mapReservationToFormData = (reservation: Reservation) => {
    // Usar utilidad centralizada para conversión UTC → Italia
    const startTimeInItaly = convertUTCToItaly(reservation.start_time);
    const endTimeInItaly = convertUTCToItaly(reservation.end_time);

    // Extraer nombres del user_name completo
    const nameParts = reservation.user_name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Usar las funciones helper para obtener las claves de traducción correctas
    const vehicleTypeKey = getVehicleTypeKeyFromId(reservation.vehicle_type_id);
    const paymentMethodKey = getPaymentMethodKeyFromId(reservation.payment_method_id);

    return {
      firstName,
      lastName,
      email: reservation.user_email,
      phone: reservation.user_phone,
      licensePlate: reservation.vehicle_plate,
      vehicleModel: reservation.vehicle_model,
      vehicleType: vehicleTypeKey,
      entryDate: startTimeInItaly.date,
      entryTime: startTimeInItaly.time,
      exitDate: endTimeInItaly.date,
      exitTime: endTimeInItaly.time,
      paymentMethod: paymentMethodKey,
    };
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-muted to-black min-h-screen flex flex-col  pb-24 sm:pb-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <StepNavigation steps={steps} currentStep={currentStep} t={t} />
            </div>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>{t("loadingReservation")}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Spinner />
                <p className="mt-4 text-muted-foreground">
                  {t("loadingReservation")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si falló la carga
  if (error || !reservation) {
    return (
      <div className="bg-gradient-to-b from-muted to-black min-h-screen flex flex-col  pb-24 sm:pb-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <StepNavigation steps={steps} currentStep={currentStep} t={t} />
            </div>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>{t("errorLoadingReservation")}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  {t("errorReservationMessage")}
                </p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <Button onClick={() => window.location.reload()} className="w-full md:flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("retry")}
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/')} className="w-full md:flex-1"> 
                    <Home className="h-4 w-4 mr-2" />
                    {t("goHome")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mapear los datos de la reserva al formato que espera Step4
  const formData = mapReservationToFormData(reservation);

  return (
    <div className="bg-gradient-to-b from-muted to-black min-h-screen flex flex-col pb-24 sm:pb-0">
      <div className=" container mx-auto px-4 sm:px-6 ">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <StepNavigation steps={steps} currentStep={currentStep} t={t} />
          </div>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Step4
                t={t}
                reservationCode={reservation.code}
                formData={{
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  vehicleType: formData.vehicleType,
                  entryDate: formData.entryDate,
                  entryTime: formData.entryTime,
                  exitDate: formData.exitDate,
                  exitTime: formData.exitTime,
                  paymentMethod: formData.paymentMethod,
                }}
                handlePrint={handlePrint}
                totalPrice={reservation.total_price}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirm;
