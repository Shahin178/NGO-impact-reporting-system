import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import Card from "../components/Card";

export default function BulkUpload() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  const uploadCSV = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/reports/upload", formData);
      setJobId(res.data.jobId);
      setStatus(null);
      setError(null);
    } catch (err) {
      setError("CSV upload failed");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    let pollCount = 0;
    const maxPolls = 30;

    const pollStatus = async () => {
      try {
        const res = await api.get(`/job-status/${jobId}`, {
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.data) return;

        setStatus(res.data);
        pollCount++;

        // ✅ STOP polling on terminal states
        if (["completed", "failed"].includes(res.data.status)) {
          clearTimeout(timerRef.current);
          return;
        }

        // ⛔ Stop after max retries
        if (pollCount >= maxPolls) {
          setError("Job is taking too long. Please refresh later.");
          return;
        }

        timerRef.current = setTimeout(pollStatus, 2000);
      } catch (err) {
        setError("Polling failed");
        console.error(err);
      }
    };

    pollStatus();

    // 🧹 Cleanup on unmount / jobId change
    return () => clearTimeout(timerRef.current);
  }, [jobId]);

  
    return (
  <Card title="Bulk Upload Reports (CSV)">
    <div className="space-y-4">
      {/* Upload */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={uploadCSV}
          className="block w-full text-sm
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
        />
      </div>

      {/* Status */}
      {status && (
        <div className="border rounded-lg p-4 bg-gray-50 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Processed</span>
            <span className="font-medium">
              {status.processedRows ?? 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Failed</span>
            <span className="font-medium text-red-600">
              {status.failedRows ?? 0}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Status</span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                status.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : status.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status.status}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
    </div>
  </Card>
);

  
}
