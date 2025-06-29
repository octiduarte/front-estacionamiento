// Mapas de transformación compartidos entre hooks
export const VEHICLE_TYPE_MAP: Record<string, number> = {
  car: 1,
  motorcycle: 2,
  suv: 3,
};

export const PAYMENT_METHOD_MAP: Record<string, number> = {
  cash: 1,
  creditCard: 2,
};

// Función helper para obtener vehicle type ID
export const getVehicleTypeId = (vehicleType: string): number => {
  return VEHICLE_TYPE_MAP[vehicleType as keyof typeof VEHICLE_TYPE_MAP] || 0;
};
