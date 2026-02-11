import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
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
      toast.error("Failed to load employees");
    } finally {
      setPageLoading(false);
    }
  };

  const markAttendance = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await API.post("/attendance/", form);
      toast.success("Attendance marked successfully");

      setForm({
        employee_id: "",
        date: "",
        status: "Present",
      });
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (id) => {
    try {
      setAttendanceLoading(true);
      const res = await API.get(`/attendance/${id}`);
      setAttendance(res.data);
    } catch (error) {
      toast.error("Failed to fetch attendance");
    } finally {
      setAttendanceLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Attendance</h2>

      {/* Loading Employees */}
      {pageLoading ? (
        <div className="text-center py-6">Loading employees...</div>
      ) : (
        <>
          {/* Attendance Form */}
          <form
            onSubmit={markAttendance}
            className="bg-white shadow rounded-xl p-6 space-y-4 mb-8"
          >
            <select
              value={form.employee_id}
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setForm({ ...form, employee_id: e.target.value })
              }
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />

            <select
              value={form.status}
              className="border p-2 w-full rounded"
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>

            <button
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Marking..." : "Mark Attendance"}
            </button>
          </form>

          {/* Employee Attendance Viewer */}
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              View Employee Attendance
            </h3>

            <select
              className="border p-2 w-full rounded mb-4"
              onChange={(e) => fetchAttendance(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name}
                </option>
              ))}
            </select>

            {attendanceLoading ? (
              <div className="text-center py-4">
                Loading attendance...
              </div>
            ) : attendance.length === 0 ? (
              <div className="text-gray-500 text-center">
                No attendance records found.
              </div>
            ) : (
              <table className="w-full border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id} className="border-t">
                      <td className="p-3">{record.date}</td>
                      <td
                        className={`${
                          record.status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
