export async function getTotalPrice({
  vehicleTypeId,
  startTime,
  endTime,
}: {
  vehicleTypeId: number;
  startTime: string;
  endTime: string;
}): Promise<number> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const params = new URLSearchParams({
      vehicle_type_id: vehicleTypeId.toString(),
      start_time: startTime,
      end_time: endTime,
    });
    const res = await fetch(`${apiUrl}/api/total-price?${params.toString()}`);
    if (!res.ok) {
      throw new Error("Error fetching total price");
    }
    const data = await res.json();
    return data.total_price;
  } catch (error) {
    console.error("Error fetching total price:", error);
    throw error;
  }
}
