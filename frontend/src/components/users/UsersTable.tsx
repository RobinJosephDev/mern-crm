import { useState, useMemo } from "react";
import { User } from "../../types/user";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

type SortKey = keyof User | "city" | "state";
type SortOrder = "asc" | "desc";

const UsersTable = ({ users, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  /* -------------------- SORT -------------------- */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  /* -------------------- FILTER + SORT -------------------- */
  const filteredUsers = useMemo(() => {
    let data = users.filter((user) => {
      const searchMatch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.phone?.toLowerCase().includes(search.toLowerCase()) ||
        user.role?.toString().includes(search);

      const nameMatch = nameFilter ? user.name === nameFilter : true;
      const roleMatch = roleFilter ? user.role === roleFilter : true;

      return searchMatch && nameMatch && roleMatch;
    });

    return data;
  }, [users, search, nameFilter, roleFilter, sortKey, sortOrder]);

  const nameOptions = Array.from(new Set(users.map((l) => l.name)));
  const roleOptions = Array.from(new Set(users.map((l) => l.role)));

  /* -------------------- HEADERS -------------------- */
  const headers = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Company", key: "companyName" },
    { label: "Phone", key: "phone" },
    { label: "Active", key: "isActive" },
    { label: "Actions", key: "actions" },
  ];

  return (
    <div>
      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, lead no"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full text-xs sm:w-64"
        />

        <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Users</option>
          {nameOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Roles</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.label}
                  className="border px-3 py-2 text-left cursor-pointer select-none"
                  onClick={() => h.key !== "actions" && handleSort(h.key as SortKey)}
                >
                  {h.label}
                  {sortKey === h.key ? (sortOrder === "asc" ? " 🔼" : " 🔽") : null}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{u.name}</td>
                  <td className="border px-3 py-2">{u.email}</td>
                  <td className="border px-3 py-2">{u.role}</td>
                  <td className="border px-3 py-2">{u.companyName}</td>
                  <td className="border px-3 py-2">{u.phone}</td>
                  <td className="border px-3 py-2">{u.isActive}</td>

                  <td className="border px-3 py-2 flex gap-2">
                    <button onClick={() => onEdit(u)} className="text-blue-600 hover:text-blue-800 p-1">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(u)} className="text-red-600 hover:text-red-800 p-1">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
