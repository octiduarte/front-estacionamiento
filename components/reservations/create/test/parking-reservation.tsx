"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon, Car, Truck, Bike } from "lucide-react"
import { format, addHours, isBefore, isAfter, startOfDay } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Generar horas válidas (solo terminadas en :00)
const generateHours = () => {
  const hours = []
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, "0") + ":00"
    hours.push(hour)
  }
  return hours
}

// Agregar esta función después de generateHours() y antes de AVAILABLE_HOURS
const getAvailableExitHours = (entryDate: Date | undefined, entryTime: string, exitDate: Date | undefined) => {
  if (!entryDate || !entryTime || !exitDate) return AVAILABLE_HOURS

  // Si es la misma fecha, filtrar horas menores o iguales a la hora de entrada
  if (entryDate.toDateString() === exitDate.toDateString()) {
    const entryHour = Number.parseInt(entryTime.split(":")[0])
    return AVAILABLE_HOURS.filter((hour) => {
      const hourNumber = Number.parseInt(hour.split(":")[0])
      return hourNumber > entryHour
    })
  }

  // Si es una fecha posterior, todas las horas están disponibles
  return AVAILABLE_HOURS
}

const AVAILABLE_HOURS = generateHours()

const VEHICLE_TYPES = [
  { id: "auto", label: "Auto", icon: Car },
  { id: "camioneta", label: "Camioneta", icon: Truck },
  { id: "moto", label: "Moto", icon: Bike },
]

export default function ParkingReservation() {
  const [vehicleType, setVehicleType] = useState("")
  const [entryDate, setEntryDate] = useState<Date>()
  const [entryTime, setEntryTime] = useState("")
  const [exitDate, setExitDate] = useState<Date>()
  const [exitTime, setExitTime] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  // Validaciones
  useEffect(() => {
    const newErrors: string[] = []

    if (entryDate && entryTime && exitDate && exitTime) {
      // Crear objetos Date completos para comparación
      const [entryHour, entryMinute] = entryTime.split(":").map(Number)
      const [exitHour, exitMinute] = exitTime.split(":").map(Number)

      const entryDateTime = new Date(entryDate)
      entryDateTime.setHours(entryHour, entryMinute, 0, 0)

      const exitDateTime = new Date(exitDate)
      exitDateTime.setHours(exitHour, exitMinute, 0, 0)

      // Validar que la fecha/hora de entrada no sea en el pasado
      const now = new Date()
      if (isBefore(entryDateTime, now)) {
        newErrors.push("La fecha y hora de entrada no puede ser en el pasado")
      }

      // Validar que la salida sea después de la entrada
      if (!isAfter(exitDateTime, entryDateTime)) {
        newErrors.push("La fecha y hora de salida debe ser posterior a la de entrada")
      }

      // Validar mínimo una hora de diferencia
      const oneHourLater = addHours(entryDateTime, 1)
      if (isBefore(exitDateTime, oneHourLater)) {
        newErrors.push("La reserva debe ser de mínimo una hora")
      }
    }

    setErrors(newErrors)
  }, [entryDate, entryTime, exitDate, exitTime])

  // Agregar este useEffect después del useEffect de validaciones existente
  useEffect(() => {
    if (entryDate && entryTime) {
      // Auto-seleccionar fecha de salida si no está seleccionada
      if (!exitDate) {
        setExitDate(entryDate)
      }

      // Si la fecha de salida es la misma que la de entrada, ajustar la hora de salida
      if (exitDate && entryDate.toDateString() === exitDate.toDateString()) {
        const entryHour = Number.parseInt(entryTime.split(":")[0])
        const currentExitHour = exitTime ? Number.parseInt(exitTime.split(":")[0]) : -1

        // Si la hora de salida actual es menor o igual a la de entrada, seleccionar la siguiente hora
        if (currentExitHour <= entryHour) {
          const nextHour = entryHour + 1
          if (nextHour < 24) {
            setExitTime(nextHour.toString().padStart(2, "0") + ":00")
          } else {
            // Si no hay más horas en el día, cambiar al día siguiente a las 00:00
            const nextDay = new Date(entryDate)
            nextDay.setDate(nextDay.getDate() + 1)
            setExitDate(nextDay)
            setExitTime("00:00")
          }
        }
      }
    }
  }, [entryDate, entryTime, exitDate, exitTime])

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault()

    if (!vehicleType || !entryDate || !entryTime || !exitDate || !exitTime) {
      setErrors(["Por favor complete todos los campos"])
      return
    }

    if (errors.length > 0) {
      return
    }

    // Aquí iría la lógica para verificar disponibilidad
    console.log("Verificando disponibilidad para:", {
      vehicleType,
      entryDate: format(entryDate, "yyyy-MM-dd"),
      entryTime,
      exitDate: format(exitDate, "yyyy-MM-dd"),
      exitTime,
    })

    // Simular verificación de disponibilidad
    const isAvailable = Math.random() > 0.3 // 70% de probabilidad de estar disponible

    if (isAvailable) {
      alert("¡Espacio disponible! Puede proceder con la reserva.")
    } else {
      alert(
        "Lo sentimos, no hay espacios disponibles para las fechas y horas seleccionadas. Por favor, intente con otros horarios.",
      )
    }
  }

  const isFormValid = vehicleType && entryDate && entryTime && exitDate && exitTime && errors.length === 0

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reserva de Estacionamiento</CardTitle>
        <CardDescription>Complete los datos para reservar su espacio de estacionamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCheckAvailability} className="space-y-6">
          {/* Tipo de Vehículo */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de Vehículo</Label>
            <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
              <div className="grid grid-cols-3 gap-4">
                {VEHICLE_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <div key={type.id}>
                      <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                      <Label
                        htmlFor={type.id}
                        className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Icon className="mb-2 h-6 w-6" />
                        {type.label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Fecha y Hora de Entrada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Fecha de Entrada</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !entryDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {entryDate ? format(entryDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={entryDate}
                    onSelect={setEntryDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Hora de Entrada</Label>
              <Select value={entryTime} onValueChange={setEntryTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_HOURS.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fecha y Hora de Salida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Fecha de Salida</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !exitDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {exitDate ? format(exitDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={exitDate}
                    onSelect={setExitDate}
                    disabled={(date) => {
                      if (!entryDate) return isBefore(date, startOfDay(new Date()))
                      return isBefore(date, entryDate)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Hora de Salida</Label>
              <Select value={exitTime} onValueChange={setExitTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar hora" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableExitHours(entryDate, entryTime, exitDate).map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Errores */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Alerta de ajuste automático */}
          {entryDate && entryTime && exitDate && exitTime && errors.length === 0 && (
            <Alert>
              <AlertDescription>
                💡 La fecha y hora de salida se ajustaron automáticamente para cumplir con el mínimo de una hora de
                reserva.
              </AlertDescription>
            </Alert>
          )}

          {/* Resumen de la reserva */}
          {entryDate && entryTime && exitDate && exitTime && errors.length === 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Resumen de la Reserva</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Vehículo:</strong> {VEHICLE_TYPES.find((v) => v.id === vehicleType)?.label}
                </p>
                <p>
                  <strong>Entrada:</strong> {format(entryDate, "PPP", { locale: es })} a las {entryTime}
                </p>
                <p>
                  <strong>Salida:</strong> {format(exitDate, "PPP", { locale: es })} a las {exitTime}
                </p>
              </div>
            </div>
          )}

          {/* Botón de envío */}
          <Button type="submit" className="w-full" disabled={!isFormValid}>
            Verificar Disponibilidad
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
