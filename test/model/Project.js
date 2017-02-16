module.exports = function(sequelize, DataTypes){
	var Project = sequelize.define('Project', {
		name: {
			type: DataTypes.STRING
		}
	}, {
		classMethods: {
			associate: function(models){
				Project.belongsToMany(models.User, {through: "UserProject"});				
			}
		},
		freezeTableName: true
	});

	return Project;
}