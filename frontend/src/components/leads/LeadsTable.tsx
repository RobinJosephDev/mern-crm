import { useState, useMemo } from "react";
import { Lead } from "../../types/lead";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

type SortKey = keyof Lead | "city" | "state";
type SortOrder = "asc" | "desc";

const LeadsTable = ({ leads, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [leadTypeFilter, setLeadTypeFilter] = useState("");
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
  const filteredLeads = useMemo(() => {
    let data = leads.filter((lead) => {
      const searchMatch =
        lead.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        lead.email?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.toLowerCase().includes(search.toLowerCase()) ||
        lead.leadNumber?.toString().includes(search);

      const leadTypeMatch = leadTypeFilter ? lead.leadType === leadTypeFilter : true;
      const statusMatch = statusFilter ? lead.leadStatus === statusFilter : true;

      return searchMatch && leadTypeMatch && statusMatch;
    });

    if (sortKey) {
      data = [...data].sort((a, b) => {
        let aValue: any = a[sortKey as keyof Lead];
        let bValue: any = b[sortKey as keyof Lead];

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
  }, [leads, search, leadTypeFilter, statusFilter, sortKey, sortOrder]);

  const leadTypeOptions = Array.from(new Set(leads.map((l) => l.leadType)));
  const statusOptions = Array.from(new Set(leads.map((l) => l.leadStatus)));

  /* -------------------- HEADERS -------------------- */
  const headers = [
    { label: "Lead No", key: "leadNumber" },
    ...(isAdmin ? [{ label: "Assigned To", key: "assignedTo" }] : []),
    { label: "Lead Date", key: "leadDate" },
    { label: "Followup Date", key: "followUpDate" },
    { label: "Customer", key: "customerName" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Lead Type", key: "leadType" },
    { label: "Status", key: "leadStatus" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
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

        <select value={leadTypeFilter} onChange={(e) => setLeadTypeFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Lead Types</option>
          {leadTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

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
            {filteredLeads.length ? (
              filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{lead.leadNumber}</td>

                  {isAdmin && <td className="border px-3 py-2">{typeof lead.assignedTo === "object" ? lead.assignedTo?.name : "—"}</td>}

                  <td className="border px-3 py-2">{lead.leadDate?.slice(0, 10)}</td>
                  <td className="border px-3 py-2">{lead.followUpDate?.slice(0, 10)}</td>
                  <td className="border px-3 py-2">{lead.customerName}</td>
                  <td className="border px-3 py-2">{lead.phone}</td>
                  <td className="border px-3 py-2">{lead.email}</td>
                  <td className="border px-3 py-2">{lead.leadType}</td>
                  <td className="border px-3 py-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{lead.leadStatus}</span>
                  </td>
                  <td className="border px-3 py-2">{lead.address?.city}</td>
                  <td className="border px-3 py-2">{lead.address?.state}</td>

                  <td className="border px-3 py-2 flex gap-2">
                    <button onClick={() => onEdit(lead)} className="text-blue-600 hover:text-blue-800 p-1">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(lead)} className="text-red-600 hover:text-red-800 p-1">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
