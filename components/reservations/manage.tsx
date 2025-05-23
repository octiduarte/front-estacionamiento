"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit, Printer, X } from "lucide-react";

export default function ManageReservation() {
  const t = useTranslations("ManageReservation");
  const tRes = useTranslations("Reservation");
  const [step, setStep] = useState(1);
  const [lookup, setLookup] = useState({ code: "", email: "" });
  const [reservation, setReservation] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // Simulate reservation lookup
  const handleFind = () => {
    setNotFound(false);
    setCancelled(false);
    setSuccess(false);
    setError(false);
    // Mock: only accept code "PK123456" and email "demo@demo.com"
    if (lookup.code === "PK123456" && lookup.email === "demo@demo.com") {
      const mock = {
        code: "PK123456",
        firstName: "John",
        lastName: "Doe",
        email: "demo@demo.com",
        vehicleType: "compact",
        entryDate: "2025-05-20",
        entryTime: "09:00",
        exitDate: "2025-05-21",
        exitTime: "18:00",
        licensePlate: "XYZ123",
        vehicleModel: "Toyota Yaris",
        paymentMethod: "creditCard",
        cardNumber: "**** **** **** 1234",
        totalAmount: "€45.00"
      };
      setReservation(mock);
      setFormData(mock);
      setStep(2);
    } else {
      setNotFound(true);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setSuccess(false);
    setError(false);
  };

  const handleSave = () => {
    setEditMode(false);
    setSuccess(true);
    setReservation({ ...reservation, ...formData });
  };

  const handleCancel = () => {
    setCancelConfirm(true);
  };

  const confirmCancel = () => {
    setCancelled(true);
    setCancelConfirm(false);
    setStep(3);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
                <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="lookup"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <Label>{t("lookupLabel")}</Label>
                        <Input
                          name="code"
                          placeholder={t("reservationCode")}
                          value={lookup.code}
                          onChange={e => setLookup({ ...lookup, code: e.target.value })}
                          className="mt-2"
                        />
                        <Input
                          name="email"
                          type="email"
                          placeholder={t("email")}
                          value={lookup.email}
                          onChange={e => setLookup({ ...lookup, email: e.target.value })}
                        />
                        {notFound && <div className="text-destructive text-sm mt-2">{t("notFound")}</div>}
                      </div>
                      <Button className="w-full" onClick={handleFind} disabled={!lookup.code || !lookup.email}>
                        {t("findReservation")}
                      </Button>
                    </motion.div>
                  )}
                  {step === 2 && reservation && (
                    <motion.div
                      key="manage"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {cancelConfirm && (
                        <div className="bg-muted p-4 rounded-md text-center">
                          <div className="mb-2">{t("cancelConfirm")}</div>
                          <div className="flex gap-2 justify-center">
                            <Button variant="destructive" onClick={confirmCancel}>{t("cancel")}</Button>
                            <Button variant="outline" onClick={() => setCancelConfirm(false)}>{t("back")}</Button>
                          </div>
                        </div>
                      )}
                      {!editMode && !cancelConfirm && (
                        <>
                          <div className="bg-muted p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{tRes("reservationCode")}:</span>
                              <span className="font-mono">{reservation.code}</span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>{tRes("name")}:</span>
                                <span>{reservation.firstName} {reservation.lastName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{tRes("vehicleType")}:</span>
                                <span className="capitalize">{tRes(reservation.vehicleType)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{tRes("entryDateTime")}:</span>
                                <span>{reservation.entryDate} {reservation.entryTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{tRes("exitDateTime")}:</span>
                                <span>{reservation.exitDate} {reservation.exitTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{tRes("licensePlate")}:</span>
                                <span>{reservation.licensePlate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{tRes("vehicleModel")}:</span>
                                <span>{reservation.vehicleModel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>{tRes("paymentMethod")}:</span>
                                <span>{reservation.paymentMethod === "creditCard" ? tRes("payOnline") : tRes("payOnSite")}</span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-2 mt-2">
                                <span>{tRes("totalAmount")}:</span>
                                <span>{reservation.totalAmount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <Button variant="outline" className="flex-1" onClick={handleEdit}>
                              <Edit className="w-4 h-4 mr-2" /> {t("edit")}
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={handleCancel}>
                              <X className="w-4 h-4 mr-2" /> {t("cancel")}
                            </Button>
                            <Button className="flex-1" onClick={handlePrint}>
                              <Printer className="w-4 h-4 mr-2" /> {t("print")}
                            </Button>
                          </div>
                          {success && <div className="text-green-600 text-sm mt-2">{t("success")}</div>}
                          {error && <div className="text-destructive text-sm mt-2">{t("error")}</div>}
                        </>
                      )}
                      {editMode && (
                        <form
                          className="space-y-4"
                          onSubmit={e => {
                            e.preventDefault();
                            handleSave();
                          }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">{tRes("firstName")}</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">{tRes("lastName")}</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">{tRes("email")}</Label>
                              <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="licensePlate">{tRes("licensePlate")}</Label>
                              <Input
                                id="licensePlate"
                                name="licensePlate"
                                value={formData.licensePlate}
                                onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" type="button" onClick={() => setEditMode(false)}>{t("back")}</Button>
                            <Button type="submit">{t("saveChanges")}</Button>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                  {step === 3 && cancelled && (
                    <motion.div
                      key="cancelled"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 text-center"
                    >
                      <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                          <X className="h-8 w-8 text-destructive" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-destructive">{t("cancelled")}</h3>
                        <Button className="mt-6" onClick={() => setStep(1)}>{t("back")}</Button>
                      </div>
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
