import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes } from "node:crypto";
import pagesRouter from "./routes/pages.routes.js";
import connectDB from "./database/db.js";
import booksRouter from "./routes/books.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "0.0.0.0";

if (!process.env.JWT_SECRET_KEY) {
    process.env.JWT_SECRET_KEY = randomBytes(32).toString("hex");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const __rootDir = __dirname;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(pagesRouter);
app.use("/api/books", booksRouter);
app.use("/api/auth", authRouter);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, hostname, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});

