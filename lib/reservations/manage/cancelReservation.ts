export async function cancelReservation(
  reservationCode: string
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/reservations/${reservationCode}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return;
  }

  if (!res.ok) {
    // Si es 401, significa que faltan menos de 12 horas
    if (res.status === 401) {
      throw new Error("CANNOT_CANCEL_LESS_THAN_12_HOURS");
    }
    throw new Error(`Failed to cancel reservation: ${res.status}`);
  }
}
