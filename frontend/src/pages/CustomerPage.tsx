import { useEffect, useState } from "react";
import API from "../api/axios";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerFormModal from "../components/customers/CustomerFormModal";
import ConfirmDeleteModal from "../components/common/ConfirmDeleteModal";
import Pagination from "../components/common/Pagination";
import { Customer } from "../types/customer";

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* -------------------- FETCH -------------------- */

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  /* -------------------- ADD / EDIT -------------------- */

  const handleCustomerSuccess = async (_customer: Customer, _isNew: boolean) => {
    // 1️⃣ Close modal
    setShowForm(false);
    setSelectedCustomer(null);

    // 2️⃣ Reset pagination
    setPage(1);

    // 3️⃣ Re-fetch customers
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to refresh customers:", err);
    }
  };

  /* -------------------- DELETE -------------------- */

  const handleDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await API.delete(`/customers/${selectedCustomer._id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== selectedCustomer._id));
      setShowDelete(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error("Failed to delete customer:", err);
    }
  };

  /* -------------------- PAGINATION -------------------- */

  const paginatedCustomers = customers.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------- RENDER -------------------- */

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Customers</h2>
      </div>

      <CustomerTable
        customers={paginatedCustomers}
        onEdit={(customer) => {
          setSelectedCustomer(customer);
          setShowForm(true);
        }}
        onDelete={(customer) => {
          setSelectedCustomer(customer);
          setShowDelete(true);
        }}
      />

      <Pagination total={customers.length} page={page} pageSize={pageSize} onChange={setPage} />

      {/* FORM MODAL */}
      {showForm && (
        <CustomerFormModal
          key={selectedCustomer?._id || "new"}
          customer={selectedCustomer}
          onClose={() => {
            setShowForm(false);
            setSelectedCustomer(null);
          }}
          onSuccess={handleCustomerSuccess}
        />
      )}

      {/* DELETE MODAL */}
      {showDelete && selectedCustomer && (
        <ConfirmDeleteModal
          title="Delete Customer"
          message={`Delete customer ${selectedCustomer.customerName}?`}
          onCancel={() => {
            setShowDelete(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default CustomerPage;
