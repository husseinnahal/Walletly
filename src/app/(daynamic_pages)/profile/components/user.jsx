"use client"
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import styles from "../page.module.css"
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "@/components/loader"
import "primeicons/primeicons.css";
import UpdateUser from "./updateUser"

export default function User() {
  const {t}=useTranslation()

  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [UserUpdated, setUserUpdated] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = Cookies.get("Walletly_Token"); 
            const response = await axios.get("https://walletlyapi.onrender.com/api/auth", {
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            });
            
            setUser(response.data.data); 
            setLoading(false); 
          } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false); 
          }
        };
    
        fetchUserData();
    }, [UserUpdated]);
    
      if (loading) {
        return <Loading/>;
      }
    
      function OnUpdateUser (){
        setUserUpdated((prev) => !prev);
      };

  return (
    <>
        <div className={styles.user}>

            <div className={styles.infoUser}>
            <div
                className={styles.imguser}
                style={{ backgroundImage: `url(${user.image || "/images/user/user.png"})` }}
            ></div>

            <div>
                <h1 style={{fontSize:"20px"}}>{user.username}</h1>
                <p>{user.email}</p>
            </div>
            </div>

            <div className={styles.editUser} onClick={() => setIsDialogVisible(true)}>
            <i className="pi pi-pencil" style={{ fontSize: "1rem" }}></i>
            <p style={{ margin: "0" }}>{t("edit")}</p>
            </div>

        </div>
        <UpdateUser visible={isDialogVisible} onClose={() => setIsDialogVisible(false)} user={user} onUpdate={OnUpdateUser}/>
        
    </>
  )
}
