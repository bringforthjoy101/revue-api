/*************************************************************************
COMMENTS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Comments = sequelize.define(
		'comments',
		{
			comment: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	Comments.associate = function (models: any) {
		models.comments.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.comments.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return Comments;
}
