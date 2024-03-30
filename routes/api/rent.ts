import express, { Request, Response, NextFunction } from "express";
import Book from "../../models/book";
import User from "../../models/user";
import Rent from "../../models/rent";
import connection from "../../config/database";

const router = express.Router();

router.get("/", async function (req: Request, res: Response) {
	const rent = await Rent.findAll();
	return res.status(200).json({ message: "data book rented", data: rent });
});

router.get("/:id", async function (req: Request, res: Response) {
	const params = req.params;
	const id = params.id;
	const rent = await Rent.findByPk(id, { include: [Book, User] });
	if (!rent) {
		return res.status(404).json({ message: "data Book Rented not found" });
	}

	res.status(200).json({ message: "Data Rented Book", data: rent });
});

router.post("/", async function (req: Request, res: Response) {
	const { bookId, userId, return_date } = req.body;
	const requiredField = ["bookId", "userId", "return_date"];
	const t = await connection.transaction();
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
		const book = await Book.findByPk(bookId);
		if (!book) {
			return res.status(404).json({ message: "Book Not Found" });
		}
		if (!book.available) {
			return res
				.status(400)
				.json({ message: "Book is not available to rented" });
		}

		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ message: "User Not Found" });
		}
		const rent = await Rent.create(
			{
				bookId: bookId,
				userId: userId,
				rent_at: new Date(),
				return_date: new Date(return_date),
				status: "rent",
			},
			{ transaction: t }
		);
		book.available = false;
		await book.save({ transaction: t });
		await t.commit();
		return res.status(200).json({ message: "Rent Success", data: rent });
	} catch (error) {
		console.error(error);

		await t.rollback();
		return res.status(500).json({ error: error });
	}
});
export default router;
