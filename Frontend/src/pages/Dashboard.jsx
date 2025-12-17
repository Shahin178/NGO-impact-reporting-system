import { useState } from "react";
import api from "../api/api";
import Card from "../components/Card";

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function Dashboard() {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState(null);

  const fetchDashboard = async () => {
    if (!month || !year) return;

    const formattedMonth = `${year}-${month}`;
    const res = await api.get(`/dashboard?month=${formattedMonth}`);
    setData(res.data);
  };

  return (
    <Card title="Admin Dashboard">
      <div className="flex gap-2 mb-4">
        {/* Month */}
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Year</option>
          {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          onClick={fetchDashboard}
          disabled={!month || !year}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-65"
        >
          View
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Total NGOs: {data.totalNGOs}</div>
          <div>People Helped: {data.peopleHelped}</div>
          <div>Events Conducted: {data.eventsConducted}</div>
          <div>Funds Utilized: ₹{data.fundsUtilized}</div>
        </div>
      )}
    </Card>
  );
}
