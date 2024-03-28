import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/login", async function (req: Request, res: Response) {
	const { email, password } = req.body;
	const requiredField = ["email", "password"];
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
		const user = await User.findAll({ where: { email: email }, limit: 1 });
		if (user.length == 0) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		function comparePassword(candidatePassword: string, cb: any) {
			bcrypt.compare(
				candidatePassword,
				user[0].password,
				function (err: any, isMatch: any) {
					if (err) return cb(err);
					cb(null, isMatch);
				}
			);
		}

		comparePassword(password, function (err: any, isMatch: any) {
			if (err) return res.status(500).send(err);
			if (isMatch) {
				const token = jwt.sign({ id: email }, process.env.SECRET as string, {
					expiresIn: 86400,
				});
				return res.status(200).json({
					message: "success Login",
					email: email,
					name: `${user[0].firstName} ${user[0].lastName}`,
					token: token,
				});
			} else {
				return res.status(404).json({
					message: "Failed login , User / Password not match",
				});
			}
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
