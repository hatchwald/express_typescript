import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import connection from "./config/database";
import cors from "cors";
import auth from "./routes/auth";
import api from "./routes/api/index";
import bodyParser from "body-parser";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.get("/", (req: Request, res: Response) => {
	res.send("welcome express typescript");
});
app.use("/auth", auth);
app.use("/api", api);

connection
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
