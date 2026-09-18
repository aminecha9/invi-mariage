import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Maximize2 } from "lucide-react";
import photo1 from "../assets/Photo 1.png";
import photo2 from "../assets/Photo 2.png";

interface PhotoItem {
  id: string;
  src: string;
  title: string;
  titleEn: string;
  caption: string;
  tag: string;
  year?: string;
}

const galleryPhotos: PhotoItem[] = [
  {
    id: "photo-1",
    src: photo1,
    title: "بداية الحكاية",
    titleEn: "Sweet Childhood",
    caption: "ذكريات طفولة بريئة كانت أول سطور في أجمل قصة حب",
    tag: "Then • طفولتنا",
  },
  {
    id: "photo-2",
    src: photo2,
    title: "فرحتنا اليوم",
    titleEn: "Wedding Day",
    caption: "واليوم نحتفل معًا ببداية حياتنا نحو المستقبل والأبد",
    tag: "Now • زفافنا",
  },
];

// Ornate Classic Floral Divider SVG
const OrnateFloralDivider = ({ className = "" }: { className?: string }) => (
  <div
    className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
  >
    <svg
      width="45"
      height="16"
      viewBox="0 0 100 30"
      fill="none"
      className="text-brand-accent/70 rotate-180 sm:w-[60px] sm:h-[20px]"
    >
      <path
        d="M10 15 C 30 15, 45 5, 60 15 C 75 25, 90 15, 100 15 M 40 15 C 45 8, 55 8, 60 15 C 55 22, 45 22, 40 15 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="8" cy="15" r="3" fill="currentColor" />
      <circle cx="25" cy="11" r="2" fill="currentColor" />
    </svg>

    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rotate-45 border border-brand-accent bg-brand-accent/20"></div>

    <svg
      width="45"
      height="16"
      viewBox="0 0 100 30"
      fill="none"
      className="text-brand-accent/70 sm:w-[60px] sm:h-[20px]"
    >
      <path
        d="M10 15 C 30 15, 45 5, 60 15 C 75 25, 90 15, 100 15 M 40 15 C 45 8, 55 8, 60 15 C 55 22, 45 22, 40 15 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="8" cy="15" r="3" fill="currentColor" />
      <circle cx="25" cy="11" r="2" fill="currentColor" />
    </svg>
  </div>
);

