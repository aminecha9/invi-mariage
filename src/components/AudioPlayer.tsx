import React, { useState, useEffect, useRef } from "react";
import { Music, Pause, Play, Volume2 } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n";

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

function EqualizerBars({ isPlaying }: { isPlaying: boolean }) {
  const bars = [
    { height: "12px", delay: 0 },
    { height: "18px", delay: 0.15 },
    { height: "10px", delay: 0.3 },
    { height: "16px", delay: 0.1 },
    { height: "14px", delay: 0.25 },
  ];

  return (
    <div className="flex items-end gap-[2px] h-4 sm:h-5">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[2.5px] rounded-full bg-brand-accent"
          animate={
            isPlaying
              ? {
                  height: [bar.height, "4px", bar.height, "8px", bar.height],
                }
              : { height: "3px" }
          }
          transition={
            isPlaying
              ? {
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: bar.delay,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ isPlaying, onToggle, audioRef }: AudioPlayerProps) {
  const { text } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audioRef]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * audio.duration;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.4 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 backdrop-blur-xl bg-gradient-to-br from-white/95 to-brand-faint/90 shadow-2xl border border-brand-border/50 rounded-2xl overflow-hidden transition-all duration-300"
      style={{ maxWidth: "calc(100vw - 32px)" }}
    >
      <div className="p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onToggle}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-primary text-brand-bg flex items-center justify-center relative cursor-pointer border-none shadow-md hover:bg-brand-accent transition-colors shrink-0"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {/* Spinning ring when playing */}
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-3px] rounded-full border border-brand-accent/40 border-t-brand-accent"
            />
          )}
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </motion.button>

        {/* Song Info & Controls */}
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "w-44 sm:w-52" : "w-24 sm:w-28"}`}>
          <div className="flex items-center gap-2">
            <EqualizerBars isPlaying={isPlaying} />
            <div className="min-w-0 flex-1">
              <div className="text-[8px] uppercase tracking-[0.2em] font-sans font-bold text-brand-secondary">
                {isPlaying ? text("شغالة الآن", "Lecture en cours") : text("موسيقى الدعوة", "Musique de l'invitation")}
              </div>
              <div className="text-xs font-arabic text-brand-primary font-bold truncate">
                الليل وسماه
              </div>
            </div>
          </div>

          {/* Progress Bar (Visible when expanded) */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="mt-2"
            >
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="w-full h-1.5 bg-brand-border/40 rounded-full cursor-pointer relative overflow-hidden group"
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-accent to-brand-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] font-mono text-brand-secondary tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <span className="text-[8px] font-mono text-brand-secondary tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Expand toggle on mobile */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden text-brand-secondary hover:text-brand-primary p-1 cursor-pointer bg-transparent border-none"
          aria-label="Toggle audio player details"
        >
          <Volume2 size={16} className={isPlaying ? "text-brand-accent" : "text-brand-secondary"} />
        </button>
      </div>
    </motion.div>
  );
}
