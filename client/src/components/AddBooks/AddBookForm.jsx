import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AddBookForm = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    quantity: 1,
    description: "",
    price: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const yourToken = localStorage.getItem("token")
      const res = await axios.post(
        "http://localhost:3000/api/books/add-book",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${yourToken}` // Uncomment if using JWT
          },
          withCredentials: true, // if using cookies for auth
        }
      );

      console.log(res)
      toast.success("Book added successfully!");
      setForm({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        quantity: 1,
        description: "",
        price: "",
      });
      setCoverImage(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add book. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-300 p-5">
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Book</h2>
      {message && (
        <div className="mb-4 text-center text-red-600">{message}</div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Author *</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">ISBN *</label>
          <input
            type="text"
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Genre</label>
          <input
            type="text"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Price *</label>
          <input
            type="number"
            name="price"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Cover Image</label>
          <input
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddBookForm;
