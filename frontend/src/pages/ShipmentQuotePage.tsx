import { useEffect, useState } from "react";
import API from "../api/axios";
import ShipmentQuotesTable from "../components/shipments-with-quotes/ShipmentQuotesTable";
import ShipmentQuotesFormModal from "../components/shipments-with-quotes/ShipmentQuotesFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { Shipment } from "../types/shipment";

const ShipmentQuotePage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await API.get("/shipments-with-quotes");
      setShipments(res.data);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);
    }
  };

  /* -------------------- ADD / EDIT -------------------- */

  const handleShipmentSuccess = async (_shipment: Shipment, _isNew: boolean) => {
    // Close modal immediately
    setShowForm(false);
    setSelectedShipment(null);

    // 2Reset pagination (optional but recommended)
    setPage(1);

    // 3Re-fetch shipments from server (authoritative source)
    try {
      const res = await API.get("/shipments-with-quotes");
      setShipments(res.data);
    } catch (err) {
      console.error("Failed to refresh shipments:", err);
    }
  };

  /* -------------------- DELETE -------------------- */

  const handleDelete = async () => {
    if (!selectedShipment) return;

    try {
      await API.delete(`/shipments-with-quotes/${selectedShipment._id}`);
      setShipments((prev) => prev.filter((l) => l._id !== selectedShipment._id));
      setShowDelete(false);
      setSelectedShipment(null);
    } catch (err) {
      console.error("Failed to delete shipment:", err);
    }
  };

  /* -------------------- PAGINATION -------------------- */

  const paginatedShipments = shipments.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Shipments with Quotes</h2>

        <button
          onClick={() => {
            setSelectedShipment(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white text-xs px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Quote
        </button>
      </div>

      <ShipmentQuotesTable
        shipments={paginatedShipments}
        onEdit={(shipment) => {
          setSelectedShipment(shipment);
          setShowForm(true);
        }}
        onDelete={(shipment) => {
          setSelectedShipment(shipment);
          setShowDelete(true);
        }}
      />

      <Pagination total={shipments.length} page={page} pageSize={pageSize} onChange={setPage} />

      {/* FORM MODAL */}
      {showForm && (
        <ShipmentQuotesFormModal
          key={selectedShipment?._id || "new"}
          shipment={selectedShipment}
          onClose={() => {
            setShowForm(false);
            setSelectedShipment(null);
          }}
          onSuccess={handleShipmentSuccess}
        />
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedShipment && (
        <ConfirmDeleteModal
          title="Delete Shipment"
          message={`Delete shipment ${selectedShipment.shipmentNumber}?`}
          onCancel={() => {
            setShowDelete(false);
            setSelectedShipment(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ShipmentQuotePage;
