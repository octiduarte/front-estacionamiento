import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";

interface CountryOption {
  name: string;
  dialCode: string;
  iso2: string;
}

interface Step2Props {
  t: (key: string) => string;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  selectedCountry: CountryOption;
  setSelectedCountry: (country: CountryOption) => void;
  countryOptions: CountryOption[];
  nextStep: () => void;
  prevStep: () => void;
}

const Step2: React.FC<Step2Props> = ({
  t,
  formData,
  handleChange,
  selectedCountry,
  setSelectedCountry,
  countryOptions,
  nextStep,
  prevStep,
}) => {
  const isEmailValid = (email: string) =>
    /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(email);
  const isNameValid = (name: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/.test(name);
  const isPhoneValid = (phone: string) => /^\d{7,}$/.test(phone);

  // Nuevo estado para saber si los campos fueron tocados
  const [touched, setTouched] = useState({
    licensePlate: false,
    vehicleModel: false,
  });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">{t("personalInfo")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <Label htmlFor="firstName" className="text-xs md:text-sm">{t("firstName")}</Label>
            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3" />
            {!isNameValid(formData.firstName) && formData.firstName && (
              <span className="text-xs md:text-sm text-red-600 mt-1 block">{t("invalidFirstName")}</span>
            )}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-xs md:text-sm">{t("lastName")}</Label>
            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3" />
            {!isNameValid(formData.lastName) && formData.lastName && (
              <span className="text-xs md:text-sm text-red-600 mt-1 block">{t("invalidLastName")}</span>
            )}
          </div>
          <div>
            <Label htmlFor="email" className="text-xs md:text-sm">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("email")}
              pattern="^[^@]+@[^@]+\.[a-zA-Z]{2,}$"
              required
              className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
            />
            {!isEmailValid(formData.email) && formData.email && (
              <span className="text-xs md:text-sm text-red-600 mt-1 block">{t("invalidEmail")}</span>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="text-xs md:text-sm">{t("phoneNumber")}</Label>
            <div className="flex gap-1 md:gap-2">
              <Select
                value={selectedCountry.iso2}
                onValueChange={(iso2) => {
                  const found = countryOptions.find((c) => c.iso2 === iso2);
                  if (found) setSelectedCountry(found);
                }}
              >
                <SelectTrigger className="w-14 md:w-20 min-w-0 h-8 md:h-10 text-xs md:text-sm px-1 md:px-2">
                  <SelectValue>{`+${selectedCountry.dialCode}`}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option.iso2} value={option.iso2} className="text-xs md:text-sm">
                      {option.name} (+{option.dialCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("phoneNumber")}
                className="flex-1 min-w-0 h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
                pattern="\\d*"
              />
            </div>
            {!isPhoneValid(formData.phone) && formData.phone && (
              <span className="text-xs md:text-sm text-red-600 mt-1 block">{t("invalidPhone")}</span>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-base md:text-lg font-medium mb-2 md:mb-4">{t("vehicleInfo")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <Label htmlFor="licensePlate" className="text-xs md:text-sm">{t("licensePlate")}</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
            />
            {touched.licensePlate && !formData.licensePlate && (
              <span className="text-xs md:text-sm text-red-600 mt-1 block">{t("invalidLicensePlate")}</span>
            )}
          </div>
          <div>
            <Label htmlFor="vehicleModel" className="text-xs md:text-sm">{t("vehicleModel")}</Label>
            <Input
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              onBlur={handleBlur}
              className="h-8 md:h-10 text-xs md:text-sm px-2 md:px-3"
            />
            {touched.vehicleModel && !formData.vehicleModel && (
              <span className="text-xs md:text-sm text-red-600 mt-1 block">{t("invalidVehicleModel")}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2 mt-2 md:mt-4">
        <Button variant="outline" onClick={prevStep} className="h-8 md:h-10 text-xs md:text-sm px-3 md:px-4">
          {t("back")}
        </Button>
        <Button
          onClick={nextStep}
          disabled={
            !formData.firstName ||
            !isNameValid(formData.firstName) ||
            !formData.lastName ||
            !isNameValid(formData.lastName) ||
            !formData.email ||
            !isEmailValid(formData.email) ||
            !formData.phone ||
            !isPhoneValid(formData.phone) ||
            !formData.licensePlate ||
            !formData.vehicleModel
          }
          className="h-8 md:h-10 text-xs md:text-sm px-3 md:px-4"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default Step2;
