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

		const user = await User.findAll({ where: { email: email } });
		if (user.length > 0) {
			return res.status(400).json({ message: "email already exist" });
		}

		bcrypt.hash(password, 10, async function (err: any, hash) {
			if (err) {
				let error = new Error();
				error = { ...error, ...err };
				throw error;
			}
			const userCreate = await User.create({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: hash,
			});
			res
				.status(200)
				.json({ message: "success create data", data: userCreate });
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
});

export default router;
