import { AlertCircleIcon } from "lucide-react";
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDateTimeForDisplay } from "@/lib/italy-time";
import { Slot } from "@/types/reservation";

interface UnavailableSlotsListProps {
  slotDetails: Slot[];
  t: (key: string) => string;
}

function groupConsecutiveUnavailable(slots: Slot[]) {
  const unavailable = slots.filter((s) => !s.is_available);
  if (!unavailable.length) return [];
  return unavailable.reduce<{ start_time: string; end_time: string }[]>(
    (groups, slot, i) => {
      if (i === 0) {
        groups.push({ start_time: slot.start_time, end_time: slot.end_time });
      } else {
        const last = groups[groups.length - 1];
        if (
          new Date(slot.start_time).getTime() ===
          new Date(last.end_time).getTime()
        ) {
          last.end_time = slot.end_time;
        } else {
          groups.push({ start_time: slot.start_time, end_time: slot.end_time });
        }
      }
      return groups;
    },
    []
  );
}

const UnavailableSlotsList: React.FC<UnavailableSlotsListProps> = ({
  slotDetails,
  t,
}) => {
  const unavailableGroups = groupConsecutiveUnavailable(slotDetails);
  if (!unavailableGroups.length) return null;

  return (
    <Alert variant="destructive" className="mt-5">
      <AlertCircleIcon className="w-5 h-5 " />
      <AlertDescription>
        <ul className="space-y-2">
          {unavailableGroups.map((group, index) => (
            <React.Fragment key={"unavailable-" + index}>
              {index > 0 && (
                <hr className="border-t border-destructive my-2" />
              )}
              <li
                className="flex justify-between items-center py-2 rounded-md text-sm"
              >
                <span>
                  {formatDateTimeForDisplay(group.start_time)}
                  <span className="md:hidden block"></span>
                  <span className="hidden md:inline">{" - "}</span>
                  {formatDateTimeForDisplay(group.end_time)}
                </span>
                <span className="font-medium text-muted-foreground text-xs">
                  {t("unavailable")}
                </span>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default UnavailableSlotsList;
