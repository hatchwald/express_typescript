import express, { Request, Response, NextFunction } from "express";
import Book from "../../models/book";

const router = express.Router();

router.get("/", async function (req: Request, res: Response) {
	const book = await Book.findAll();
	return res.status(200).json({ message: "book Data", data: book });
});

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

export default router;
