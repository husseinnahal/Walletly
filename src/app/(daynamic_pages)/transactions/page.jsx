"use client";
import { useTranslation } from "react-i18next";
import Settings from "@/components/tosettings";
import styles from "./page.module.css"
import Summery from "./components/totals"
import AddCat from "./components/addCat";
import AddTran from "./components/addTran";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Loader from "@/components/loader";
import ShowDialog from "./components/showDialog";
import { useSelector } from "react-redux";
import numeral from 'numeral';

export default function Transactions() {
  const {t} =useTranslation();
  const [isDialogCat, setIsDialogCat] = useState(false);
  const [isDialogTran, setIsDialogTran] = useState(false);
  const [isDialogUp, setIsDialogUp] = useState(false);
  const [transaction, setTransaction] = useState(false);
  const [Tran, setTran] = useState([]);
  const [loader,setLoader]=useState(false)
  const [cat,setCat]=useState([])
  const [isUpdated, setIsUpdated] = useState(false);
  const [catUpdated, setCatUpdated] = useState(false);

  // filters
  const [filters, setFilters] = useState({
    categoryId: "",
    type: "",
    filterBy: "",
    startDate: "",
    endDate: ""
  });
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

// get transaction
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoader(true);
      try {
        const token = Cookies.get("Walletly_Token");

        const queryParams = new URLSearchParams();
        if (filters.categoryId) queryParams.append("categoryId", filters.categoryId);
        if (filters.type) queryParams.append("type", filters.type);
        if (filters.filterBy) queryParams.append("filterBy", filters.filterBy);
        if (filters.startDate) queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        
        const response = await axios.get(`https://walletlyapi.onrender.com/api/transaction?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setTran(response.data.data);  
      } catch (err) {
        
        setTran([])
      } finally {
        setLoader(false);
      }
    };

      fetchTransactions(); 

  }, [filters,isUpdated]);

// get categories
  useEffect(()=>{
  
    const fetchCategories = async () => {
      try {
        const token = Cookies.get("Walletly_Token");
        const response = await axios.get("https://walletlyapi.onrender.com/api/cat", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCat(response.data.data);
      } catch (err) {
        setCat([]);
      }
    };
    fetchCategories();
  },[catUpdated])
  
  // clear filters
  function clearFilter() {
    setFilters({
      categoryId: "",
      type: "",
      filterBy: "",
      startDate: "",
      endDate: ""
    });
  }

  // for filters
  const menuRight = useRef(null);
  const items = useMemo(() => [
    {
      label:  (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{t("filters.label")}</span>
          <button 
            style={{ padding: "5px 10px", backgroundColor: "#1B358D", color: "white", border: "none", cursor: "pointer",borderRadius:"10px" }}
            onClick={clearFilter}
          >
            {t("filters.clear")}
          </button>
        </div>
      ),
      items: [
        {
          template: () => (
            <div style={{ padding: "10px",color:"#1B358D"}}>

              <label style={{  marginBottom: "5px" }}>{t("filters.categories")}</label>
              <select className={styles.selections} value={filters.categoryId} onChange={(e) => updateFilter("categoryId", e.target.value)}>
                <option value="">{t("filters.all")}</option>
                  {cat.map((cat)=>(
                    <option value={cat._id} key={cat._id}>{cat.name}</option>

                  ))
                }
              </select>

              <label style={{  marginBottom: "5px" }}>{t("AddTran.type")}</label>
              <select className={styles.selections} value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}>
                <option value="">{t("filters.all")}</option>
                <option value="income">{t("filters.transactionTypes.income")}</option>
                <option value="expense">{t("filters.transactionTypes.expenses")}</option>
              </select>

              <label style={{ marginBottom: "5px" }}>{t("filters.date")}</label>
              <select className={styles.selections} value={filters.filterBy} onChange={(e) => updateFilter("filterBy", e.target.value)}>
                <option value="">{t("filters.all")}</option>
                <option value="today">{t("filters.dateOptions.today")}</option>
                <option value="thisWeek">{t("filters.dateOptions.week")}</option>
                <option value="thisMonth">{t("filters.dateOptions.month")}</option>
                <option value="thisYear">{t("filters.dateOptions.year")}</option>
              </select>


              <label style={{ marginBottom: "5px" }}>{t("filters.from")}</label>
              <input type="date" className={styles.selections} value={filters.startDate}  onChange={(e) => updateFilter("startDate", e.target.value)}/>

              <label style={{ marginBottom: "5px" }}>{t("filters.to")}</label>
              <input type="date" className={styles.selections} value={filters.endDate}  onChange={(e) => updateFilter("endDate", e.target.value)}/>
            </div>
          ),
        },
      ],
    }],[filters, cat, t]);

  function openUp(event){
    setIsDialogUp(true)
    setTransaction(event)
  }

  // when add transaction 
  function handleTransactionAdded (){
    setIsUpdated((prev) => !prev);
  };

    // when add cat 
  function handleCatAdded (){
      setCatUpdated((prev) => !prev);
  };
  

  const currency = useSelector((state) => state.currency.currency); 
  const formatNumber = (num) => {
    return numeral(num).format('0.0a');
  };

  return (
    <>
      <Settings/>

      <div className={styles.filters}>
        <div className={styles.adds}>
          <div className={styles.addTran} onClick={() => setIsDialogTran(true)}>{t("filters.addTransaction")}</div>
          <div className={styles.addTran} onClick={() => setIsDialogCat(true)}>{t("filters.addCat")}</div>
        </div>

          <Menu model={items}    popup ref={menuRight} className={styles.menufilter} id="popup_menu_right" popupAlignment="right" />
          <Button
            label={t("filters.showFilters")}
            icon="pi pi-filter"
            className={styles.btFilter}
            onClick={(event) => menuRight.current.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          />
      </div>

      {loader?
        <Loader/>:
        <>
          <Summery transactions={Tran} />

          <div className={styles.trans}>
            {Tran.length > 0 ?
            (
              Tran.map((tr) => (
                <div className={styles.Atran} key={tr._id}  onClick={()=>openUp(tr)}>
                  <div className={styles.infos}>
                    <div className={styles.img} style={{ backgroundImage: `url(${tr.categoryId.image})` }}></div>
                    <div className={styles.info}>
                      <p style={{margin:0,marginBottom:"10px",fontWeight:700}}>{tr.title}</p>
                      <p className={styles.catTran} style={{margin:0}}>{tr.categoryId.name}</p>
                    </div>
                  </div>
                    <p className={styles.amount} style={{color:tr.type==='income'?"#16A34A":"#DC2626"}} >{formatNumber(tr.amount*currency.nb)} {currency.name}</p>
                </div>
              ))
              
            ):
            (
              <p className={styles.notfound}>{t("AddTran.noTransactions")}</p>)
            }
          </div>
        </>
      }

      <AddCat visible={isDialogCat} onClose={() => setIsDialogCat(false)} onCatAdded={handleCatAdded} />
      <AddTran visible={isDialogTran} onClose={() => setIsDialogTran(false)} Cats={cat} onTransactionAdded={handleTransactionAdded}/>
      <ShowDialog visible={isDialogUp} onClose={() => setIsDialogUp(false)} handledel={handleTransactionAdded} info={transaction}  Cats={cat}/>
    </>
  )
}








        





