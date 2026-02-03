import { useEffect, useState } from "react";
import API from "../api/axios";
import UsersTable from "../components/users/UsersTable";
import UserFormModal from "../components/users/UserFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { User } from "../types/user";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  /* -------------------- ADD / EDIT -------------------- */

  const handleUserSuccess = async (_user: User, _isNew: boolean) => {
    // 1️⃣ Close modal immediately
    setShowForm(false);
    setSelectedUser(null);

    // 2️⃣ Reset pagination (optional but recommended)
    setPage(1);

    // 3️⃣ Re-fetch users from server (authoritative source)
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  /* -------------------- DELETE -------------------- */

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await API.delete(`/users/${selectedUser._id}`);
      setUsers((prev) => prev.filter((l) => l._id !== selectedUser._id));
      setShowDelete(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  /* -------------------- PAGINATION -------------------- */

  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>
      </div>

      <UsersTable
        users={paginatedUsers}
        onEdit={(user) => {
          setSelectedUser(user);
          setShowForm(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setShowDelete(true);
        }}
      />

      <Pagination total={users.length} page={page} pageSize={pageSize} onChange={setPage} />

      {/* FORM MODAL */}
      {showForm && (
        <UserFormModal
          key={selectedUser?._id || "new"}
          user={selectedUser}
          onClose={() => {
            setShowForm(false);
            setSelectedUser(null);
          }}
          onSuccess={handleUserSuccess}
        />
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedUser && (
        <ConfirmDeleteModal
          title="Delete User"
          message={`Delete user ${selectedUser.name}?`}
          onCancel={() => {
            setShowDelete(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default UsersPage;
