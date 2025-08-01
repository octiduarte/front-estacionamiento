import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountryOption {
  name: string;
  dialCode: string;
  iso2: string;
}

interface ClientInfoFormProps {
  user_name: string;
  user_email: string;
  user_phone: string;
  vehicle_plate: string;
  vehicle_model: string;
  selectedCountry: CountryOption;
  setSelectedCountry: (country: CountryOption) => void;
  countryOptions: CountryOption[];
  isNameValid: (name: string) => boolean;
  isEmailValid: (email: string) => boolean;
  isPhoneValid: (phone: string) => boolean;
  onChange: (
    field:
      | "user_name"
      | "user_email"
      | "user_phone"
      | "vehicle_plate"
      | "vehicle_model",
    value: string
  ) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  touched?: {
    vehicle_plate?: boolean;
    vehicle_model?: boolean;
  };
}

export function ClientInfoForm({
  user_name,
  user_email,
  user_phone,
  vehicle_plate,
  vehicle_model,
  selectedCountry,
  setSelectedCountry,
  countryOptions,
  isNameValid,
  isEmailValid,
  isPhoneValid,
  onChange,
  onBlur,
  touched,
}: ClientInfoFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        <div>
          <Label htmlFor="user_name" className="text-sm md:text-base">
            Nome Completo
          </Label>
          <Input
            id="user_name"
            name="user_name"
            required
            value={user_name}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || isNameValid(value)) {
                onChange("user_name", value);
              }
            }}
            className="h-8 md:h-10 text-sm md:text-base"
          />
          {!isNameValid(user_name) && user_name && (
            <span className="text-sm text-red-600 mt-1 block">
              Inserisci un nome valido (solo lettere)
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="user_email" className="text-sm md:text-base">
            Email
          </Label>
          <Input
            id="user_email"
            name="user_email"
            type="email"
            required
            value={user_email}
            onChange={(e) => onChange("user_email", e.target.value)}
            className="h-8 md:h-10 text-sm md:text-base"
          />
          {!isEmailValid(user_email) && user_email && (
            <span className="text-sm text-red-600 mt-1 block">
              Inserisci una email valida
            </span>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="user_phone" className="text-sm md:text-base">
          Numero di Telefono
        </Label>
        <div className="flex gap-1 md:gap-2">
          <Select
            name="user_phone"
            value={selectedCountry.iso2}
            onValueChange={(iso2) => {
              const found = countryOptions.find((c) => c.iso2 === iso2);
              if (found) setSelectedCountry(found);
            }}
          >
            <SelectTrigger
              id="country_code"
              name="country_code"
              className="w-16 md:w-20 min-w-0 h-8 md:h-10 text-sm md:text-base"
            >
              <SelectValue>{`+${selectedCountry.dialCode}`}</SelectValue>
            </SelectTrigger>
            <SelectContent className="text-sm md:text-base">
              {countryOptions.map((option) => (
                <SelectItem key={option.iso2} value={option.iso2}>
                  {option.name} (+{option.dialCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="user_phone"
            name="user_phone"
            type="tel"
            required
            value={user_phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              onChange("user_phone", value);
            }}
            className="flex-1 min-w-0 h-8 md:h-10 text-sm md:text-base"
          />
        </div>
        {!isPhoneValid(user_phone) && user_phone && (
          <span className="text-sm text-red-600 mt-1 block">
            Numero non valido (minimo 7 cifre, solo numeri)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mt-4 pt-4 border-t">
        <div>
          <Label htmlFor="vehicle_plate" className="text-sm md:text-base">
            Targa
          </Label>
          <Input
            id="vehicle_plate"
            name="vehicle_plate"
            required
            value={vehicle_plate}
            onChange={(e) => onChange("vehicle_plate", e.target.value)}
            onBlur={onBlur}
            className="h-8 md:h-10 text-sm md:text-base"
          />
          {touched?.vehicle_plate && !vehicle_plate && (
            <span className="text-sm text-red-600 mt-1 block">
              Devi inserire la targa
            </span>
          )}
        </div>
        <div>
          <Label htmlFor="vehicle_model" className="text-sm md:text-base">
            Modello Veicolo
          </Label>
          <Input
            id="vehicle_model"
            name="vehicle_model"
            required
            value={vehicle_model}
            onChange={(e) => onChange("vehicle_model", e.target.value)}
            onBlur={onBlur}
            className="h-8 md:h-10 text-sm md:text-base"
          />
          {touched?.vehicle_model && !vehicle_model && (
            <span className="text-sm text-red-600 mt-1 block">
              Devi inserire il modello del veicolo
            </span>
          )}
        </div>
      </div>
    </>
  );
}
