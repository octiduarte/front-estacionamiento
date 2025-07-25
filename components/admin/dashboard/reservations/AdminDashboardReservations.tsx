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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { convertUTCToItaly } from "@/lib/italy-time";
import { Reservation } from "@/types/reservation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function AdminDashboardReservations() {
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
    data: reservationsResponse = [],
    isLoading,
    isError,
    refetch,
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

  // Extraer reservas del response (el backend devuelve un array directo)
  const reservations = Array.isArray(reservationsResponse) ? reservationsResponse : [];
  
  // Como no tenemos el total del backend, calculamos si hay más páginas
  // Si recibimos exactamente itemsPerPage registros, asumimos que hay más páginas
  const hasMorePages = reservations.length === itemsPerPage;
  const hasNextPage = hasMorePages;
  const hasPreviousPage = currentPage > 1;
  
  // Para mostrar el total, usamos una estimación
  const estimatedMinTotal = (currentPage - 1) * itemsPerPage + reservations.length;
  const currentReservations = reservations;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  // Función para generar números de página (simplificada sin conocer el total)
  const generatePageNumbers = () => {
    const pages = [];
    
    // Solo mostramos las páginas cercanas a la actual
    const start = Math.max(1, currentPage - 2);
    const end = currentPage + 2;
    
    // Siempre mostrar página 1 si no está incluida
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("ellipsis");
    }
    
    // Páginas cercanas a la actual
    for (let i = start; i <= end; i++) {
      if (i >= 1) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    // TODO: Implementar cancelación real de reserva
    console.log("Canceling reservation:", reservation.code);
    // Refetch para actualizar la lista
    refetch();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active:
        "bg-green-900 text-green-200",
      pending:
        "bg-yellow-900 text-yellow-200",
      canceled: "bg-destructive/20 text-destructive-foreground",
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
        <Button
          onClick={() => setShowCreateModal(true)}
          size="sm"
        >
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
              <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !startDate && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yy") : "Pick a date"}
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
              <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Start Time </TableHead>
                  <TableHead>End Time </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReservations.map((reservation: Reservation) => (
                  <TableRow key={reservation.code}>
                    <TableCell className="font-medium">
                      {reservation.code}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {reservation.user_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.user_email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.user_phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {reservation.vehicle_type_name.toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.vehicle_plate}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.vehicle_model}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {reservation.payment_method_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.payment_status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-green-600">
                          €
                          {(
                            reservation.total_price ||
                            0
                          ).toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          EUR
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-0 md:p-4">
                      {(() => {
                        const startTimeItaly = convertUTCToItaly(reservation.start_time);
                        return (
                          <div>
                            <div className="text-xs md:text-sm font-medium mr-1 md:mb-0">
                              {startTimeItaly.date} 
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground">
                              {startTimeItaly.time}
                            </div>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="p-0 md:p-4">
                      {(() => {
                        const endTimeItaly = convertUTCToItaly(reservation.end_time);
                        return (
                          <div>
                            <div className="text-xs md:text-sm font-medium ml-1 md:mb-0">
                            {endTimeItaly.date}
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground">
                              {endTimeItaly.time}
                            </div>
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {reservation.status !== "canceled" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelReservation(reservation)}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {reservations.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {(currentPage - 1) * itemsPerPage + reservations.length} of {estimatedMinTotal}+ reservations
            </div>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreviousPage();
                  }}
                  className={
                    !hasPreviousPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                  className={
                    !hasNextPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
