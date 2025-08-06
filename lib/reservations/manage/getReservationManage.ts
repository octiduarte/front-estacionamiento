import { ReservationDashboard } from "@/types/reservation";

export async function getReservationManage(
  code: string,
  email: string
): Promise<ReservationDashboard> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/reservations/${code}?email=${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to search reservation: ${res.status}`);
  }

  return res.json();
}
