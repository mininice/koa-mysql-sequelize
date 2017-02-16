module.exports = function(sequelize, DataTypes){
	var User = sequelize.define("User", {
		firstName: {
    		type: DataTypes.STRING,
    		field: 'first_name'
  		},
  		lastName: {
    		type: DataTypes.STRING
  		}
	}, {
		classMethods: {
			associate: function(models){
				User.belongsToMany(models.Project, {through: "UserProject"});				
			}
		},
		freezeTableName: true
	});

	return User;
}
