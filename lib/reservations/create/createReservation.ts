import {ReservationPayload} from "@/types/reservation";
interface ReservationResponse {
    code: string;
    url: string;
    session_id: string;
}

export async function createReservation(
    data: ReservationPayload
): Promise<ReservationResponse> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    
    if (!res.ok) {
        throw new Error(`Failed to search reservation: ${res.status}`);
    }
    
    const json = await res.json();
    return json.reservation;
}
