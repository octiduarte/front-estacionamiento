import { useState } from "react";
import { VehicleConfig } from "@/types/reservation";

export function useAdminConfig() {
  const [editingType, setEditingType] = useState<string | null>(null); //Tipo de vehiculo que se está editando
  const [editForm, setEditForm] = useState<VehicleConfig | null>(null); //Los datos actuales del formulario de edición

  const handleEdit = (config: VehicleConfig) => {
    setEditingType(config.vehicle_type);
    setEditForm({ ...config });
  };

  const handleSave = (mutation: any) => {
    if (!editForm) return;
    mutation.mutate(editForm);
  };

  const handleCancel = () => {
    setEditingType(null);
    setEditForm(null);
  };

  const handleEditFormChange = (field: string, value: any) => { //Solo para el campo de spaces
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : null
    );
  };

  const handleEditFormPriceChange = (priceType: string, value: number) => { //Para los precios
    setEditForm((prev) =>
      prev
        ? {
            ...prev,
            prices: {
              ...prev.prices,
              [priceType]: value,
            },
          }
        : null
    );
  };

  return {
    editingType,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditFormChange,
    handleEditFormPriceChange,
    setEditingType,
    setEditForm,
  };
}