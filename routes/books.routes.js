import express from "express";
import { __rootDir } from "../app.js";
import receiveBookCover from "../middlewares/book-cover-upload.js";
import {
    addBook,
    getBookById,
    getAllBooks,
} from "../controllers/books.controller.js";

const router = express.Router();

router.get("/:id", getBookById);
router.get("/", getAllBooks);
router.post("/", receiveBookCover, addBook);

export default router;

