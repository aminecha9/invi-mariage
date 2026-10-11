import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Language = "ar" | "fr";

interface LanguageContextValue {
  language: Language;
  direction: "rtl" | "ltr";
  toggleLanguage: () => void;
  text: (arabic: string, french: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = window.localStorage.getItem("invitation-language");
    return saved === "fr" ? "fr" : "ar";
  });

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: language === "ar" ? "rtl" : "ltr",
      toggleLanguage: () => {
        setLanguage((current) => {
          const next = current === "ar" ? "fr" : "ar";
          window.localStorage.setItem("invitation-language", next);
          return next;
        });
      },
      text: (arabic, french) => (language === "ar" ? arabic : french),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
