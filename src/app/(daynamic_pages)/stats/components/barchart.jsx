"use client";
import Loading from "@/components/loader";
import axios from "axios";
import Cookies from "js-cookie";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "../page.module.css";

export default function BarChart() {
    const { t } = useTranslation();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [year, setYear] = useState(new Date().getFullYear()); 
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const token = Cookies.get("Walletly_Token");
                const response = await axios.get(`https://walletlyapi.onrender.com/api/transaction/monthlystats?year=${year}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setData(response.data.data);

                if (response.data.status) {
                    const stats = response.data.data; // Array with month, income, expenses

                    const labels = stats.map(item => item.month);
                    const incomeData = stats.map(item => parseFloat(item.income));
                    const expensesData = stats.map(item => parseFloat(item.expenses));

                    const data = {
                        labels,
                        datasets: [
                            {
                                label: "Income",
                                backgroundColor: "#16a34a",
                                data: incomeData
                            },
                            {
                                label: "Expenses",
                                backgroundColor: "#dc2626",
                                data: expensesData
                            }
                        ]
                    };

                    const options = {
                        maintainAspectRatio: false,
                        aspectRatio: 1,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        let value = context.raw;
                                        return `$${value.toFixed(2)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                ticks: {
                                    callback: function (value) {
                                        return `$${value}`; 
                                    }
                                }
                            }
                        }
                    };

                    setChartData(data);
                    setChartOptions(options);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [year]); 

    return (
        <div className={styles.barchart}>
            <div className={styles.head}>
                <h1 className={styles.titleBar}>{t("Stats.InEx")}</h1>

                <select 
                    className={styles.yearSelector} 
                    value={year} 
                    onChange={(e) => setYear(parseInt(e.target.value))}
                >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <Loading />
            ) : (
                <div>
                    {data.length > 0 ? (
                        <Chart type="bar" data={chartData} options={chartOptions} className={styles.ee} />
                    ) : (
                        <p style={{ textAlign: "center", margin: "50px 0" }}>
                            {t("Stats.noTransactions")}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
