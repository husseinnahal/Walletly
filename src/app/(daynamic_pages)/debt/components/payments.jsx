"use client";
import styles from "../page.module.css";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import axios from "axios";
import Cookies from "js-cookie";
import numeral from 'numeral';
import { useSelector } from "react-redux";
import Loading from "@/components/loader";
import UpdatePay from "./updatePay"


export default function Payments({ visible, onClose, id ,refresh,onaddPay}) {
    const toast = useRef(null);
    const { t } = useTranslation();
    const [loader, setLoader] = useState(false);
    const [handelDel, setHandelDel] = useState(false);
    const [payments, setPayments] = useState([]);
    const [upPay, setUppay] = useState(false);
    const [pays, setPay] = useState(false);

    // get all payments
    useEffect(() => {       
        if (!id) return;
        const fetchPayments = async () => {
            setLoader(true);
            try {
                const token = Cookies.get("Walletly_Token");

                const response = await axios.get(`https://walletlyapi.onrender.com/api/debts/paid/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });                
                
                setPayments(response.data.data);
            } catch (err) {    
                console.log(err);
                          
                setPayments([]);
            } finally {
                setLoader(false);
            }
        };

        fetchPayments();
    }, [id,handelDel,onaddPay]);

    // delete a payment
    const accept = useCallback(async (idToDelete) => {
        try {
            const token = Cookies.get("Walletly_Token");
            await axios.delete(`https://walletlyapi.onrender.com/api/debts/paid/${id}/${idToDelete}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.current?.show({
                severity: "success",
                summary: t("savings.payment.del"),
                detail: t("savings.payment.Paydeleted"),
                life: 3000,
            });
            setHandelDel((del)=>!del)
            refresh()
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.current?.show({
                severity: "error",
                summary: "Deletion Failed",
                detail: error.response?.data?.message || "An error occurred while deleting.",
                life: 3000,
            });
        }
    }, [id]);

    const confirmDeletePay = (idToDelete) => {
        confirmDialog({
            message: t("savings.payment.confirmDelPay"),
            header: t("AddTran.delTran.conf"),
            icon: "pi pi-info-circle",
            defaultFocus: "reject",
            acceptClassName: "p-button-danger",
            accept: () => accept(idToDelete), 
        });
    };

    const currency = useSelector((state) => state.currency.currency);
    const formatNumber = (num) => {
        return numeral(num).format('0.0a');
    };

    const formatDate = (date) => {
        const newDate = new Date(date);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    };

    return (
        <>
            <Dialog
                header={t("savings.payment.payments")}
                visible={visible}
                onHide={onClose}
                maximizable
                style={{ width: "50vw" }}
                breakpoints={{ "960px": "65vw", "800px": "75vw", "641px": "80vw", "470px": "90vw" }}
            >
                {loader?
                    <Loading/>:
                
                    <div className={styles.payments}>
                        {payments.length >0?

                            (payments.map((pay) => (
                                <div className={styles.payment} key={pay._id}>
                                    <p style={{ margin: 0 }}>{formatDate(pay.date)}</p>
                                    <p style={{ margin: 0 }}>
                                        {formatNumber(pay.amount * currency.nb)} {currency.name}
                                    </p>
                                    <div className={styles.actions}>
                                        <i className={`${styles.upPay} pi pi-pencil`} onClick={()=>{setUppay(true);setPay(pay)}}></i>
                                        <i
                                            className={`${styles.upPay} pi pi-trash`}
                                            style={{ backgroundColor: "red" }}
                                            onClick={() => confirmDeletePay(pay._id)} 
                                        ></i>
                                    </div>
                                </div>
                            ))):

                            <p >{t("savings.payment.noPay")}</p>

                        }
                    </div>
                }
            </Dialog>

            <Toast ref={toast} />
            <UpdatePay  visible={upPay} onClose={() => setUppay(false)} debtId={id} pay={pays} handlePay={()=>setHandelDel((up)=>!up)} handleGoals={refresh}/>
            {/* <ConfirmDialog breakpoints={{ "960px": "60vw", "641px": "70vw", "450px": "85vw" }} /> */}
        </>
    );
}
