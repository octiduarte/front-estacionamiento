import { Label } from "@/components/ui/label";
import { Car, Truck, Bike, CheckCircle2Icon } from "lucide-react";

interface VehicleTypeSelectorProps {
  t: (key: string) => string;
  vehicleTypes: { id: number; name: string }[];
  selectedType: number;
  onTypeChange: (value: number) => void;
}

const VehicleTypeSelector = ({
  t,
  vehicleTypes,
  selectedType,
  onTypeChange,
}: VehicleTypeSelectorProps) => {
  const getVehicleIcon = (vehicleTypeName: string, isSelected: boolean) => {
    const iconClass = `h-6 w-6 ${isSelected ? "text-primary" : "text-gray-300"}`;
    
    switch (vehicleTypeName.toLowerCase()) {
      case "car":
        return <Car className={iconClass} />;
      case "motorcycle":
        return <Bike className={iconClass} />;
      case "suv":
        return <Truck className={iconClass} />;
      default:
        return <Car className={iconClass} />;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">{t("vehicleType")}</Label>
      <div className="grid grid-cols-3 gap-4">
        {vehicleTypes.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                relative cursor-pointer rounded-md border-2 p-4 transition-all duration-200
                flex flex-col items-center justify-center
                ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/50"
                    : "border-gray-700 bg-background hover:border-gray-500 text-gray-100 hover:shadow-sm"
                }
              `}
            >
              {getVehicleIcon(type.name, isSelected)}
              <span
                className={`text-xs font-medium text-center mt-2 ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {t(type.name)}
              </span>
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
  );
};

export default VehicleTypeSelector;
