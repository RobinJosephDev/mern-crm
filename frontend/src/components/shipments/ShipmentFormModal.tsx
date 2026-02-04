import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Shipment } from "../../types/shipment";
import { Autocomplete } from "@react-google-maps/api";
import { toast } from "react-toastify";

interface Props {
  shipment: Shipment | null;
  onClose: () => void;
  onSuccess: (shipment: Shipment, isNew: boolean) => void | Promise<void>;
}

const ShipmentFormModal: React.FC<Props> = ({ shipment, onClose, onSuccess }) => {
  const isEdit = Boolean(shipment?._id);

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  /* -------------------- FORM STATE -------------------- */
  const [form, setForm] = useState({
    shipmentNumber: "",
    loadDate: "",
    driverType: "",
    shipmentType: "",
    weight: "",
    tarp: "",
    equipment: "",
    price: "",
    notes: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    unitNo: "",
  });

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    if (!isAdmin) return;
    API.get("/users/carriers")
      .then((res) => setEmployees(res.data))
      .catch(() => console.error("Failed to load carriers"));
  }, [isAdmin]);

  useEffect(() => {
    if (!shipment) return;

    setForm({
      shipmentNumber: shipment.shipmentNumber || "",
      loadDate: shipment.loadDate?.slice(0, 10) || "",
      driverType: shipment.driverType || "",
      shipmentType: shipment.shipmentType || "",
      weight: shipment.weight?.toString() || "",
      tarp: shipment.tarp || "",
      equipment: shipment.equipment || "",
      price: shipment.price?.toString() || "",
      notes: shipment.notes || "",
      addressLine: shipment.pickupLocation?.addressLine || "",
      city: shipment.pickupLocation?.city || "",
      state: shipment.pickupLocation?.state || "",
      country: shipment.pickupLocation?.country || "",
      postalCode: shipment.pickupLocation?.postalCode || "",
      unitNo: shipment.pickupLocation?.unitNo || "",
    });
  }, [shipment]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      address: {
        addressLine: form.addressLine,
        city: form.city,
        state: form.state,
        country: form.country,
        postalCode: form.postalCode,
        unitNo: form.unitNo,
      },
    };

    try {
      const res = isEdit && shipment?._id ? await API.put(`/shipments/${shipment._id}`, payload) : await API.post("/shipments", payload);
      toast.success(isEdit ? "Shipment updated successfully" : "Shipment added successfully");
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
      <div className="bg-white w-full max-w-5xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit Lead" : "Add Lead"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* BASIC INFO */}
          <input
            name="shipmentNumber"
            placeholder="Shipment Number *"
            value={form.shipmentNumber}
            onChange={handleChange}
            required
            className="input"
          />

          <input type="date" name="loadDate" value={form.loadDate} onChange={handleChange} className="input" />

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

          <select name="driverType" value={form.driverType} onChange={handleChange} className="input">
            <option value="">Driver Type</option>
            <option value="Team">Team</option>
            <option value="Single">Single</option>
          </select>

          <select name="shipmentType" value={form.shipmentType} onChange={handleChange} className="input">
            <option value="">Shipment Type</option>
            <option value="Team">FTL</option>
            <option value="Single">LTL</option>
          </select>

          <input name="weight" placeholder="Weight" value={form.weight} onChange={handleChange} className="input" />
          <input name="tarp" placeholder="TARP" value={form.tarp} onChange={handleChange} className="input" />
          <input name="equipment" placeholder="Equipment" value={form.equipment} onChange={handleChange} className="input" />
          <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="input" />

          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="input col-span-full" />

          <div className="col-span-full flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
              {loading ? "Saving..." : "Save Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentFormModal;
