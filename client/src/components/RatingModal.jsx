import React, { useState } from "react";

const RatingModal = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) return alert("Please select a rating");
    onSubmit(rating);
    setRating(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
  <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 animate-fade-in border border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
      Rate the Book
    </h2>

    <div className="flex justify-center mb-6">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={`text-4xl mx-1 cursor-pointer transition-colors duration-200 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>

    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
  </div>
</div>

  );
};

export default RatingModal;
