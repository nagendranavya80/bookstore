import { unlink } from "node:fs/promises";
import Book from "../models/book.model.js";

const addBook = async (req, res) => {
    try {
        const bookData = { ...req.body };
        if (req.file) {
            bookData.coverImage = `/uploads/${req.file.filename}`;
        }
        const newBook = await Book.create(bookData);

        return res.status(201).location(`/api/books/${newBook._id}`).json({
            success: true,
            message: "Book added successfully",
            data: newBook,
        });
    } catch (error) {
        console.error(error);
        if (req.file) {
            try {
                await unlink(req.file.path);
            } catch (cleanupError) {
                if (cleanupError.code !== "ENOENT") {
                    console.error("Could not remove failed book cover upload:", cleanupError);
                }
            }
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        return res.json({
            success: true,
            message: "Book found",
            data: book,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "Invalid book ID",
        });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({});

        return res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export { addBook, getBookById, getAllBooks };

