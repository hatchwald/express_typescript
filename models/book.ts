import { DataTypes, Model, Optional } from "sequelize";
import connection from "../config/database";

interface BookAttribute {
	id?: number;
	title?: string;
	synopsis?: string;
	author?: string;
	available?: boolean;
	thumbnail?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface BookInput extends Optional<BookAttribute, "id"> {}
export interface BookOutput extends Required<BookAttribute> {}

class Book extends Model<BookAttribute, BookInput> implements BookAttribute {
	public id!: number;
	public title!: string;
	public synopsis!: string;
	public author!: string;
	public available!: boolean;
	public thumbnail!: string;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Book.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		title: {
			type: DataTypes.STRING,
		},
		synopsis: {
			type: DataTypes.STRING,
		},
		author: {
			type: DataTypes.STRING,
		},
		available: {
			type: DataTypes.BOOLEAN,
		},
		thumbnail: {
			type: DataTypes.STRING,
		},
	},
	{
		timestamps: true,
		sequelize: connection,
	}
);

export default Book;
