export async function getVehicleTypes() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/vehicle-types`);

  if (!res.ok) {
    throw new Error("Error fetching vehicle types");
  }
  return await res.json();
}
