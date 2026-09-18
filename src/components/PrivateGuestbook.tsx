import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookHeart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  Users,
  UserCheck,
  MessageSquare,
  Download,
  Copy,
  Check,
  Search,
  Trash2,
  ArrowRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { getMessages, formatArabicDate } from "../utils/guestbookStorage";
import type { GuestMessage } from "../utils/guestbookStorage";
import {
  getRSVPs,
  deleteRSVP,
  exportRSVPsToCSV,
  getRSVPSummary,
  type RSVPEntry,
} from "../utils/rsvpStorage";

export default function PrivateGuestbook() {
  const [activeTab, setActiveTab] = useState<"rsvp" | "book">("rsvp");

  // RSVP State
  const [rsvps, setRsvps] = useState<RSVPEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Guestbook State
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const totalPages = messages.length + 2; // cover + messages + back cover

  const loadData = useCallback(() => {
    setMessages(getMessages());
    setRsvps(getRSVPs());
  }, []);

  useEffect(() => {
    loadData();

    // Listen to cross-tab storage events
    const handleStorage = () => loadData();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadData]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalSubmissions = rsvps.length;
    const totalGuestsCount = rsvps.reduce(
      (acc, curr) => acc + (Number(curr.guests) || 1),
      0,
    );
    const totalWithWishes = rsvps.filter(
      (item) => item.message && item.message.trim().length > 0,
    ).length;
    return {
      totalSubmissions,
      totalGuestsCount,
      totalWithWishes,
    };
  }, [rsvps]);

  // Filtered RSVPs
  const filteredRSVPs = useMemo(() => {
    if (!searchQuery.trim()) return rsvps;
    return rsvps.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase().trim()),
    );
  }, [rsvps, searchQuery]);

  const handleDeleteRSVP = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التأكيد؟")) {
      deleteRSVP(id);
      loadData();
    }
  };

  const handleCopyList = () => {
    const lines = [
      `💍 كشف حضور زفاف محمد أمين وآمنة 💍`,
      `إجمالي الحضور المتوقع: ${stats.totalGuestsCount} فرد (${stats.totalSubmissions} تأكيد)`,
      `────────────────────────────`,
      ...rsvps.map(
        (entry, index) =>
          `${index + 1}. ${entry.name} (${entry.guests === 1 ? "فرد واحد" : `${entry.guests} أفراد`})${entry.message ? ` — "${entry.message}"` : ""}`,
      ),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Keyboard navigation for 3D Book
  useEffect(() => {
    if (activeTab !== "book") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") goToPrev();
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const goToNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrev = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  }, [currentPage]);

  // Touch/swipe handlers for 3D Book
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStartX(null);
  };

  // Page flip animation variants
  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.96,
    }),
  };

  const pageTransition = {
    type: "tween" as const,
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94],
  };

  const renderBookPage = () => {
    // Cover page
    if (currentPage === 0) {
      return (
        <motion.div
          key="cover"
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="book-page book-cover"
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-5 sm:p-8 relative">
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-t-2 border-brand-accent/50" />
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-t-2 border-brand-accent/50" />
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-b-2 border-brand-accent/50" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-b-2 border-brand-accent/50" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-accent/10 border-2 border-brand-accent/40 flex items-center justify-center mb-6 sm:mb-8"
            >
              <BookHeart
                size={30}
                className="text-brand-accent"
                strokeWidth={1.2}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="font-calligraphy text-3xl sm:text-5xl text-brand-primary mb-3 sm:mb-4 leading-relaxed">
                دفتر التهاني
              </h1>
              <div className="w-20 sm:w-24 h-[1px] bg-brand-accent/60 mx-auto mb-4 sm:mb-6" />
              <p className="font-serif text-xl sm:text-3xl text-brand-primary italic mb-1 sm:mb-2">
                Amine & Emna
              </p>
              <p className="font-calligraphy text-lg sm:text-xl text-brand-accent mt-2 sm:mt-4">
                أمين و آمنة
              </p>
              <div className="w-20 sm:w-24 h-[1px] bg-brand-accent/60 mx-auto mt-4 sm:mt-6 mb-3 sm:mb-4" />
              <p
                className="font-sans text-[10px] sm:text-xs text-brand-secondary tracking-[0.3em] uppercase font-bold"
                dir="ltr"
              >
                31 October 2026
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-6 sm:bottom-8 left-0 right-0 text-center"
            >
              <p className="font-arabic text-[11px] sm:text-xs text-brand-secondary animate-pulse">
                اقلب الصفحة لتقرأ التهاني ←
              </p>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    // Back cover
    if (currentPage === totalPages - 1) {
      return (
        <motion.div
          key="back-cover"
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="book-page book-cover"
        >
          <div className="flex flex-col items-center justify-center h-full text-center p-5 sm:p-8 relative">
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-t-2 border-brand-accent/50" />
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-t-2 border-brand-accent/50" />
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 sm:w-16 h-12 sm:h-16 border-r-2 border-b-2 border-brand-accent/50" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 w-12 sm:w-16 h-12 sm:h-16 border-l-2 border-b-2 border-brand-accent/50" />

            <Heart
              size={36}
              className="text-brand-accent/60 mb-4 sm:mb-6"
              strokeWidth={1}
              fill="currentColor"
            />

            <h2 className="font-calligraphy text-2xl sm:text-3xl text-brand-primary mb-3 sm:mb-4">
              شكراً لكل كلمة حلوة
            </h2>
            <div className="w-16 h-[1px] bg-brand-accent/50 mx-auto mb-3 sm:mb-4" />
            <p className="font-calligraphy text-base sm:text-lg text-brand-secondary leading-relaxed max-w-xs px-2">
              كل رسالة منكم هي ذكرى جميلة هنفتكرها طول العمر
            </p>
            <p className="font-serif text-xs sm:text-sm text-brand-accent italic mt-6 sm:mt-8 font-semibold">
              — R & E —
            </p>

            <div className="absolute bottom-6 sm:bottom-8">
              <p className="font-arabic text-[11px] sm:text-xs text-brand-secondary">
                {messages.length > 0
                  ? `${messages.length} تهنئة من الأحباب 💕`
                  : "في انتظار تهانيكم 💕"}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }

    // Message pages
    const msg = messages[currentPage - 1];
    if (!msg) return null;

    return (
      <motion.div
        key={msg.id}
        custom={direction}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={pageTransition}
        className="book-page book-inner-page"
      >
        <div
          className="flex flex-col h-full p-5 sm:p-8 md:p-10 relative"
          dir="rtl"
        >
          <div className="absolute top-3.5 right-3.5 w-8 sm:w-10 h-8 sm:h-10 border-r border-t border-brand-accent/30" />
          <div className="absolute bottom-3.5 left-3.5 w-8 sm:w-10 h-8 sm:h-10 border-l border-b border-brand-accent/30" />

          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex-1 h-[1px] bg-gradient-to-l from-brand-accent/40 to-transparent" />
            <Heart
              size={12}
              className="text-brand-accent/50"
              fill="currentColor"
            />
            <div className="flex-1 h-[1px] bg-gradient-to-r from-brand-accent/40 to-transparent" />
          </div>

          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center shrink-0">
                <span className="font-calligraphy text-base sm:text-lg font-bold text-brand-accent">
                  {msg.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-calligraphy text-lg sm:text-2xl text-brand-primary leading-tight">
                  {msg.name}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center overflow-y-auto my-2">
            <blockquote className="w-full">
              <p className="font-calligraphy text-lg sm:text-2xl text-brand-primary leading-[2.0] sm:leading-[2.2] tracking-wide">
                "{msg.message}"
              </p>
            </blockquote>
          </div>

          <div className="mt-auto pt-4 sm:pt-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="flex-1 h-[1px] bg-gradient-to-l from-brand-accent/40 to-transparent" />
              <Heart
                size={10}
                className="text-brand-accent/40"
                fill="currentColor"
              />
              <div className="flex-1 h-[1px] bg-gradient-to-r from-brand-accent/40 to-transparent" />
            </div>
            <p className="font-arabic text-[11px] sm:text-xs text-brand-secondary text-center">
              {formatArabicDate(msg.timestamp)}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center py-6 sm:py-10 px-3 sm:px-6 relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-brand-faint)_0%,_var(--color-brand-bg)_70%)]" />
      </div>

      {/* Top Bar / Header */}
      <header className="w-full max-w-4xl flex items-center justify-between gap-4 mb-6 sm:mb-8 z-10">
        <a
          href="#/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-brand-border/60 rounded-full font-arabic text-xs sm:text-sm text-brand-primary hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-300 shadow-xs"
        >
          <ArrowRight size={16} />
          <span>العودة لصفحة الدعوة</span>
        </a>

        <div className="text-right">
          <div className="font-serif text-xs sm:text-sm tracking-[0.2em] uppercase text-brand-accent font-bold">
            Private Dashboard
          </div>
          <div className="font-arabic text-xs text-brand-secondary font-semibold">
            محمد أمين وآمنة 💍
          </div>
        </div>
      </header>

      {/* Luxury Tabs Switcher */}
      <div className="w-full max-w-md flex items-center justify-center p-1.5 bg-white/85 backdrop-blur-md border border-brand-border/60 rounded-2xl shadow-sm mb-6 sm:mb-8 z-10">
        <button
          onClick={() => setActiveTab("rsvp")}
          className={`flex-1 py-2.5 px-4 rounded-xl font-arabic text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-none ${
            activeTab === "rsvp"
              ? "bg-brand-primary text-white shadow-md"
              : "text-brand-secondary hover:text-brand-primary hover:bg-brand-faint/50"
          }`}
        >
          <UserCheck size={16} />
          <span>كشف الحضور ({stats.totalGuestsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("book")}
          className={`flex-1 py-2.5 px-4 rounded-xl font-arabic text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-none ${
            activeTab === "book"
              ? "bg-brand-primary text-white shadow-md"
              : "text-brand-secondary hover:text-brand-primary hover:bg-brand-faint/50"
          }`}
        >
          <BookOpen size={16} />
          <span>دفتر التهاني ({messages.length})</span>
        </button>
      </div>

      {/* TAB 1: RSVP Dashboard */}
      {activeTab === "rsvp" && (
        <motion.div
          key="tab-rsvp"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl flex flex-col items-center z-10"
        >
          {/* KPI Stats Bento Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full mb-6 sm:mb-8"
            dir="rtl"
          >
            {/* KPI 1: Total Guests */}
            <div className="bg-gradient-to-br from-brand-accent/15 via-white/95 to-brand-faint/90 backdrop-blur-md border-2 border-brand-accent/40 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  إجمالي الحضور المتوقع
                </div>
                <div className="text-3xl sm:text-4xl font-sans font-bold text-brand-primary tabular-nums">
                  {stats.totalGuestsCount}{" "}
                  <span className="text-base font-arabic font-normal text-brand-accent">
                    فرد
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/15 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                <Users size={24} />
              </div>
            </div>

            {/* KPI 2: Total Confirmations */}
            <div className="bg-gradient-to-br from-white/95 to-brand-faint/85 backdrop-blur-md border border-brand-border/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  عدد التأكيدات (المدعوين)
                </div>
                <div className="text-3xl sm:text-4xl font-sans font-bold text-brand-primary tabular-nums">
                  {stats.totalSubmissions}{" "}
                  <span className="text-base font-arabic font-normal text-brand-secondary">
                    تأكيد
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                <UserCheck size={24} />
              </div>
            </div>

            {/* KPI 3: Messages Attached */}
            <div className="bg-gradient-to-br from-white/95 to-brand-faint/85 backdrop-blur-md border border-brand-border/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-brand-secondary mb-1">
                  رسائل وتهاني مرفقة
                </div>
                <div className="text-3xl sm:text-4xl font-sans font-bold text-brand-primary tabular-nums">
                  {stats.totalWithWishes}{" "}
                  <span className="text-base font-arabic font-normal text-brand-secondary">
                    رسالة
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
                <Heart size={24} fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Action Bar & Search */}
          <div
            className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-6"
            dir="rtl"
          >
            {/* Search Box */}
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-secondary pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو التهنئة..."
                className="w-full pr-10 pl-4 py-2.5 bg-white/90 border border-brand-border/60 rounded-xl font-arabic text-sm text-brand-primary placeholder:text-brand-secondary/60 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all shadow-xs"
              />
            </div>

            {/* Export & Copy Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyList}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/90 border border-brand-border/60 rounded-xl font-arabic text-xs font-bold text-brand-primary hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-300 shadow-xs cursor-pointer"
              >
                {copied ? (
                  <Check size={15} className="text-green-600" />
                ) : (
                  <Copy size={15} />
                )}
                <span>{copied ? "تم النسخ بنجاح" : "نسخ القائمة"}</span>
              </button>

              <button
                onClick={exportRSVPsToCSV}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white border border-brand-primary rounded-xl font-arabic text-xs font-bold hover:bg-brand-accent hover:border-brand-accent transition-all duration-300 shadow-sm cursor-pointer"
              >
                <Download size={15} />
                <span>تحميل كشف Excel (CSV)</span>
              </button>
            </div>
          </div>

          {/* Guest List Grid / Cards */}
          <div className="w-full flex flex-col gap-3" dir="rtl">
            {filteredRSVPs.length === 0 ? (
              <div className="w-full bg-white/80 border border-brand-border/50 rounded-2xl p-10 text-center shadow-xs">
                <Users
                  size={36}
                  className="text-brand-secondary/40 mx-auto mb-3"
                />
                <h4 className="font-arabic text-base font-bold text-brand-primary mb-1">
                  {searchQuery
                    ? "لم يتم العثور على نتائج مطابقة للبحث"
                    : "لا توجد تأكيدات حضور مسجلة بعد"}
                </h4>
                <p className="font-arabic text-xs text-brand-secondary">
                  {searchQuery
                    ? "جرّب البحث باسم آخر"
                    : "شارك رابط الدعوة مع المدعوين لتظهر تأكيداتهم هنا فوراً"}
                </p>
              </div>
            ) : (
              filteredRSVPs.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="bg-white/95 backdrop-blur-md border border-brand-border/60 hover:border-brand-accent rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center font-calligraphy text-lg font-bold text-brand-accent shrink-0">
                      {entry.name.charAt(0) || " ض "}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-arabic text-base sm:text-lg font-bold text-brand-primary">
                          {entry.name}
                        </h4>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-arabic font-bold bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                          <Users size={12} />
                          <span>
                            {entry.guests === 1
                              ? "شخص واحد"
                              : `${entry.guests} أفراد`}
                          </span>
                        </span>
                      </div>

                      {entry.message && (
                        <p className="font-arabic text-xs sm:text-sm text-brand-secondary mt-1.5 bg-brand-faint/60 border border-brand-border/30 rounded-xl p-2.5 leading-relaxed">
                          "{entry.message}"
                        </p>
                      )}

                      <div className="font-arabic text-[11px] text-brand-secondary/80 mt-2">
                        تاريخ التأكيد: {formatArabicDate(entry.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-brand-border/30">
                    <button
                      onClick={() => handleDeleteRSVP(entry.id)}
                      className="p-2 rounded-xl text-brand-secondary/60 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
                      title="حذف من الكشف"
                      aria-label="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* TAB 2: 3D Guestbook */}
      {activeTab === "book" && (
        <motion.div
          key="tab-book"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col items-center z-10"
        >
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="font-calligraphy text-2xl sm:text-3xl text-brand-primary mb-1">
              دفتر التهاني الخاص
            </h2>
            <p className="font-arabic text-xs text-brand-secondary">
              تصفّح الرسائل والكلمات الجميلة من الأهل والأصدقاء
            </p>
          </div>

          {/* Book Container */}
          <div
            className="book-container z-10"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="absolute -bottom-4 left-4 right-4 h-8 bg-black/10 blur-xl rounded-full" />
            <div className="absolute left-0 top-0 bottom-0 w-3 sm:w-6 bg-gradient-to-r from-brand-primary/10 via-brand-primary/5 to-transparent z-20 pointer-events-none rounded-l-lg" />

            <div className="book-perspective relative w-full h-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                {renderBookPage()}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 sm:gap-6 mt-5 sm:mt-8 z-10">
            <motion.button
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              disabled={currentPage >= totalPages - 1}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 border border-brand-border/50 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/90 disabled:hover:text-brand-primary shadow-sm"
              aria-label="Next page"
            >
              <ChevronLeft size={18} />
            </motion.button>

            <div className="text-center min-w-[90px] sm:min-w-[100px]">
              <p className="font-arabic text-xs sm:text-sm text-brand-primary font-bold">
                {currentPage === 0
                  ? "الغلاف"
                  : currentPage === totalPages - 1
                    ? "النهاية"
                    : `صفحة ${currentPage}`}
              </p>
              <p className="font-sans text-[9px] sm:text-[10px] text-brand-secondary tracking-wider uppercase mt-0.5">
                {currentPage + 1} / {totalPages}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPrev}
              disabled={currentPage <= 0}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 border border-brand-border/50 flex items-center justify-center text-brand-primary hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/90 disabled:hover:text-brand-primary shadow-sm"
              aria-label="Previous page"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>

          {messages.length === 0 && (
            <p className="font-arabic text-xs sm:text-sm text-brand-secondary mt-3 z-10 text-center px-4">
              لم يتم إرسال أي تهاني بعد — شارك رابط الدعوة مع أحبابك 💌
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
