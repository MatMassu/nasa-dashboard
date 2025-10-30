"use client";

import { useEffect, useState } from "react";
import { CMEResponse } from "./types";

export default function Home() {
  const [data, setData] = useState<CMEResponse[] | null>(null);
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
    <div className="items-center max-w-screen justify-center bg-[#0a3c9173] font-sans">
      {data
        .filter((cme) =>
          cme.cmeAnalyses?.some((a) => a.isMostAccurate === true)
        )

        .map((cme) => {
          const analysis = cme.cmeAnalyses?.find((a) => a.isMostAccurate);
          const enlil = analysis?.enlilList?.[0];
          const notification = cme.sentNotifications?.[0];
          const localTime = new Date(cme.startTime).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          const localShockTime = enlil?.estimatedShockArrivalTime
            ? new Date(enlil.estimatedShockArrivalTime).toLocaleString(
                "en-US",
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              )
            : "N/A";
          const submissionTime = new Date(cme.submissionTime).toLocaleString(
            "en-US",
            { dateStyle: "medium", timeStyle: "short" }
          );

          return (
            <div key={cme.activityID} className="pb-8 pt-2 pl-2">
              <p>
                <strong>Start Time:</strong> {localTime} (
                {Intl.DateTimeFormat().resolvedOptions().timeZone})
              </p>
              <p>
                <strong>Note:</strong> {cme.note}
              </p>
              <p>
                <strong>Speed:</strong> {analysis?.speed ?? "N/A"} km/s
              </p>
              <p>
                <strong>Type:</strong> {analysis?.type ?? "N/A"}
              </p>
              <p>
                <strong>Submission Time:</strong> {submissionTime}
              </p>
              <p>
                <strong>Link:</strong>{" "}
                <a href={cme.link} className="text-blue-500 underline">
                  View CME
                </a>
              </p>
              <p>
                <strong>Estimated Shock Arrival: </strong>
                {localShockTime}
              </p>
              <p>
                <strong>Kp (18° longitude):</strong> {enlil?.kp_18 ?? "N/A"}
              </p>
              <p>
                <strong>Kp (90° longitude):</strong> {enlil?.kp_90 ?? "N/A"}
              </p>
              <p>
                <strong>Kp (135° longitude):</strong> {enlil?.kp_135 ?? "N/A"}
              </p>
              <p>
                <strong>Kp (180° longitude):</strong> {enlil?.kp_180 ?? "N/A"}
              </p>
              <p>
                <strong>Earth Glancing Blow:</strong>{" "}
                {enlil?.isEarthGB ? "True" : "False"}
              </p>
              <p>
                <strong>Earth Minor Impact:</strong>{" "}
                {enlil?.isEarthMinorImpact ? "True" : "False"}
              </p>
              <p>
                <strong>Message: </strong>
                {notification?.messageURL ? (
                  <a
                    href={notification.messageURL}
                    className="text-blue-500 underline"
                  >
                    View Alert
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
            </div>
          );
        })}
    </div>
  );
}
