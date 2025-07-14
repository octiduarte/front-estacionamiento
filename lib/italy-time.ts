import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

/**
 * Utilidades para manejar fechas y horas siempre basadas en la zona horaria de Italia
 * Esto evita inconsistencias por usar la hora local del dispositivo del usuario
 */

export const ITALY_TIMEZONE = 'Europe/Rome';

/**
 * Obtiene la fecha y hora actual en Italia, independientemente de la zona horaria local del usuario
 */
export const getCurrentItalyTime = (): Date => {
  const utcNow = new Date();
  return toZonedTime(utcNow, ITALY_TIMEZONE);
};

/**
 * Obtiene solo la fecha actual de Italia (sin hora)
 */
export const getTodayInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  return new Date(nowInItaly.getFullYear(), nowInItaly.getMonth(), nowInItaly.getDate());
};

/**
 * Obtiene la fecha mínima seleccionable considerando la hora de Italia
 */
export const getMinSelectableDateInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  const todayInItaly = getTodayInItaly();
  
  // Si es después de las 23:00 en Italia, la fecha mínima es mañana
  if (nowInItaly.getHours() >= 23) {
    return new Date(nowInItaly.getFullYear(), nowInItaly.getMonth(), nowInItaly.getDate() + 1);
  }
  
  return todayInItaly;
};

/**
 * Crea un objeto Date completo con fecha y hora en la zona horaria de Italia
 */
export const createItalyDateTime = (date: Date, timeString: string): Date => {
  const [hour, minute] = timeString.split(":").map(Number);
  const italyDate = toZonedTime(date, ITALY_TIMEZONE);
  italyDate.setHours(hour, minute, 0, 0);
  return italyDate;
};

/**
 * Convierte una fecha y hora de Italia a UTC ISO string
 * @param date - Fecha como string (YYYY-MM-DD) o objeto Date
 * @param time - Hora como string (HH:mm)
 * @returns ISO string en UTC
 */
export const convertItalyToUTC = (date: Date | string, time: string): string => {
  let dateStr: string;
  if (date instanceof Date) {
    dateStr = format(date, 'yyyy-MM-dd');
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

/**
 * Convierte una fecha UTC ISO string a fecha y hora de Italia
 * @param utcDateTime - Fecha UTC como ISO string
 * @returns Objeto con date (DD-MM-YYYY) y time (HH:mm) en zona horaria de Italia
 */
export const convertUTCToItaly = (utcDateTime: string): { date: string; time: string } => {
  if (!utcDateTime) return { date: "", time: "" };
  
  // Convertir la fecha UTC a la zona horaria de Italia
  const utcDate = new Date(utcDateTime);
  const italyDate = toZonedTime(utcDate, ITALY_TIMEZONE);
  
  return {
    date: format(italyDate, 'dd-MM-yyyy'),
    time: format(italyDate, 'HH:mm')
  };
};

/**
 * Formatea una fecha UTC para mostrar en la zona horaria de Italia
 * @param utcDateTime - Fecha UTC como ISO string
 * @param includeTime - Si incluir la hora en el formato
 * @returns String formateado para mostrar
 */
export const formatDateTimeForDisplay = (utcDateTime: string, includeTime = true): string => {
  const { date, time } = convertUTCToItaly(utcDateTime);
  return includeTime ? `${date} ${time}` : date;
};

/**
 * Verifica si una fecha y hora está en el pasado (basado en zona horaria de Italia)
 * @param date - Fecha como objeto Date
 * @param time - Hora como string (HH:mm) - opcional
 * @returns true si está en el pasado
 */
export const isDateTimeInPast = (date: Date, time?: string): boolean => {
  const currentItaly = getCurrentItalyTime();
  const targetDateTime = time ? createItalyDateTime(date, time) : createItalyDateTime(date, '00:00');
  return targetDateTime < currentItaly;
};
