'use strict';

var path = process.cwd();
var mongoose = require('mongoose');
var Poll = mongoose.model('Polls');
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require('../controllers/pollController.js');

module.exports = function (app, passport) {
	var userName = "";

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			userName = req.user.github.username;
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			pollHandler.list_all_polls(req, res);
		});

	app.route('/polls')
		.get(function(req, res) {
			Poll.find({}, (err, polls) => {
		  		if (err) return res.send(err);
		  		console.log(polls);
		  		res.render(path + '/public/polls.html.ejs', {polls});	
		  	});
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

	app.route('/create')
		.get(function (req, res) {
			res.render(path + '/public/create.html.ejs');
		})
		.post(isLoggedIn, pollHandler.createPoll);

	app.route('/:userName/:pollId')
		.get(function(req, res) {

			Poll.findById(req.params.pollId, (err, poll) => {
				if (err) return res.send(err);
				res.render(path + '/public/poll.html.ejs', {poll});
			});
		}).delete(isLoggedIn, (req, res) => {
			pollHandler.remove_poll(req, res);
		}).put((req, res) => {
			pollHandler.update_poll_vote(req, res);
		});

};
