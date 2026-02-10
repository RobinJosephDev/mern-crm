import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { getPasswordStrength, strengthLabel } from "../utils/passwordStrength";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);
  const { label, color } = strengthLabel(strength);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (strength < 3) {
      return toast.error("Password is too weak");
    }

    setLoading(true);

    try {
      const res = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success("Password reset successful!");

      // 🔐 AUTO-LOGIN (backend must return token + user)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        <input
          type="password"
          className="w-full border p-2 mb-2 rounded"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {password && <p className={`text-sm mb-2 ${color}`}>Password strength: {label}</p>}

        <input
          type="password"
          className="w-full border p-2 mb-4 rounded"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
