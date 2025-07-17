import { Reservation } from "@/types/reservation";

export async function getReservationManage(
  code: string,
  email: string
): Promise<Reservation> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/reservations/${code}?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // Si es 404, significa que no se encontró la reserva
    if (res.status === 404) {
      throw new Error('CANNOT_FOUND');
    }
    //Si ocurre otro error que no sea 404
    throw new Error(`Failed to search reservation: ${res.status}`);
  }

  return res.json();
}
