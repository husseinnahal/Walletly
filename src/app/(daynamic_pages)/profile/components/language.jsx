"use client";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie"; // Import js-cookie
import styles from "../page.module.css";

export default function Language() {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    Cookies.set("language", newLang, { expires: 365 }); // Store in cookies
  };

  return (
    <div>
      <select onChange={changeLanguage} value={i18n.language} className={styles.lang}>
        <option value="en">🇬🇧 English</option>
        <option value="ar">🇸🇦 العربية</option>
      </select>
    </div>
  );
}
