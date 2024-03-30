import { Sequelize } from "sequelize";

const connection = new Sequelize({
	dialect: "mysql",
	host: process.env.HOST,
	username: process.env.USERDB,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: process.env.DB_PORT as unknown as number | 3306,
});
export default connection;
