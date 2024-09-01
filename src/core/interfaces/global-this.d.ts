/* eslint-disable no-unused-vars */
import { LayoutDayEvent } from './layout-events';

declare global {
  interface Window {
    layOutDay: (events?: LayoutDayEvent[]) => void;
  }
}
