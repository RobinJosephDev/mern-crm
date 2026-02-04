import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Customer } from "../../types/customer";
import { Autocomplete } from "@react-google-maps/api";
import { toast } from "react-toastify";

interface Props {
  customer: Customer | null;
  onClose: () => void;
  onSuccess: (customer: Customer, isNew: boolean) => void | Promise<void>;
}

const CustomerFormModal: React.FC<Props> = ({ customer, onClose, onSuccess }) => {
  const isEdit = Boolean(customer?._id);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  /* -------------------- FORM STATE -------------------- */
  const [form, setForm] = useState({
    customerType: "",
    customerName: "",
    customerRefNo: "",
    website: "",
    email: "",
    contactNo: "",
    contactNoExt: "",
    taxId: "",

    creditStatus: "",
    paymentMode: "",
    approvalDate: "",
    expiryDate: "",
    creditLimit: "",
    creditNotes: "",
    currency: "CAD",
    creditApplication: false,
    creditAgreement: null as File | null,
    shipperBrokerAgreement: null as File | null,

    primaryName: "",
    primaryStreet: "",
    primaryCity: "",
    primaryState: "",
    primaryCountry: "",
    primaryPostalCode: "",
    primaryUnitNo: "",
  });

  /* -------------------- FILE STATE -------------------- */

  const [existingFiles, setExistingFiles] = useState({
    creditAgreement: "" as string,
    shipperBrokerAgreement: "" as string,
  });

  /* -------------------- MULTIPLE CONTACTS -------------------- */
  const [contacts, setContacts] = useState<
    {
      contactName: string;
      contactNo: string;
      contactNoExt?: string;
      email: string;
      fax?: string;
      designation?: string;
    }[]
  >([
    {
      contactName: "",
      contactNo: "",
      email: "",
    },
  ]);

  /* -------------------- LOAD EDIT DATA -------------------- */
  useEffect(() => {
    if (!customer) return;

    setForm({
      customerType: customer.customerType || "",
      customerName: customer.customerName || "",
      customerRefNo: customer.customerRefNo || "",
      website: customer.website || "",
      email: customer.email || "",
      contactNo: customer.contactNo || "",
      contactNoExt: customer.contactNoExt || "",
      taxId: customer.taxId || "",

      creditStatus: customer.creditStatus || "",
      paymentMode: customer.paymentMode || "",
      approvalDate: customer.approvalDate?.slice(0, 10) || "",
      expiryDate: customer.expiryDate?.slice(0, 10) || "",
      creditLimit: customer.creditLimit?.toString() || "",
      creditNotes: customer.creditNotes || "",
      currency: customer.currency || "CAD",
      creditApplication: customer.creditApplication ?? false,
      creditAgreement: null,
      shipperBrokerAgreement: null,

      primaryName: customer.primaryAddress?.name || "",
      primaryStreet: customer.primaryAddress?.street || "",
      primaryCity: customer.primaryAddress?.city || "",
      primaryState: customer.primaryAddress?.state || "",
      primaryCountry: customer.primaryAddress?.country || "",
      primaryPostalCode: customer.primaryAddress?.postalCode || "",
      primaryUnitNo: customer.primaryAddress?.unitNo || "",
    });
    setExistingFiles({
      creditAgreement: customer.creditAgreement || "",
      shipperBrokerAgreement: customer.shipperBrokerAgreement || "",
    });
    setContacts(
      customer.contacts?.length
        ? customer.contacts.map((c) => ({
            contactName: c.contactName || "",
            contactNo: c.contactNo || "",
            contactNoExt: c.contactNoExt || "",
            email: c.email || "",
            fax: c.fax || "",
            designation: c.designation || "",
          }))
        : [{ contactName: "", contactNo: "", email: "" }],
    );
  }, [customer]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addContact = () => setContacts((prev) => [...prev, { contactName: "", contactNo: "", email: "" }]);

  const removeContact = (index: number) => setContacts((prev) => prev.filter((_, i) => i !== index));

  const updateContact = (index: number, field: string, value: string) => {
    setContacts((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    const components = place.address_components || [];

    const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name || "";

    setForm((prev) => ({
      ...prev,
      primaryStreet: place.formatted_address || "",
      primaryCity: get("locality"),
      primaryState: get("administrative_area_level_1"),
      primaryCountry: get("country"),
      primaryPostalCode: get("postal_code"),
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files?.[0]) return;

    setForm((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // --- Append text fields ---
      formData.append("customerType", form.customerType);
      formData.append("customerName", form.customerName);
      formData.append("customerRefNo", form.customerRefNo || "");
      formData.append("website", form.website || "");
      formData.append("email", form.email || "");
      formData.append("contactNo", form.contactNo || "");
      formData.append("contactNoExt", form.contactNoExt || "");
      formData.append("taxId", form.taxId || "");

      formData.append("creditStatus", form.creditStatus || "");
      formData.append("paymentMode", form.paymentMode || "");
      formData.append("approvalDate", form.approvalDate || "");
      formData.append("expiryDate", form.expiryDate || "");
      formData.append("creditLimit", form.creditLimit || "");
      formData.append("creditNotes", form.creditNotes || "");
      formData.append("currency", form.currency || "CAD");
      formData.append("creditApplication", form.creditApplication.toString());

      // --- Append files ---
      if (form.creditAgreement) formData.append("creditAgreement", form.creditAgreement);
      if (form.shipperBrokerAgreement) formData.append("shipperBrokerAgreement", form.shipperBrokerAgreement);

      // --- Append objects as JSON strings ---
      formData.append(
        "primaryAddress",
        JSON.stringify({
          name: form.primaryName,
          street: form.primaryStreet,
          city: form.primaryCity,
          state: form.primaryState,
          country: form.primaryCountry,
          postalCode: form.primaryPostalCode,
          unitNo: form.primaryUnitNo,
        }),
      );

      formData.append("contacts", JSON.stringify(contacts));

      // --- Send request ---
      const res =
        isEdit && customer?._id
          ? await API.put(`/customers/${customer._id}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : await API.post("/customers", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
      toast.success(isEdit ? "Customer updated successfully" : "Customer added successfully");
      await onSuccess(res.data, !isEdit);
    } catch (err: any) {
      const message = err.response?.data?.message || err.response?.data?.error || "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-6xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit Customer" : "Add Customer"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BASIC INFO */}
          <select name="customerType" value={form.customerType} onChange={handleChange} className="input">
            <option value="">Customer Type *</option>
            <option value="Shipper">Shipper</option>
            <option value="Consignee">Consignee</option>
            <option value="Both">Both</option>
          </select>

          <input name="customerName" placeholder="Customer Name *" value={form.customerName} onChange={handleChange} required className="input" />
          <input name="customerRefNo" placeholder="Customer Ref No" value={form.customerRefNo} onChange={handleChange} className="input" />
          <input name="website" placeholder="Website" value={form.website} onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
          <input name="contactNo" placeholder="Contact No" value={form.contactNo} onChange={handleChange} className="input" />
          <input name="contactNoExt" placeholder="Contact No Ext" value={form.contactNoExt} onChange={handleChange} className="input" />
          <input name="taxId" placeholder="Tax ID" value={form.taxId} onChange={handleChange} className="input" />

          {/* PRIMARY ADDRESS */}
          <h3 className="col-span-full font-semibold mt-3">Primary Address</h3>

          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <input
              className="input col-span-full"
              placeholder="Street Address"
              value={form.primaryStreet}
              onChange={(e) => setForm({ ...form, primaryStreet: e.target.value })}
            />
          </Autocomplete>

          <input name="primaryCity" placeholder="City" value={form.primaryCity} onChange={handleChange} className="input" />
          <input name="primaryState" placeholder="State" value={form.primaryState} onChange={handleChange} className="input" />
          <input name="primaryCountry" placeholder="Country" value={form.primaryCountry} onChange={handleChange} className="input" />
          <input name="primaryPostalCode" placeholder="Postal Code" value={form.primaryPostalCode} onChange={handleChange} className="input" />
          <input name="primaryUnitNo" placeholder="Unit No" value={form.primaryUnitNo} onChange={handleChange} className="input" />

          {/* CREDIT */}
          <h3 className="col-span-full font-semibold mt-3">Customer Credit</h3>

          <select name="creditStatus" value={form.creditStatus} onChange={handleChange} className="input">
            <option value="">Credit Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select name="paymentMode" value={form.paymentMode} onChange={handleChange} className="input">
            <option value="">Mode of Payment</option>
            <option value="Direct Deposit">Direct Deposit</option>
            <option value="Cheque">Cheque</option>
            <option value="Wire">Wire</option>
          </select>

          <input type="date" name="approvalDate" value={form.approvalDate} onChange={handleChange} className="input" />
          <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="input" />
          <input name="creditLimit" placeholder="Credit Limit" value={form.creditLimit} onChange={handleChange} className="input" />
          <label className="flex items-center gap-2 col-span-full">
            <input type="checkbox" name="creditApplication" checked={form.creditApplication} onChange={handleCheckboxChange} />
            Credit Application Submitted
          </label>

          {/* Credit Agreement */}
          <div className="col-span-full">
            <input type="file" name="creditAgreementFile" onChange={handleFileChange} className="input" />
            {existingFiles.creditAgreement && !form.creditAgreement && (
              <p className="text-sm text-gray-500 mt-1">Existing file: {existingFiles.creditAgreement.split("/").pop()}</p>
            )}
          </div>

          {/* Shipper/Broker Agreement */}
          <div className="col-span-full">
            <input type="file" name="shipperBrokerAgreement" onChange={handleFileChange} className="input" />
            {existingFiles.shipperBrokerAgreement && !form.shipperBrokerAgreement && (
              <p className="text-sm text-gray-500 mt-1">Existing file: {existingFiles.shipperBrokerAgreement.split("/").pop()}</p>
            )}
          </div>

          <textarea name="creditNotes" placeholder="Credit Notes" value={form.creditNotes} onChange={handleChange} className="input col-span-full" />

          {/* CONTACTS */}
          <h3 className="col-span-full font-semibold mt-3 flex justify-between">
            Contacts
            <button type="button" onClick={addContact} className="text-blue-600 text-sm">
              ➕ Add
            </button>
          </h3>

          {contacts.map((c, i) => (
            <React.Fragment key={i}>
              <input
                placeholder="Contact Name"
                value={c.contactName}
                onChange={(e) => updateContact(i, "contactName", e.target.value)}
                className="input"
              />
              <input placeholder="Contact No" value={c.contactNo} onChange={(e) => updateContact(i, "contactNo", e.target.value)} className="input" />
              <input placeholder="Email" value={c.email} onChange={(e) => updateContact(i, "email", e.target.value)} className="input" />
              {contacts.length > 1 && (
                <button type="button" onClick={() => removeContact(i)} className="text-red-600">
                  🗑
                </button>
              )}
            </React.Fragment>
          ))}

          {/* ACTIONS */}
          <div className="col-span-full flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
