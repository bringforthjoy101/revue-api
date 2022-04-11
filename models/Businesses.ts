/*************************************************************************
BUSINESSES TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Businesses = sequelize.define(
		'businesses',
		{
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			code: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				defaultValue: 'inactive',
			},
		},
		{
			freezeTableName: true,
		}
	);

	Businesses.associate = function (models: any) {
		models.businesses.belongsTo(models.users, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'userId' });
	};

	return Businesses;
}
