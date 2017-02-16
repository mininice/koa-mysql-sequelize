var express = require("express");
var request = require("request");
var should = require("should");
var path = require("path");
var promise = require("promise");
var iceDBMysql = require("..");

var database = "test";
var username = "root";
var password = "";
var options = {
	host: 'localhost',
	port: '3306',
	dialect: 'mysql',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},

	define: {
		timestamps: false
	}
};

var dbConfig = {
	database: database,
 	username: username,
 	password: password,
 	options: options
};

var modelDir = path.join(process.env.PWD, "test/model");

describe("ice-db-mysql-test", function(){

	before(function(done){
		var app = new express();
		app.use(iceDBMysql.middleware(modelDir, dbConfig, callback));
		function callback(){
			app.post("/create", function(req, res){
				var model = req.db.model;
				var User = model.User;
				var Project = model.Project;
				User.create({
					firstName: "Charles",
					lastName: "Jiang"
				}).then(function(user){
					Project.create({
						name: "BI"
					}).then(function(project){
						user.addProject(project).then(function(userproject){
							res.send(userproject);
						});
					});
				});
			});
			app.listen(8888, function(){
				console.log("Listen 8888");
				done();
			});
		}
	});

	it("should save data successfully in router", function(done){
		request.post("http://localhost:8888/create", function(err, response, body){
			var result = JSON.parse(body);
			should.exist(result.UserId);
			should.exist(result.ProjectId);
			done();
		});
	});

	it("should find data successfully by using DB instance", function(done){
		var db = new iceDBMysql.DB(modelDir, dbConfig, function(db){
			var User = db.model.User;
			User.findOne({
				where: {
					firstName: "Charles"
				}
			}).then(function(user){
				user.get("firstName").should.equal("Charles");
				user.getProjects().then(function(projects){
					projects[0].get("name").should.equal("BI");
					done();
				});
			});
		});
	});
});