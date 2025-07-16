export async function cancelReservation(reservationCode: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/reservations/${reservationCode}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Si es 401, significa que faltan menos de 12 horas
    if (response.status === 401) {
      throw new Error('CANNOT_CANCEL_LESS_THAN_12_HOURS');
    }
    
    throw new Error(errorData.message || `Failed to cancel reservation: ${response.status}`);
  }
}
