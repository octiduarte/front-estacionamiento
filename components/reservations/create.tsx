"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Calendar, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { getAvailability } from "@/lib/reservations/getAvailability";
import { getVehicleTypes } from "@/lib/reservations/getVehicleTypes";
import countryData from "country-telephone-data";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

const countryOptions = (countryData.allCountries as Array<{ name: string; dialCode: string; iso2: string }>).map((country) => ({
  name: country.name,
  dialCode: country.dialCode,
  iso2: country.iso2,
}));

export default function CreateReservation() {
  const t = useTranslations("Reservation");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleType: "",
    entryDate: "",
    entryTime: "",
    exitDate: "",
    exitTime: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licensePlate: "",
    vehicleModel: "",
    paymentMethod: "cash", // Por defecto "cash" (pago en el lugar)
  });
  const [reservationCode, setReservationCode] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [entryDateObj, setEntryDateObj] = useState<Date | undefined>(undefined);
  const [exitDateObj, setExitDateObj] = useState<Date | undefined>(undefined);
  const [availability, setAvailability] = useState<null | boolean>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [slotDetails, setSlotDetails] = useState<{ start_time: string; end_time: string; is_available: boolean; available_spaces: number }[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<{ id: number; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; dialCode: string; iso2: string }>(countryOptions.find((c) => c.iso2 === "ar") || countryOptions[0]);
  
  const isTimeValid = (entryDate: string, entryTime: string, exitDate: string, exitTime: string): boolean => {
    const entry = new Date(`${entryDate}T${entryTime}:00Z`);
    const exit = new Date(`${exitDate}T${exitTime}:00Z`);
    return exit > entry;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      if (
        name === "entryDate" ||
        name === "entryTime" ||
        name === "exitDate" ||
        name === "exitTime"
      ) {
        const { entryDate, entryTime, exitDate, exitTime } = updatedFormData;
        if (
          entryDate &&
          entryTime &&
          exitDate &&
          exitTime &&
          !isTimeValid(entryDate, entryTime, exitDate, exitTime)
        ) {
          setError(t("Reservation.exitTimeError"));
        } else {
          setError("");
        }
      }

      return updatedFormData;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep === 3) {
      const mockReservationCode =
        "PK" +
        Math.floor(Math.random() * 1000000)
          .toString()
          .padStart(6, "0");
      setReservationCode(mockReservationCode);
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleEdit = () => {
    setCurrentStep(1);
  };

  const handleCancel = () => {
    setCancelled(true);
    setCurrentStep(4);
  };

  const handlePrint = () => {  
    window.print();
  };

  const checkAvailability = async () => {
    setChecking(true);
    setError("");
    try {
      if (!isTimeValid(formData.entryDate, formData.entryTime, formData.exitDate, formData.exitTime)) {
        setError(t("Reservation.exitTimeError"));
        setChecking(false);
        return;
      }

      const vehicleTypeMap: Record<string, number> = { car: 1, motorcycle: 2, suv: 3 };
      const vehicleTypeId = vehicleTypeMap[formData.vehicleType as keyof typeof vehicleTypeMap] || 0;


      const data = await getAvailability({
        startTime: `${formData.entryDate}T${formData.entryTime}:00Z`,
        endTime: `${formData.exitDate}T${formData.exitTime}:00Z`,
        vehicleTypeId,
      });


      setAvailability(data.is_overall_available);
      setSlotDetails(data.slot_details || []);
      if (!data.is_overall_available) {
        setError( "No hay disponibilidad para el período solicitado.");
      }
    } catch (error) {
      setError("Ocurrió un error al verificar la disponibilidad.");
    } finally {
      setChecking(false);
    }
  };

  const handleReservation = async () => {
    setSubmitting(true);
    setError("");
    try {
      // Simulamos el procesamiento de la reserva sin Stripe
      setCurrentStep(4); // Pasar directamente al paso de comprobante
    } catch (e) {
      setError("Error al procesar la reserva");
    }
    setSubmitting(false);
  };

  // Sync date objects with string values for form submission
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      entryDate: entryDateObj ? format(entryDateObj, "yyyy-MM-dd") : "",
      exitDate: exitDateObj ? format(exitDateObj, "yyyy-MM-dd") : "",
    }));
  }, [entryDateObj, exitDateObj]);

  // Cargar tipos de vehículos
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const types = await getVehicleTypes();
        setVehicleTypes(types);
      } catch (error) {
        console.error("Error al cargar los tipos de vehículos:", error);
      }
    };

    fetchVehicleTypes();
  }, []);

  const steps = [
    { number: 1, title: t("step1Title"), icon: <Calendar className="h-5 w-5" /> },
    { number: 2, title: t("step2Title"), icon: <User className="h-5 w-5" /> },
    { number: 3, title: t("step3Title"), icon: <CreditCard className="h-5 w-5" /> },
    { number: 4, title: t("step4Title"), icon: <Check className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-center">{t("reservation")}</h1>
              <div className="mt-8 hidden md:flex justify-between">
                {steps.map((step, idx) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center ${
                      currentStep === idx + 1
                        ? "text-primary"
                        : currentStep > idx + 1
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2 ${
                        currentStep === idx + 1
                          ? "border-primary bg-primary/10"
                          : currentStep > idx + 1
                          ? "border-muted-foreground bg-muted"
                          : "border-muted-foreground/50"
                      }`}
                    >
                      {currentStep > idx + 1 ? <Check className="h-5 w-5" /> : step.icon}
                    </div>
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex md:hidden items-center justify-center">
                <span className="text-sm font-medium">
                  {t("step")} {currentStep} {t("of")} 4: {steps[currentStep - 1].title}
                </span>
              </div>
            </div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent>
                  {currentStep === 1 && (
                    <Step1
                      t={t}
                      formData={formData}
                      setFormData={setFormData}
                      entryDateObj={entryDateObj}
                      setEntryDateObj={setEntryDateObj}
                      exitDateObj={exitDateObj}
                      setExitDateObj={setExitDateObj}
                      vehicleTypes={vehicleTypes}
                      handleSelectChange={handleSelectChange}
                      checkAvailability={checkAvailability}
                      checking={checking}
                      availability={availability}
                      slotDetails={slotDetails}
                      error={error}
                      nextStep={nextStep}
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
                    />
                  )}
                  {currentStep === 4 && (
                    <Step4
                      t={t}
                      reservationCode={reservationCode}
                      cancelled={cancelled}
                      formData={formData}
                      handlePrint={handlePrint}
                    />
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
