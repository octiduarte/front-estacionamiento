"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VehicleDashboardConfig } from "./VehicleDashboardConfig";
import { getAdminVehicles } from "@/lib/admin/dashboard/config/getAdminConfig";
import { putAdminConfig } from "@/lib/admin/dashboard/config/putAdminConfig";
import { toast } from "sonner";
import Wheel from "@/components/ui/wheel";
import { VehicleConfig } from "@/types/reservation";
import { useAdminConfig } from "@/hooks/admin/dashboard/config/useAdminConfig";

export default function AdminDashboardConfig() {
  const router = useRouter();
  // Custom hook para states y handlers
  const {
    editingType,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditFormChange,
    handleEditFormPriceChange,
    setEditingType,
    setEditForm,
  } = useAdminConfig();

  // Token state y useEffect
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);

  // React Query hooks
  const queryClient = useQueryClient();
  const {
    data: configs,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminVehicles"],
    queryFn: () => getAdminVehicles(token),
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async (form: VehicleConfig) => {
      return putAdminConfig(token || "", form.vehicle_type, {
        spaces: form.spaces,
        prices: form.prices,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVehicles"] });
      setEditingType(null);
      setEditForm(null);
      toast.success("Configurazione aggiornata con successo.");
    },
    onError: (error: any) => {
      toast.error(`Errore nell'aggiornamento: ${error.message}`);
    },
  });

  useEffect(() => {
    if (isError && error?.message?.includes("401")) {
      toast.error("Sessione scaduta. Effettua nuovamente il login.");
      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
    }
  }, [isError, error, router]);

  if (isFetching) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Configurazione Veicoli</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {configs &&
          configs.map((config: VehicleConfig) => (
            <VehicleDashboardConfig
              key={config.vehicle_type}
              config={config}
              editingType={editingType}
              editForm={editForm}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleEditFormChange={handleEditFormChange}
              handleEditFormPriceChange={handleEditFormPriceChange}
              mutation={mutation}
            />
          ))}
      </div>
    </div>
  );
};