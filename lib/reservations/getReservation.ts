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
  payment_status: string;
  status: string;
  start_time: string;
  end_time: string;
  total_price?: number; // Opcional, puede no estar disponible en todas las respuestas
  created_at: string;
  updated_at: string;
}

export async function getReservation(sessionId: string): Promise<Reservation> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const res = await fetch(`${apiUrl}/api/reservation/by-session?session_id=${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch reservation');
  return res.json();
}
