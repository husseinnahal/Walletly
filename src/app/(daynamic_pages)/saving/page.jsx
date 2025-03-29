"use client"
import { useState } from "react"
import styles from "./page.module.css"
import { useTranslation } from "react-i18next"
import AddGoal from "./components/addSaving"
import Goals from "./components/goals"
import Settings from "@/components/tosettings"



export default function Saving() {
    const {t}=useTranslation()
    const [addGoal,setAddGoal]=useState(false)
    const [upGoals,setUpGoal]=useState(false)

    function updateGoals(){
      setUpGoal((prev) => !prev)
    }

  return (
    <div>
          <div className={styles.addGoal} onClick={()=>setAddGoal(true)} >{t("savings.addGoal")}</div>

          <div className={styles.summery}>
            <h3 >{t("savings.saving")}</h3>
          </div>
          
          <Goals update={upGoals}/>


          <AddGoal visible={addGoal} onClose={() => setAddGoal(false)} onAdd={updateGoals}/>
          <Settings/>
    </div>
  )
}
