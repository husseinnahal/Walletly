"use client";
import { I18nextProvider } from "react-i18next";
import useI18n from "./i18n"; 
import i18next from "i18next"; 
import Navbar from "@/components/navbar";
import "./globals.css";
import { useEffect, useState } from "react";
import Loading from "../loading";
import ReduxProvider from "@/redux/ReduxProvider";

export default function Layout({ children }) {
  const isInitialized = useI18n(); 

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    setIsLoading(false);

    // Function to update direction based on language
    const updateDirection = (lng) => {
      document.documentElement.setAttribute("dir", lng === "ar" ? "rtl" : "ltr");
    };

    // Set initial direction
    updateDirection(i18next.language);

    // Listen for language changes
    i18next.on("languageChanged", updateDirection);

    // Cleanup event listener when unmounting
    return () => {
      i18next.off("languageChanged", updateDirection);
    };
  }, [isInitialized]); 

  if (isLoading) return <Loading/>; 

  return (
    <ReduxProvider>
      <I18nextProvider i18n={i18next}>
        <div className="containerpages">
          {children}
          <Navbar />
        </div>
      </I18nextProvider>
    </ReduxProvider>
  );
}
