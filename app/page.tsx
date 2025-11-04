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
    <div className="flex flex-col min-h-screen bg-[rgba(29,12,126,0.64)] font-sans">
      <div className="bg-black flex pt-2 text-2xl font-bold w-screen justify-center">
        CME Watch
      </div>
      <header className="flex flex-wrap items-center justify-center gap-2 px-2 min-h-10 h-auto sm:h-10 min-w-screen bg-black text-white text-sm sm:text-base">
        <div className="flex flex-wrap justify-center gap-5">
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
