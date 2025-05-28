export async function getVehicleTypes() {
    try {
        const response = await fetch("http://localhost:8080/api/vehicle-types");

        if (!response.ok) {
            throw new Error("Error al obtener los tipos de vehículos");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los tipos de vehículos:", error);
        throw error;
    }
}
