import { useState } from "react";
import { format } from "date-fns";

const useAdminReservationState = (itemsPerPage: number) => {
  // Estados
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    vehicleType: "all",
    status: "all",
    code: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Calendarios
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  // Filtros mobile
  const [showFilters, setShowFilters] = useState(false);

  // Handlers
  const handlePageChange = (page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = (totalPages: number) =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  const handleDateChange = (
    key: "startDate" | "endDate",
    date: Date | undefined,
    setDate: (date: Date | undefined) => void,
    setCalendarOpen: (open: boolean) => void
  ) => {
    setDate(date);
    const dateString = date ? format(date, "yyyy-MM-dd") : "";
    setFilters((prev) => ({ ...prev, [key]: dateString }));
    setCurrentPage(1);
    setCalendarOpen(false);
  };
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

  return {
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
  };
};

export { useAdminReservationState };
