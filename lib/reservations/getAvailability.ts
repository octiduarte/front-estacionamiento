interface GetAvailabilityParams {
  vehicleTypeId: number;
  startTime: string;
  endTime: string;
}

export async function getAvailability({ startTime, endTime, vehicleTypeId }: GetAvailabilityParams) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const response = await fetch(
      `${apiUrl}/api/availability?startTime=${startTime}&endTime=${endTime}&vehicleTypeId=${vehicleTypeId}`
    );

    if (!response.ok) {
      throw new Error('Error al verificar disponibilidad');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    throw error;
  }
}