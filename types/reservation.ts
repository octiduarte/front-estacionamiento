export interface Reservation {
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
  languaje: string;
  start_time: string;
  end_time: string;
  total_price?: number; // Opcional, puede no estar disponible en todas las respuestas
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
  vehicleType: string;
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
  paymentMethod: string;
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