export interface Price {
  vehicle_type: string;
  reservation_time: string;
  price: number;
}

export async function getPrices(): Promise<Price[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const res = await fetch(`${apiUrl}/api/prices`);
  if (!res.ok) throw new Error('Error fetching prices');
  return res.json();
}
