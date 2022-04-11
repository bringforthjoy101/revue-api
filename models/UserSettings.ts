/*************************************************************************
USER SETTINGS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var UserSettings = sequelize.define(
		'userSettings',
		{
			twoFa: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			twoFaChannel: {
				type: Sequelize.ENUM('email', 'phone'),
				defaultValue: 'email',
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	UserSettings.associate = function (models: any) {
		models.userSettings.belongsTo(models.users, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'userId' });
	};

	return UserSettings;
}
