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

const emptyAddress = {
  addressLine: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  unitNo: "",
};

const ShipmentFormModal: React.FC<Props> = ({ shipment, onClose, onSuccess }) => {
  const isEdit = Boolean(shipment?._id);
  const [loading, setLoading] = useState(false);

  const [pickupAutocomplete, setPickupAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const [deliveryAutocomplete, setDeliveryAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const [form, setForm] = useState({
    shipmentNumber: "",
    loadDate: "",
    driverType: "",
    shipmentType: "",
    weight: "",
    tarpRequired: false,
    equipment: "",
    price: "",
    notes: "",
    pickupLocation: { ...emptyAddress },
    deliveryLocation: { ...emptyAddress },
  });

  /* -------------------- EDIT MODE -------------------- */
  useEffect(() => {
    if (!shipment) return;

    setForm({
      shipmentNumber: shipment.shipmentNumber || "",
      loadDate: shipment.loadDate?.slice(0, 10) || "",
      driverType: shipment.driverType || "",
      shipmentType: shipment.shipmentType || "",
      weight: shipment.weight?.toString() || "",
      tarpRequired: shipment.tarpRequired ?? false,
      equipment: shipment.equipment || "",
      price: shipment.price?.toString() || "",
      notes: shipment.notes || "",
      pickupLocation: {
        addressLine: shipment.pickupLocation?.addressLine || "",
        city: shipment.pickupLocation?.city || "",
        state: shipment.pickupLocation?.state || "",
        country: shipment.pickupLocation?.country || "",
        postalCode: shipment.pickupLocation?.postalCode || "",
        unitNo: shipment.pickupLocation?.unitNo || "",
      },
      deliveryLocation: {
        addressLine: shipment.deliveryLocation?.addressLine || "",
        city: shipment.deliveryLocation?.city || "",
        state: shipment.deliveryLocation?.state || "",
        country: shipment.deliveryLocation?.country || "",
        postalCode: shipment.deliveryLocation?.postalCode || "",
        unitNo: shipment.deliveryLocation?.unitNo || "",
      },
    });
  }, [shipment]);

  /* -------------------- HANDLERS -------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressChange = (type: "pickupLocation" | "deliveryLocation", field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const parsePlace = (autocomplete: google.maps.places.Autocomplete | null, type: "pickupLocation" | "deliveryLocation") => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    const components = place.address_components || [];

    const get = (t: string) => components.find((c) => c.types.includes(t))?.long_name || "";

    setForm((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        addressLine: place.formatted_address || "",
        city: get("locality"),
        state: get("administrative_area_level_1"),
        country: get("country"),
        postalCode: get("postal_code"),
      },
    }));
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      weight: form.weight ? Number(form.weight) : undefined,
      price: form.price ? Number(form.price) : undefined,
    };

    try {
      const res = isEdit ? await API.put(`/shipments/${shipment!._id}`, payload) : await API.post("/shipments", payload);

      toast.success(isEdit ? "Shipment updated successfully" : "Shipment added successfully");
      await onSuccess(res.data, !isEdit);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{isEdit ? "Edit Shipment" : "Add Shipment"}</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="shipmentNumber"
            value={form.shipmentNumber}
            onChange={handleChange}
            placeholder="Shipment Number *"
            required
            className="input"
          />

          <input type="date" name="loadDate" value={form.loadDate} onChange={handleChange} className="input" />

          {/* PICKUP */}
          <h3 className="col-span-full font-semibold mt-3">Pickup Address</h3>

          <Autocomplete onLoad={setPickupAutocomplete} onPlaceChanged={() => parsePlace(pickupAutocomplete, "pickupLocation")}>
            <input
              className="input col-span-full"
              placeholder="Pickup Address"
              value={form.pickupLocation.addressLine}
              onChange={(e) => handleAddressChange("pickupLocation", "addressLine", e.target.value)}
            />
          </Autocomplete>

          {["city", "state", "country", "postalCode", "unitNo"].map((f) => (
            <input
              key={f}
              className="input"
              placeholder={f}
              value={(form.pickupLocation as any)[f]}
              onChange={(e) => handleAddressChange("pickupLocation", f, e.target.value)}
            />
          ))}

          {/* DELIVERY */}
          <h3 className="col-span-full font-semibold mt-3">Delivery Address</h3>

          <Autocomplete onLoad={setDeliveryAutocomplete} onPlaceChanged={() => parsePlace(deliveryAutocomplete, "deliveryLocation")}>
            <input
              className="input col-span-full"
              placeholder="Delivery Address"
              value={form.deliveryLocation.addressLine}
              onChange={(e) => handleAddressChange("deliveryLocation", "addressLine", e.target.value)}
            />
          </Autocomplete>

          {["city", "state", "country", "postalCode", "unitNo"].map((f) => (
            <input
              key={f}
              className="input"
              placeholder={f}
              value={(form.deliveryLocation as any)[f]}
              onChange={(e) => handleAddressChange("deliveryLocation", f, e.target.value)}
            />
          ))}

          <select name="driverType" value={form.driverType} onChange={handleChange} className="input">
            <option value="">Driver Type</option>
            <option value="Team">Team</option>
            <option value="Single">Single</option>
          </select>

          <select name="shipmentType" value={form.shipmentType} onChange={handleChange} className="input">
            <option value="">Shipment Type</option>
            <option value="FTL">FTL</option>
            <option value="LTL">LTL</option>
          </select>

          <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight" className="input" />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.tarpRequired}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tarpRequired: e.target.checked,
                }))
              }
            />
            Tarp Required
          </label>
          <input name="equipment" value={form.equipment} onChange={handleChange} placeholder="Equipment" className="input" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="input" />

          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="input col-span-full" />

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
