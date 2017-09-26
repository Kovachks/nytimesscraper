var path = require("path");
var cheerio = require("cheerio");
var util = require('util')
var request = require("request");
var express = require("express");
var mongoose = require("mongoose");
var Article = require("../models/Article.js");
var router = express.Router();
var mongojs = require("mongojs")

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
		// var articles = db.get('scrapedData')
		request("https://nytimes.com/", function(error, response, html) {
			var $ = cheerio.load(html);
			$(".theme-summary").each(function(i, element) {
				var result = {};
				result.title = $(this).children("h2").children("a").text();
				result.link = $(this).children("h2").children("a").attr("href");
				result.summary = $(this).children(".summary").text()
				var entry = new Article(result);
				entry.save(function(err, doc) {
					if (err) {
						console.log(err);
					}
					else {
						console.log(doc)
					}
				});
			});
		})
		db.scrapedData.find({}, function(error,articles){
			res.render("home", {result:articles})
		})
	});
	app.get("/saved", function(req, res) {
		res.render("home")
	})
	// app.post("/", function(req, res) {
	// 	request("https://nytimes.com/", function(error, response, html) {
	// 		var $ = cheerio.load(html);
	// 		$(".theme-summary").each(function(i, element) {
	// 			var title = $(element).children("h2").children("a").text();
	// 			var link = $(element).children("h2").children("a").attr("href");
	// 			var articleSummary = $(element).children(".summary").text()
	// 				if (title && link && articleSummary) {
	// 					db.scrapedData.insert({
	// 						title: title,
	// 						link: link,
	// 						articleSummary: articleSummary
	// 					},
	// 				function(err, inserted) {
	// 					if (err) {
	// 						console.log(err)
	// 					}
	// 					else {
	// 						console.log(inserted);
	// 					}
	// 					});
	// 				}
	// 		});
	// 	})
	// 	db.scrapedData.find({}, function(error,articles){
	// 		res.render("home", {"articles":articles})
	// 	})
	}



