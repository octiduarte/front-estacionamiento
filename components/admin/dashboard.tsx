"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Pencil, X, User, LogOut } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"


// Mock reservations data for demo purposes
const mockReservations = [
  {
    id: 1,
    code: "RES-123456",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    licensePlate: "ABC123",
    vehicleModel: "Toyota Corolla",
    vehicleType: "car",
    entryDate: new Date("2023-06-15T10:00:00"),
    exitDate: new Date("2023-06-17T14:00:00"),
    status: "active",
    totalAmount: 240,
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    code: "RES-234567",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    licensePlate: "XYZ789",
    vehicleModel: "Honda Civic",
    vehicleType: "car",
    entryDate: new Date("2023-06-18T09:00:00"),
    exitDate: new Date("2023-06-19T17:00:00"),
    status: "active",
    totalAmount: 160,
    paymentMethod: "On-site",
  },
]

// Mock vehicles data for spaces management only
const mockVehicles = [
  {
    id: 1,
    name: "car",
    spaces: 50,
  },
  {
    id: 2,
    name: "motorcycle",
    spaces: 20,
  },
];

export function AdminDashboard() {
  const t = useTranslations("Admin.Dashboard")
  const router = useRouter();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("reservations")
  const [reservations, setReservations] = useState(mockReservations)
  const [filteredReservations, setFilteredReservations] = useState(mockReservations)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [vehicleType, setVehicleType] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [selectedReservation, setSelectedReservation] = useState<(typeof mockReservations)[0] | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [editEntryDate, setEditEntryDate] = useState<Date | undefined>(undefined)
  const [editExitDate, setEditExitDate] = useState<Date | undefined>(undefined)
  const [successMessage, setSuccessMessage] = useState("")
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    spaces: 0,
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isEditVehicleDialogOpen, setIsEditVehicleDialogOpen] = useState(false);
  const [editSpaces, setEditSpaces] = useState(0);

  const applyFilters = () => {
    let filtered = [...reservations]

    if (startDate) {
      filtered = filtered.filter((res) => res.entryDate >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((res) => res.exitDate <= endDate)
    }

    if (vehicleType !== "all") {
      filtered = filtered.filter((res) => res.vehicleType === vehicleType)
    }

    if (status !== "all") {
      filtered = filtered.filter((res) => res.status === status)
    }

    setFilteredReservations(filtered)
  }

  const resetFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setVehicleType("all")
    setStatus("all")
    setFilteredReservations(reservations)
  }

  const openEditDialog = (reservation: (typeof mockReservations)[0]) => {
    setSelectedReservation(reservation)
    setEditEntryDate(reservation.entryDate)
    setEditExitDate(reservation.exitDate)
    setIsEditDialogOpen(true)
  }

  const openCancelDialog = (reservation: (typeof mockReservations)[0]) => {
    setSelectedReservation(reservation)
    setIsCancelDialogOpen(true)
  }

  const updateReservation = () => {
    if (selectedReservation && editEntryDate && editExitDate) {
      const updatedReservations = reservations.map((res) =>
        res.id === selectedReservation.id ? { ...res, entryDate: editEntryDate, exitDate: editExitDate } : res,
      )

      setReservations(updatedReservations)
      setFilteredReservations(updatedReservations)
      setIsEditDialogOpen(false)
      setSuccessMessage(t("success.reservationUpdated"))

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }
  }

  const cancelReservation = () => {
    if (selectedReservation) {
      const updatedReservations = reservations.map((res) =>
        res.id === selectedReservation.id ? { ...res, status: "cancelled" } : res,
      )

      setReservations(updatedReservations)
      setFilteredReservations(updatedReservations)
      setIsCancelDialogOpen(false)
      setSuccessMessage(t("success.reservationCancelled"))

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    }
  }

  // Removed vehicles tab from tabs array
  const tabs = [
    { value: "reservations", label: t("tabs.reservations") },
    { value: "spaces", label: t("spaces.title") },
  ];

  const logout = () => {
    // Limpia la cookie de autenticación si la usas
    document.cookie = "admin-auth=; Max-Age=0; path=/";
    // Redirige al login
    router.replace(`/${locale}/admin/login`);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={logout}>
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>

        {successMessage && (
          <Alert className="bg-green-50 text-green-700 border-green-200">
            <AlertTitle>{t("success.success")}</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="mb-4 overflow-x-auto whitespace-nowrap flex gap-2 sm:grid sm:grid-cols-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="min-w-[140px] flex-shrink-0"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>{t("filters.title")}</CardTitle>
                <CardDescription>{t("filters.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>{t("filters.dateRangeStart")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>{t("filters.selectDate")}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("filters.dateRangeEnd")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>{t("filters.selectDate")}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">{t("filters.vehicleType")}</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger id="vehicleType">
                        <SelectValue placeholder={t("filters.allVehicleTypes")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("filters.all")}</SelectItem>
                        <SelectItem value="car">{t("filters.car")}</SelectItem>
                        <SelectItem value="motorcycle">{t("filters.motorcycle")}</SelectItem>
                        <SelectItem value="pickup">{t("filters.pickupTruck")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">{t("filters.status")}</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder={t("filters.allStatuses")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("filters.all")}</SelectItem>
                        <SelectItem value="active">{t("filters.active")}</SelectItem>
                        <SelectItem value="cancelled">{t("filters.cancelled")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={resetFilters}>
                    {t("filters.reset")}
                  </Button>
                  <Button onClick={applyFilters}>{t("filters.applyButton")}</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("reservations.title")}</CardTitle>
                <CardDescription>{t("reservations.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.code")}</TableHead>
                      <TableHead>{t("table.name")}</TableHead>
                      <TableHead>{t("table.vehicle")}</TableHead>
                      <TableHead>{t("table.dates")}</TableHead>
                      <TableHead>{t("table.paymentMethod")}</TableHead>
                      <TableHead>{t("table.totalAmount")}</TableHead>
                      <TableHead>{t("table.status")}</TableHead>
                      <TableHead className="text-right">{t("table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          {t("noReservations")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-medium">{reservation.code}</TableCell>
                          <TableCell>{`${reservation.firstName} ${reservation.lastName}`}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="capitalize">{reservation.vehicleType}</span>
                              <span className="text-xs text-muted-foreground">{reservation.licensePlate}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{format(reservation.entryDate, "PPP")}</span>
                              <span className="text-xs text-muted-foreground">
                                {format(reservation.entryDate, "HH:mm")} - {format(reservation.exitDate, "HH:mm")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{reservation.paymentMethod || t("dashboard.table.onSite")}</TableCell>
                          <TableCell>
                            <span className="font-medium">${reservation.totalAmount.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${reservation.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                                }`}
                            >
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {reservation.status === "active" && (
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(reservation)}>
                                  <Pencil className="h-4 w-4 mr-1" />
                                  {t("table.edit")}
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => openCancelDialog(reservation)}>
                                  <X className="h-4 w-4 mr-1" />
                                  {t("table.cancel")}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spaces">
            <Card>
              <CardHeader>
                <CardTitle>{t("spaces.title")}</CardTitle>
                <CardDescription>{t("spaces.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("spaces.table.name")}</TableHead>
                      <TableHead>{t("spaces.table.spaces")}</TableHead>
                      <TableHead>{t("spaces.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map(vehicle => (
                      <TableRow key={vehicle.id}>
                        <TableCell>{t(`vehicles.types.${vehicle.name}`)}</TableCell>
                        <TableCell>
                          <input
                            type="number"
                            min={0}
                            value={vehicle.spaces}
                            onChange={e => {
                              const updated = vehicles.map(v => v.id === vehicle.id ? { ...v, spaces: Number(e.target.value) } : v)
                              setVehicles(updated)
                            }}
                            className="w-20 border rounded px-2 py-1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-start space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Logic to open an edit dialog for the vehicle
                                console.log(`Edit vehicle: ${vehicle.name}`);
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              {t("table.edit")}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setVehicles(vehicles.filter(v => v.id !== vehicle.id))}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {t("table.remove")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <input
                          type="text"
                          placeholder={t("spaces.table.name")}
                          value={newVehicle.name}
                          onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })}
                          className="w-32 border rounded px-2 py-1"
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          min={0}
                          placeholder={t("spaces.table.spaces")}
                          value={newVehicle.spaces}
                          onChange={e => setNewVehicle({ ...newVehicle, spaces: Number(e.target.value) })}
                          className="w-20 border rounded px-2 py-1"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (newVehicle.name && newVehicle.spaces > 0) {
                              setVehicles([...vehicles, { ...newVehicle, id: Date.now() }])
                              setNewVehicle({ name: "", spaces: 0 })
                            }
                          }}
                        >
                          {t("spaces.table.add")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("editDialog.title")}</DialogTitle>
              <DialogDescription>{t("editDialog.description")}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>{t("editDialog.entryDateTime")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editEntryDate ? (
                        format(editEntryDate, "PPP HH:mm")
                      ) : (
                        <span>{t("editDialog.selectDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={editEntryDate} onSelect={setEditEntryDate} initialFocus />
                    <div className="p-3 border-t">
                      <Select
                        onValueChange={(value) => {
                          if (editEntryDate) {
                            const newDate = new Date(editEntryDate)
                            const [hours, minutes] = value.split(":").map(Number)
                            newDate.setHours(hours, minutes)
                            setEditEntryDate(newDate)
                          }
                        }}
                        defaultValue={editEntryDate ? `${editEntryDate.getHours()}:00` : "12:00"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("editDialog.selectTime")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={`${i}:00`}>
                              {`${i}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t("editDialog.exitDateTime")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editExitDate ? (
                        format(editExitDate, "PPP HH:mm")
                      ) : (
                        <span>{t("editDialog.selectDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={editExitDate} onSelect={setEditExitDate} initialFocus />
                    <div className="p-3 border-t">
                      <Select
                        onValueChange={(value) => {
                          if (editExitDate) {
                            const newDate = new Date(editExitDate)
                            const [hours, minutes] = value.split(":").map(Number)
                            newDate.setHours(hours, minutes)
                            setEditExitDate(newDate)
                          }
                        }}
                        defaultValue={editExitDate ? `${editExitDate.getHours()}:00` : "12:00"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("editDialog.selectTime")} />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={`${i}:00`}>
                              {`${i}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                {t("editDialog.cancelButton")}
              </Button>
              <Button onClick={updateReservation}>{t("editDialog.updateButton")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("cancelDialog.title")}</DialogTitle>
              <DialogDescription>{t("cancelDialog.description")}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                {t("cancelDialog.backButton")}
              </Button>
              <Button variant="destructive" onClick={cancelReservation}>
                {t("cancelDialog.cancelButton")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}