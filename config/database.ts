import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	dialect: "mysql",
	host: process.env.HOST,
	username: process.env.USERDB,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	port: 3306,
});
export default sequelize;
