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

  // ✅ GENRES NOW DYNAMIC
  const [genres, setGenres] = useState([
"Fiction",
"Non-Fiction",
"Productivity / Self-Help",
"Science Fiction",
"Self-Help / Psychology",
"Fantasy",
"Romance / Young Adult",
"Mystery",
"Thriller",
"Romance",
"Biography",
"History",
"Children",
"Young Adult",
"Self-Help",
"Mythology",
"Adventure",
"Classics",
"Horror",
"Literary Fiction",
"Paranormal",
"Dystopian",
"Contemporary Fiction",
"Historical Fiction",
"Science",
"Philosophy",
"Poetry",
"Cookbooks",
"Art",
"Travel",
"Business",
"Economics",
"Politics",
"True Crime",
"Sports",
"Religion",
"Spirituality",
"Humor",
"Drama",
"Western",
"Gothic",
"Steampunk",
"Cyberpunk",
"Urban Fantasy",
"High Fantasy",
"Dark Fantasy",
"Military Science Fiction",
"Space Opera",
"Hard Science Fiction",
"Historical Romance",
"Paranormal Romance",
"Contemporary Romance",
"Erotica",
"New Adult",
"Middle Grade",
"Graphic Novels",
"Comics",
"Manga",
"Memoir",
"Autobiography",
"Essays",
"Short Stories",
"Crime",
"Cozy Mystery",
"Legal Thriller",
"Medical Thriller",
"Psychological Thriller",
"Action & Adventure",
"Suspense",
"Noir",
"Detective",
"Espionage",
"War",
"Military History",
"Ancient History",
"Medieval History",
"Archaeology",
"Anthropology",
"Sociology",
"Psychology",
"Health",
"Fitness",
"Diet",
"Gardening",
"Crafts",
"Home Improvement",
"Technology",
"Computers",
"Gaming",
"Music",
"Theater",
"Film",
"Photography",
"Fashion",
"True Story",
"Inspirational",
"Christian",
"Islam",
"Buddhism",
"Hinduism",
"Jewish",
"African American",
"LGBTQ+",
"Latin American",
"Asian Literature",
"European Literature",
"Russian Literature",
"Magical Realism",
"Postmodern",
"Experimental",
"Realism",
"Modernism",
"Victorian",
"Regency",
"Post-Apocalyptic",
"Survival",
"Zombies",
"Vampires",
"Werewolves",
"Fairies",
"Dragons",
"Myth Retellings",
"Other",
  ]);

  const [customGenre, setCustomGenre] = useState("");
  const [showCustomGenreInput, setShowCustomGenreInput] = useState(false);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre" && value === "Other") {
      setShowCustomGenreInput(true);
      setForm((prev) => ({ ...prev, genre: "" }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // ✅ ADD NEW GENRE FUNCTION
  const handleAddCustomGenre = () => {
    if (!customGenre.trim()) {
      toast.error("Please enter a genre name");
      return;
    }

    if (genres.includes(customGenre.trim())) {
      toast.error("Genre already exists");
      return;
    }

    // Insert before "Other"
    const updatedGenres = [...genres.slice(0, -1), customGenre.trim(), "Other"];
    setGenres(updatedGenres);

    setForm((prev) => ({ ...prev, genre: customGenre.trim() }));
    setCustomGenre("");
    setShowCustomGenreInput(false);

    toast.success("New genre added!");
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
        throw new Error(data.message || "Failed to add book.");
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
      setShowCustomGenreInput(false);
    } catch (err) {
      toast.error(err.message || "Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-100 to-orange-300 p-5 flex justify-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md overflow-y-auto max-h-[90vh]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          📚 Add a New Book
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title *" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Author *" name="author" value={form.author} onChange={handleChange} required />
            <Input label="ISBN *" name="isbn" value={form.isbn} onChange={handleChange} required />

            {/* ✅ GENRE DROPDOWN */}
            <div>
              <label className="block font-semibold mb-1">Genre *</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              {/* ✅ SHOW INPUT WHEN "OTHER" SELECTED */}
              {showCustomGenreInput && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new genre"
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />

                  <button
                    type="button"
                    onClick={handleAddCustomGenre}
                    className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              )}
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
              className="w-full border border-gray-300 rounded px-3 py-2"
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">PDF File</label>
            <input type="file" accept="application/pdf" onChange={handlePdfChange} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
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
      className="w-full border border-gray-300 rounded px-3 py-2"
      {...rest}
    />
  </div>
);

export default AddBookForm;
