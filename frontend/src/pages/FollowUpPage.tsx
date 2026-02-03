import { useEffect, useState } from "react";
import API from "../api/axios";
import FollowUpTable from "../components/follow-ups/FollowUpTable";
import FollowUpFormModal from "../components/follow-ups/FollowUpFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { FollowUp } from "../types/followup";

const FollowUpPage = () => {
  const [followups, setFollowUps] = useState<FollowUp[]>([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const res = await API.get("/follow-ups");
      setFollowUps(res.data);
    } catch (err) {
      console.error("Failed to fetch follow-ups:", err);
    }
  };

  /* -------------------- ADD / EDIT -------------------- */

  const handleLeadSuccess = async (_followup: FollowUp, _isNew: boolean) => {
    // 1️⃣ Close modal immediately
    setShowForm(false);
    setSelectedFollowUp(null);

    // 2️⃣ Reset pagination (optional but recommended)
    setPage(1);

    // 3️⃣ Re-fetch leads from server (authoritative source)
    try {
      const res = await API.get("/follow-ups");
      setFollowUps(res.data);
    } catch (err) {
      console.error("Failed to refresh follow-up:", err);
    }
  };

  /* -------------------- DELETE -------------------- */

  const handleDelete = async () => {
    if (!selectedFollowUp) return;

    try {
      await API.delete(`/follow-ups/${selectedFollowUp._id}`);
      setFollowUps((prev) => prev.filter((l) => l._id !== selectedFollowUp._id));
      setShowDelete(false);
      setSelectedFollowUp(null);
    } catch (err) {
      console.error("Failed to delete follow-up:", err);
    }
  };

  /* -------------------- PAGINATION -------------------- */

  const paginatedFollowUps = followups.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Follow-ups</h2>

        {isAdmin && (
          <button
            onClick={() => {
              setSelectedFollowUp(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white text-xs px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Follow-up
          </button>
        )}
      </div>

      <FollowUpTable
        followups={paginatedFollowUps}
        onEdit={(followup) => {
          setSelectedFollowUp(followup);
          setShowForm(true);
        }}
        onDelete={(followup) => {
          setSelectedFollowUp(followup);
          setShowDelete(true);
        }}
      />

      <Pagination total={followups.length} page={page} pageSize={pageSize} onChange={setPage} />

      {/* FORM MODAL */}
      {showForm && (
        <FollowUpFormModal
          key={selectedFollowUp?._id || "new"}
          followup={selectedFollowUp}
          onClose={() => {
            setShowForm(false);
            setSelectedFollowUp(null);
          }}
          onSuccess={handleLeadSuccess}
        />
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedFollowUp && (
        <ConfirmDeleteModal
          title="Delete Lead"
          message={`Delete lead ${selectedFollowUp.leadNumber}?`}
          onCancel={() => {
            setShowDelete(false);
            setSelectedFollowUp(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default FollowUpPage;
