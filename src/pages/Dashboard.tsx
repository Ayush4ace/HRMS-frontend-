import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("/employees/");
    setEmployees(res.data);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="bg-white shadow p-6 rounded-xl w-64">
        <h3 className="text-gray-500">Total Employees</h3>
        <p className="text-3xl font-bold">{employees.length}</p>
      </div>
    </div>
  );
}
