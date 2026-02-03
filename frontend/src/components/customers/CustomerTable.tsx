import { useState, useMemo } from "react";
import { Customer } from "../../types/customer";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

type SortKey = keyof Customer | "city" | "state";
type SortOrder = "asc" | "desc";

const CustomerTable = ({ customers, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [customerTypeFilter, setCustomerTypeFilter] = useState("");
  const [creditStatusFilter, setCreditStatusFilter] = useState("");
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
  const filteredCustomers = useMemo(() => {
    let data = customers.filter((customer) => {
      const searchMatch =
        customer.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.contactNo?.toLowerCase().includes(search.toLowerCase()) ||
        customer.customerRefNo?.toString().includes(search);

      const typeMatch = customerTypeFilter ? customer.customerType === customerTypeFilter : true;

      const creditMatch = creditStatusFilter ? customer.creditStatus === creditStatusFilter : true;

      return searchMatch && typeMatch && creditMatch;
    });

    if (sortKey) {
      data = [...data].sort((a, b) => {
        let aValue: any = a[sortKey as keyof Customer];
        let bValue: any = b[sortKey as keyof Customer];

        if (sortKey === "city") {
          aValue = a.primaryAddress?.city || "";
          bValue = b.primaryAddress?.city || "";
        }

        if (sortKey === "state") {
          aValue = a.primaryAddress?.state || "";
          bValue = b.primaryAddress?.state || "";
        }

        aValue = aValue ?? "";
        bValue = bValue ?? "";

        return sortOrder === "asc" ? aValue.toString().localeCompare(bValue.toString()) : bValue.toString().localeCompare(aValue.toString());
      });
    }

    return data;
  }, [customers, search, customerTypeFilter, creditStatusFilter, sortKey, sortOrder]);

  const customerTypeOptions = Array.from(new Set(customers.map((c) => c.customerType).filter(Boolean)));

  const creditStatusOptions = Array.from(new Set(customers.map((c) => c.creditStatus).filter(Boolean)));

  /* -------------------- HEADERS -------------------- */
  const headers = [
    { label: "Customer Name", key: "customerName" },
    { label: "Customer Ref No", key: "customerRefNo" },
    { label: "Type", key: "customerType" },
    { label: "Phone", key: "contactNo" },
    { label: "Email", key: "email" },
    { label: "Credit Status", key: "creditStatus" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    ...(isAdmin ? [{ label: "Actions", key: "actions" }] : []),
  ];

  return (
    <div>
      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, phone, ref no"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full text-xs sm:w-64"
        />

        <select value={customerTypeFilter} onChange={(e) => setCustomerTypeFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Customer Types</option>
          {customerTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select value={creditStatusFilter} onChange={(e) => setCreditStatusFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Credit Status</option>
          {creditStatusOptions.map((status) => (
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
            {filteredCustomers.length ? (
              filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{customer.customerName}</td>
                  <td className="border px-3 py-2">{customer.customerRefNo || "—"}</td>
                  <td className="border px-3 py-2">{customer.customerType}</td>
                  <td className="border px-3 py-2">{customer.contactNo}</td>
                  <td className="border px-3 py-2">{customer.email}</td>

                  <td className="border px-3 py-2">
                    {customer.creditStatus ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{customer.creditStatus}</span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="border px-3 py-2">{customer.primaryAddress?.city}</td>
                  <td className="border px-3 py-2">{customer.primaryAddress?.state}</td>

                  {isAdmin && (
                    <td className="border px-3 py-2 flex gap-2">
                      <button onClick={() => onEdit(customer)} className="text-blue-600 hover:text-blue-800 p-1">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(customer)} className="text-red-600 hover:text-red-800 p-1">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
