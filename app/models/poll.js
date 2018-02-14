'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var PollSchema = new Schema({
  user: {
    id: String,
    displayName: String
  },
  title: {
    type: String,
    required: true
  },
  options: {
    type: [
      {
        option: String,
        voteCount: 0
      }
    ]
  },
  createdAt: {
    type: String,
    default: moment().format("MMMM Do YYYY")
  }

});

module.exports = mongoose.model('Polls', PollSchema);


