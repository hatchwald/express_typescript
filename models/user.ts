import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/database";

interface UserAttribute {
	id?: number;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface UserInput extends Optional<UserAttribute, "id"> {}
export interface UserOutput extends Required<UserAttribute> {}

class User extends Model<UserAttribute, UserInput> implements UserAttribute {
	public id!: number;
	public firstName!: string;
	public lastName!: string;
	public email!: string;
	public password!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

User.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		firstName: {
			type: DataTypes.STRING,
		},
		lastName: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
		sequelize: connection,
		defaultScope: {
			attributes: {
				exclude: ["password"],
			},
		},
	}
);

export default User;
