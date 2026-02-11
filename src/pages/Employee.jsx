import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setPageLoading(true);
      const res = await API.get("/employees/");
      setEmployees(res.data);
    } catch (error) {
      toast.error(error.response.data.detail || "failed to load employees");
    } finally {
      setPageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/employees/", form);
      toast.success("Employee added successfully");
      setForm({ full_name: "", email: "", department: "" });
      fetchEmployees();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/employees/${id}`);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch (error) {
      toast.error("delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Employees</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full rounded"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Department"
          className="border p-2 w-full rounded"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Adding...." : "Add Employee"}
        </button>
      </form>

      {pageLoading ? (
        <div className="text-center py-10">Loading Employees....</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-gray-500">No Employees Found</div>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-3">{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
