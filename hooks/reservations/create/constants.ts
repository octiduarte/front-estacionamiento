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

// Mapa inverso: de ID numérico a clave de traducción
export const VEHICLE_TYPE_ID_TO_KEY_MAP: Record<number, string> = {
  1: 'car',
  2: 'motorcycle', 
  3: 'suv',
};

export const PAYMENT_METHOD_NAME_TO_KEY_MAP: Record<string, string> = {
  'cash': 'cash',
  'efectivo': 'cash',
  'contanti': 'cash',
  'credit card': 'creditCard',
  'tarjeta de crédito': 'creditCard',
  'carta di credito': 'creditCard',
  'stripe': 'creditCard',
};

// Función helper para obtener vehicle type ID
export const getVehicleTypeId = (vehicleType: string): number => {
  return VEHICLE_TYPE_MAP[vehicleType as keyof typeof VEHICLE_TYPE_MAP] || 0;
};

// Función helper para obtener la clave de traducción desde el ID del tipo de vehículo
export const getVehicleTypeKeyFromId = (vehicleTypeId: number): string => {
  return VEHICLE_TYPE_ID_TO_KEY_MAP[vehicleTypeId] || 'car';
};

// Función helper para obtener la clave de traducción del método de pago desde el nombre
export const getPaymentMethodKey = (paymentMethodName: string): string => {
  const normalizedName = paymentMethodName.toLowerCase().trim();
  return PAYMENT_METHOD_NAME_TO_KEY_MAP[normalizedName] || 'cash';
};
