const DeletePopup = ({ isOpen, onClose, onConfirm, bookTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 text-xl"
            >
            &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-500">Delete Book</h2>
            <p className="mb-4 text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{bookTitle}</span>?
            </p>
            <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
                Delete
            </button>
            </div>
        </div>
        </div>
    );
};

export default DeletePopup;
