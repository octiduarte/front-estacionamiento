interface CreateAdminReservationData {
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

export async function createAdminReservation(token: string, data: CreateAdminReservationData) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const res = await fetch(`${apiUrl}/admin/reservations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create reservation: ${res.status}`);
  }

  return res.json();
}