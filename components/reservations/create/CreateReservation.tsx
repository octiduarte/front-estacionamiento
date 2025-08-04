"use client";

import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Calendar, User } from "lucide-react";
import countryData from "country-telephone-data";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import { useReservationForm } from "../../../hooks/reservations/create/useReservationForm";
import StepNavigation from "./StepNavigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const countryOptions =
  //Es un array de objetos con nombre, código de marcado y código ISO2
  (
    countryData.allCountries as Array<{
      name: string;
      dialCode: string;
      iso2: string;
    }>
  ).map((country) => ({
    name: country.name,
    dialCode: country.dialCode,
    iso2: country.iso2,
  }));

export default function CreateReservation() {
  const t = useTranslations("Reservation");
  const locale = useLocale();
  const {
    currentStep,
    formData,
    entryDateObj,
    exitDateObj,
    submissionError,
    submitting,
    selectedCountry,
    setSelectedCountry,
    availability,
    setAvailability,
    slotDetails,
    setSlotDetails,
    timer,
    setTimer,
    start_time,
    end_time,
    handleChange,
    handleSelectChange,
    handleDateChange,
    nextStep,
    prevStep,
    handleReservation,
    totalPrice,
  } = useReservationForm(t, countryOptions, locale);

  const expiredToastRef = useRef(false);
  const slotAvailableToastRef = useRef(false);

  // Lógica del timer movida desde el hook para usar traducciones
  useEffect(() => {
    if (!timer) return;
    expiredToastRef.current = false; // Con esto hago que no se muestre el mensaje de expiración dos veces
    const interval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          if (!expiredToastRef.current) {
            setAvailability(null);
            setSlotDetails([]);
            toast.warning(t("reservationTimeExpired"));
            expiredToastRef.current = true;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

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

  return (
    <div className="bg-gradient-to-b from-muted via-black to-muted flex flex-col pb-24 sm:pb-0">
      <div className="container mx-auto px-4 sm:px-6 flex-1 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="mb-6">
            <StepNavigation steps={steps} currentStep={currentStep} t={t} />
          </div>
          {/* Timer visible cuando availability es true (replicado del admin) */}
          {availability === true && timer > 0 && (
            <div className="w-full flex justify-center mb-6">
              <div className="bg-muted border rounded-md px-4 py-2">
                <span className="text-sm font-semibold text-red-600">
                  {t("timeRemaining")}{" "}
                  {`${Math.floor(timer / 60)
                    .toString()
                    .padStart(2, "0")}:${(timer % 60)
                    .toString()
                    .padStart(2, "0")}`}
                </span>
              </div>
            </div>
          )}

          <Card className="max-w-2xl w-full mx-auto">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              {" "}
              {currentStep === 1 && (
                <Step1
                  t={t}
                  formData={formData}
                  entryDateObj={entryDateObj}
                  exitDateObj={exitDateObj}
                  availability={availability}
                  setAvailability={setAvailability}
                  slotDetails={slotDetails}
                  setSlotDetails={setSlotDetails}
                  handleSelectChange={handleSelectChange}
                  handleDateChange={handleDateChange}
                  nextStep={nextStep}
                  start_time={start_time}
                  end_time={end_time}
                  slotAvailableToastRef={slotAvailableToastRef}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  t={t}
                  formData={formData}
                  handleChange={handleChange}
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  countryOptions={countryOptions}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 3 && (
                <Step3
                  t={t}
                  formData={formData}
                  handleSelectChange={handleSelectChange}
                  prevStep={prevStep}
                  handleReservation={handleReservation}
                  submitting={submitting}
                  totalPrice={totalPrice}
                  submissionError={submissionError}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
