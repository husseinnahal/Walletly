"use client"
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/loader";
import styles from "../page.module.css"
import { useSelector } from "react-redux";
import numeral from 'numeral';
import GoalInfo from "./dialog"

export default function Goals({update}) {
    const {t} =useTranslation();
    const [goals,setGoals]=useState([])
    const [loader,setLoader]=useState(false)
    const [Dialog,setDialog]=useState(false)
    const [goal,setGoal]=useState(false)
    const [delGoal,setDelgoal]=useState(false)
 
    // gey all goals
    useEffect(()=>{
        const fetchGoals = async () => {
            setLoader(true);
            try {
              const token = Cookies.get("Walletly_Token");
              
              const response = await axios.get('https://walletlyapi.onrender.com/api/goals', {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              setGoals(response.data.data);  
            } catch (err) {
              setGoals([])
            } finally {
              setLoader(false);
            }
          };
      
          fetchGoals(); 
    },[update,delGoal])

    const currency = useSelector((state) => state.currency.currency); 
    const formatNumber = (num) => {
      return numeral(num).format('0.00a');
    };

    function openDialog(event){
      setDialog(true);
      setGoal(event)
    }

    function deleteGoal(){
      setDelgoal((del)=> !del)
    }

  return (
    <div>
        {loader ?
            <Loader/>:
            <div className={styles.goals}>
              {goals.length > 0 ?
              (
                goals.map((sv) => (
                  <div className={styles.goal} key={sv._id} onClick={()=>openDialog(sv)} >

                      <div className={styles.img} style={{ backgroundImage: `url(${sv.image || "/images/saving/goals.png"})` }}></div>
                      <div className={styles.info}>
                        <p style={{margin:0,marginBottom:"10px",fontWeight:700}}>{sv.title}</p>
                        <p className={styles.amount}>{formatNumber(sv.total*currency.nb)} {currency.name} {t("savings.from")} {formatNumber(sv.amount*currency.nb)} {currency.name}</p>
                        <div className={styles.target}>
                          <p className={styles.tofrom} style={{width:`${(sv.total*100)/sv.amount}%`,
                            backgroundColor: `${formatNumber(sv.total) == formatNumber(sv.amount) ? "#16a34a" : "#1B358D"}`
                          }}></p>
                        </div>
                      </div>

                  </div>
                ))
                
              ):
              (
                <p className={styles.notfound}>{t("savings.notfound")}</p>)
              }
            </div>
        }
        <GoalInfo visible={Dialog}  onClose={() => setDialog(false)} info={goal} handledel={deleteGoal}/>

    </div>
  )
}
