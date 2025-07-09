export async function cancelReservation(reservationCode: string): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/reservations/${reservationCode}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to cancel reservation: ${response.status}`);
  }
}
