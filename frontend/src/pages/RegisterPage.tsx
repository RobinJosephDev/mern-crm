import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      setMsg("Registered successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        {msg && <div className="bg-blue-100 text-blue-700 p-2 mb-3 rounded">{msg}</div>}

        <input className="w-full border p-2 mb-3 rounded" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select className="w-full border p-2 mb-4 rounded" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
          <option value="carrier">Carrier</option>
          <option value="customer">Customer</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
