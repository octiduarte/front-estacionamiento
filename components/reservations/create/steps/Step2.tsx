import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

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

  return (
    <div className="space-y-6">
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
              placeholder={t("email")}
              pattern="^[^@]+@[^@]+\.[a-zA-Z]{2,}$"
              required
            />
            {!isEmailValid(formData.email) && formData.email && (
              <span className="text-sm text-red-600 mt-1 block">{t("invalidEmail")}</span>
            )}
          </div>
          <div>
            <Label htmlFor="phone">{t("phoneNumber")}</Label>
            <div className="flex gap-2">
              <Select
                value={selectedCountry.iso2}
                onValueChange={(iso2) => {
                  const found = countryOptions.find((c) => c.iso2 === iso2);
                  if (found) setSelectedCountry(found);
                }}
              >
                <SelectTrigger className="w-28">
                  <SelectValue>{`+${selectedCountry.dialCode}`}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option.iso2} value={option.iso2}>
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
                className="flex-1"
              />
            </div>
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
            !isEmailValid(formData.email) ||
            !formData.phone ||
            !formData.licensePlate
          }
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default Step2;
