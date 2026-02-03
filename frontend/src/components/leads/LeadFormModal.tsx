import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Lead } from "../../types/lead";
import { Autocomplete } from "@react-google-maps/api";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onSuccess: (lead: Lead, isNew: boolean) => void | Promise<void>;
}

const LeadFormModal: React.FC<Props> = ({ lead, onClose, onSuccess }) => {
  const isEdit = Boolean(lead?._id);

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  /* -------------------- FORM STATE -------------------- */
  const [form, setForm] = useState({
    leadNumber: "",
    assignedTo: "",
    leadDate: "",
    followUpDate: "",
    customerName: "",
    phone: "",
    email: "",
    website: "",
    equipmentType: "",
    leadType: "",
    leadStatus: "",
    notes: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    unitNo: "",
  });

  /* -------------------- CONTACTS (MULTIPLE) -------------------- */
  const [contacts, setContacts] = useState<
    {
      contactName: string;
      contactNo: string;
      email: string;
    }[]
  >([
    {
      contactName: "",
      contactNo: "",
      email: "",
    },
  ]);

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    if (!isAdmin) return;
    API.get("/users/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => console.error("Failed to load employees"));
  }, [isAdmin]);

  useEffect(() => {
    if (!lead) return;

    setForm({
      leadNumber: lead.leadNumber || "",
      assignedTo: lead.assignedTo?._id || "",
      leadDate: lead.leadDate?.slice(0, 10) || "",
      followUpDate: lead.followUpDate?.slice(0, 10) || "",
      customerName: lead.customerName || "",
      phone: lead.phone || "",
      email: lead.email || "",
      website: lead.website || "",
      equipmentType: lead.equipmentType || "",
      leadType: lead.leadType || "",
      leadStatus: lead.leadStatus || "",
      notes: lead.notes || "",
      addressLine: lead.address?.addressLine || "",
      city: lead.address?.city || "",
      state: lead.address?.state || "",
      country: lead.address?.country || "",
      postalCode: lead.address?.postalCode || "",
      unitNo: lead.address?.unitNo || "",
    });

    setContacts(
      lead.contacts?.length
        ? lead.contacts.map((c) => ({
            contactName: c.contactName || "",
            contactNo: c.contactNo || "",
            email: c.email || "",
          }))
        : [
            {
              contactName: "",
              contactNo: "",
              email: "",
            },
          ],
    );
  }, [lead]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addContact = () => {
    setContacts((prev) => [
      ...prev,
      {
        contactName: "",
        contactNo: "",
        email: "",
      },
    ]);
  };

  const removeContact = (index: number) => {
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, field: "contactName" | "contactNo" | "email", value: string) => {
    setContacts((prev) =>
      prev.map((c, i) =>
        i === index
          ? {
              ...c,
              [field]: value,
            }
          : c,
      ),
    );
  };

  const onPlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    const components = place.address_components || [];

    const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name || "";

    setForm((prev) => ({
      ...prev,
      addressLine: place.formatted_address || "",
      city: get("locality"),
      state: get("administrative_area_level_1"),
      country: get("country"),
      postalCode: get("postal_code"),
    }));
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      assignedTo: isAdmin ? form.assignedTo : user._id,
      address: {
        addressLine: form.addressLine,
        city: form.city,
        state: form.state,
        country: form.country,
        postalCode: form.postalCode,
        unitNo: form.unitNo,
      },
      contacts: contacts.filter((c) => c.contactName || c.contactNo || c.email),
    };

    try {
      const res = isEdit && lead?._id ? await API.put(`/leads/${lead._id}`, payload) : await API.post("/leads", payload);

      await onSuccess(res.data, !isEdit);
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit Lead" : "Add Lead"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BASIC INFO */}
          <input name="leadNumber" placeholder="Lead Number *" value={form.leadNumber} onChange={handleChange} required className="input" />

          {isAdmin && (
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="input">
              <option value="">Assigned To *</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          )}

          <input type="date" name="leadDate" value={form.leadDate} onChange={handleChange} className="input" />
          <input type="date" name="followUpDate" value={form.followUpDate} onChange={handleChange} className="input" />

          <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className="input" />
          <input name="website" placeholder="Website" value={form.website} onChange={handleChange} className="input" />
          <input name="equipmentType" placeholder="Equipment Type" value={form.equipmentType} onChange={handleChange} className="input" />

          <select name="leadType" value={form.leadType} onChange={handleChange} className="input">
            <option value="">Lead Type</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>

          <select name="leadStatus" value={form.leadStatus} onChange={handleChange} className="input">
            <option value="">Lead Status</option>
            <option value="Prospect customer">Prospect customer</option>
            <option value="Lanes discussed">Lanes discussed</option>
            <option value="Product/Equipment discussed">Product/Equipment discussed</option>
            <option value="Email sent to concerened person">Email sent to concerened person</option>
            <option value="Carrier portal registration">Carrier portal registration</option>
            <option value="Quotations">Quotations</option>
            <option value="Fob/have broker">Fob/have broker</option>
            <option value="Voicemail/no answer">Voicemail/no answer</option>
            <option value="Different department">Different department</option>
            <option value="No answer/callback/Voicemail">No answer/callback/Voicemail</option>
            <option value="Not interested reason provided in notes">Not interested reason provided in notes</option>
            <option value="Asset based only">Asset based only</option>
          </select>

          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="input col-span-full" />

          {/* ADDRESS */}
          <h3 className="col-span-full font-semibold mt-3">Address</h3>

          <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <input
              className="input col-span-full"
              placeholder="Address"
              value={form.addressLine}
              onChange={(e) =>
                setForm({
                  ...form,
                  addressLine: e.target.value,
                })
              }
            />
          </Autocomplete>

          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input" />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="input" />
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="input" />
          <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} className="input" />
          <input name="unitNo" placeholder="Unit No" value={form.unitNo} onChange={handleChange} className="input" />

          {/* CONTACTS */}
          <h3 className="col-span-full font-semibold mt-3 flex justify-between">
            Contact Persons
            <button type="button" onClick={addContact} className="text-blue-600 text-sm">
              ➕ Add
            </button>
          </h3>

          {contacts.map((c, i) => (
            <React.Fragment key={i}>
              <input
                value={c.contactName}
                onChange={(e) => updateContact(i, "contactName", e.target.value)}
                placeholder="Contact Name"
                className="input"
              />
              <input
                value={c.contactNo}
                onChange={(e) => updateContact(i, "contactNo", e.target.value)}
                placeholder="Contact Phone"
                className="input"
              />
              <div className="flex gap-2">
                <input
                  value={c.email}
                  onChange={(e) => updateContact(i, "email", e.target.value)}
                  placeholder="Contact Email"
                  className="input flex-1"
                />
                {contacts.length > 1 && (
                  <button type="button" onClick={() => removeContact(i)} className="text-red-600">
                    🗑
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}

          <div className="col-span-full flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
