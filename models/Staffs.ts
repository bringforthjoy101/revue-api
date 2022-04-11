/*************************************************************************
STAFFS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Staffs = sequelize.define(
		'staffs',
		{
			names: {
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
			status: {
				type: Sequelize.ENUM('active', 'inactive'),
				defaultValue: 'inactive',
			},
		},
		{
			freezeTableName: true,
		}
	);

	Staffs.associate = function (models: any) {
		models.staffs.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.staffs.hasMany(models.comments, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
	};

	return Staffs;
}
