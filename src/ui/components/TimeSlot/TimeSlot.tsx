import { cn } from '@/core/utils/cn';
import React, { PropsWithChildren } from 'react';

interface TimeSlotProps extends PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}
export function TimeSlot({
  title = 'Timeslot',
  description = 'test description',
  className,
  style,
}: TimeSlotProps) {
  return (
    <article
      className={cn(
        'absolute border-[1px] border-l-4 border-slate-300 border-l-blue-500 bg-white p-2 text-sm text-white',
        className,
      )}
      style={style}
    >
      <h1 className="text-sm font-semibold text-blue-500">{title}</h1>

      {description && <p className="text-xs text-slate-500">{description}</p>}
    </article>
  );
}