export default function Gallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [likes, setLikes] = useState<{ [key: string]: number }>({
    "photo-1": 128,
    "photo-2": 256,
  });
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked[id]) {
      setLikes((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setLiked((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setLiked((prev) => ({ ...prev, [id]: true }));
    }
  };

  return (
    <section className="w-full relative mb-16 sm:mb-28 flex flex-col items-center">
      {/* Background Watermark */}
      <span className="absolute text-6xl sm:text-8xl md:text-[140px] font-sans font-black text-brand-faint -z-10 opacity-60 uppercase tracking-tighter top-0 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        GALLERY
      </span>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-12 relative z-10 flex flex-col items-center px-4"
      >
        <OrnateFloralDivider className="mb-3 sm:mb-4" />

        <h2 className="font-serif tracking-[0.25em] text-xs sm:text-base uppercase font-bold text-brand-primary mb-1 sm:mb-2">
          PHOTO GALLERY
        </h2>

        <h3 className="font-arabic text-2xl sm:text-4xl font-bold text-brand-accent mt-1 mb-2">
          ذكرياتنا الجميلة
        </h3>

        <p className="font-arabic text-brand-secondary text-xs sm:text-base max-w-md mx-auto font-medium">
          "من طفولة بريئة ملؤها المحبة.. إلى موعد جمعنا على طريق العمر"
        </p>

        <div className="w-16 h-[1px] bg-brand-border/60 mt-4 mb-2"></div>
      </motion.div>

      {/* Photos Grid - Luxury Frame Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 w-full max-w-4xl px-3 sm:px-4 z-10">
        {galleryPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            whileHover={{ y: -6 }}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative cursor-pointer flex flex-col items-center bg-gradient-to-b from-white/95 via-[#fcfaf7]/95 to-[#f7f2ea]/95 backdrop-blur-md rounded-2xl border border-brand-border/60 p-3.5 sm:p-6 shadow-md hover:shadow-xl hover:border-brand-accent transition-all duration-500"
          >
            {/* Top Ornate Pin / Badge */}
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-widest text-brand-accent uppercase bg-brand-accent/10 px-2.5 sm:px-3 py-1 rounded-full border border-brand-accent/30">
                {photo.tag}
              </span>

              {/* Interactive Like Button */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={(e) => handleLike(photo.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                  liked[photo.id]
                    ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-xs"
                    : "bg-brand-faint/80 text-brand-secondary hover:text-brand-primary border border-brand-border/40"
                }`}
                aria-label="Like photo"
              >
                <Heart
                  size={14}
                  className={
                    liked[photo.id]
                      ? "fill-rose-500 text-rose-500"
                      : "text-brand-secondary"
                  }
                />
                <span className="tabular-nums">{likes[photo.id]}</span>
              </motion.button>
            </div>

            {/* Photo Card with Archival Frame and Double Border */}
            <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-b from-[#f8f5f0] via-[#f3ede3] to-[#ebe3d5] p-2 sm:p-3 border border-brand-border/60 flex items-center justify-center shadow-inner">
              {/* Gold Filigree Inner Frame */}
              <div className="absolute inset-1.5 sm:inset-2 border border-brand-accent/40 rounded-lg pointer-events-none z-10 transition-all duration-500 group-hover:border-brand-accent group-hover:scale-[0.98]"></div>

              {/* Corner Floral Ornaments in Frame */}
              <div className="absolute top-2.5 right-2.5 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t-2 border-r-2 border-brand-accent/70 z-10 pointer-events-none"></div>
              <div className="absolute bottom-2.5 left-2.5 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b-2 border-l-2 border-brand-accent/70 z-10 pointer-events-none"></div>

              {/* Image */}
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-contain object-bottom drop-shadow-sm group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Hover Zoom Prompt Overlay */}
              <div className="absolute inset-0 bg-brand-primary/25 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-20">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-bg/95 text-brand-primary flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Maximize2 size={18} strokeWidth={1.8} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider text-white uppercase bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                  اضغط للتكبير
                </span>
              </div>
            </div>

            {/* Captions & Typography */}
            <div className="w-full mt-4 sm:mt-5 text-center flex flex-col items-center">
              <h3 className="font-arabic text-xl sm:text-2xl font-bold text-brand-primary mb-0.5 sm:mb-1">
                {photo.title}
              </h3>
              <span className="font-serif italic text-[11px] sm:text-xs text-brand-accent tracking-widest uppercase mb-1.5 sm:mb-2">
                {photo.titleEn}
              </span>
              <p className="font-arabic text-xs sm:text-sm text-brand-secondary leading-relaxed px-1 font-medium">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Floral Divider */}
      <OrnateFloralDivider className="mt-8 sm:mt-12" />

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 text-brand-primary flex items-center justify-center shadow-2xl hover:bg-brand-accent hover:text-white transition-colors z-50 cursor-pointer"
              aria-label="Close photo preview"
            >
              <X size={18} />
            </motion.button>

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full max-h-[92vh] overflow-y-auto bg-brand-bg rounded-2xl border-2 border-brand-accent/40 p-4 sm:p-6 shadow-2xl flex flex-col items-center cursor-default"
            >
              {/* Header inside modal */}
              <div className="w-full flex items-center justify-between mb-3">
                <span className="text-[10px] font-sans font-bold tracking-widest text-brand-accent uppercase bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/30">
                  {selectedPhoto.tag}
                </span>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleLike(selectedPhoto.id, e)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold transition-all cursor-pointer ${
                    liked[selectedPhoto.id]
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-brand-faint text-brand-secondary border border-brand-border/40"
                  }`}
                >
                  <Heart
                    size={14}
                    className={
                      liked[selectedPhoto.id]
                        ? "fill-rose-500 text-rose-500"
                        : "text-brand-secondary"
                    }
                  />
                  <span>{likes[selectedPhoto.id]}</span>
                </motion.button>
              </div>

              {/* Image Frame in Modal */}
              <div className="relative w-full max-h-[50vh] sm:max-h-[56vh] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-brand-faint/60 via-brand-bg to-brand-faint/80 p-2 sm:p-3 border border-brand-border/40">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[46vh] sm:max-h-[52vh] w-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Text & Details */}
              <div className="w-full mt-3 sm:mt-4 text-center">
                <h3 className="font-arabic text-xl sm:text-2xl font-bold text-brand-primary">
                  {selectedPhoto.title}
                </h3>
                <p className="font-serif italic text-xs text-brand-accent mt-0.5 mb-1.5 sm:mb-2">
                  {selectedPhoto.titleEn}
                </p>
                <p className="font-arabic text-xs sm:text-sm text-brand-secondary leading-relaxed max-w-sm mx-auto">
                  {selectedPhoto.caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
