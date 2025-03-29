"use client";
import styles from "../page.module.css";
import { useTranslation } from "react-i18next";
import { useRef, useCallback, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import Cookies from "js-cookie";
import UpdateGoal from "./updateGoal"
import AddPayment from "./addPayment"
import Payments from "./payments"

export default function ShowDialog({ visible, onClose ,info,handledel }) {
    const toast = useRef(null);
    const {t} =useTranslation();
    const [UpGoalDialog, setUpgoaldialog] = useState(false);
    const [addpay, setAddPayment] = useState(false);
    const [payments, setPayments] = useState(false);
    const [refreshPayments, setRefreshPayments] = useState(false);


    const accept = useCallback(async () => {
        try {
            const token = Cookies.get("Walletly_Token");
            await axios.delete(`https://walletlyapi.onrender.com/api/goals/${info._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            handledel(); 
            toast.current?.show({
                severity: "success",
                summary: t("savings.summary"),
                detail: t("savings.deleted"),
                life: 3000,
            });

        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.current?.show({
                severity: "error",
                summary: "Deletion Failed",
                detail: error.response?.data?.message || "An error occurred while deleting.",
                life: 3000,
            });
        }
    }, [info]);

    const confirmDelete = () => {
        onClose();  
        confirmDialog({
            message:t("savings.confirmDel"),
            header: t("AddTran.delTran.conf"),
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept,
        });
    };

    const handlePaymentAdded = () => {
        setRefreshPayments((prev) => !prev);
    };
        
    return (
        <>
            <Dialog
                header={t("savings.saving")}
                visible={visible}
                onHide={onClose}
                style={{ width: "50vw" }}
                breakpoints={{ "960px": "65vw", "800px": "75vw","641px": "80vw","380px": "90vw" }}
            >
                <p>{info.title}</p>
                <div className={styles.goalinfo}>
                    <p  className={styles.edit} onClick={()=> setPayments(true)}>{t("savings.payment.payments")}</p>
                    <p  className={styles.edit} onClick={()=> {setAddPayment(true),onClose()}}>{t("savings.payment.addPay")}</p>
                    <p className={styles.edit}  onClick={()=>{setUpgoaldialog(true),onClose()}}>{t("edit")}</p>
                    <p onClick={confirmDelete} className={styles.del}>{t("delete")}</p>
                </div>
            </Dialog>

            <Toast ref={toast} />

            <ConfirmDialog breakpoints={{ "960px": "60vw", "641px": "70vw", "450px": "85vw" }}/>
            <UpdateGoal visible={UpGoalDialog} onClose={() => setUpgoaldialog(false)}  info={info} updated={handledel}/>
            <AddPayment visible={addpay} onClose={() => setAddPayment(false)}  id={info._id} added={() => {handlePaymentAdded();handledel()}} />
            <Payments visible={payments} onClose={() => setPayments(false)}  id={info._id} refresh={handledel} onaddPay={refreshPayments}/>
        </>
    );
}
