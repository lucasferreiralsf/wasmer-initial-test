export interface LayoutDayEvent {
  start: number;
  end: number;
}

export interface TimeSlotEvent extends LayoutDayEvent {
  left?: number;
  width?: number;
}
