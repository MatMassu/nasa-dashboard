"use client";

import { useEffect, useState } from "react";
import { CMEResponse } from "./types";
import CmeDetails from "./components/CmeDetails";

export default function Home() {
  const [data, setData] = useState<CMEResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [earthImpact, setEarthImpact] = useState<"all" | "yes" | "no">("all");

  function toggleEarthImpact() {
    setEarthImpact((prev) => {
      switch (prev) {
        case "all":
          return "yes";
        case "yes":
          return "no";
        case "no":
          return "all";
      }
    });
  }

  useEffect(() => {
    async function fetchCME() {
      try {
        const res = await fetch("/api/cme");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Failed to load CME data");
        console.error(err);
      }
    }
    fetchCME();
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="flex flex-col bg-[#0a3c9173] font-sans">
      <header className="flex items-center h-12 min-w-screen bg-black">
        <div className="flex min-w-40 justify-between gap-x-8">
          <strong>
            <p className="ml-2">Sort by:</p>
          </strong>
          <button
            className=""
            onClick={() => {
              setSelected("date");
              setSortAsc((prev) => !prev);
            }}
          >
            Date {selected == "date" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            className=""
            onClick={() => {
              setSelected("speed");
              setSortAsc((prev) => !prev);
            }}
          >
            Speed {selected == "speed" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            className=""
            onClick={() => {
              setSelected("strength");
              setSortAsc((prev) => !prev);
            }}
          >
            Strength {selected == "strength" && (sortAsc ? "↑" : "↓")}
          </button>
          <button className="" onClick={toggleEarthImpact}>
            Earth Impact:{" "}
            {earthImpact == "all" ? "All" : earthImpact == "yes" ? "Yes" : "No"}
          </button>
        </div>
      </header>
      <CmeDetails
        data={data}
        selected={selected}
        sortAsc={sortAsc}
        earthImpact={earthImpact}
      ></CmeDetails>
    </div>
  );
}
