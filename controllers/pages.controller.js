import mongoose from "mongoose";
import Book from "../models/book.model.js";

export const renderHome = async (req, res) => {
    try {
        const genreNames = await Book.distinct("genre");

        const allGenres = await Promise.all(
            genreNames.map(async (genre) => {
                const books = await Book.find({ genre: genre }).limit(15);
                return {
                    name: genre,
                    books,
                };
            }),
        );
        const genres = allGenres.filter((v) => {
            return v.books.length > 0;
        });

        console.log(genres);
        res.render("index", { genres });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};
export const renderAbout = async (req, res) => {
    res.render("about");
};
export const renderUpload = async (req, res) => {
    res.render("upload");
};
export const renderLogin = (req, res) => {
    res.render("login");
};
export const renderBookDetails = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(404).send("Book not found");
    }

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send("Book not found");
        }

        return res.render("book-details", { book });
    } catch (error) {
        console.error("Could not load book details:", error);
        return res.status(500).send("Server error");
    }
};

