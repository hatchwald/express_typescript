import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";

const app: Application = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
	res.send("welcome express typescript");
});

sequelize
	.sync()
	.then(() => {
		console.log("Database syncronized!");
		app.listen(port, () => {
			console.log(`Server running at http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.error("Error syncronized database", error);
	});
