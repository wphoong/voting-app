"use strict";

var path = process.cwd();
var mongoose = require('mongoose');
var Poll = mongoose.model('Polls');

function PollHandler () {
  this.createPoll = (req,res) => {

  	const user = req.user.github.id;
  	const displayName = req.user.github.displayName.split(' ');
  	const name = displayName[0] + displayName[1];
  	console.log("display name: ", name);
  	const options = [];
  	const voteCount = 0;

  	for( var key in req.body) {
  		if (key != "title") {
	  		options.push(
	  			{ "option": req.body[key], "voteCount": 0 }
	  		);
  		}
  	};

  	console.log("options", options);

  	const poll = {
  		"user": {
  			"id": user,
  			"displayName": name
  		},
  		"title": req.body.title,
  		"options": options
  	};
  	console.log(poll);

    const new_poll = new Poll(poll);
    new_poll.save( function(err, task) {
      if (err) return res.send(err);

      console.log(poll.title + ' saved to db');
      res.redirect('/');
    });
  };

  this.list_all_polls = (req, res) => {
  	
  	Poll.find({}, (err, polls) => {
  		if (err) return res.send(err);
  		console.log(polls);
  		res.render(path + '/public/index.html.ejs', {polls});	
  	});
  	
  };

  this.remove_poll = (req, res) => {
  	console.log("current request params", req.params);
  	Poll.remove({ _id: req.params.pollId}, (err, poll) => {
  		if (err) return res.send(err);
  		console.log(req.params.pollId + " has been deleted");
  		res.redirect("/");
  	});
  };

  this.update_poll_vote = (req, res) => {

  	// let optionIndex;

  	// Poll.findById(req.params.pollId, (err, poll) => {
  	// 	if (err) return res.send(err);
  	// 	const option = JSON.stringify(Object.keys(req.body)[0]);

  	// 	const optionsArr = poll.options;
  	// 	console.log("option req ", option);

  	// 	console.log("options arr ", optionsArr);

  	// 	console.log("found poll ", poll);

  	// 	optionsArr.forEach((current, index) => {
  	// 		if (JSON.stringify(current.option) == option) {
  	// 			optionIndex = index;
  	// 		}
  	// 	});
  	// 	console.log("clicked index ", optionIndex);

  	// });

  	// console.log("req displayname", req.params.userName);
  	// console.log("req pollId", req.params.pollId);
  	// // console.log("req option clicked", Object.keys(req.body));
  	const option = JSON.stringify(Object.keys(req.body)[0]);

  	const update = {
  		 "$inc": { "options.$.voteCount" : 1}
  	};
  	
  	Poll.findOneAndUpdate({_id: req.params.pollId, 'options.option': Object.keys(req.body)[0] }, update , (err, poll) => {
  		console.log("found poll", poll);
  		if (err) return res.send(err);
  		console.log(req.params.pollId + " has been updated");
  		res.redirect("/"+req.params.userName+"/"+req.params.pollId);
  	});
  };
}

module.exports = PollHandler;