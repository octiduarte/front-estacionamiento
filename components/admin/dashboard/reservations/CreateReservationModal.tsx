"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreateReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReservationCreated: (reservation: any) => void
}

export function CreateReservationModal({ open, onOpenChange, onReservationCreated }: CreateReservationModalProps) {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    vehicle_type_name: "",
    vehicle_plate: "",
    vehicle_model: "",
    start_time: "",
    end_time: "",
  })

  const [calculatedAmount, setCalculatedAmount] = useState<number>(0)

  const calculateAmount = () => {
    if (!formData.start_time || !formData.end_time || !formData.vehicle_type_name) {
      setCalculatedAmount(0)
      return
    }

    const start = new Date(formData.start_time)
    const end = new Date(formData.end_time)
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60))

    // Mock pricing based on vehicle type
    const pricing = {
      car: 4,
      suv: 6,
      motorcycle: 2,
    }

    const hourlyRate = pricing[formData.vehicle_type_name as keyof typeof pricing] || 4
    setCalculatedAmount(hours * hourlyRate)
  }

  // Add useEffect to recalculate when form data changes
  React.useEffect(() => {
    calculateAmount()
  }, [formData.start_time, formData.end_time, formData.vehicle_type_name])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Create new reservation
    const newReservation = {
      code: `RES${Date.now()}`,
      status: "pending" as const,
      ...formData,
      payment_method_name: "Onsite",
      payment_status: "pending",
      created_at: new Date().toISOString(),
      total_amount: calculatedAmount,
      currency: "USD",
    }

    onReservationCreated(newReservation)

    // Reset form
    setFormData({
      user_name: "",
      user_email: "",
      user_phone: "",
      vehicle_type_name: "",
      vehicle_plate: "",
      vehicle_model: "",
      start_time: "",
      end_time: "",
    })
    setCalculatedAmount(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Reservation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user_name">Full Name</Label>
                  <Input
                    id="user_name"
                    required
                    value={formData.user_name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, user_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="user_email">Email</Label>
                  <Input
                    id="user_email"
                    type="email"
                    required
                    value={formData.user_email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, user_email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="user_phone">Phone Number</Label>
                <Input
                  id="user_phone"
                  required
                  value={formData.user_phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, user_phone: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicle_type_name">Vehicle Type</Label>
                  <Select
                    value={formData.vehicle_type_name}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicle_type_name: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vehicle_plate">License Plate</Label>
                  <Input
                    id="vehicle_plate"
                    required
                    value={formData.vehicle_plate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle_plate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="vehicle_model">Vehicle Model</Label>
                <Input
                  id="vehicle_model"
                  required
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData((prev) => ({ ...prev, vehicle_model: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reservation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>

              {calculatedAmount > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">Estimated Total:</span>
                    <span className="text-lg font-bold text-blue-900">${calculatedAmount.toFixed(2)} USD</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Payment will be handled onsite</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Reservation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
