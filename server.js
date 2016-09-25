/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');

var express = require('express');
var app = express();
var twitter = require('./twitter');
var _ = require('lodash');

const util = require('util');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let hashtags = [];


twitter.stream('statuses/sample', {}, function(stream) {
  stream.on('data', function(event) {
      if (event && event.entities && event.entities.hashtags
          && (event.entities.hashtags.length > 0)) {
          _.map(event.entities.hashtags, (tag) => {
              if (tag.text.match(/^[a-z0-9]+$/i)) {
                  console.log(tag.text);
                  if (hashtags.indexOf(tag.text) == -1) {
                      hashtags.push(tag.text);
                  }
                  return tag.text; }
                  return false;});
      }
  });

  stream.on('error', function(error) {
    throw error;
  });
});




app.get('/', function (req, res) {
    let q = req.query.q;
    res.send(hashtags.filter((tag) => {
        return tag.toLowerCase().startsWith(q.toLowerCase());}).slice(0, 10));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
.listen(config.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
  console.log('Opening your system browser...');
  open('http://localhost:' + config.port + '/webpack-dev-server/');
});
