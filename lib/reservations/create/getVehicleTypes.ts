export async function getVehicleTypes() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/vehicle-types`);

        if (!response.ok) {
            throw new Error("Error fetching vehicle types");
        }
        console.log("Fetching vehicle types from:", `${apiUrl}/api/vehicle-types`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching vehicle types:", error);
        throw error;
    }
}
