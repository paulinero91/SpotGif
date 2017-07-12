var SpotifyWebApi = require('spotify-web-api-node');
var client_id = '23811d2b8d704cb2af2c134ce28e3304'; // Your client id
var client_secret = '67c2965cca9748f39cbdd62694b9d631'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


var spotifyApi = new SpotifyWebApi({
  clientId : client_id,
  clientSecret : client_secret
});


var huh = function(){ 
// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
	  //console.log(data)
    // Set the access token on the API object so that it's used in all future requests
    spotifyApi.setAccessToken(data.body['access_token']);

    // Get the most popular tracks by David Bowie in Great Britain
    return spotifyApi.getArtistTopTracks('0oSGxfWSnnOXhD2fKuz2Gy', 'GB')
  }).then(function(data) {
    console.log('The most popular tracks for David Bowie is..');
    console.log('Drum roll..')
    console.log('...')

    /*
     * 1. Space Oddity - 2009 Digital Remaster (popularity is 51)
     * 2. Heroes - 1999 Digital Remaster (popularity is 33)
     * 3. Let's Dance - 1999 Digital Remaster (popularity is 20)
     * 4. ...
    */
    data.body.tracks.forEach(function(track, index) {
      console.log((index+1) + '. ' + track.name + ' (popularity is ' + track.popularity + ')');
    });

  }).catch(function(err) {
    console.log('Unfortunately, something has gone wrong.', err.message);
  });

}

 module.exports = huh

