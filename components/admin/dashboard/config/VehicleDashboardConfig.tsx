import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import { VehicleConfig } from "@/types/reservation";

interface VehicleDashboardConfigProps {
  config: VehicleConfig;
  editingType: string | null;
  editForm: VehicleConfig | null;
  handleEdit: (config: VehicleConfig) => void;
  handleSave: (mutation: any) => void;
  handleCancel: () => void;
  handleEditFormChange: (key: string, value: any) => void;
  handleEditFormPriceChange: (key: string, value: any) => void;
  mutation: any;
}

export function VehicleDashboardConfig({
  config,
  editingType,
  editForm,
  handleEdit,
  handleSave,
  handleCancel,
  handleEditFormChange,
  handleEditFormPriceChange,
  mutation,
}: VehicleDashboardConfigProps) {
  return (
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
            {/* Modo edición */}
            <div>
              <Label htmlFor={`spaces-${config.vehicle_type}`}>
                Posti Disponibili
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
              <Label>Prezzi per Unità di Tempo</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`hour-${config.vehicle_type}`} className="text-xs">
                    Ora
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
                  <Label htmlFor={`daily-${config.vehicle_type}`} className="text-xs">
                    Giornaliero
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
                  <Label htmlFor={`weekly-${config.vehicle_type}`} className="text-xs">
                    Settimanale
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
                  <Label htmlFor={`monthly-${config.vehicle_type}`} className="text-xs">
                    Mensile
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
                {mutation.isPending ? "Salvando..." : "Salva"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                disabled={mutation.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Annulla
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Modo vista */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Posti Disponibili
              </span>
              <Badge variant="outline" className="text-lg font-bold">
                {config.spaces}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="mb-1 font-medium text-sm text-muted-foreground">
                Prezzi per Unità di Tempo
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                  <span>Ora</span>
                  <span className="text-sm font-medium text-primary ml-4">
                    €{config.prices.hour}
                  </span>
                </div>
                <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                  <span>Giornaliero</span>
                  <span className="text-sm font-medium text-primary ml-4">
                    €{config.prices.daily}
                  </span>
                </div>
                <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                  <span>Settimanale</span>
                  <span className="text-sm font-medium text-primary ml-4">
                    €{config.prices.weekly}
                  </span>
                </div>
                <div className="flex items-center justify-between border border-input rounded px-2 py-1">
                  <span>Mensile</span>
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
  );
}
