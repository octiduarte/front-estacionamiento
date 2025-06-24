import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { format } from "date-fns";

interface Step3Props {
  t: (key: string) => string;
  formData: any;
  handleSelectChange: (name: string, value: string) => void;
  prevStep: () => void;
  handleReservation: () => void;
  submitting: boolean;
  totalPrice: number | null;
}

const Step3: React.FC<Step3Props> = ({
  t,
  formData,
  handleSelectChange,
  prevStep,
  handleReservation,
  submitting,
  totalPrice,
}) => {
  return (
    <div className="space-y-6">
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
              {formData.entryDate ? format(new Date(formData.entryDate), "dd/MM/yyyy") : "-"} {formData.entryTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("exitDateTime")}:</span>
            <span>
              {formData.exitDate ? format(new Date(formData.exitDate), "dd/MM/yyyy") : "-"} {formData.exitTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("paymentMethod")}:</span>
            <span>{formData.paymentMethod === "creditCard" ? t("payOnline") : t("payOnSite")}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>{t("totalAmount")}:</span>
              <span>{totalPrice !== null ? `€${totalPrice}` : "-"}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          {t("back")}
        </Button>
        <Button
          onClick={handleReservation}
          disabled={submitting}
        >
          {t("completeReservation")}
        </Button>
      </div>
    </div>
  );
};

export default Step3;
