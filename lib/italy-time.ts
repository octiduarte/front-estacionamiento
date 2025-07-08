import { toZonedTime, fromZonedTime } from 'date-fns-tz';

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
 * Convierte una fecha local a la zona horaria de Italia
 */
export const convertToItalyTime = (date: Date): Date => {
  return toZonedTime(date, ITALY_TIMEZONE);
};

/**
 * Convierte una fecha de Italia a UTC para enviar al servidor
 */
export const convertFromItalyTime = (date: Date): Date => {
  return fromZonedTime(date, ITALY_TIMEZONE);
};

/**
 * Verifica si es tarde en Italia (23:00 o más)
 */
export const isLateInItaly = (): boolean => {
  const nowInItaly = getCurrentItalyTime();
  return nowInItaly.getHours() >= 23;
};

/**
 * Obtiene la fecha mínima seleccionable considerando la hora de Italia
 */
export const getMinSelectableDateInItaly = (): Date => {
  const nowInItaly = getCurrentItalyTime();
  const todayInItaly = getTodayInItaly();
  
  if (isLateInItaly()) {
    // Si es después de las 23:00 en Italia, la fecha mínima es mañana
    return new Date(nowInItaly.getFullYear(), nowInItaly.getMonth(), nowInItaly.getDate() + 1);
  }
  
  return todayInItaly;
};

/**
 * Crea un objeto Date completo con fecha y hora en la zona horaria de Italia
 */
export const createItalyDateTime = (date: Date, timeString: string): Date => {
  const [hour, minute] = timeString.split(":").map(Number);
  const italyDate = convertToItalyTime(date);
  italyDate.setHours(hour, minute, 0, 0);
  return italyDate;
};
