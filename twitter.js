'use strict';
var Twitter = require('twitter');





let config = {
    'consumer_key': 'dxpMDwYFtWqKRz4uDm0vqXOi0',
    'consumer_secret': 't9uAUdXXJ4ht9cNy8QmDyzQWExAfVCqY3wsHVn6xDMsnUufCdZ',
    'access_token_key': '778488202910920704-TaCjzSLcNNSDdL5HJhXRYT79Rsx3Kpa',
    'access_token_secret': 'XsN1vF37Mx6oGdL6upgCRslkHzhHMeMxg8QHOkyZTkLYx'
};

let twitter = new Twitter(config);




module.exports = twitter;
