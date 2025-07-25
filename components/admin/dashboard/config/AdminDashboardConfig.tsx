"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { getAdminVehicles } from "@/lib/admin/dashboard/config/getAdminConfig";
import { putAdminConfig } from "@/lib/admin/dashboard/config/putAdminConfig";
import { toast } from "sonner";
import Wheel from "@/components/ui/wheel";
import { VehicleConfig } from "@/types/reservation";
import { useAdminConfig } from "@/hooks/admin/dashboard/config/useAdminConfig";

export default function AdminDashboardConfig() {
  const t = useTranslations("Admin.config");
  const router = useRouter();
  // Custom hook para states y handlers
  const {
    editingType,
    editForm,
    handleEdit,
    handleSave,
    handleCancel,
    handleEditFormChange,
    handleEditFormPriceChange,
    setEditingType,
    setEditForm,
  } = useAdminConfig();

  // Token state y useEffect
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("admin_token") || "");
    }
  }, []);

  // React Query hooks
  const queryClient = useQueryClient();
  const {
    data: configs,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminVehicles"],
    queryFn: () => getAdminVehicles(token),
    enabled: !!token,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async (form: VehicleConfig) => {
      return putAdminConfig(token || "", form.vehicle_type, {
        spaces: form.spaces,
        prices: form.prices,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVehicles"] });
      setEditingType(null);
      setEditForm(null);
      toast.success(t("successMessage"));
    },
    onError: (error: any) => {
      toast.error(`${t("errorUpdating")}: ${error.message}`);
    },
  });

  useEffect(() => {
    if (isError && error?.message?.includes("401")) {
      toast.error(t("sessionExpired"));
      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
    }
  }, [isError, error, t, router]);

  if (isFetching) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Wheel />
      </div>
    );
  }

  return (
    <div className="p-6 ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {configs &&
          configs.map((config: VehicleConfig) => (
            <Card key={config.vehicle_type} className="relative ">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="capitalize text-primary">
                      {config.vehicle_type}
                    </CardTitle>
                  </div>
                  {editingType !== config.vehicle_type && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEdit(config)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingType === config.vehicle_type && editForm ? (
                  <>
                    {/* Modo edicion */}
                    <div>
                      <Label htmlFor={`spaces-${config.vehicle_type}`}>
                        {t("availableSpaces")}
                      </Label>
                      <Input
                        id={`spaces-${config.vehicle_type}`}
                        type="number"
                        value={editForm.spaces}
                        onChange={(e) =>
                          handleEditFormChange(
                            "spaces",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>{t("pricingPerTimeUnit")}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label
                            htmlFor={`hour-${config.vehicle_type}`}
                            className="text-xs"
                          >
                            {t("hour")}
                          </Label>
                          <Input
                            id={`hour-${config.vehicle_type}`}
                            type="number"
                            step="0.01"
                            value={editForm.prices.hour}
                            onChange={(e) =>
                              handleEditFormPriceChange(
                                "hour",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`daily-${config.vehicle_type}`}
                            className="text-xs"
                          >
                            {t("daily")}
                          </Label>
                          <Input
                            id={`daily-${config.vehicle_type}`}
                            type="number"
                            step="0.01"
                            value={editForm.prices.daily}
                            onChange={(e) =>
                              handleEditFormPriceChange(
                                "daily",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`weekly-${config.vehicle_type}`}
                            className="text-xs"
                          >
                            {t("weekly")}
                          </Label>
                          <Input
                            id={`weekly-${config.vehicle_type}`}
                            type="number"
                            step="0.01"
                            value={editForm.prices.weekly}
                            onChange={(e) =>
                              handleEditFormPriceChange(
                                "weekly",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`monthly-${config.vehicle_type}`}
                            className="text-xs"
                          >
                            {t("monthly")}
                          </Label>
                          <Input
                            id={`monthly-${config.vehicle_type}`}
                            type="number"
                            step="0.01"
                            value={editForm.prices.monthly}
                            onChange={(e) =>
                              handleEditFormPriceChange(
                                "monthly",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        onClick={() => handleSave(mutation)}
                        size="sm"
                        className="flex-1"
                        disabled={mutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {mutation.isPending ? t("saving") : t("save")}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        disabled={mutation.isPending}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t("cancel")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Modo vista */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t("availableSpaces")}
                      </span>
                      <Badge variant="outline" className="text-lg font-bold">
                        {config.spaces}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="mb-1 font-medium text-sm text-muted-foreground">
                        {t("pricingPerTimeUnit")}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                          <span>{t("hour").replace(" (€)", "")}</span>
                          <span className="text-sm font-medium text-primary ml-4">
                            €{config.prices.hour}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                          <span>{t("daily").replace(" (€)", "")}</span>
                          <span className="text-sm font-medium text-primary ml-4">
                            €{config.prices.daily}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                          <span>{t("weekly").replace(" (€)", "")}</span>
                          <span className="text-sm font-medium text-primary ml-4">
                            €{config.prices.weekly}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                          <span>{t("monthly").replace(" (€)", "")}</span>
                          <span className="text-sm font-medium text-primary ml-4">
                            €{config.prices.monthly}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
