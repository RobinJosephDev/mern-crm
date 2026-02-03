import { useEffect, useState } from "react";
import API from "../api/axios";
import LeadQuotesTable from "../components/leads/LeadQuotesTable";
import LeadFormModal from "../components/leads/LeadFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { Lead } from "../types/lead";
import ConfirmActionModal from "../components/common/ConfirmActionModal";

const LeadsQuotesPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showConvert, setShowConvert] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    if (isAdmin) fetchLeads();
  }, [isAdmin]);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads/with-quotes"); // Ensure token is attached in API
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    }
  };

  /* -------------------- ADD / EDIT -------------------- */

  const handleLeadSuccess = async (_lead: Lead, _isNew: boolean) => {
    setShowForm(false);
    setSelectedLead(null);
    setPage(1); // reset pagination

    // Refresh leads from server
    try {
      const res = await API.get("/leads/with-quotes");
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

  const handleConfirmConvert = async () => {
    if (!selectedLead?._id) return;

    try {
      await API.post(`/leads/${selectedLead._id}/convert`);

      // remove from table
      setLeads((prev) => prev.filter((l) => l._id !== selectedLead._id));

      setShowConvert(false);
      setSelectedLead(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Conversion failed");
    }
  };

  /* -------------------- RENDER -------------------- */

  if (!isAdmin) {
    return <p className="p-6 text-red-600">Access denied. Admins only.</p>;
  }
  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowConvert(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Leads with Quotes</h2>
      </div>

      <LeadQuotesTable
        leads={paginatedLeads}
        onEdit={(lead) => {
          setSelectedLead(lead);
          setShowForm(true);
        }}
        onDelete={(lead) => {
          setSelectedLead(lead);
          setShowDelete(true);
        }}
        onConvert={handleConvertClick}
      />

      <Pagination total={leads.length} page={page} pageSize={pageSize} onChange={setPage} />

      {/* FORM MODAL */}
      {showForm && (
        <LeadFormModal
          key={selectedLead?._id || "new"}
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

      {/* CONVERT MODAL */}
      {showConvert && selectedLead && (
        <ConfirmActionModal
          title="Convert Lead to Customer"
          message={`Convert lead ${selectedLead.leadNumber} to a customer? This action cannot be undone.`}
          confirmText="Convert"
          confirmColor="bg-green-600"
          onCancel={() => {
            setShowConvert(false);
            setSelectedLead(null);
          }}
          onConfirm={handleConfirmConvert}
        />
      )}
    </div>
  );
};

export default LeadsQuotesPage;
