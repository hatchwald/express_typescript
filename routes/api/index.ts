import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import profile from "./profile";
import book from "./book";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
router.all("/*", (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(403).send({ message: "No Token Provided!" });
	}
	const bearer_val = token.replace("Bearer ", "");
	jwt.verify(
		bearer_val,
		process.env.SECRET as string,
		(err: any, decoded: any) => {
			if (err) {
				return res.status(401).send({ message: "Unauthorized!" });
			}
		}
	);
	next();
});

router.use("/profile", profile);
router.use("/book", book);
router.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({ message: "this is api" });
});

export default router;
