import { ReservationDashboard } from "@/types/reservation";

interface AdminReservationFilters {
  limit?: number;
  offset?: number;
  status?: string;
  code?: string;
  start_time?: string;
  end_time?: string;
  vehicle_type_name?: string;
}

interface AdminReservationsResponse {
  total: number;
  limit: number;
  offset: number;
  reservations: ReservationDashboard[];
}

export async function getAdminReservations(token: string, filters: AdminReservationFilters = {}): Promise<AdminReservationsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Construir query parameters
  const queryParams = new URLSearchParams();
  
  // Agregar filtros solo si tienen valor
  if (filters.limit !== undefined) queryParams.append('limit', filters.limit.toString());
  if (filters.offset !== undefined) queryParams.append('offset', filters.offset.toString());
  if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
  if (filters.code) queryParams.append('code', filters.code);
  if (filters.start_time) queryParams.append('start_time', filters.start_time);
  if (filters.end_time) queryParams.append('end_time', filters.end_time);
  if (filters.vehicle_type_name && filters.vehicle_type_name !== 'all') queryParams.append('vehicle_type_name', filters.vehicle_type_name);
  
  const url = `${apiUrl}/admin/reservations?${queryParams.toString()}`;
  
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch reservations: ${res.status}`);
  }

  return res.json();
}
