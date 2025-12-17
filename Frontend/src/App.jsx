import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import SubmitReport from "./pages/SubmitReport";
import BulkUpload from "./pages/BulkUpload";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-6 space-y-6">
        <Routes>
          <Route path="/" element={<Navigate to="/submit" />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/upload" element={<BulkUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
}
