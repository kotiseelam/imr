import { prisma } from "../../../lib/prisma";

// Handle GET requests
export async function GET(req) {
  try {
    const movies = await prisma.movie.findMany();
    return new Response(JSON.stringify(movies), { status: 200 });
  } catch (err) {
    console.error("Error fetching movies:", err);
    return new Response(JSON.stringify({ error: "Error fetching movies" }), { status: 500 });
  }
}

// Handle POST requests to add a movie
export async function POST(req) {
  try {
    const { title, actors, releaseYear } = await req.json();
    const newMovie = await prisma.movie.create({
      data: { title, actors, releaseYear: parseInt(releaseYear) },
    });
    return new Response(JSON.stringify(newMovie), { status: 201 });
  } catch (err) {
    console.error("Error adding movie:", err);
    return new Response(JSON.stringify({ error: "Error adding movie" }), { status: 500 });
  }
}

// Handle PUT requests to edit a movie
export async function PUT(req) {
  try {
    const { id, title, actors, releaseYear } = await req.json();
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { title, actors, releaseYear: parseInt(releaseYear) },
    });
    return new Response(JSON.stringify(updatedMovie), { status: 200 });
  } catch (err) {
    console.error("Error updating movie:", err);
    return new Response(JSON.stringify({ error: "Error updating movie" }), { status: 500 });
  }
}

// Handle DELETE requests to delete a movie
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.movie.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("Error deleting movie:", err);
    return new Response(JSON.stringify({ error: "Error deleting movie" }), { status: 500 });
  }
}
