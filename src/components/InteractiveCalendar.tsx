import { useState } from "react";
import { motion } from "motion/react";
import {
  Heart,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

const MONTH_NAMES_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_AR = [
  "أحد",
  "إثنين",
  "ثلاثاء",
  "أربعاء",
  "خميس",
  "جمعة",
  "سبت",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function generateICSFile(): void {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Amine & Emna//Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "DTSTART:20261031T190000",
    "DTEND:20261101T010000",
    "SUMMARY:💍 زفاف محمد أمين وآمنة",
    "DESCRIPTION:حفل زفاف محمد أمين وآمنة - فضاء مريم، صفاقس، طريق المهدية، كم 10، تونس",
    "LOCATION:فضاء مريم، صفاقس، طريق المهدية، كم 10، تونس",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:غداً حفل زفاف محمد أمين وآمنة 💍",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "amine-emna-wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function InteractiveCalendar() {
  const [currentMonth, setCurrentMonth] = useState(9); // October (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [saved, setSaved] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = new Date();

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const isWeddingDay = (day: number) =>
    currentYear === 2026 && currentMonth === 9 && day === 31;

  const isPast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return (
      date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  const isToday = (day: number) =>
    currentYear === today.getFullYear() &&
    currentMonth === today.getMonth() &&
    day === today.getDate();

  const handleSaveCalendar = () => {
    generateICSFile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md mx-auto mb-16 sm:mb-24 flex flex-col items-center px-3"
    >
      {/* Header */}
      <h2 className="font-serif tracking-[0.25em] text-xs sm:text-sm uppercase font-bold text-brand-primary mb-1">
        CALENDAR
      </h2>
      <h3 className="font-arabic text-2xl sm:text-3xl font-bold text-brand-accent mb-6 sm:mb-8">
        احفظ الموعد
      </h3>

      {/* Calendar Card */}
      <div className="w-full bg-gradient-to-b from-white/95 to-brand-faint/85 backdrop-blur-md border border-brand-border/60 rounded-2xl p-4 sm:p-6 shadow-lg">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth(-1)}
            className="w-8 h-8 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-secondary hover:text-brand-primary hover:border-brand-primary transition-colors cursor-pointer bg-white/70 shadow-xs"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </motion.button>

          <div className="text-center">
            <div className="font-sans text-xs sm:text-sm font-bold tracking-[0.15em] text-brand-primary uppercase">
              {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
                month: "long",
              })}{" "}
              {currentYear}
            </div>
            <div className="font-arabic text-xs sm:text-sm text-brand-accent font-bold mt-0.5">
              {MONTH_NAMES_AR[currentMonth]} {currentYear}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigateMonth(1)}
            className="w-8 h-8 rounded-full border border-brand-border/60 flex items-center justify-center text-brand-secondary hover:text-brand-primary hover:border-brand-primary transition-colors cursor-pointer bg-white/70 shadow-xs"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((day, i) => (
            <div key={day} className="text-center py-0.5 sm:py-1">
              <div className="text-[8px] sm:text-[9px] font-sans font-bold uppercase tracking-wider text-brand-secondary">
                {day}
              </div>
              <div className="text-[8px] sm:text-[9px] font-arabic text-brand-accent/80 font-bold">
                {DAY_NAMES_AR[i]}
              </div>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              className="aspect-square flex items-center justify-center relative"
            >
              {day !== null && (
                <motion.div
                  whileHover={
                    isWeddingDay(day) ? { scale: 1.12 } : { scale: 1.05 }
                  }
                  className={`w-full h-full flex items-center justify-center rounded-lg text-xs sm:text-sm font-sans relative transition-all duration-200 ${
                    isWeddingDay(day)
                      ? "bg-brand-accent text-white font-bold shadow-md cursor-pointer ring-2 ring-brand-accent/50"
                      : isToday(day)
                        ? "bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/30"
                        : isPast(day)
                          ? "text-brand-border/80"
                          : "text-brand-primary hover:bg-brand-faint"
                  }`}
                >
                  {isWeddingDay(day) && (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -top-1 -right-1 z-10"
                    >
                      <Heart size={12} className="fill-red-500 text-red-500" />
                    </motion.div>
                  )}
                  <span className="relative z-10">{day}</span>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-brand-border/40">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs bg-brand-accent shadow-xs" />
            <span className="text-[10px] font-arabic font-medium text-brand-secondary">
              يوم الزفاف
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-xs border border-brand-primary/30 bg-brand-primary/10" />
            <span className="text-[10px] font-arabic font-medium text-brand-secondary">
              اليوم الحالي
            </span>
          </div>
        </div>
      </div>

      {/* Save to Calendar Button */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSaveCalendar}
        className={`mt-6 flex items-center gap-2.5 px-8 sm:px-10 py-3.5 text-[11px] uppercase tracking-[0.25em] font-sans font-bold transition-all duration-300 rounded-full border cursor-pointer shadow-md hover:shadow-lg ${
          saved
            ? "bg-emerald-600 text-white border-emerald-600"
            : "bg-brand-primary text-brand-bg border-brand-primary hover:bg-brand-accent hover:border-brand-accent"
        }`}
      >
        {saved ? (
          <Check size={16} />
        ) : (
          <CalendarPlus size={16} strokeWidth={1.8} />
        )}
        {saved ? "تم الحفظ بنجاح" : "حفظ في التقويم"}
      </motion.button>
    </motion.section>
  );
}
