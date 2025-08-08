"use client";

import { useEffect } from "react";
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
import { useAdminReservationFilters } from "@/hooks/admin/dashboard/reservations/useAdminReservationFilters";
import { ReservationDashboard } from "@/types/reservation";
import { useAdminDashboardAuth } from "@/hooks/admin/dashboard/useAdminDashboardAuth";
import { toast } from "sonner";
import { PaginationDashboardReservations } from "./PaginationDashboardReservations";
import { TableDashboardReservations } from "./TableDashboardReservations";
import { FiltersDashboardReservations } from "./FiltersDashboardReservations";

export default function AdminDashboardReservations() {
  const itemsPerPage = 10;

  const queryClient = useQueryClient();
  // Hook para estado de la UI (modal, paginación, etc.)
  const {
    showCreateModal,
    setShowCreateModal,
    currentPage,
    showFilters,
    setShowFilters,
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    resetPagination,
  } = useAdminReservationState(itemsPerPage);

  // Hook para filtros
  const {
    filters,
    localCode,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startCalendarOpen,
    setStartCalendarOpen,
    endCalendarOpen,
    setEndCalendarOpen,
    handleFilterChange,
    handleDateChange,
    clearAllFilters,
  } = useAdminReservationFilters({
    startDate: "",
    endDate: "",
    vehicleType: "all",
    status: "all",
    code: "",
  });

  // Hook de autenticación
  const { token, isAuthenticated, isLoading, handleAuthError } =
    useAdminDashboardAuth();

  // Obtener tipos de vehículos
  const { data: vehicleTypes = [], isLoading: loadingVehicleTypes } = useQuery({
    queryKey: ["vehicleTypes"],
    queryFn: getVehicleTypes,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 25 * 60 * 60 * 1000, // Cache
  });

  const {
    data: reservationsResponse,
    isFetching,
    isError,
    refetch,
    error: GetReservationError,
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
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // Paginacion = 1 cuando se elige algun filtro
  useEffect(() => {
    resetPagination();
  }, [filters]);

  // Mutación para cancelar reserva
  const cancelMutation = useMutation({
    mutationFn: async ({
      reservation,
      refund,
    }: {
      reservation: ReservationDashboard;
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
    },
    onError: (error: any) => {
      handleAuthError(error);
      toast.error(`Errore nella cancellazione: ${error.message}`);
    },
  });


  useEffect(() => {
    if (isError) {
      if (GetReservationError?.message?.includes("401")) {
        handleAuthError(GetReservationError);
        return;
      } else {
        toast.error(`Errore : ${GetReservationError.message}`);
      }
    }
  }, [isError, GetReservationError  , handleAuthError]);

  // Extraer datos de la nueva estructura de respuesta
  const reservations = reservationsResponse?.reservations || [];
  const totalReservations = reservationsResponse?.total || 0;
  const totalPages = Math.ceil(totalReservations / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleCancelReservation = (
    reservation: ReservationDashboard,
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

  if (isFetching || cancelMutation.isPending || isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-black/90">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-b from-black to-black/90 relative">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 sm:w-96 sm:h-96 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="absolute top-2/3 left-2/3 w-24 h-24 sm:w-48 sm:h-48 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
      <div className="flex justify-between items-center mb-6 " >
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
        localCode={localCode}
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

      {/* Pagination o mensaje de no resultados */}
      {reservations.length > 0 && totalReservations > 0 ? (
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
      ) : (
        <div className="mt-6 text-center">
          <span className="text-muted-foreground text-sm">
            Nessuna prenotazione trovata per i filtri selezionati.
          </span>
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
