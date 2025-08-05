interface ReservationData {
    user_name: string;
    user_email: string;
    user_phone: string;
    vehicle_type_id: number;
    vehicle_plate: string;
    vehicle_model: string;
    payment_method_id: number;
    start_time: string; // ISO string or timestamp
    end_time: string;   // ISO string or timestamp
    total_price: number;
    language: string;
}

interface ReservationResponse {
    code: string;
    url: string;
    session_id: string;
}

export async function createReservation(
    data: ReservationData
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
