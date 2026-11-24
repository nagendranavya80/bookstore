import express from "express";
import path from "node:path";
import { __rootDir } from "../app.js";
import {
    renderHome,
    renderAbout,
    renderUpload,
    renderLogin,
    renderBookDetails,
} from "../controllers/pages.controller.js";

const router = express.Router();

router.get("/", renderHome);
router.get("/about", renderAbout);
router.get("/upload", renderUpload);
router.get("/login", renderLogin);
router.get("/books/:id", renderBookDetails);

export default router;

