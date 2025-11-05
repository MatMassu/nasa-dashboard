"use client";

import { useEffect, useState } from "react";
import { CMEResponse } from "./types";
import CmeDetails from "./components/CmeDetails";
import { SlQuestion } from "react-icons/sl";
import Tooltip from "./components/Tooltip";

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

  if (error)
    return (
      <div className="flex items-center justify-center w-screen h-screen font-bold text-xl">
        <p>{error}</p>
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center w-screen h-screen font-bold text-xl">
        <p className="tracking-wide">
          Loading
          <span className="animate-pulse">.</span>
          <span className="animate-pulse delay-300">.</span>
          <span className="animate-pulse delay-600">.</span>
        </p>
      </div>
    );

  const tooltipText = () => {
    return (
      <div className="p-1">
        <h1 className="font-semibold text-base">Welcome to CME Watch</h1>
        <hr className="opacity-30 my-1"></hr>
        <p className="">
          This tool visualizes every{" "}
          <strong>
            <a
              href="https://www.nasa.gov/image-article/what-coronal-mass-ejection-or-cme/"
              className="text-blue-400 underline"
            >
              Coronal Mass Ejection (CME)
            </a>
          </strong>{" "}
          detected in the past 30 days using the latest data from NASA's DONKI
          system.{" "}
        </p>
        <p className="mt-2">
          Sort CMEs by <strong>date</strong>, <strong>speed</strong>, or{" "}
          <strong>strength</strong>, and filter by
          <strong> Earth impact type</strong>.
        </p>
        <h2 className="font-semibold mt-5">Cards</h2>
        <hr className="opacity-30 my-1"></hr>
        <section className="">
          Each card includes:
          <ul className="list-disc list-inside space-y-1.5 my-3 ml-2">
            <li>
              <strong>Time and date</strong> - When the CME occured, shown in
              your local time.
            </li>
            <li>
              <strong>
                <a
                  href="https://www.swpc.noaa.gov/noaa-scales-explanation"
                  className="text-blue-400 underline"
                >
                  Kp index
                </a>
              </strong>{" "}
              - A 1-9 scale of geomagnetic activity. Anything over 5 constitutes
              a geomagnetic storm, with higher numbers indicating a stronger
              effect on the planet.
            </li>
            <li>
              <strong>Impact type</strong> - Whether the CME hit Earth, and if
              the impact was direct or partial.
            </li>
            <li>
              <strong>Speed</strong> - The CME's velocity in km/s.
            </li>
            <li>
              <strong>Frequency</strong> - The event's rarity, color coded:
              <span className="text-lime-600"> Common</span>,
              <span className="text-yellow-500"> Occasional</span>,
              <span className="text-orange-500"> Rare</span>, and
              <span className="text-red-500"> Extremely Rare</span>.
            </li>
          </ul>
          <p className="mt-2">
            Click a card for detailed data and links to the official analysis.
          </p>
        </section>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[rgba(29,12,126,0.64)] font-sans">
      <Tooltip element={tooltipText()}>
        <div className="absolute left-2 top-3 w-8 h-8 text-3xl text-white">
          <SlQuestion />
        </div>
      </Tooltip>
      <div className="bg-black flex pt-2 w-screen justify-center">
        <p className="text-2xl font-bold select-none">CME Watch</p>
      </div>
      <header className="flex flex-wrap items-center justify-center gap-2 px-2 min-h-10 h-auto sm:h-10 min-w-screen bg-black text-white text-sm sm:text-base">
        <div className="flex flex-wrap justify-center gap-5">
          <button
            className="hover:font-bold active:scale-98 transform transition-all"
            onClick={() => {
              setSelected("date");
              setSortAsc((prev) => !prev);
            }}
          >
            Date {selected == "date" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            className="hover:font-bold active:scale-98 transform transition-all"
            onClick={() => {
              setSelected("speed");
              setSortAsc((prev) => !prev);
            }}
          >
            Speed {selected == "speed" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            className="hover:font-bold active:scale-98 transform transition-all"
            onClick={() => {
              setSelected("strength");
              setSortAsc((prev) => !prev);
            }}
          >
            Strength {selected == "strength" && (sortAsc ? "↑" : "↓")}
          </button>
          <button
            className="hover:font-bold active:scale-98 transform transition-all"
            onClick={toggleEarthImpact}
          >
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
