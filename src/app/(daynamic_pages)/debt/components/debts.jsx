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

export default function Debts({update}) {
    const {t} =useTranslation();
    const [debts,setDebts]=useState([])
    const [loader,setLoader]=useState(false)
    const [Dialog,setDialog]=useState(false)
    const [debt,setDebt]=useState(false)
    const [delDebt,setDelDebt]=useState(false)
 
    // get all debt
    useEffect(()=>{
        const fetchGoals = async () => {
            setLoader(true);
            try {
              const token = Cookies.get("Walletly_Token");
              
              const response = await axios.get('https://walletlyapi.onrender.com/api/debts', {
                headers: { Authorization: `Bearer ${token}` },
              });
              
              setDebts(response.data.data);  
            } catch (err) {
              setDebts([])
            } finally {
              setLoader(false);
            }
          };
      
          fetchGoals(); 
    },[update,delDebt])

    const currency = useSelector((state) => state.currency.currency); 
    const formatNumber = (num) => {
      return numeral(num).format('0.0a');
    };

    function openDialog(event){
      setDialog(true);
      setDebt(event)
    }

    function deleteDebt(){
      setDelDebt((del)=> !del)
    }

  return (
    <div>
        {loader ?
            <Loader/>:
            <div className={styles.goals}>
              {debts.length > 0 ?
              (
                debts.map((db) => (
                  <div className={styles.goal} key={db._id} onClick={()=>openDialog(db)} >

                      <div className={styles.info}>
                        <p style={{margin:0,marginBottom:"10px",fontWeight:700}}>{db.forWhom}</p>
                        <p className={styles.amount}>{formatNumber(db.total*currency.nb)} {currency.name} {t("savings.from")} {formatNumber(db.amount*currency.nb)} {currency.name}</p>
                        <div className={styles.target}>
                          <p className={styles.tofrom} style={{width:`${(db.total*100)/db.amount}%`,
                          backgroundColor: `${formatNumber(db.total) == formatNumber(db.amount) ? "#16a34a" : "#1B358D"}` }}></p>
                        </div>
                      </div>

                  </div>
                ))
                
              ):
              (
                <p className={styles.notfound}>{t("Debt.notfound")}</p>)
              }
            </div>
        }
        <GoalInfo visible={Dialog}  onClose={() => setDialog(false)} info={debt} handledel={deleteDebt}/>

    </div>
  )
}
