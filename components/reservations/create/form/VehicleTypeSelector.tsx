import { Label } from "@/components/ui/label";
import { Car, Truck, Bike, Bus, CheckCircle2Icon } from "lucide-react";
import React from "react";

interface VehicleTypeSelectorProps {
  t: (key: string) => string;
  vehicleTypes: { id: number; name: string }[];
  selectedType: string;
  onTypeChange: (value: string) => void;
}

const VehicleTypeSelector: React.FC<VehicleTypeSelectorProps> = ({
  t,
  vehicleTypes,
  selectedType,
  onTypeChange,
}) => {
  // Función para obtener el icono según el tipo de vehículo
  const getVehicleIcon = (
    vehicleTypeName: string,
    size: "sm" | "lg" | "custom" = "sm",
    isSelected = false
  ) => {
    const name = vehicleTypeName.toLowerCase();
    const iconSize = size === "lg" ? "h-8 w-8" : size === "custom" ? "h-6 w-6" : "h-4 w-4";

    const selectedClass = isSelected ? "text-primary" : "text-gray-300";
    switch (name) {
      case "car":
        return <Car className={`${iconSize} ${selectedClass}`} />;
      case "motorcycle":
        return <Bike className={`${iconSize} ${selectedClass}`} />;
      case "suv":
        return <Truck className={`${iconSize} ${selectedClass}`} />;
      case "bus":
        return <Bus className={`${iconSize} ${selectedClass}`} />;
      default:
        return <Car className={`${iconSize} ${selectedClass}`} />; // Icono por defecto
    }
  };

  // Función para obtener el color del borde según el tipo de vehículo
  const getVehicleColor = (vehicleTypeName: string) => {
    // Todos iguales
    return "border-gray-700 bg-background hover:border-gray-500 text-gray-100";
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{t("vehicleType")}</Label>
      {/* Selector de vehículos con tarjetas */}
      <div className="grid grid-cols-3 gap-4">
        {vehicleTypes.map((type) => {
          const isSelected = selectedType === type.name;
          return (
            <div
              key={type.id}
              onClick={() => onTypeChange(type.name)}
              className={`
                relative cursor-pointer rounded-md border-2 p-4 transition-all duration-200
                flex flex-col items-center justify-center
                ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/50"
                    : `${getVehicleColor(type.name)} hover:shadow-sm`
                }
              `}
            >
              {getVehicleIcon(type.name, "custom", isSelected)}
              <span
                className={`text-xs font-medium text-center mt-2 ${
                  isSelected ? "text-primary" : "text-foreground"
                }`}
              >
                {t(type.name)}
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
  );
};

export default VehicleTypeSelector;
