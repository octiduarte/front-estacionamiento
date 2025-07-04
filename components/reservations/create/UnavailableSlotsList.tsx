import { XCircle } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import React from "react";

// Constante para la zona horaria de Italia
const ITALY_TIMEZONE = 'Europe/Rome';

interface Slot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

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
        if (new Date(slot.start_time).getTime() === new Date(last.end_time).getTime()) {
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

const UnavailableSlotsList: React.FC<UnavailableSlotsListProps> = ({ slotDetails, t }) => {
  const unavailableGroups = groupConsecutiveUnavailable(slotDetails);
  if (!unavailableGroups.length) return null;
  return (
    <ul className="space-y-2 mt-1">
      {unavailableGroups.map((group, index) => (
        <li
          key={"unavailable-" + index}
          className="flex justify-between items-center px-2 py-1 rounded-md bg-red-50 text-red-700"
        >
          <span className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            {formatInTimeZone(new Date(group.start_time), ITALY_TIMEZONE, "dd/MM/yyyy HH:mm")} - {formatInTimeZone(new Date(group.end_time), ITALY_TIMEZONE, "dd/MM/yyyy HH:mm")}
          </span>
          <span className="font-medium">{t("unavailable")}</span>
        </li>
      ))}
    </ul>
  );
};

export default UnavailableSlotsList;
