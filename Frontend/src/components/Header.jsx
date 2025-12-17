import { NavLink } from "react-router-dom";

export default function Header() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded text-sm ${
      isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <header className="bg-white shadow-sm mb-6">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">NGO Reporting</h1>

        <nav className="flex gap-2">
          <NavLink to="/submit" className={linkClass}>
            Submit Report
          </NavLink>
          <NavLink to="/upload" className={linkClass}>
            Bulk Upload
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
