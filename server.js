var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 8080;
// var db = require("./models");

// Static directory
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars")

require("./routes/html-routes.js")(app);

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });