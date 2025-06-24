export interface Price {
  vehicle_type: string;
  reservation_time: string;
  price: number;
}

export async function getPrices(): Promise<Price[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  try {
    const res = await fetch(`${apiUrl}/api/prices`);

    if (!res.ok) {
      throw new Error("Error fetching prices");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
}
