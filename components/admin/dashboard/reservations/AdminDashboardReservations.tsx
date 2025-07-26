"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { Plus, RefreshCcw } from "lucide-react";
import { CreateReservationModal } from "@/components/admin/dashboard/reservations/modal/CreateDashboardReservations";
import { getAdminReservations } from "@/lib/admin/dashboard/reservations/getAdminReservations";
import { deleteAdminReservation } from "@/lib/admin/dashboard/reservations/deleteAdminReservations";
import { getVehicleTypes } from "@/lib/reservations/create/getVehicleTypes";
import Wheel from "@/components/ui/wheel";
import { useAdminReservationState } from "@/hooks/admin/dashboard/reservations/useAdminReservationState";
import { Reservation } from "@/types/reservation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaginationDashboardReservations } from "./PaginationDashboardReservations";
import { TableDashboardReservations } from "./TableDashboardReservations";
import { FiltersDashboardReservations } from "./FiltersDashboardReservations";

export default function AdminDashboardReservations() {
  const router = useRouter();

  const itemsPerPage = 10;
  const {
    filters,
    showCreateModal,
    setShowCreateModal,
    currentPage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    showFilters,
    setShowFilters,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    handleFilterChange,
    handleDateChange,
    clearAllFilters,
  } = useAdminReservationState(itemsPerPage);

  // Obtener tipos de vehículos dinámicamente del backend
  const { data: vehicleTypes = [], isLoading: loadingVehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 0, // Siempre se considera stale
    gcTime: 5 * 60 * 1000, // 5 minutos en caché
  });

  const [token, setToken] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);

  const queryClient = useQueryClient();
  const {
    data: reservationsResponse,
    isFetching,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["adminReservations", token, currentPage, itemsPerPage, filters],
    queryFn: () =>
      getAdminReservations(token, {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        status: filters.status,
        code: filters.code,
        start_time: filters.startDate,
        end_time: filters.endDate,
        vehicle_type_name: filters.vehicleType,
      }),
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  // Mutación para cancelar reserva
  const cancelMutation = useMutation({
    mutationFn: async ({
      reservation,
      refund,
    }: {
      reservation: Reservation;
      refund: boolean;
    }) => {
      return deleteAdminReservation(token, reservation.code, refund);
    },
    onSuccess: async (data: Response) => {
      let msg = "Prenotazione cancellata correttamente.";

      const json = await data.json();
      if (json?.message) msg = json.message;

      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["adminReservations"] });
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Errore nella cancellazione: ${error.message}`);
    },
  });

  useEffect(() => {
    if (isError && error?.message?.includes("401")) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
    }
  }, [isError, error, router]);

  // Extraer datos de la nueva estructura de respuesta
  const reservations = reservationsResponse?.reservations || [];
  const totalReservations = reservationsResponse?.total || 0;
  const totalPages = Math.ceil(totalReservations / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleCancelReservation = (
    reservation: Reservation,
    refund: boolean
  ) => {
    cancelMutation.mutate({ reservation, refund });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-900 text-green-200",
      pending: "bg-yellow-900 text-yellow-200",
      canceled: "bg-destructive/20 text-destructive",
      finished: "text-blue-200 bg-blue-900 ",
      null: "bg-gray-200 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.null;
  };

  // Estados de carga
  if (isFetching || cancelMutation.isPending) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Prenotazioni</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            onClick={() => refetch()}
            variant="secondary"
            size="sm"
            title="Refresh list"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Aggiorna
          </Button>
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Crea Prenotazione
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <FiltersDashboardReservations
        filters={filters}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startCalendarOpen={startCalendarOpen}
        setStartCalendarOpen={setStartCalendarOpen}
        endCalendarOpen={endCalendarOpen}
        setEndCalendarOpen={setEndCalendarOpen}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        vehicleTypes={vehicleTypes}
        loadingVehicleTypes={loadingVehicleTypes}
        handleFilterChange={handleFilterChange}
        handleDateChange={handleDateChange}
        clearAllFilters={clearAllFilters}
      />

      {/* Tabla de reservas */}
      <Card>
        <CardContent className="p-0">
          <TableDashboardReservations
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
            getStatusBadge={getStatusBadge}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      {reservations.length > 0 && totalReservations > 0 && (
        <div className="mt-6">
          <PaginationDashboardReservations
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalReservations}
            itemsPerPage={itemsPerPage}
            hasPreviousPage={hasPreviousPage}
            hasNextPage={hasNextPage}
            onPageChange={(page) => handlePageChange(page, totalPages)}
            onPreviousPage={handlePreviousPage}
            onNextPage={() => handleNextPage(totalPages)}
          />
        </div>
      )}

      <CreateReservationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onReservationCreated={() => {
          // Refetch data después de crear nueva reserva
          refetch();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
