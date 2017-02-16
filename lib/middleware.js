var DB = require("./DB");

module.exports = function(modelDir, dbConfig, /*optional*/callback){
	var db = new DB(modelDir, dbConfig, callback);
	return function(req, res, next){
		req.db = db;
		next();
	}
}