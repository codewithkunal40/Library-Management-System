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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (coverImage) formData.append("coverImage", coverImage);

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/books/add-book", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

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
    <div className="bg-gradient-to-br from-orange-100 to-orange-300 p-5 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add a New Book
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Input
              label="Author *"
              name="author"
              value={form.author}
              onChange={handleChange}
              required
            />
            <Input
              label="ISBN *"
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              required
            />
            <Input
              label="Genre"
              name="genre"
              value={form.genre}
              onChange={handleChange}
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              min="1"
            />
            <Input
              label="Price *"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-1">Cover Image</label>
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
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
      </div>
  );
};

// Reusable Input
const Input = ({ label, name, value, onChange, type = "text", ...rest }) => (
  <div>
    <label className="block font-semibold mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
      {...rest}
    />
  </div>
);

export default AddBookForm;
