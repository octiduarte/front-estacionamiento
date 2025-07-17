import { Reservation } from "../create/getReservation";

export async function getReservationManage(code: string, email: string): Promise<Reservation> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/reservations/${code}?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      const errorText = await res.text();
      throw new Error(errorText);
    }
  }
  return res.json();
}
