import { useEffect, useState } from "react";
import API from "../api/axios";
import LeadsTable from "../components/leads/LeadsTable";
import LeadFormModal from "../components/leads/LeadFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { Lead } from "../types/lead";

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  /* -------------------- ADD / EDIT -------------------- */

  const handleLeadSuccess = async (_lead: Lead, _isNew: boolean) => {
    // 1️⃣ Close modal immediately
    setShowForm(false);
    setSelectedLead(null);

    // 2️⃣ Reset pagination (optional but recommended)
    setPage(1);

    // 3️⃣ Re-fetch leads from server (authoritative source)
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to refresh leads:", err);
    }
  };

  /* -------------------- DELETE -------------------- */

  const handleDelete = async () => {
    if (!selectedLead) return;

    try {
      await API.delete(`/leads/${selectedLead._id}`);
      setLeads((prev) => prev.filter((l) => l._id !== selectedLead._id));
      setShowDelete(false);
      setSelectedLead(null);
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  /* -------------------- PAGINATION -------------------- */

  const paginatedLeads = leads.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leads</h2>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedLead(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white text-xs px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Lead
          </button>
        )}
      </div>

      <LeadsTable
        leads={paginatedLeads}
        onEdit={(lead) => {
          setSelectedLead(lead);
          setShowForm(true);
        }}
        onDelete={(lead) => {
          setSelectedLead(lead);
          setShowDelete(true);
        }}
      />

      <Pagination total={leads.length} page={page} pageSize={pageSize} onChange={setPage} />

      {/* FORM MODAL */}
      {showForm && (
        <LeadFormModal
          key={selectedLead?._id || "new"} // 👈 CRITICAL FIX
          lead={selectedLead}
          onClose={() => {
            setShowForm(false);
            setSelectedLead(null);
          }}
          onSuccess={handleLeadSuccess}
        />
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedLead && (
        <ConfirmDeleteModal
          title="Delete Lead"
          message={`Delete lead ${selectedLead.leadNumber}?`}
          onCancel={() => {
            setShowDelete(false);
            setSelectedLead(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default LeadsPage;
