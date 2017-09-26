var path = require("path");

var util = require('util')

var express = require("express");

var router = express.Router();

var session = require('express-session')

module.exports = function(app) {
	app.get("/", function(req, res) {
		res.render("home");
	});
}

