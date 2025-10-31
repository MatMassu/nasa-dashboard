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
  return (
    <>
      {data
        .filter((cme) => {
          const analysis = cme.cmeAnalyses?.find((a) => a.isMostAccurate);
          const gb = analysis?.enlilList[0]?.isEarthGB;
          const impact = analysis?.enlilList[0]?.isEarthMinorImpact;

          if (earthImpact === "any") return true;
          if (earthImpact === "gb") return gb === true;
          if (earthImpact === "impact") return impact === true;
          if (earthImpact === "no") return gb !== true && impact !== true;
          return true;
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
    </>
  );
}
