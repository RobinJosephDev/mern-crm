interface Props {
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmActionModal = ({ title, message, confirmText = "Confirm", confirmColor = "bg-blue-600", onCancel, onConfirm }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-96 shadow-lg">
        <h3 className="font-bold mb-2 text-lg">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="border px-4 py-1 rounded">
            Cancel
          </button>

          <button onClick={onConfirm} className={`${confirmColor} text-white px-4 py-1 rounded`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
