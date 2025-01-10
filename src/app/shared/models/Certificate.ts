export interface Certificate {
  id: string;
  registration: string;
  startDay: Date;
  endDay: Date;
  startHour: Date;
  endHour: Date;
  dayOff: Date;
  type: string;
  mode: string;
  status?: string;
}
