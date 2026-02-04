import { useState, useMemo } from "react";
import { Shipment } from "../../types/shipment";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

interface Props {
  shipments: Shipment[];
  onEdit: (shipment: Shipment) => void;
  onDelete: (shipment: Shipment) => void;
}

type SortKey = keyof Shipment | "city" | "state";
type SortOrder = "asc" | "desc";

const ShipmentsTable = ({ shipments, onEdit, onDelete }: Props) => {
  const [search, setSearch] = useState("");
  const [driverTypeFilter, setDriverTypeFilter] = useState("");
  const [shipmentTypeFilter, setShipmentTypeFilter] = useState("");
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
  const filteredShipments = useMemo(() => {
    let data = shipments.filter((shipment) => {
      const searchMatch =
        shipment.pickupLocation?.city?.toLowerCase().includes(search.toLowerCase()) ||
        shipment.deliveryLocation?.city?.toLowerCase().includes(search.toLowerCase()) ||
        shipment.equipment?.toLowerCase().includes(search.toLowerCase());

      const driverTypeMatch = driverTypeFilter ? shipment.driverType === driverTypeFilter : true;
      const shipmentTypeMatch = shipmentTypeFilter ? shipment.shipmentType === shipmentTypeFilter : true;

      return searchMatch && driverTypeMatch && shipmentTypeMatch;
    });

    if (sortKey) {
      data = [...data].sort((a, b) => {
        let aValue: any = a[sortKey as keyof Shipment];
        let bValue: any = b[sortKey as keyof Shipment];

        if (sortKey === "city") {
          aValue = a.pickupLocation?.city || "";
          bValue = b.pickupLocation?.city || "";
        }
        if (sortKey === "state") {
          aValue = a.pickupLocation?.state || "";
          bValue = b.pickupLocation?.state || "";
        }
        if (sortKey === "tarpRequired") {
          return sortOrder === "asc" ? Number(a.tarpRequired) - Number(b.tarpRequired) : Number(b.tarpRequired) - Number(a.tarpRequired);
        }

        aValue = aValue ?? "";
        bValue = bValue ?? "";

        return sortOrder === "asc" ? aValue.toString().localeCompare(bValue.toString()) : bValue.toString().localeCompare(aValue.toString());
      });
    }

    return data;
  }, [shipments, search, driverTypeFilter, shipmentTypeFilter, sortKey, sortOrder]);

  const driverTypeOptions = Array.from(new Set(shipments.map((l) => l.driverType)));
  const shipmentTypeOptions = Array.from(new Set(shipments.map((l) => l.shipmentType)));

  /* -------------------- HEADERS -------------------- */
  const headers = [
    { label: "Shipment#", key: "shipmentNumber" },
    { label: "Load Date", key: "loadDate" },
    { label: "Pickup", key: "pickupLocation" },
    { label: "Delivery", key: "deliveryLocation" },
    { label: "Driver", key: "driverType" },
    { label: "Weight", key: "weight" },
    { label: "Shipment", key: "shipmentType" },
    { label: "TARP", key: "tarpRequired" },
    { label: "Equipment", key: "equipment" },
    { label: "Price", key: "price" },
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

        <select value={driverTypeFilter} onChange={(e) => setDriverTypeFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Driver Types</option>
          {driverTypeOptions.map((driver) => (
            <option key={driver} value={driver}>
              {driver}
            </option>
          ))}
        </select>

        <select value={shipmentTypeFilter} onChange={(e) => setShipmentTypeFilter(e.target.value)} className="border px-3 py-2 rounded text-xs">
          <option value="">All Shipments</option>
          {shipmentTypeOptions.map((shipment) => (
            <option key={shipment} value={shipment}>
              {shipment}
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
            {filteredShipments.length ? (
              filteredShipments.map((shipment) => (
                <tr key={shipment._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{shipment.shipmentNumber}</td>
                  <td className="border px-3 py-2">{shipment.loadDate?.slice(0, 10)}</td>
                  <td className="border px-3 py-2">{shipment.pickupLocation?.city}</td>
                  <td className="border px-3 py-2">{shipment.deliveryLocation?.city}</td>
                  <td className="border px-3 py-2">{shipment.driverType}</td>
                  <td className="border px-3 py-2">{shipment.weight}</td>
                  <td className="border px-3 py-2">{shipment.shipmentType}</td>
                  <td className="border px-3 py-2">{shipment.tarpRequired ? "Yes" : "No"}</td>
                  <td className="border px-3 py-2">{shipment.equipment}</td>
                  <td className="border px-3 py-2">{shipment.price}</td>

                  <td className="border px-3 py-2 flex gap-2">
                    <button onClick={() => onEdit(shipment)} className="text-blue-600 hover:text-blue-800 p-1">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(shipment)} className="text-red-600 hover:text-red-800 p-1">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No shipments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentsTable;
