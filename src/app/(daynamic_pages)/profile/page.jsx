"use client";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css";
import Themtoggle from "@/components/ThemeToggle";
import User from "./components/user";
import Updatepass from "./components/changepass";
import Logout from "./components/logout";
import Language from "./components/language";
import Currency from "./components/currency";

export default function Profile() {
  const { t } = useTranslation();

  return (
    <div>
      <User />

      <div className={styles.settings}>
        <div className={styles.feature}>
          <h3>{t("switchTheme")}</h3>
          <Themtoggle />
        </div>

        <div className={styles.feature}>
          <h3>{t("language")}</h3>
          <Language />
        </div>

        <div className={styles.feature}>
          <h3>{t("currency")}</h3>
          <Currency/>
        </div>

        <Updatepass />
        <Logout />
      </div>
    </div>
  );
}
