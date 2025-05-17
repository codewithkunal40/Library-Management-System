import React, { useState } from "react";

const EditBookModal = ({ book, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: book.title,
        author: book.author,
        genre: book.genre,
        isbn: book.isbn,
        quantity: book.quantity,
        price: book.price,
        description: book.description,
        coverImage: null,
    });
    const [preview, setPreview] = useState(
        book.coverImage
        ? `http://localhost:3000/${book.coverImage.replace(/\\/g, "/")}`
        : ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "coverImage" && files.length) {
        setFormData({ ...formData, coverImage: files[0] });
        setPreview(URL.createObjectURL(files[0]));
        } else {
        setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
        const token = localStorage.getItem("token");
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "coverImage" && !value) return;
            form.append(key, value);
        });

        const response = await fetch(
            `http://localhost:3000/api/books/update-book/${book._id}`,
            {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: form,
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update book.");
        }

        const updatedBook = await response.json();
        onSave(updatedBook);
        onClose();
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 text-xl"
            >
            &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-orange-500">Edit Book</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Title"
                required
            />
            <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Author"
                required
            />
            <input
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Genre"
            />
            <input
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="ISBN"
                required
            />
            <input
                name="quantity"
                type="number"
                min={1}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Quantity"
            />
            <input
                name="price"
                type="number"
                min={0}
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Price"
                required
            />
            <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                placeholder="Description"
            />
            <div>
                <label className="block mb-1">Cover Image</label>
                <input
                name="coverImage"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full"
                />
                {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded"
                />
                )}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition"
            >
                {loading ? "Updating..." : "Update Book"}
            </button>
            </form>
        </div>
        </div>
    );
};

export default EditBookModal;
