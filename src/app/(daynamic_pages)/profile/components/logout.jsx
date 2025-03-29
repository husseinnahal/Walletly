"use client"
import { useTranslation } from "react-i18next";
import Image from "next/image"
import styles from "../page.module.css"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; 


export default function logout() {
  const {t}=useTranslation()
    const router=useRouter()
    
      const handleLogout = () => {
        Cookies.remove("Walletly_Token"); 
        router.push("/auth"); 
      };
    
  return (
    <div className={styles.logout} onClick={handleLogout}> 
        <h3>{t("logout")}</h3>
        <Image
        src="/images/logout.svg"
        width={30}
        height={30}
        alt="logout"
        />
  </div>
  )
}
