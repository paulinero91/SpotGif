// // find template and compile it
// //

// (function() {

// 	/**
// 	 * Obtains parameters from the hash of the URL
// 	 * @return Object
// 	 */
// 	function getHashParams() {
// 		var hashParams = {};
// 		var e, r = /([^&;=]+)=?([^&;]*)/g,
// 		q = window.location.hash.substring(1);
// 		while ( e = r.exec(q)) {
// 			hashParams[e[1]] = decodeURIComponent(e[2]);
// 		}
// 		return hashParams;
// 	}

// 	var params = getHashParams();

// 	var access_token = params.access_token,
// 	refresh_token = params.refresh_token,
// 		      error = params.error;


// 	var templateSource = document.getElementById('results-template').innerHTML,
// 	    template = Handlebars.compile(templateSource),
// 	    resultsPlaceholder = document.getElementById('results'),
// 	    playingCssClass = 'playing',
// 	    audioObject = null;

// 	var fetchTracks = function (albumId, callback) {
// 		$.ajax({
// 			url: 'https://api.spotify.com/v1/albums/' + albumId,
// 			headers: {
// 				'Authorization': 'Bearer ' + access_token
// 			},

// 			success: function (response) {
// 				console.log(response)
// 			callback(response);
// 			}
// 		});
// 	};

// 	var searchAlbums = function (query) {
// 		$.ajax({
// 			url: 'https://api.spotify.com/v1/search',
// 			headers: {
// 				'Authorization': 'Bearer ' + access_token
// 			},

// 			data: {
// 				q: query,
// 				type: 'album'
// 			},
// 			success: function (response) {
// 				resultsPlaceholder.innerHTML = template(response);
// 			}
// 		});
// 	};

// 	results.addEventListener('click', function (e) {
// 		var target = e.target;
// 		giphyIt(); 
// 		if (target !== null && target.classList.contains('cover')) {
// 			if (target.classList.contains(playingCssClass)) {
// 				audioObject.pause();
// 			} else {
// 				if (audioObject) {
// 					audioObject.pause();
// 				}
// 				fetchTracks(target.getAttribute('data-album-id'), function (data) {
// 					console.log(data)
// 					audioObject = new Audio(data.tracks.items[0].preview_url);
// 					audioObject.play();
// 					target.classList.add(playingCssClass);
// 					audioObject.addEventListener('ended', function () {
// 						target.classList.remove(playingCssClass);
// 					});
// 					audioObject.addEventListener('pause', function () {
// 						target.classList.remove(playingCssClass);
// 					});
// 				});
// 			}
// 		}
// 	});

// 	document.getElementById('search-form').addEventListener('submit', function (e) {
// 		e.preventDefault();
// 		console.log(document.getElementById('query').value)
// 		searchAlbums(document.getElementById('query').value);
// 	}, false);

// })()
