"use client";

import React, { useState, useEffect } from "react";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ id: "", title: "", actors: "", releaseYear: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch movies from the database
  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Add or Edit movie
  const handleAddOrEditMovie = async (e) => {
    e.preventDefault();
    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/movies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          title: form.title,
          actors: form.actors.split(",").map((actor) => actor.trim()),
          releaseYear: parseInt(form.releaseYear),
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const updatedMovie = await res.json();
      if (isEditing) {
        setMovies((prev) =>
          prev.map((movie) => (movie.id === updatedMovie.id ? updatedMovie : movie))
        );
      } else {
        setMovies((prev) => [...prev, updatedMovie]);
      }

      setForm({ id: "", title: "", actors: "", releaseYear: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("Error adding/updating movie:", err);
    }
  };

  // Delete movie
  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/movies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  // Populate form for editing
  const handleEdit = (movie) => {
    setForm({
      id: movie.id,
      title: movie.title,
      actors: movie.actors.join(", "),
      releaseYear: movie.releaseYear,
    });
    setIsEditing(true);
  };

  return (
    <div className="container">
      <h1>Internet Movie Rentals</h1>

      {/* Movies List */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <h2>{movie.title}</h2>
            <p>
              <strong>Actors:</strong> {movie.actors.join(", ")}
            </p>
            <p>
              <strong>Release Year:</strong> {movie.releaseYear}
            </p>
            <button onClick={() => handleEdit(movie)}>Edit</button>
            <button onClick={() => handleDelete(movie.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Add or Edit Movie Form */}
      <form onSubmit={handleAddOrEditMovie}>
        <h2>{isEditing ? "Edit Movie" : "Add a New Movie"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Actors (comma-separated)"
          value={form.actors}
          onChange={(e) => setForm({ ...form, actors: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Release Year"
          value={form.releaseYear}
          onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
          required
        />
        <button type="submit">{isEditing ? "Update Movie" : "Add Movie"}</button>
      </form>
      <footer>© 2023 Internet Movie Rentals | Contact: support@internetmovierentals.com</footer>
    </div>
  );
};

export default MoviesPage;
