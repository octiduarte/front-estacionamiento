import { Reservation } from "../create/getReservation";

export async function getReservationManage(code: string, email: string): Promise<Reservation> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/reservations/${code}?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to fetch reservation');
  return res.json();
}
