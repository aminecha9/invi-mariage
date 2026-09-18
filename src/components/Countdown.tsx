import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimeUnit {
  value: number;
  label: string;
  labelAr: string;
}

function FlipDigit({ value, label, labelAr }: TimeUnit) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            style={{ perspective: "400px" }}
          >
            <div className="w-13 h-17 xs:w-15 xs:h-19 sm:w-20 sm:h-26 md:w-24 md:h-28 bg-gradient-to-b from-white/95 to-brand-faint/90 backdrop-blur-md border border-brand-border/60 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
              {/* Center line */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-brand-border/30" />
              <span className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-sans font-light text-brand-primary relative z-10 tabular-nums">
                {value.toString().padStart(2, "0")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-sans font-bold text-brand-secondary mt-2 sm:mt-3">
        {label}
      </span>
      <span className="text-[9px] sm:text-[10px] font-arabic text-brand-accent font-bold mt-0.5">
        {labelAr}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 mt-4 sm:mt-6">
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-brand-accent"
      />
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-brand-accent"
      />
    </div>
  );
}

export default function Countdown() {
  const targetDate = new Date("2026-10-31T19:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const units: TimeUnit[] = [
    { value: timeLeft.days, label: "Days", labelAr: "يوم" },
    { value: timeLeft.hours, label: "Hours", labelAr: "ساعة" },
    { value: timeLeft.minutes, label: "Minutes", labelAr: "دقيقة" },
    { value: timeLeft.seconds, label: "Seconds", labelAr: "ثانية" },
  ];

  return (
    <div
      className="flex justify-center items-start gap-1.5 xs:gap-2.5 sm:gap-4 md:gap-6 mt-4 z-10 max-w-full px-2"
      dir="ltr"
    >
      {units.map((unit, index) => (
        <div
          key={unit.label}
          className="flex items-start gap-1.5 xs:gap-2.5 sm:gap-4 md:gap-6"
        >
          <FlipDigit {...unit} />
          {index < units.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
