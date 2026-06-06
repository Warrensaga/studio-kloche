import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface AppointmentCalendarProps {
  events: any[];
  onDateClick: (dateStr: string) => void;
  onEventClick: (info: any) => void;
}

export default function AppointmentCalendar({
  events,
  onDateClick,
  onEventClick,
}: AppointmentCalendarProps) {
  const handleDateClick = (arg: any) => {
    onDateClick(arg.dateStr);
  };

  const handleEventClick = (info: any) => {
    // Info contains info.event instance
    onEventClick(info.event);
  };

  return (
    <div id="fullcalendar-viewport-wrapper" className="bg-[#FAF8F4] border border-[#E2DDD5] p-5 md:p-8 shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={false}
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        dayMaxEvents={3}
        themeSystem="standard"
        aspectRatio={1.5}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
      />
    </div>
  );
}
