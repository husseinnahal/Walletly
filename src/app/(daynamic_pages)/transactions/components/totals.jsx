"use client";
import { useTranslation } from "react-i18next";
import styles from "../page.module.css"
import { useMemo } from "react";
import { useSelector } from "react-redux";
import numeral from 'numeral';


export default function Totals({transactions}) {
    const {t} =useTranslation();
    const { income, expense } = useMemo(() => {
      let income = 0;
      let expense = 0;
  
      if (transactions && transactions.length) {
        transactions.forEach((tr) => {
          if (tr.type === "expense") {
            expense += tr.amount;
          } else if (tr.type === "income") {
            income += tr.amount;
          }
        });
      }
  
      return { income, expense };
    }, [transactions]);
  
    const balance = income - expense;

    const currency = useSelector((state) => state.currency.currency); 
    const formatNumber = (num) => {
      return numeral(num).format('0.00a');
    };
  return (
    <div className={styles.summery}>
        <h3  style={{color:"#3679FB" ,margin:"0"}}>{t("Tran.balance")}</h3>
        <h1 className={styles.cash} style={{color:balance<0?"#DC2626":""}}>{formatNumber(balance*currency.nb)} {currency.name}</h1>

        <div className={styles.totals}>

        <div className={styles.totalIn}>
            <p style={{margin:0}}>{t("Tran.tIncome")}</p>
            <div className={styles.nb} >
              <p  style={{margin:0}}>{formatNumber(income*currency.nb)} {currency.name}</p>
              <i className="pi pi-arrow-up" style={{ fontSize: '0.8rem' }}></i>
            </div>
        </div>

        <div className={styles.totalEx}>
            <p style={{margin:0}}>{t("Tran.tExpense")}</p>
            <div className={styles.nb}>
             <p style={{margin:0}}>{formatNumber(expense*currency.nb)} {currency.name}</p>
             <i className="pi pi-arrow-down" style={{ fontSize: '0.8rem' }}></i>
            </div>
        </div>

        </div>
    </div>
  )
}
