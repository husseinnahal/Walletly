"use client";

import { useState, useEffect } from "react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";

import enTranslation from "@/../public/locales/en.json";
import arTranslation from "@/../public/locales/ar.json";

export default function useI18n() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!i18next.isInitialized) {
      const savedLanguage = Cookies.get("language") || "en";

      i18next
        .use(initReactI18next)
        .init({
          resources: {
            en: { translation: enTranslation },
            ar: { translation: arTranslation },
          },
          lng: savedLanguage,
          fallbackLng: "en",
          interpolation: { escapeValue: false },
        })
        .then(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, []);

  return isInitialized;
}
