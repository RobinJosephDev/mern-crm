import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { User } from "../../types/user";

interface Props {
  user: User | null;
  onClose: () => void;
  onSuccess: (user: User, isNew: boolean) => void | Promise<void>;
}

const UserFormModal: React.FC<Props> = ({ user, onClose, onSuccess }) => {
  const isEdit = Boolean(user?._id);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  const [loading, setLoading] = useState(false);

  /* -------------------- FORM STATE -------------------- */
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    companyName: "",
    phone: "",
    isActive: true,
  });

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      companyName: user.companyName || "",
      phone: user.phone || "",
      isActive: user.isActive ?? true,
    });
  }, [user]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = isEdit && user?._id ? await API.put(`/users/${user._id}`, form) : await API.post("/register", form);

      await onSuccess(res.data, !isEdit);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit User" : "Add User"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} required className="input" />

          <input name="email" placeholder="Email *" value={form.email} onChange={handleChange} required className="input" />

          <select name="role" value={form.role} onChange={handleChange} className="input" disabled={!isAdmin}>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="carrier">Carrier</option>
            <option value="customer">Customer</option>
          </select>

          <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} className="input" />

          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input" />

          {isAdmin && (
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              Active
            </label>
          )}

          <div className="col-span-full flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
