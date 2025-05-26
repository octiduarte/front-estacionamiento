interface ReservationData {
    code: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    vehicle_type_id: number;
    vehicle_plate: string;
    vehicle_model: string;
    status?: string; // Optional, defaults to 'active'
    start_time: string; // ISO string or timestamp
    end_time: string;   // ISO string or timestamp
    created_at?: string; // Optional, handled by backend
    updated_at?: string; // Optional, handled by backend
}

interface ReservationResponse {
    id: number;
    code: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    vehicle_type_id: number;
    vehicle_plate: string;
    vehicle_model: string;
    status: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export async function createReservation(
    data: ReservationData
): Promise<ReservationResponse> {
    const res = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error creating reservation');
    return res.json();
}
