import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";
import { format } from "date-fns";
import { createItalyDateTime } from "@/lib/italy-time";
import { Wallet, Coins, CheckCircle2Icon } from "lucide-react";

interface Step3Props {
  t: (key: string) => string;
  formData: any;
  handleSelectChange: (name: string, value: string) => void;
  prevStep: () => void;
  handleReservation: () => void;
  submitting: boolean;
  totalPrice: number | null;
  submissionError?: string;
  isLoadingPrice?: boolean;
}

const paymentMethods = [
  {
    value: "creditCard",
    label: "payOnline",
    icon: Wallet,
  },
  {
    value: "cash",
    label: "payOnSite",
    icon: Coins,
  },
];

const Step3: React.FC<Step3Props> = ({
  t,
  formData,
  handleSelectChange,
  prevStep,
  handleReservation,
  submitting,
  totalPrice,
  submissionError,
  isLoadingPrice = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium">{t("paymentMethod")}</Label>
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = formData.paymentMethod === method.value;
            return (
              <div
                key={method.value}
                onClick={() => handleSelectChange("paymentMethod", method.value)}
                className={`
                  relative cursor-pointer rounded-md border-2 p-4 transition-all duration-200
                  flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/50"
                      : "border-gray-700 bg-background hover:border-gray-500 text-gray-100 hover:shadow-sm"
                  }
                  ${submitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-gray-300"}`} />
                <span
                  className={`text-xs font-medium text-center mt-2 ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}
                >
                  {t(method.label)}
                </span>
                {/* Indicador de selección */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                    <CheckCircle2Icon className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-medium mb-2">{t("reservationSummary")}</h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span>{t("vehicleType")}:</span>
            <span className="capitalize">{formData.vehicleType ? t(formData.vehicleType) : "-"}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("entryDateTime")}:</span>
            <span>
              {formData.entryDate && formData.entryTime
                ? format(createItalyDateTime(new Date(formData.entryDate), formData.entryTime), "dd/MM/yyyy HH:mm")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("exitDateTime")}:</span>
            <span>
              {formData.exitDate && formData.exitTime
                ? format(createItalyDateTime(new Date(formData.exitDate), formData.exitTime), "dd/MM/yyyy HH:mm")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("paymentMethod")}:</span>
            <span>
              {
                formData.paymentMethod === "creditCard"
                  ? t("payOnline")
                  : formData.paymentMethod === "cash"
                    ? t("payOnSite")
                    : "-"
              }
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>{t("totalAmount")}:</span>
              <span>{totalPrice !== null ? `€${totalPrice}` : "-"}</span>
            </div>
            {formData.paymentMethod === "cash" && totalPrice !== null && (
              <div className="mt-2 space-y-1 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>{t("onlinePaymentAmount") || "Online payment (30%)"}:</span>
                  <span>€{(totalPrice * 0.3).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("onsitePaymentAmount") || "To pay on site (70%)"}:</span>
                  <span>€{(totalPrice * 0.7).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {submissionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{submissionError}</p>
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {t("back")}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={submitting || !formData.paymentMethod}
              role="link"
            >
              {t("completeReservation")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmReservation")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("confirmReservationDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleReservation}
                disabled={submitting}
              >
                {submitting ? t("processing") : t("confirmReservation")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Step3;
