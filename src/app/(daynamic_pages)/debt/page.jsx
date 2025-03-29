"use client"
import { useState } from "react"
import styles from "./page.module.css"
import { useTranslation } from "react-i18next"
import AddDebt from "./components/addDebt"
import Debts from "./components/debts"
import Settings from "@/components/tosettings"



export default function Debt() {
    const {t}=useTranslation()
    const [addGoal,setAddGoal]=useState(false)
    const [upDebts,setUpDebts]=useState(false)

    function updateDebts(){
      setUpDebts((prev) => !prev)
    }

  return (
    <div>
          <div className={styles.addGoal} onClick={()=>setAddGoal(true)} >{t("Debt.adddebt")}</div>

          <div className={styles.summery}>
            <h3 >{t("Debt.debt")}</h3>
          </div>
          
          <Debts update={upDebts}/>


          <AddDebt visible={addGoal} onClose={() => setAddGoal(false)} onAdd={updateDebts}/>
          <Settings/>
    </div>
  )
}
