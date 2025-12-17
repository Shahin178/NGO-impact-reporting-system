import { useState } from "react";
import api from "../api/api";
import Input from "../components/Input";
import Card from "../components/Card";

export default function SubmitReport() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValidMonth = (value) => {
    return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const formData = Object.fromEntries(new FormData(e.target));

    // 🔹 Basic validation
    if (!formData.ngoId || !formData.month) {
      setError("NGO ID and Month are required");
      return;
    }

    if (!isValidMonth(formData.month)) {
      setError("Month must be in YYYY-MM format");
      return;
    }

    const peopleHelped = Number(formData.peopleHelped);
    const eventsConducted = Number(formData.eventsConducted);
    const fundsUtilized = Number(formData.fundsUtilized);

    if (
      [peopleHelped, eventsConducted, fundsUtilized].some(
        (v) => isNaN(v) || v < 0
      )
    ) {
      setError("Numeric fields must be non-negative numbers");
      return;
    }

    try {
      setLoading(true);

      await api.post("/report", {
        ngoId: formData.ngoId,
        month: formData.month,
        peopleHelped,
        eventsConducted,
        fundsUtilized,
      });

      alert("Report submitted successfully");
      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Submit Monthly Report">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Input label="NGO ID" name="ngoId" required />
        <Input label="Month (YYYY-MM)" name="month" required />

        <Input
          label="People Helped"
          name="peopleHelped"
          type="number"
          min="0"
          required
        />
        <Input
          label="Events Conducted"
          name="eventsConducted"
          type="number"
          min="0"
          required
        />
        <Input
          label="Funds Utilized"
          name="fundsUtilized"
          type="number"
          min="0"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </Card>
  );
}
