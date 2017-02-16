// exports.getMiddleware = require("./lib/middleware");

// var bootstrap = require("./lib/bootstrap");
// exports.getDB = function(modelDir, dbConfig, /*optional*/callback){
// 	return bootstrap(modelDir, dbConfig, /*optional*/callback);
// }

exports.DB = require("./lib/DB");
exports.middleware = require("./lib/middleware");