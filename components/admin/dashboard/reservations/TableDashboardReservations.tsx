import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { convertUTCToItaly } from "@/lib/italy-time";
import { Reservation } from "@/types/reservation";

interface TableDashboardReservationsProps {
  reservations: Reservation[];
  onCancelReservation: (reservation: Reservation) => void;
  getStatusBadge: (status: string) => string;
}

export function TableDashboardReservations({
  reservations,
  onCancelReservation,
  getStatusBadge,
}: TableDashboardReservationsProps) {
  return (
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
          {reservations.map((reservation: Reservation) => (
            <TableRow key={reservation.code}>
              <TableCell className="font-medium">{reservation.code}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(reservation.status)}>
                  {reservation.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reservation.user_name}</div>
                  <div className="text-sm text-muted-foreground">{reservation.user_email}</div>
                  <div className="text-sm text-muted-foreground">{reservation.user_phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reservation.vehicle_type_name.toUpperCase()}</div>
                  <div className="text-sm text-muted-foreground">{reservation.vehicle_plate}</div>
                  <div className="text-sm text-muted-foreground">{reservation.vehicle_model}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{reservation.payment_method_name}</div>
                  <div className="text-sm text-muted-foreground">{reservation.payment_status}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-green-600">€{(reservation.total_price || 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">EUR</div>
                </div>
              </TableCell>
              <TableCell className="p-0 md:p-4">
                {(() => {
                  const startTimeItaly = convertUTCToItaly(reservation.start_time);
                  return (
                    <div>
                      <div className="text-xs md:text-sm font-medium mr-1 md:mb-0">{startTimeItaly.date}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{startTimeItaly.time}</div>
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell className="p-0 md:p-4">
                {(() => {
                  const endTimeItaly = convertUTCToItaly(reservation.end_time);
                  return (
                    <div>
                      <div className="text-xs md:text-sm font-medium ml-1 md:mb-0">{endTimeItaly.date}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{endTimeItaly.time}</div>
                    </div>
                  );
                })()}
              </TableCell>
              <TableCell>
                {reservation.status !== "canceled" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancelReservation(reservation)}
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
  );
}
