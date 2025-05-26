"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { getPrices, Price } from "@/lib/landing/getPrices"

export default function PricingTable() {
  const t = useTranslations()
  const [duration, setDuration] = useState("hour")
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getPrices()
      .then(setPrices)
      .catch(() => setError("Error fetching prices"))
      .finally(() => setLoading(false))
  }, [])

  const durations = ["hour", "daily", "weekly", "monthly"]
  const vehicleTypes = [
    { key: "motorcycle", label: t("PricingTable.reservation.motorcycle") },
    { key: "car", label: t("PricingTable.reservation.compact_car") },
    { key: "suv", label: t("PricingTable.reservation.suv_large_vehicle") },
  ]

  function getPrice(vehicle_type: string, reservation_time: string) {
    const found = prices.find(
      (p) => p.vehicle_type === vehicle_type && p.reservation_time === reservation_time
    )
    return found ? `$${found.price}` : "-"
  }

  if (loading) return <div className="text-center py-8">{t("common.loading")}</div>
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="hour" className="w-full" onValueChange={setDuration}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="hour">{t("PricingTable.pricing.hourly")}</TabsTrigger>
          <TabsTrigger value="daily">{t("PricingTable.pricing.daily")}</TabsTrigger>
          <TabsTrigger value="weekly">{t("PricingTable.pricing.weekly")}</TabsTrigger>
          <TabsTrigger value="monthly">{t("PricingTable.pricing.monthly")}</TabsTrigger>
        </TabsList>
        {durations.map((d) => (
          <TabsContent key={d} value={d} className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              {vehicleTypes.map((v, index) => (
                <Card key={v.key} className={`${index === 1 ? "border-primary shadow-lg" : ""} flex flex-col`}>
                  <CardHeader>
                    <CardTitle>{v.label}</CardTitle>
                    <CardDescription>{d.charAt(0).toUpperCase() + d.slice(1)} rate</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-4xl font-bold mb-4">{getPrice(v.key, d)}</div>
                    <p className="text-sm text-muted-foreground mb-6">Per {d}</p>
                    {/* Features can be static or mapped if needed */}
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/reservations/new?type=${v.key}`}
                      className="w-full"
                    >
                      <Button className="w-full">{t("common.reserve_now")}</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
