// Payload que se envía al backend para crear una reserva (admin y user)
export interface ReservationPayload {
  user_name: string;
  user_email: string;
  user_phone: string;
  vehicle_type_id: number;
  vehicle_plate: string;
  vehicle_model: string;
  payment_method_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  language: string;
}

//Se utiliza para Mostrar las reservas en el dashboard de admin, tambien para los detalles en manage y para confirmacion de reserva
export interface ReservationDashboard {
  code: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  vehicle_type_id: number;
  vehicle_type_name: string;
  vehicle_plate: string;
  vehicle_model: string;
  payment_method_id: number;
  payment_method_name: string;
  stripe_session_id: string;
  payment_status: string;
  status: string;
  language: string;
  start_time: string;
  end_time: string;
  total_price: number; 
  created_at: string;
  updated_at: string;
}

export interface MappedReservation {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  vehicleType: string;
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  licensePlate: string;
  vehicleModel: string;
  paymentMethod: string;
}


export interface Price {
  vehicle_type: string;
  reservation_time: string;
  price: number;
}


export interface ReservationFormData {
  vehicleType: number;
  entryDate: string;
  entryTime: string;
  exitDate: string;
  exitTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licensePlate: string;
  vehicleModel: string;
  paymentMethod: number;
  language?: string; // Agregado para enviar el idioma
}

export interface CountryOption {
  name: string;
  dialCode: string;
  iso2: string;
}


export interface Slot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface VehicleConfig {
  vehicle_type: string;
  spaces: number;
  prices: {
    hour: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
}