"use client"
import { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import styles from "../page.module.css"
import axios from "axios";
import Cookies from "js-cookie";
import Loader from "@/components/loader"

export default function PieChartDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loader, setLoader] = useState(false);
    const [selectedType, setSelectedType] = useState("income");

    useEffect(() => {
        const fetchData = async () => {
            setLoader(true);
            try {
                const token = Cookies.get("Walletly_Token");
                const response = await axios.get(`https://walletlyapi.onrender.com/api/transaction/tranbyCat`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const categories = response.data.categories || [];
                
                const labels = categories.map(category => category._id); // Category names
                const chartValues = categories.map(category => 
                    selectedType === "income" ? category.totalIncome : category.totalExpense
                );

                const data = {
                    labels: labels,
                    datasets: [
                        {
                            data: chartValues,
                            backgroundColor: [
                                "#16a34a", "#3b82f6", "#a855f7", "#f97316",
                                "#9333ea", "#fb923c", "#d97706", "#16c7f6", "#0d9488",
                                "#22c55e", "#e11d48", "#8b5cf6", "#06b6d4", "#dc2626",
                                "#d4d4d4", "#4ade80", "#f59e0b", "#facc15", "#ec4899", "#6ee7b7"
                            ],
                            hoverBackgroundColor: [
                                "#15803d", "#2563eb", "#9333ea", "#ea580c",
                                "#7e22ce", "#ea580c", "#ca8a04", "#0c4a6e", "#1e3a8a",
                                "#16a34a", "#9f1239", "#6d28d9", "#0891b2", "#b91c1c",
                                "#9ca3af", "#64d2a6", "#eab308", "#eab308", "#d02670", "#10b981"
                            ],
                        }
                    ]
                };

                setChartData(data);
            } catch (error) {
                console.error("Error fetching transaction categories:", error);
            } finally {
                setLoader(false);
            }
        };

        fetchData();

        setChartOptions({
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            let value = tooltipItem.raw; 
                            return `$${value.toLocaleString()}`;
                        }
                    }
                }
            }
        });

    }, [selectedType]);

    return (
        <div className={styles.piechart}>
            <div className={styles.headPie}>
                <h1 className={styles.titleBar}>{selectedType === "income" ? "Income" : "Expenses"} by Categories</h1>

                <select 
                    className={styles.yearSelector} 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)} 
                >
                    <option value="income">Income</option>
                    <option value="expense">Expenses</option>
                </select>
            </div>

            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                {loader ? <Loader /> :
                    <Chart type="pie" data={chartData} options={chartOptions} className={styles.pie} />
                }
            </div>
        </div>
    );
}
