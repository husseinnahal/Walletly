"use client";
import { useTranslation } from "react-i18next";
import styles from "./page.module.css"
import Link from "next/link"
import Image from "next/image"
import 'primeicons/primeicons.css';



export default function Navbar() {
    const {t}=useTranslation();

  return (
    <div className={styles.navbar}>

        <Link href="/transactions" className={styles.topage}>
            <i className="pi pi-dollar" style={{ fontSize: '1rem' }}></i>
            <p>{t("tran")}</p>
        </Link>    

        <Link href="/saving" className={styles.topage}>
            <Image src="/images/navbar/saving.svg"
             width={20}
             height={20}
             alt="saving"
            />            
            <p>{t("saving")}</p>
        </Link>  

        <Link href="/debt" className={styles.topage}>
            <Image src="/images/navbar/debt.svg"
             width={20}
             height={20}
             alt="debt"
            />
            <p>{t("debt")}</p>
        </Link>   
        
        <Link href="/stats" className={styles.topage}>
            <i className="pi pi-chart-line" style={{ fontSize: '1rem' }}></i>
            <p>{t("stats")}</p>
        </Link>   

    </div>
  )
}
