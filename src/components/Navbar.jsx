import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-gray-900 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-lg">HRMS Lite</h1>
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/employees">Employees</Link>
        <Link to="/attendance">Attendance</Link>
      </div>
    </div>
  );
}
