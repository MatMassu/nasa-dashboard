"use client";

import { useEffect, useState } from "react";
import { CMEResponse } from "./types";

export default function Home() {
  const [data, setData] = useState<CMEResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="items-center justify-center bg-[#0a3c9173] font-sans">
      <h1>CME Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
