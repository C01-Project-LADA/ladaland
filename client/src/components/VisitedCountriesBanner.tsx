"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "@/styles/VisitedCountriesBanner.module.css";

export default function VisitedCountriesBanner() {
  const [visitedMessage, setVisitedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVisitedPercentage() {
      try {
        const response = await axios.get("http://localhost:4000/api/visitedCountriesPercent", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setVisitedMessage(response.data.message);
        } else {
          setVisitedMessage("Unable to get visited countries data.");
        }
      } catch (error) {
        console.error("Error getting visited countries percent:", error);
        setVisitedMessage("Error loading travel progress.");
      }
    }

    fetchVisitedPercentage();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header_block}>
        <h2>Travel Progress</h2>
        <h1>{visitedMessage ?? "Loading your travel progress..."}</h1>
      </div>
    </div>
  );
}
