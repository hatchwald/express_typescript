import express, { Request, Response, NextFunction } from "express";
import Book from "../../models/book";
import fs from "fs/promises";
import path from "path";
import multer from "multer";

// setup multer storage
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
const upload = multer({ storage: storage });

const router = express.Router();

// get all book
router.get("/", async function (req: Request, res: Response) {
	const book = await Book.findAll();
	return res.status(200).json({ message: "book Data", data: book });
});

// show detail book
router.get("/:bookId", async function (req: Request, res: Response) {
	try {
		const params = req.params;
		const bookid = params.bookId;
		const book = await Book.findByPk(bookid);
		if (book == null) {
			return res.status(404).json({ message: "Book Data not found !" });
		}
		return res.status(200).json({ message: "Book Data", data: book });
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
});

// create book
router.post(
	"/",
	upload.single("thumbnail"),
	async function (req: Request, res: Response) {
		const { title, synopsis, author, thumbnail } = req.body;
		const requiredField = ["title", "synopsis", "author"];
		try {
			requiredField.forEach((field) => {
				if (!req.body[field]) {
					const responseError = {
						type: "Error",
						message: `${field} cannot be empty!`,
						code: 400,
					};
					console.log(req.file?.filename);
					let error = new Error();
					error = { ...error, ...responseError };
					throw error;
				}
			});

			// doing insert
			let thumbnailName = "";
			if (req.file) {
				thumbnailName = `uploads/${req.file?.filename}`;
			}
			const bookCreate = await Book.create({
				title: title,
				synopsis: synopsis,
				author: author,
				available: true,
				thumbnail: thumbnailName,
			});

			return res
				.status(201)
				.json({ message: "success create book", data: bookCreate });
		} catch (error) {
			return res.status(500).json({ error: error });
		}
	}
);

// update book
router.put(
	"/:bookId",
	upload.single("thumbnail"),
	async function (req: Request, res: Response) {
		const { title, synopsis, author, thumbnail } = req.body;

		try {
			const params = req.params;
			const bookid = params.bookId;
			const book = await Book.findByPk(bookid);
			if (book == null) {
				return res.status(404).json({ message: "Book Data not found !" });
			}
			let thumbnailName = "";
			if (req.file) {
				thumbnailName = `uploads/${req.file?.filename}`;
			}
			book.title = title || book.title;
			book.synopsis = synopsis || book.synopsis;
			book.author = author || book.author;
			book.thumbnail = thumbnailName || book.thumbnail;
			await book.save();

			return res
				.status(200)
				.json({ message: "Success Update book", data: book });
		} catch (error) {
			return res.status(500).json({ error: error });
		}
	}
);

// delete book
router.delete("/:bookId", async function (req: Request, res: Response) {
	try {
		const params = req.params;
		const bookid = params.bookId;
		const book = await Book.findByPk(bookid);
		if (book == null) {
			return res.status(404).json({ message: "Book Data not found !" });
		}

		await Book.destroy({
			where: {
				id: bookid,
			},
		});
		return res.status(200).json({ message: "Success Delete Book" });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});
export default router;
