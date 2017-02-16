var Sequelize = require("sequelize");
var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var logger = global.logger || log4js.getLogger();

var DB = module.exports = function DB(modelDir, dbConfig, /*optional*/callback){
	if(!modelDir){
		throw "Database model dir can not be empty";
	}
	if(!dbConfig){
		throw "Database config can not be empty";
	}
	this.Sequelize = Sequelize;
	//initialize database connection
	this.sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.options);
	//register DAO model
	this.registerModel(modelDir);
	//register DAO model relations
	this.registerAssociation();
	//sync DAO model with DB, if missing any table, Sequelize will create them for you
	var self = this;
	this.sequelize.sync().then(function(){
		//Sequelize sync successfully
		logger.info("Sequelize sync successfully");
		callback && callback(self);
	});
}

DB.prototype.registerModel = function(modelDir){
	var model = this.model = {};
	var self = this;
	fs.readdirSync(modelDir).filter(function(file){
		return file.indexOf(".") !== 0;
	}).forEach(function(file){
		var filePath = modelDir + path.sep + file;
		var fileStat = fs.statSync(filePath);
		if(fileStat.isFile() && path.extname(file) === ".js"){
			var _model = self.sequelize["import"](filePath);
			if(model[_model.name]){
				throw "DAO model name can not be duplicated: " + _model.name;
			}else{
				model[_model.name] = _model;
				logger.info("register DAO model: " + _model.name);
			}
		}else if(fileStat.isDirectory()){
			registerModel(filePath);
		}
	});
}

DB.prototype.registerAssociation = function(){
	var model = this.model;
	Object.keys(model).forEach(function(modelName){
		if("associate" in model[modelName]){
			model[modelName].associate(model);
		}
	});
}