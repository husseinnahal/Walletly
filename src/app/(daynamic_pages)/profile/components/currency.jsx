"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setCurrency } from "@/redux/features/currencySlice";

export default function Currency() {
  const [currencies, setCurrencies] = useState({});

  const currency = useSelector((state) => state.currency.currency);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get("https://open.er-api.com/v6/latest/USD"); 
        setCurrencies(response.data.rates);
      } catch (err) {
        console.error("Error fetching currency data:", err);
      }
    };

    fetchRates();
  }, []);

  
  const handleCurrencyChange = (e) => {
    const selectedName = e.target.value;
    const selectedRate = currencies[selectedName];

    if (selectedRate) {
      dispatch(setCurrency({ name: selectedName, nb: selectedRate }));
    }
  };

  return (
      <select
        className={styles.lang}
        value={currency.name}
        style={{ width: "100px" }}
        onChange={handleCurrencyChange}
      >
        <option value="" disabled>Select Currency</option>
        {Object.entries(currencies).map(([key, value]) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
  );
}
