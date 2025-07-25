"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, CalendarIcon, Filter, X } from "lucide-react";
import { CreateReservationModal } from "@/components/admin/dashboard/reservations/CreateReservationModal";
import { getAdminReservations } from "@/lib/admin/dashboard/reservations/getAdminReservations";
import Wheel from "@/components/ui/wheel";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Reservation } from "@/types/reservation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PaginationDashboardReservations } from "./PaginationDashboardReservations";
import { TableDashboardReservations } from "./TableDashboardReservations";

export default function AdminDashboardReservations() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    vehicleType: "all",
    status: "all",
    code: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados para los calendarios
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Estado para mostrar/ocultar filtros en mobile
  const [showFilters, setShowFilters] = useState(false);

  // Token state para autenticación
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);

  // Fetch de reservas del backend con filtros
  const {
    data: reservationsResponse,
    isLoading,
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Resetear a la primera página cuando cambien los filtros
  };

  // Funciones para manejar cambios en las fechas del calendario
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    setFilters((prev) => ({ ...prev, startDate: dateString }));
    setCurrentPage(1);
    setStartCalendarOpen(false);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    setFilters((prev) => ({ ...prev, endDate: dateString }));
    setCurrentPage(1);
    setEndCalendarOpen(false);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      vehicleType: "all",
      status: "all",
      code: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    // TODO: Implementar cancelación real de reserva
    console.log("Canceling reservation:", reservation.code);
    // Refetch para actualizar la lista
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-900 text-green-200",
      pending: "bg-yellow-900 text-yellow-200",
      canceled: "bg-destructive/20 text-destructive",
      finished: "text-blue-200 bg-blue-900 ",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  // Estados de carga
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservation Management</h1>
        <Button onClick={() => setShowCreateModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Reservation
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {/* Botón toggle solo visible en mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`${showFilters ? "block" : "hidden"} md:block`}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Popover
                  open={startCalendarOpen}
                  onOpenChange={setStartCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !startDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "dd/MM/yy")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Popover
                  open={endCalendarOpen}
                  onOpenChange={setEndCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !endDate && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateChange}
                      initialFocus
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={filters.vehicleType}
                  onValueChange={(value) =>
                    handleFilterChange("vehicleType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="code">Reservation Code</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="code"
                    placeholder="Search code..."
                    className="pl-8"
                    value={filters.code}
                    onChange={(e) => handleFilterChange("code", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Table */}
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
            onPageChange={handlePageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </div>
      )}


      <CreateReservationModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onReservationCreated={(newReservation) => {
          // Refetch data después de crear nueva reserva
          refetch();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
