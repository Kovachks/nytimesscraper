var path = require("path");
var cheerio = require("cheerio");
var util = require('util')
var request = require("request");
var express = require("express");
var mongojs = require("mongojs");

var router = express.Router();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

var session = require('express-session')

module.exports = function(app) {
	app.get("/", function(req, res) {
		res.render("home");
		request("https://nytimes.com/", function(error, response, html) {
			var $ = cheerio.load(html);
			$(".theme-summary").each(function(i, element) {
				var title = $(element).children("h2").children("a").text();
				var link = $(element).children("h2").children("a").attr("href");
				var articleSummary = $(element).children(".summary").text()
					if (title && link && articleSummary) {
						db.scrapedData.insert({
							title: title,
							link: link,
							articleSummary: articleSummary
						},
					function(err, inserted) {
						if (err) {
							console.log(err)
						}
						else {
							console.log(inserted);
						}
						});
					}
			});
		});
	});
}


