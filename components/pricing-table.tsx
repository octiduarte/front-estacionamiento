"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

export default function PricingTable() {
  const t = useTranslations()
  const [duration, setDuration] = useState("hourly")

  const pricingData = {
    hourly: [
      {
        type: t("PricingTable.reservation.motorcycle"),
        price: "$2",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras")],
      },
      {
        type: t("PricingTable.reservation.compact_car"),
        price: "$3",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.easy_access_spots")],
      },
      {
        type: t("PricingTable.reservation.suv_large_vehicle"),
        price: "$4",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.wider_parking_spots")],
      },
    ],
    daily: [
      {
        type: t("PricingTable.reservation.motorcycle"),
        price: "$10",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.unlimited_in_out")],
      },
      {
        type: t("PricingTable.reservation.compact_car"),
        price: "$15",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.easy_access_spots"), t("PricingTable.features.unlimited_in_out")],
      },
      {
        type: t("PricingTable.reservation.suv_large_vehicle"),
        price: "$20",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.wider_parking_spots"), t("PricingTable.features.unlimited_in_out")],
      },
    ],
    weekly: [
      {
        type: t("PricingTable.reservation.motorcycle"),
        price: "$50",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.unlimited_in_out"), t("PricingTable.features.reserved_spot")],
      },
      {
        type: t("PricingTable.reservation.compact_car"),
        price: "$75",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.easy_access_spots"), t("PricingTable.features.unlimited_in_out"), t("PricingTable.features.reserved_spot")],
      },
      {
        type: t("PricingTable.reservation.suv_large_vehicle"),
        price: "$100",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.wider_parking_spots"), t("PricingTable.features.unlimited_in_out"), t("PricingTable.features.reserved_spot")],
      },
    ],
    monthly: [
      {
        type: t("PricingTable.reservation.motorcycle"),
        price: "$150",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.unlimited_in_out"), t("PricingTable.features.reserved_spot"), t("PricingTable.features.monthly_billing")],
      },
      {
        type: t("PricingTable.reservation.compact_car"),
        price: "$200",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.easy_access_spots"), t("PricingTable.features.unlimited_in_out"), t("PricingTable.features.reserved_spot"), t("PricingTable.features.monthly_billing")],
      },
      {
        type: t("PricingTable.reservation.suv_large_vehicle"),
        price: "$250",
        features: [t("PricingTable.features.covered_parking"), t("PricingTable.features.access_247"), t("PricingTable.features.security_cameras"), t("PricingTable.features.wider_parking_spots"), t("PricingTable.features.unlimited_in_out"), t("PricingTable.features.reserved_spot"), t("PricingTable.features.monthly_billing")],
      },
    ],
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="hourly" className="w-full" onValueChange={setDuration}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
          <TabsTrigger value="hourly">{t("PricingTable.pricing.hourly")}</TabsTrigger>
          <TabsTrigger value="daily">{t("PricingTable.pricing.daily")}</TabsTrigger>
          <TabsTrigger value="weekly">{t("PricingTable.pricing.weekly")}</TabsTrigger>
          <TabsTrigger value="monthly">{t("PricingTable.pricing.monthly")}</TabsTrigger>
        </TabsList>
        {Object.keys(pricingData).map((key) => (
          <TabsContent key={key} value={key} className="mt-8">
            <div className="grid gap-6 md:grid-cols-3">
              {pricingData[key as keyof typeof pricingData].map((plan, index) => (
                <Card key={index} className={`${index === 1 ? "border-primary shadow-lg" : ""} flex flex-col`}>
                  <CardHeader>
                    <CardTitle>{plan.type}</CardTitle>
                    <CardDescription>{key.charAt(0).toUpperCase() + key.slice(1)} rate</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="text-4xl font-bold mb-4">{plan.price}</div>
                    <p className="text-sm text-muted-foreground mb-6">Per {key.slice(0, -2) || key}</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/reservations/new?type=${plan.type.toLowerCase().replace(/ /g, "-")}`}
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
