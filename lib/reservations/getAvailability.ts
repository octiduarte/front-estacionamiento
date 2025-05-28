interface GetAvailabilityParams {
  vehicleTypeId: number;
  startTime: string;
  endTime: string;
}

export async function getAvailability({ startTime, endTime, vehicleTypeId }: GetAvailabilityParams) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/availability?startTime=${startTime}&endTime=${endTime}&vehicleTypeId=${vehicleTypeId}`
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