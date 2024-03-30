import express, { Request, Response, NextFunction } from "express";
import axios from "axios";

const route = express.Router();

route.get("/", async function (req: Request, res: Response) {
	try {
		const response = await axios.get(
			"https://www.googleapis.com/books/v1/volumes?q=search+terms"
		);
		return res
			.status(200)
			.json({ message: "Data fetched", data: response.data });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: error });
	}
});
export default route;
