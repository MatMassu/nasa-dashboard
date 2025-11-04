import { useState } from "react";
import { CMEResponse } from "../types";

export default function CmeDetails({
  data,
  selected,
  sortAsc,
  earthImpact,
}: {
  data: CMEResponse[];
  selected: string;
  sortAsc: boolean;
  earthImpact: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {data
        .filter((cme) => {
          const analysis = cme.cmeAnalyses?.find((a) => a.isMostAccurate);

          const yes =
            analysis?.enlilList[0]?.isEarthGB ||
            analysis?.enlilList[0]?.isEarthMinorImpact;
          switch (earthImpact) {
            case "all":
              return true;
            case "yes":
              return yes === true;
            case "no":
              return yes == false;
            default:
              return "no";
          }
        })

        .sort((a, b) => {
          const analysisA = a.cmeAnalyses?.find((x) => x.isMostAccurate);
          const analysisB = b.cmeAnalyses?.find((x) => x.isMostAccurate);
          let valA = 0;
          let valB = 0;

          switch (selected) {
            case "date":
              valA = new Date(a.startTime).getTime();
              valB = new Date(b.startTime).getTime();
              break;
            case "speed":
              valA = analysisA?.speed ?? 0;
              valB = analysisB?.speed ?? 0;
              break;
            case "strength":
              const kpValuesA = [
                analysisA?.enlilList?.[0]?.kp_18 ?? 0,
                analysisA?.enlilList?.[0]?.kp_90 ?? 0,
                analysisA?.enlilList?.[0]?.kp_135 ?? 0,
                analysisA?.enlilList?.[0]?.kp_180 ?? 0,
              ];
              const kpValuesB = [
                analysisB?.enlilList?.[0]?.kp_18 ?? 0,
                analysisB?.enlilList?.[0]?.kp_90 ?? 0,
                analysisB?.enlilList?.[0]?.kp_135 ?? 0,
                analysisB?.enlilList?.[0]?.kp_180 ?? 0,
              ];
              valA = Math.max(...kpValuesA);
              valB = Math.max(...kpValuesB);
              break;
            default:
              break;
          }
          return sortAsc ? valA - valB : valB - valA;
        })

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

          const isSelected = selectedId === cme.activityID;
          const kpMax = Math.max(
            enlil?.kp_18 ?? 0,
            enlil?.kp_90 ?? 0,
            enlil?.kp_135 ?? 0,
            enlil?.kp_180 ?? 0
          );
          const frequency = () => {
            if (analysis?.type === "S" || analysis?.type === "C") {
              return "Common";
            } else if (analysis?.type === "O") {
              return "Occasional";
            } else if (analysis?.type === "R") {
              return "Rare";
            } else return "Extremely Rare";
          };

          const impactType = () => {
            if (enlil?.isEarthMinorImpact) {
              return "Direct Impact";
            } else if (enlil?.isEarthGB && !enlil?.isEarthMinorImpact) {
              return "Partial Impact";
            } else return "No Impact";
          };

          return (
            <div
              key={cme.activityID}
              onClick={() => setSelectedId(isSelected ? null : cme.activityID)}
              className="bg-white w-[220px] h-[220px] cursor-pointer rounded-2xl p-4 shadow-md transition-all duration-200"
            >
              {!isSelected ? (
                <div className="text-black text-center">
                  <p>{localTime}</p>
                  <p>{kpMax > 0 ? `Kp ${kpMax}` : ""}</p>
                  <p>{impactType()}</p>
                  <p>{analysis?.speed} km/s</p>
                  <p> ({frequency()})</p>
                </div>
              ) : (
                <div className="absolute inset-0 text-white bg-black">
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
                    <strong>Kp (135° longitude):</strong>{" "}
                    {enlil?.kp_135 ?? "N/A"}
                  </p>
                  <p>
                    <strong>Kp (180° longitude):</strong>{" "}
                    {enlil?.kp_180 ?? "N/A"}
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
              )}
            </div>
          );
        })}
    </div>
  );
}
