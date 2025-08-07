
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export const ITALY_TIMEZONE = "Europe/Rome";

//Retorna la fecha y hora actual en Italia, independientemente del lugar desde donde se acceda
export const getCurrentItalyTime = (): Date => {
  const utcNow = new Date();
  return toZonedTime(utcNow, ITALY_TIMEZONE);
};

//Retorna la fecha de hoy en Italia, sin hora
export const getTodayInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  return new Date(
    nowInItaly.getFullYear(),
    nowInItaly.getMonth(),
    nowInItaly.getDate()
  );
};


// Retorna la fecha en italia, pero siempre en 00::00:00
export const getMinSelectableDateInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  const todayInItaly = getTodayInItaly();

  // Si es después de las 23:00 en Italia, la fecha mínima es mañana, la hora siempre será 00:00:00
  if (nowInItaly.getHours() >= 23) {
    return new Date(
      nowInItaly.getFullYear(),
      nowInItaly.getMonth(),
      nowInItaly.getDate() + 1
    );
  }

  return todayInItaly;
};

// Crea un objeto Date completo con fecha y hora en la zona horaria de Italia
export const createItalyDateTime = (date: Date, timeString: string): Date => {
  const [hour, minute] = timeString.split(":").map(Number);
  const italyDate = toZonedTime(date, ITALY_TIMEZONE);
  italyDate.setHours(hour, minute, 0, 0);
  return italyDate;
};

// Convierte una fecha y hora de Italia a UTC ISO string
export const convertItalyToUTC = (
  date: Date | string,
  time: string
): string => {
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = format(date, "yyyy-MM-dd");
  } else {
    dateStr = date;
  }

  // Crear fecha en zona horaria italiana
  const italyDateTime = `${dateStr}T${time}:00`;
  const italyDate = new Date(italyDateTime);

  // Convertir a UTC usando fromZonedTime
  const utcDate = fromZonedTime(italyDate, ITALY_TIMEZONE);
  return utcDate.toISOString();
};

// Convierte una fecha UTC ISO string a fecha y hora de Italia
export const convertUTCToItaly = (
  utcDateTime: string
): { date: string; time: string } => {
  //Se usa
  if (!utcDateTime) return { date: "", time: "" };

  // Convertir la fecha UTC a la zona horaria de Italia
  const italyDate = toZonedTime(utcDateTime, ITALY_TIMEZONE);

  return {
    date: format(italyDate, "dd-MM-yyyy"),
    time: format(italyDate, "HH:mm"),
  };
};

//Formatea una fecha UTC para mostrar en la zona horaria de Italia
export const formatDateTimeForDisplay = (
  utcDateTime: string,
  includeTime = true
): string => {
  const { date, time } = convertUTCToItaly(utcDateTime);
  return includeTime ? `${date} ${time}` : date;
};
