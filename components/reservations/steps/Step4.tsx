import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import React from "react";
import { format } from "date-fns";

interface Step4Props {
  t: (key: string) => string;
  reservationCode: string;
  cancelled: boolean;
  formData: any;
  handlePrint: () => void;
}

const Step4: React.FC<Step4Props> = ({
  t,
  reservationCode,
  cancelled,
  formData,
  handlePrint,
}) => {
  return (
    <div className="space-y-6 text-center">
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
                    {formData.entryDate ? format(new Date(formData.entryDate), "dd/MM/yyyy") : "-"} {formData.entryTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("exitDateTime")}:</span>
                  <span>
                    {formData.exitDate ? format(new Date(formData.exitDate), "dd/MM/yyyy") : "-"} {formData.exitTime}
                  </span>
                </div>
              </div>
            </div>
            {/* Only show the print button here */}
            <Button className="w-full" onClick={handlePrint}>{t("printConfirmation")}</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Step4;
