import express, { Request, Response, NextFunction } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";

const router = express.Router();
router.get("/", async function (req: Request, res: Response) {
	const token = req.headers.authorization as string;
	const bearer_val = token.replace("Bearer ", "");
	jwt.verify(
		bearer_val,
		process.env.SECRET as string,
		async (err: any, decoded: any) => {
			if (err) {
				return res.status(401).send({ message: "Unauthorized!" });
			}

			const user = await User.findAll({
				where: { email: decoded.id },
				limit: 1,
			});
			return res.status(200).json({ message: "data profile", data: user[0] });
		}
	);
});
export default router;
