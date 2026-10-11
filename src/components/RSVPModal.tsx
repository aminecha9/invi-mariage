import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  UserCheck,
  Users,
  MessageSquare,
  Sparkles,
  Send,
} from "lucide-react";
import { saveRSVP } from "../utils/rsvpStorage";
import { saveMessage } from "../utils/guestbookStorage";
import { useLanguage } from "../i18n";

interface RSVPData {
  name: string;
  guests: number;
  message: string;
}

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RSVPModal({ isOpen, onClose }: RSVPModalProps) {
  const { text } = useLanguage();
  const [formData, setFormData] = useState<RSVPData>({
    name: "",
    guests: 1,
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      // Save real RSVP entry
      saveRSVP(formData.name, formData.guests, formData.message);

      // Also save to guestbook if message is written
      if (formData.message.trim()) {
        saveMessage(formData.name, formData.message);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", guests: 1, message: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-gradient-to-b from-white via-brand-bg to-brand-faint border border-brand-border/60 rounded-2xl p-5 sm:p-8 shadow-2xl"
          >
            {/* Background decorative corners */}
            <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-r-2 border-t-2 border-brand-border/40 m-2 sm:m-3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-l-2 border-b-2 border-brand-border/40 m-2 sm:m-3 pointer-events-none" />

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-brand-faint border border-brand-border/50 flex items-center justify-center text-brand-secondary hover:text-brand-primary hover:bg-brand-border/40 transition-colors cursor-pointer z-20"
              aria-label="Close modal"
            >
              <X size={16} />
            </motion.button>

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Header */}
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <UserCheck
                        size={22}
                        className="text-brand-accent"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mb-0.5">
                      RSVP
                    </h3>
                    <p className="font-arabic text-base sm:text-lg text-brand-accent font-bold">
                      {text("أكّد حضورك", "Confirmer ma présence")}
                    </p>
                    <p className="font-arabic text-xs sm:text-sm text-brand-secondary mt-1.5 max-w-xs mx-auto">
                      {text("يسعدنا تأكيدكم لحضور حفل زواجنا", "Nous serons heureux de vous compter parmi nous")}
                    </p>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                    dir="rtl"
                  >
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-brand-secondary mb-1.5">
                        <UserCheck size={14} />
                        <span>{text("الاسم الكريم", "Nom complet")}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder={text("أدخل اسمك الكريم", "Entrez votre nom")}
                        className="w-full px-4 py-2.5 sm:py-3 bg-white/90 border border-brand-border/50 rounded-xl font-arabic text-base sm:text-sm text-brand-primary placeholder:text-brand-border focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
                      />
                    </div>

                    {/* Number of Guests */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-brand-secondary mb-1.5">
                        <Users size={14} />
                        <span>{text("عدد المرافقين", "Nombre d'accompagnants")}</span>
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            guests: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 sm:py-3 bg-white/90 border border-brand-border/50 rounded-xl font-arabic text-base sm:text-sm text-brand-primary focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n === 1
                              ? text("شخص واحد", "1 personne")
                              : text(`${n} أشخاص`, `${n} personnes`)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-widest text-brand-secondary mb-1.5">
                        <MessageSquare size={14} />
                        <span>{text("رسالة (اختياري)", "Message (facultatif)")}</span>
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder={text("كلمة حلوة تفرحنا...", "Un joli mot pour nous...")}
                        rows={3}
                        className="w-full px-4 py-2.5 sm:py-3 bg-white/90 border border-brand-border/50 rounded-xl font-arabic text-base sm:text-sm text-brand-primary placeholder:text-brand-border focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !formData.name.trim()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-brand-primary text-brand-bg text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-bold hover:bg-brand-accent transition-all duration-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-md"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-brand-bg/30 border-t-brand-bg rounded-full"
                        />
                      ) : (
                        <>
                          <Send size={14} />
                          <span>{text("تأكيد الحضور", "Confirmer ma présence")}</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 sm:py-8 relative"
                >
                  {/* Success sparkles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 160],
                          y: [0, (Math.random() - 0.5) * 160],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.08,
                          ease: "easeOut",
                        }}
                        className="absolute top-1/2 left-1/2"
                      >
                        <Sparkles
                          size={12 + Math.random() * 8}
                          className="text-brand-accent"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      damping: 10,
                      stiffness: 200,
                      delay: 0.15,
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5"
                  >
                    <UserCheck
                      size={30}
                      className="text-green-600"
                      strokeWidth={1.5}
                    />
                  </motion.div>

                  <h3 className="font-arabic text-xl sm:text-2xl font-bold text-brand-primary mb-2">
                    {text("تم تأكيد حضورك! 🎉", "Votre présence est confirmée ! 🎉")}
                  </h3>
                  <p className="font-arabic text-sm text-brand-secondary mb-1">
                    {text("شكراً", "Merci")}{" "}
                    <span className="font-bold text-brand-accent">
                      {formData.name}
                    </span>
                  </p>
                  <p className="font-arabic text-xs sm:text-sm text-brand-secondary">
                    {formData.guests === 1
                      ? text("بانتظارك يوم الفرحة", "Nous vous attendons le jour du mariage")
                      : text(
                          `بانتظاركم (${formData.guests} أشخاص) يوم الفرحة`,
                          `Nous vous attendons le jour du mariage (${formData.guests} personnes)`,
                        )}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleClose}
                    className="mt-6 sm:mt-8 px-8 py-3 bg-brand-faint text-brand-primary text-[11px] uppercase tracking-[0.2em] font-sans font-bold border border-brand-border/50 rounded-full hover:bg-brand-border/30 transition-colors cursor-pointer"
                  >
                    {text("إغلاق", "Fermer")}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
