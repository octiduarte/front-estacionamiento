"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, Calendar, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReservationPage() {
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
    paymentMethod: "creditCard",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [reservationCode, setReservationCode] = useState("");
  const [cancelled, setCancelled] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const steps = [
    { number: 1, title: t("step1Title"), icon: <Calendar className="h-5 w-5" /> },
    { number: 2, title: t("step3Title"), icon: <User className="h-5 w-5" /> },
    { number: 3, title: t("step4Title"), icon: <CreditCard className="h-5 w-5" /> },
    { number: 4, title: t("step5Title"), icon: <Check className="h-5 w-5" /> },
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
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="vehicleType">{t("vehicleType")}</Label>
                          <Select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onValueChange={(value) => handleSelectChange("vehicleType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectVehicleType")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compact">{t("compact")}</SelectItem>
                              <SelectItem value="standard">{t("standard")}</SelectItem>
                              <SelectItem value="suv">{t("suv")}</SelectItem>
                              <SelectItem value="motorcycle">{t("motorcycle")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="entryDate">{t("entryDate")}</Label>
                            <Input
                              id="entryDate"
                              name="entryDate"
                              type="date"
                              value={formData.entryDate}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="entryTime">{t("entryTime")}</Label>
                            <Input
                              id="entryTime"
                              name="entryTime"
                              type="time"
                              value={formData.entryTime}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="exitDate">{t("exitDate")}</Label>
                            <Input
                              id="exitDate"
                              name="exitDate"
                              type="date"
                              value={formData.exitDate}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="exitTime">{t("exitTime")}</Label>
                            <Input
                              id="exitTime"
                              name="exitTime"
                              type="time"
                              value={formData.exitTime}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={nextStep} disabled={!(formData.vehicleType && formData.entryDate && formData.entryTime && formData.exitDate && formData.exitTime)}>{t("next")}</Button>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-4">{t("personalInfo")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">{t("firstName")}</Label>
                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                          </div>
                          <div>
                            <Label htmlFor="lastName">{t("lastName")}</Label>
                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                          </div>
                          <div>
                            <Label htmlFor="email">{t("email")}</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">{t("phoneNumber")}</Label>
                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">{t("vehicleInfo")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="licensePlate">{t("licensePlate")}</Label>
                            <Input
                              id="licensePlate"
                              name="licensePlate"
                              value={formData.licensePlate}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vehicleModel">{t("vehicleModel")}</Label>
                            <Input
                              id="vehicleModel"
                              name="vehicleModel"
                              value={formData.vehicleModel}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          {t("back")}
                        </Button>
                        <Button
                          onClick={nextStep}
                          disabled={
                            !formData.firstName ||
                            !formData.lastName ||
                            !formData.email ||
                            !formData.phone ||
                            !formData.licensePlate
                          }
                        >
                          {t("next")}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-medium mb-4">{t("paymentMethod")}</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="paymentMethod">{t("paymentMethod")}</Label>
                            <Select
                              name="paymentMethod"
                              value={formData.paymentMethod}
                              onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectPaymentMethod")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="creditCard">{t("payOnline")}</SelectItem>
                                <SelectItem value="cash">{t("payOnSite")}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {formData.paymentMethod === "creditCard" && (
                            <>
                              <div>
                                <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                                <Input
                                  id="cardNumber"
                                  name="cardNumber"
                                  value={formData.cardNumber}
                                  onChange={handleChange}
                                  placeholder="1234 5678 9012 3456"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiryDate">{t("expiryDate")}</Label>
                                  <Input
                                    id="expiryDate"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    placeholder="MM/YY"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvv">{t("cvv")}</Label>
                                  <Input
                                    id="cvv"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    placeholder="123"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-muted p-4 rounded-md">
                        <h3 className="font-medium mb-2">{t("reservationSummary")}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t("vehicleType")}:</span>
                            <span className="capitalize">{formData.vehicleType ? t(formData.vehicleType) : "-"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("entryDateTime")}:</span>
                            <span>
                              {formData.entryDate} {formData.entryTime}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("exitDateTime")}:</span>
                            <span>
                              {formData.exitDate} {formData.exitTime}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("paymentMethod")}:</span>
                            <span>{formData.paymentMethod === "creditCard" ? t("payOnline") : t("payOnSite")}</span>
                          </div>
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                              <span>{t("totalAmount")}:</span>
                              <span>€45.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={prevStep}>
                          {t("back")}
                        </Button>
                        <Button
                          onClick={nextStep}
                          disabled={
                            formData.paymentMethod === "creditCard"
                              ? !formData.cardNumber || !formData.expiryDate || !formData.cvv
                              : false
                          }
                        >
                          {t("completeReservation")}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 text-center"
                    >
                      {cancelled ? (
                        <div className="text-red-600 font-bold text-xl py-8">{t("reservationCancelled")}</div>
                      ) : (
                        <>
                          <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                              <Check className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{t("reservationConfirmed")}</h3>
                            <p className="text-muted-foreground mt-2">{t("confirmationDetails")}</p>
                          </div>
                          <div className="bg-muted p-6 rounded-md inline-block mx-auto">
                            <div className="text-sm text-muted-foreground">{t("reservationCode")}</div>
                            <div className="text-2xl font-bold tracking-wider">{reservationCode}</div>
                          </div>
                          <div className="pt-4 space-y-4">
                            <div className="bg-muted p-4 rounded-md text-left">
                              <h4 className="font-medium mb-2">{t("reservationDetails")}</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>{t("name")}:</span>
                                  <span>
                                    {formData.firstName} {formData.lastName}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>{t("vehicleType")}:</span>
                                  <span className="capitalize">{formData.vehicleType ? t(formData.vehicleType) : "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>{t("entryDateTime")}:</span>
                                  <span>
                                    {formData.entryDate} {formData.entryTime}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>{t("exitDateTime")}:</span>
                                  <span>
                                    {formData.exitDate} {formData.exitTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                                {t("modifyReservation")}
                              </Button>
                              <Button variant="outline" className="flex-1" onClick={handleCancel}>
                                {t("cancelReservation")}
                              </Button>
                            </div>
                            <Button className="w-full" onClick={handlePrint}>{t("printConfirmation")}</Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
