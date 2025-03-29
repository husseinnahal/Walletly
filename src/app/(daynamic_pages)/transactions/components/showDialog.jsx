"use client";
import styles from "../page.module.css";
import { useTranslation } from "react-i18next";
import { useRef, useCallback, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import Cookies from "js-cookie";
import UpTransaction from "./upTran"

export default function ShowDialog({ visible, onClose, info, handledel,Cats }) {
    const toast = useRef(null);
    const {t} =useTranslation();
    const [isDialogTran, setIsDialogTran] = useState(false);


    const accept = useCallback(async () => {
        try {
            const token = Cookies.get("Walletly_Token");
            await axios.delete(`https://walletlyapi.onrender.com/api/transaction/${info._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            handledel(); 
            toast.current?.show({
                severity: "success",
                summary: t("AddTran.delTran.summary"),
                detail: t("AddTran.delTran.detail"),
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
    }, [info, handledel]);

    const confirmDelete = () => {
        onClose();  
        confirmDialog({
            message:t("AddTran.delTran.message"),
            header: t("AddTran.delTran.conf"),
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept,
        });
    };

    
    return (
        <>
            <Dialog
                header={t("AddTran.delTran.trn")}
                visible={visible}
                onHide={onClose}
                style={{ width: "50vw" }}
                breakpoints={{ "960px": "65vw", "641px": "80vw" }}
            >
                <p>{info.title}</p>
                <div className={styles.up}>
                    <p className={styles.edit} onClick={()=>{setIsDialogTran(true);onClose()}}>{t("edit")}</p>
                    <p onClick={confirmDelete} className={styles.del}>{t("delete")}</p>
                </div>
            </Dialog>

            <Toast ref={toast} />
            <ConfirmDialog breakpoints={{ "960px": "60vw", "641px": "70vw", "450px": "85vw" }}/>
            <UpTransaction visible={isDialogTran} onClose={() => setIsDialogTran(false)} onTransactionUP={handledel} Cats={Cats} info={info} />
            
        </>
    );
}
