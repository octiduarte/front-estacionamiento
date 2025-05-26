export interface Price {
  vehicle_type: string;
  reservation_time: string;
  price: number;
}

export async function getPrices(): Promise<Price[]> {
  const res = await fetch('http://localhost:8080/api/prices');
  if (!res.ok) throw new Error('Error fetching prices');
  return res.json();
}
