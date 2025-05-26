interface GetAvailabilityParams {
  vehicleType: string;
  entryTime: string;
  exitTime: string;
}

export async function getAvailability({ vehicleType, entryTime, exitTime }: GetAvailabilityParams) {
  const res = await fetch('http://localhost:8080/api/availability', {
    method: 'POST', // Aunque tu ejemplo usa GET, con body JSON es mejor POST
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicle_type: vehicleType,
      entry_time: entryTime,
      exit_time: exitTime,
    }),
  });
  if (!res.ok) throw new Error('Error checking availability');
  return res.json();
}