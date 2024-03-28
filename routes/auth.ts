import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
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

router.post("/register", async function (req: Request, res: Response) {
	const { email, password, firstName, lastName } = req.body;
	const requiredField = ["email", "password", "firstName", "lastName"];
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

		const user = await User.findAll();
		console.log("All users:", JSON.stringify(user, null, 2));
		res.status(200).json(email);

		// bcrypt.hash(password, 10, function (err: any, hash) {
		// 	if (err) {
		// 		let error = new Error();
		// 		error = { ...error, ...err };
		// 		throw error;
		// 	}
		// });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
});

export default router;
