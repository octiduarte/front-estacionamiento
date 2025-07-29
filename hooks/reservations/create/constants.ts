// Mapa para traducir tipo de vehículo a italiano
export const VEHICLE_TYPE_IT_MAP: Record<string, string> = {
  car: "Auto",
  motorcycle: "Motocicletta",
  suv: "SUV",
};

export function getVehicleTypeItalian(name: string): string {
  return VEHICLE_TYPE_IT_MAP[name] || name;
}

// Mapa para traducir estado de reserva a italiano
export const RESERVATION_STATUS_IT_MAP: Record<string, string> = {
  active: "Attiva",
  pending: "In attesa",
  finished: "Completata",
  canceled: "annullata",
};

export function getReservationStatusItalian(status: string): string {
  return RESERVATION_STATUS_IT_MAP[status] || status;
}

// Mapa para traducir método de pago a italiano
export const PAYMENT_METHOD_IT_MAP: Record<string, string> = {
  online: "In linea",
  onsite: "In loco",
};

export function getPaymentMethodItalian(method: string): string {
  return PAYMENT_METHOD_IT_MAP[method.toLowerCase()] || method;
}

// Mapa para traducir estado de pago a italiano
export const PAYMENT_STATUS_IT_MAP: Record<string, string> = {
  succeeded: "riuscita",
  refunded: "Rimborsata",
  pending: "In attesa di",
};

export function getPaymentStatusItalian(status: string): string {
  return PAYMENT_STATUS_IT_MAP[status] || status;
}


// Mapa para nombres de método de pago de la base de datos a clave de traducción
export const PAYMENT_METHOD_DB_NAME_TO_KEY_MAP: Record<string, string> = {
  online: "online",
  onsite: "onsite",
};

// Función helper para obtener la clave de traducción desde el nombre del método de pago en la base de datos
export const getPaymentMethodNameKey = (paymentMethodName: string): string => {
  const normalizedName = paymentMethodName.toLowerCase().trim();
  return PAYMENT_METHOD_DB_NAME_TO_KEY_MAP[normalizedName] || "-";
};
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
  1: "car",
  2: "motorcycle",
  3: "suv",
};

export const PAYMENT_METHOD_ID_TO_KEY_MAP: Record<number, string> = {
  1: "payOnSite", // Pago en sitio
  2: "payOnline", // Pago online
};

// Función helper para obtener vehicle type ID
export const getVehicleTypeId = (vehicleType: string): number => {
  return VEHICLE_TYPE_MAP[vehicleType as keyof typeof VEHICLE_TYPE_MAP] || 0;
};

// Función helper para obtener la clave de traducción desde el ID del tipo de vehículo (Se usa)
export const getVehicleTypeKeyFromId = (vehicleTypeId: number): string => {
  return VEHICLE_TYPE_ID_TO_KEY_MAP[vehicleTypeId] || "-";
};

// Función helper para obtener la clave de traducción del método de pago desde el ID (Se usa)
export const getPaymentMethodKeyFromId = (paymentMethodId: number): string => {
  return PAYMENT_METHOD_ID_TO_KEY_MAP[paymentMethodId] || "-";
};

export const RESERVATION_DURATIONS = ["hour", "daily", "weekly", "monthly"] as const;

