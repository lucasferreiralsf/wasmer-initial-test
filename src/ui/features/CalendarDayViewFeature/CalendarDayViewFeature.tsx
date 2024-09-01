'use client';
import { LayoutDayEvent, TimeSlotEvent } from '@/core/interfaces/layout-events';
import { cn } from '@/core/utils/cn';
import { MAX_SLOT_WIDTH } from '@/core/utils/contants';
import { TimeSlot } from '@/ui/components';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface CalendarDayViewFeatureProps {
  openingHour?: string;
  closingHour?: string;
}
export function CalendarDayViewFeature({
  openingHour = '09:00',
  closingHour = '21:00',
}: CalendarDayViewFeatureProps) {
  const [slots, setSlots] = useState<TimeSlotEvent[]>([]);

  function calculateLayout(newEvents: LayoutDayEvent[]): TimeSlotEvent[] {
    newEvents.sort((a, b) => a.start - b.start);
    const calendarColumns: TimeSlotEvent[][] = [];

    newEvents.forEach((event) => {
      let placed = false;

      for (const colEvents of calendarColumns) {
        if (colEvents[colEvents.length - 1].end <= event.start) {
          colEvents.push(event);
          placed = true;
          break;
        }
      }

      if (!placed) {
        calendarColumns.push([event]);
      }
    });

    const maxWidth = MAX_SLOT_WIDTH / calendarColumns.length;
    const eventSlots: TimeSlotEvent[] = [];

    calendarColumns.forEach((col, colIndex) => {
      col.forEach((event) => {
        if (
          calendarColumns.some((column) =>
            column.some((slot) => slot.end <= event.start),
          )
        ) {
          event.width = maxWidth;
        } else {
          event.width = MAX_SLOT_WIDTH;
        }
        event.left = maxWidth * colIndex;

        eventSlots.push(event);
      });
    });

    return eventSlots;
  }

  useEffect(() => {
    if (window) {
      window.layOutDay = (newEvents: LayoutDayEvent[] = []) => {
        const dayEvents = calculateLayout(newEvents);
        setSlots(dayEvents);
      };
    }
  }, []);
  const generateHours = (openingTime: string, closingTime: string) => {
    const [openingHour, openingMinute] = openingTime.split(':');
    const [closingHour, closingMinute] = closingTime.split(':');
    const parsedClosingTime = dayjs()
      .hour(Number(closingHour))
      .minute(Number(closingMinute));
    const acc = [];
    let currentTime = dayjs()
      .hour(Number(openingHour))
      .minute(Number(openingMinute));

    while (currentTime.isBefore(parsedClosingTime)) {
      acc.push({
        time: currentTime,
        suffix: currentTime.hour() < 12 ? 'AM' : 'PM',
        formattedTime: currentTime.format('hh:mm'),
        hasMinutes: currentTime.minute() > 0,
      });
      currentTime = dayjs(currentTime.add(30, 'minutes'), 'HH:mm');
    }
    return [
      ...acc,
      {
        time: parsedClosingTime,
        suffix: parsedClosingTime.hour() < 12 ? 'AM' : 'PM',
        formattedTime: parsedClosingTime.format('hh:mm'),
        hasMinutes: parsedClosingTime.minute() > 0,
      },
    ];
  };

  const hourLabels = generateHours(openingHour, closingHour);

  return (
    <div className="flex overflow-x-auto p-4">
      <div className="h-[45rem]">
        <div className="relative -top-[8px] flex w-20 justify-end pr-2">
          {hourLabels.map((label, index) => (
            <div
              key={label.time.toISOString()}
              className={`absolute h-fit w-fit`}
              style={{
                top: index * 30,
              }}
            >
              <h4
                className={cn('flex items-center justify-end', {
                  'text-sm': !label.hasMinutes,
                  'text-xs': label.hasMinutes,
                })}
              >
                {label.formattedTime}
                {!label.hasMinutes && (
                  <span className="ml-1 text-xs">{label.suffix}</span>
                )}
              </h4>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[38.75rem] bg-gray px-[0.625rem]">
        <div className="relative w-[37.5rem]">
          {slots.map((event, index) => {
            const top = (event.start / (12 * 60)) * 720;
            const height = ((event.end - event.start) / (12 * 60)) * 720;

            return (
              <TimeSlot
                key={`${event.start}_${index}`}
                title={`Event ${index + 1}`}
                style={{
                  top,
                  left: event.left,
                  width: event.width,
                  height,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
