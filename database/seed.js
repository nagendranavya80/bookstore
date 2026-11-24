import "dotenv/config";
import mongoose from "mongoose";
import Book from "../models/book.model.js";
import books from "../data/books.data.js";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function seedDB() {
    try {
        if (!MONGO_URI) {
            throw new Error("Set MONGO_URI or MONGODB_URI in .env");
        }

        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        let inserted = 0;
        let coversAdded = 0;
        for (const book of books) {
            const existingBook = await Book.findOne({
                title: book.title,
                author: book.author,
            });

            if (existingBook) {
                if (book.coverImage && !existingBook.coverImage) {
                    existingBook.coverImage = book.coverImage;
                    await existingBook.save();
                    coversAdded += 1;
                }
                continue;
            }

            await Book.create(book);
            inserted += 1;
        }

        console.log(
            `Sample data ready: ${inserted} books added, ${coversAdded} covers added.`,
        );
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedDB();
