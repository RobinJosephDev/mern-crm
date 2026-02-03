import { useState, useMemo } from "react";
import { FollowUp } from "../../types/followup";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  followups: FollowUp[];
  onEdit: (followup: FollowUp) => void;
  onDelete: (followup: FollowUp) => void;
}

type SortKey = keyof FollowUp | "city" | "state";
type SortOrder = "asc" | "desc";

const FollowUpTable = ({ followups, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // 🔐 Role check
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

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
  const filteredFollowUps = useMemo(() => {
    let data = followups.filter((followup) => {
      const searchMatch =
        followup.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        followup.email?.toLowerCase().includes(search.toLowerCase()) ||
        followup.phone?.toLowerCase().includes(search.toLowerCase()) ||
        followup.leadNumber?.toString().includes(search);

      const statusMatch = statusFilter ? followup.leadStatus === statusFilter : true;

      return searchMatch && statusMatch;
    });

    if (sortKey) {
      data = [...data].sort((a, b) => {
        let aValue: any = a[sortKey as keyof FollowUp];
        let bValue: any = b[sortKey as keyof FollowUp];

        if (sortKey === "city") {
          aValue = a.address?.city || "";
          bValue = b.address?.city || "";
        }
        if (sortKey === "state") {
          aValue = a.address?.state || "";
          bValue = b.address?.state || "";
        }

        aValue = aValue ?? "";
        bValue = bValue ?? "";

        return sortOrder === "asc" ? aValue.toString().localeCompare(bValue.toString()) : bValue.toString().localeCompare(aValue.toString());
      });
    }

    return data;
  }, [followups, search, statusFilter, sortKey, sortOrder]);

  const statusOptions = Array.from(new Set(followups.map((l) => l.leadStatus)));

  /* -------------------- HEADERS -------------------- */
  const headers = [
    { label: "Lead No", key: "leadNumber" },
    { label: "Customer", key: "customerName" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Status", key: "leadStatus" },
    { label: "Followup Date", key: "followUpDate" },
    { label: "Follow-up Type", key: "followUpType" },
    { label: "Equipment", key: "equipmentType" },
    { label: "Remarks", key: "remarks" },
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

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
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
            {filteredFollowUps.length ? (
              filteredFollowUps.map((followup) => (
                <tr key={followup._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{followup.leadNumber}</td>
                  <td className="border px-3 py-2">{followup.customerName}</td>
                  <td className="border px-3 py-2">{followup.phone}</td>
                  <td className="border px-3 py-2">{followup.email}</td>
                  <td className="border px-3 py-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{followup.leadStatus}</span>
                  </td>
                  <td className="border px-3 py-2">{followup.followUpDate?.slice(0, 10)}</td>
                  <td className="border px-3 py-2">{followup.followUpType}</td>
                  <td className="border px-3 py-2">{followup.equipmentType}</td>
                  <td className="border px-3 py-2">{followup.remarks}</td>
                  <td className="border px-3 py-2 flex gap-2">
                    <button onClick={() => onEdit(followup)} className="text-blue-600 hover:text-blue-800 p-1">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(followup)} className="text-red-600 hover:text-red-800 p-1">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No follow-ups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FollowUpTable;
