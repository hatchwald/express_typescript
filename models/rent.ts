import { DataTypes, EnumDataType, Model, Optional } from "sequelize";
import connection from "../config/database";
import User from "./user";
import Book from "./book";

interface RentAttribute {
	id?: number;
	userId?: number;
	bookId?: number;
	rent_at?: Date;
	return_date?: Date;
	status?: EnumDataType<string>;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface RentInput extends Optional<RentAttribute, "id"> {}
export interface RentOutput extends Required<RentAttribute> {}

class Rent extends Model<RentAttribute, RentInput> implements RentAttribute {
	public id!: number;
	public userId!: number;
	public bookId!: number;
	public rent_at!: Date;
	public return_date!: Date;
	public status!: EnumDataType<string>;

	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Rent.init(
	{
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.BIGINT,
		},
		bookId: {
			type: DataTypes.INTEGER,
			references: {
				model: "books",
			},
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: "users",
			},
		},
		rent_at: {
			type: DataTypes.DATE,
		},
		return_date: {
			type: DataTypes.DATE,
		},
		status: {
			type: DataTypes.ENUM,
			values: ["rent", "returned"],
		},
	},
	{
		timestamps: true,
		sequelize: connection,
		modelName: "Rent",
	}
);

Rent.belongsTo(Book, { targetKey: "id", foreignKey: "bookId" });
Rent.belongsTo(User, { targetKey: "id", foreignKey: "userId" });
export default Rent;
