"use client"
import { useTranslation } from "react-i18next";
import { useState } from "react";
import styles from "../page.module.css"
import Updatepass from "./updatePass"

export default function Changepass() {
  const [isDialogPass, setIsDialogPass] = useState(false);
  const {t}=useTranslation()

  return (
    <>
        <div className={styles.feature} style={{cursor:"pointer"}} onClick={() => setIsDialogPass(true)}>
            <h3>{t("pass")}</h3>
        </div>
        <Updatepass visible={isDialogPass} onClose={() => setIsDialogPass(false)} />
        
    </>
  )
}
