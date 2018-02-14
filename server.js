"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Poll = require("./app/models/poll.js");
var passport = require("passport");
var session = require("express-session");
var routes = require("./app/routes/index.js");
var methodOverride = require('method-override')

var app = express();
require("dotenv").load();
require("./app/config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use("/controllers", express.static(process.cwd() + "/app/controllers"));
app.use("/public", express.static(process.cwd() + "/public"));
app.use("/common", express.static(process.cwd() + "/app/common"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));

app.use(session({
	secret: "secretClementine",
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		maxAge: 3600000 //1 hour
	}
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);


routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log("Node.js listening on port " + port + "...");
});
