import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBookForm = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    rating: 0,
    description: "",
    price: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]); // PDF FILE CHANGE
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
      if (pdfFile) formData.append("pdf", pdfFile); 

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/books/add-book", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add book. Please try again.");
      }

      toast.success("Book added successfully!");
      setForm({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        rating: 0,
        description: "",
        price: "",
      });
      setCoverImage(null);
      setPdfFile(null);
    } catch (err) {
      toast.error(err.message || "Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GENRES = [
    "Fiction", "Non-Fiction", "Productivity / Self-Help", "Science Fiction",
    "Self-Help / Psychology", "Fantasy", "Romance / Young Adult", "Mystery",
    "Thriller", "Romance", "Biography", "History", "Children", "Young Adult",
    "Self-Help", "Other"
  ];

  return (
    <div className="bg-gradient-to-br from-orange-100 to-orange-300 p-5 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          📚 Add a New Book
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title *" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Author *" name="author" value={form.author} onChange={handleChange} required />
            <Input label="ISBN *" name="isbn" value={form.isbn} onChange={handleChange} required />
            <div>
              <label className="block font-semibold mb-1">Genre *</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select a genre</option>
                {GENRES.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <Input label="Rating" name="rating" type="number" value={form.rating} onChange={handleChange} min="0" max="5" step="0.1" />
            <Input label="Price *" name="price" type="number" value={form.price} onChange={handleChange} required />
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
            <label className="block mb-2 text-sm font-medium text-gray-700">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition"
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">PDF File</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer transition"
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
