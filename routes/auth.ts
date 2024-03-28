import express, { Request, Response, NextFunction } from "express";

const router = express.Router();

router.post("/login", function (req: Request, res: Response) {
	const { email, password } = req.body;
	const requiredField = ["email", "password"];
	try {
		requiredField.forEach((field) => {
			const responseError = {
				type: "Error",
				message: `${field} cannot be empty!`,
				code: 400,
			};
			let error = new Error();
			error = { ...error, ...responseError };
			throw error;
		});
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

export default router;
