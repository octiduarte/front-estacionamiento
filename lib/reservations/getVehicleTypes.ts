export async function getVehicleTypes() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/vehicle-types`);

        if (!response.ok) {
            throw new Error("Error al obtener los tipos de vehículos");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los tipos de vehículos:", error);
        throw error;
    }
}
