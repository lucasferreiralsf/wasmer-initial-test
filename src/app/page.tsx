import { CalendarDayViewFeature } from '@/ui/features';

export default function Home() {
  return (
    <main className="flex items-center justify-center">
      <CalendarDayViewFeature openingHour="09:00" closingHour="21:00" />
    </main>
  );
}
