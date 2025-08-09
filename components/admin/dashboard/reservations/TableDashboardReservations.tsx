import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getVehicleTypeItalian, getReservationStatusItalian, getPaymentMethodItalian, getPaymentStatusItalian } from "@/hooks/reservations/create/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { convertUTCToItaly } from "@/lib/italy-time";
import { ReservationDashboard } from "@/types/reservation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface TableDashboardReservationsProps {
  reservations: ReservationDashboard[];
  onCancelReservation: (reservation: ReservationDashboard, refund: boolean) => void;
  getStatusBadge: (status: string) => string;
}

export function TableDashboardReservations({
  reservations,
  onCancelReservation,
  getStatusBadge,
}: TableDashboardReservationsProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [refund, setRefund] = useState(false);

  return (
    <div className="overflow-x-auto ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Codice</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Stato</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Cliente</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Veicolo</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Pagamento</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Importo</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Inizio</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Fine</TableHead>
            <TableHead className="text-[10px] md:text-sm p-2 md:p-4">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation: ReservationDashboard) => (
            <TableRow key={reservation.code}>
              <TableCell className="font-medium text-[10px] md:text-sm p-2 md:p-4">{reservation.code}</TableCell>
              <TableCell className="p-2 md:p-4">
                <Badge className={getStatusBadge(reservation.status) + ' text-[10px] md:text-sm'}>
                  {getReservationStatusItalian(reservation.status)}
                </Badge>
              </TableCell>
              <TableCell className="p-2 md:p-4">
                <div>
                  <div className="font-medium text-[10px] md:text-sm">{reservation.user_name}</div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.user_email}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.user_phone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-2 md:p-4">
                <div>
                  <div className="font-medium text-[10px] md:text-sm">
                    {getVehicleTypeItalian(reservation.vehicle_type_name.toLowerCase())}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.vehicle_plate}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {reservation.vehicle_model}
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-2 md:p-4">
                <div>
                  <div className="font-medium text-[10px] md:text-sm">
                    {getPaymentMethodItalian(reservation.payment_method_name)}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">
                    {getPaymentStatusItalian(reservation.payment_status)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-2 md:p-4">
                <div>
                  <div className="font-medium text-green-600 text-[10px] md:text-sm">
                    €{(reservation.total_price || 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] md:text-sm text-muted-foreground">EUR</div>
                </div>
              </TableCell>
              <TableCell className="p-0 md:p-4">
                {(() => {
                  const startTimeItaly = convertUTCToItaly(
                    reservation.start_time
                  );
                  return (
                    <div>
                      <div className="text-[10px] md:text-sm font-medium ">
                        {startTimeItaly.date}
                      </div>
                      <div className="text-[10px] md:text-sm text-muted-foreground">
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
                      <div className="text-[10px] md:text-sm font-medium ">
                        {endTimeItaly.date}
                      </div>
                      <div className="text-[10px] md:text-sm text-muted-foreground">
                        {endTimeItaly.time}
                      </div>
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="p-2 md:p-4">
                {reservation.status == "active" && (
                  <AlertDialog
                    open={openDialog === reservation.code}
                    onOpenChange={(open) =>
                      setOpenDialog(open ? reservation.code : null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpenDialog(reservation.code)}
                      >
                        Annulla
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Conferma cancellazione
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Vuoi cancellare la prenotazione{" "}
                          <b>{reservation.code}</b>?<br />
                          Seleziona se vuoi rimborsare il cliente:
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {reservation.payment_method_name !== "onsite" && (
                        <div className="flex gap-4 my-4 items-center">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Switch
                              id={`refund-switch-${reservation.code}`}
                              checked={refund}
                              onCheckedChange={setRefund}
                            />
                            <span>{refund ? "Rimborsa" : "Non rimborsare"}</span>
                          </label>
                        </div>
                      )}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annulla</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            setOpenDialog(null);
                            onCancelReservation(reservation, refund);
                          }}
                          className="bg-destructive hover:bg-destructive/80"
                        >
                          Conferma
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
