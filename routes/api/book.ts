import express, { Request, Response, NextFunction } from "express";
import Book from "../../models/book";

const router = express.Router();

// get all book
router.get("/", async function (req: Request, res: Response) {
	const book = await Book.findAll();
	return res.status(200).json({ message: "book Data", data: book });
});

// show detail book
router.get("/:bookId", async function (req: Request, res: Response) {
	const params = req.params;
	const bookid = params.bookId;
	const book = await Book.findByPk(bookid);
	if (book == null) {
		return res.status(404).json({ message: "Book Data not found !" });
	}
	return res.status(200).json({ message: "Book Data", data: book });
});

// create book
router.post("/", async function (req: Request, res: Response) {
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
				let error = new Error();
				error = { ...error, ...responseError };
				throw error;
			}
		});

		// doing insert
		const bookCreate = await Book.create({
			title: title,
			synopsis: synopsis,
			author: author,
			available: true,
		});

		return res
			.status(201)
			.json({ message: "success create book", data: bookCreate });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});

router.put("/:bookId", async function (req: Request, res: Response) {
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
				let error = new Error();
				error = { ...error, ...responseError };
				throw error;
			}
		});
		const params = req.params;
		const bookid = params.bookId;
		const book = await Book.findByPk(bookid);
		if (book == null) {
			return res.status(404).json({ message: "Book Data not found !" });
		}
		const bookUpdate = await Book.update(
			{
				title: title,
				synopsis: synopsis,
				author: author,
			},
			{ where: { id: bookid } }
		);
		return res
			.status(200)
			.json({ message: "Success Update book", data: bookUpdate });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
});
export default router;
