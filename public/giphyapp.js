(function() {

	/*GIHPY*/ //no authentication- ES6 syntax


	//setting everything we need from the Giphy API
	const PUBLIC_KEY = 'dc6zaTOxFJmzC';
	const BASE_URL = '//api.giphy.com/v1/gifs/';
	const ENDPOINT = 'search';
	const LIMIT = 12;
	const RATING = 'pg';

	//sets variables to equal our HTML divs
	let $queryInput = $('.query');
	let $resultWrapper = $('.result');
	let $loader = $('.loader');
	let $inputWrapper = $('.input-wrapper');
	let $clear = $('.clear');
	let $button = $('.random');
	let $gif = $('.gif'); 
	let oldArtist; 
	let currentTimeout;
	let albumQuery; 	
	let $playing; 

	//setting variables to HTML divs again and declaring global variables
	var templateSource = document.getElementById('giphy-template').innerHTML,
	    template = Handlebars.compile(templateSource),
	    resultsPlaceholder = document.getElementById('results'),
	    playingCssClass = 'playing',
	    audioObject = null;


	//creates an object that contains all the necessary functions for api call to Giphy
	let query = { 
		text: null,
		offset: 0,
		request() { //declares function that returns our api URL
			console.log(`${BASE_URL}${ENDPOINT}?q=${this.text}&limit=${LIMIT}&rating=${RATING}&offset=${this.offset}&api_key=${PUBLIC_KEY}`)
			return `${BASE_URL}${ENDPOINT}?q=${this.text}&limit=${LIMIT}&rating=${RATING}&offset=${this.offset}&api_key=${PUBLIC_KEY}`;
		},
		handleData(data){ //declares function that converts data to HTML
				let results = data.data;
				console.log(data)
					
				if (results.length) {
					resultsPlaceholder.innerHTML = template(data); //puts gifs into HTML

					$('.loader').addClass('done');

					//callback(url);
				} else {
					//callback('');
				}

		},

		failData(error){
			//console.log(error)
		},


		fetch(callback) { //just our ajax call

			return $.ajax({
				url : this.request(), //gets URL from line 39
				type: 'GET',
				success : this.handleData, //gets function from line 42
				fail: this.failData
			})


		}
	}


//The Beginning
	//whatever the user types into search bar
	$queryInput.on('keyup', e => {
		let key = e.which || e.keyCode;
		query.text = $queryInput.val();
		query.offset = Math.floor(Math.random() * 25);

		if (key===13) { //when user presses enter key
			$queryInput.blur()
			$inputWrapper.addClass('active').removeClass('empty');

				search(query)

				return 
		}

		if (currentTimeout) { //if user types a key, the timer resets
			clearTimeout(currentTimeout);
			
		}

		currentTimeout = setTimeout(() => { //after a certain amount of seconds, search automatically pushes through
			currentTimeout = null;
			$('.gif').addClass('hidden');
			$('.top-section, .search-bar').removeClass("full-height")
			$loader.removeClass('done');
			if (query.text && query.text.length) {

				$inputWrapper.addClass('active').removeClass('empty');

				search(query)



			} else {
				$inputWrapper.removeClass('active').addClass('empty');
				$button.removeClass('active');
			}
		}, 1000);



	});



	function search(query){ 


		//fetching data from Giphy.com
		console.log('searching')

		query.fetch(url => { //refers to object above and makes API call on line 69
					if (url.length) {
						//$resultWrapper.html(buildImg(url));

						$button.addClass('active');
					} else {
						$resultWrapper.html(`<p class="no-results hidden">No Results found for <strong>${query.text}</strong></p>`);

						$button.removeClass('active');
					}

			
					currentTimeout = setTimeout(() => {
						$('.hidden').toggleClass('hidden');
					}, 1000);
				})
				.then(function(){
					
					//console.log('now search '+query.text)
					oldArtist = $queryInput.val();
					$('#artistPlaying').text('') 
					searchAlbums(query.text) //WE CONNECT TO SPOTIFY CODE THROUGH WHAT USER SEARCHED FOR
					}
				);

	}

	$('body').on('click', '.gif', function (e) { //Plays GIF on click
		this.src = this.getAttribute('data-gif')
		playSong(e); //CONNECT TO SPOTIFY CODE WHEN USER CLICKS ON GIF TO PLAY SONG
	});

	$('.button').on('click', function (e){
		query.text = $queryInput.val();
		query.offset = Math.floor(Math.random() * 25)

		search(query)

		console.log("hi")
	})




	/*SPOTIFY*/ //requires authentication - ES5 syntax



	function getHashParams() { //necessary for Spotify authentication- copy and pasted most of it
		var hashParams = {};
		var e, r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
		while ( e = r.exec(q)) {
			hashParams[e[1]] = decodeURIComponent(e[2]);
		}
		return hashParams;
	}
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */
	var params = getHashParams();

	var access_token = params.access_token,
		refresh_token = params.refresh_token,
	        error = params.error;
	        

	    if(access_token){
	    	$('.in').hide()
	    	$('.out').show()
	    }

	    else{
	    	$('.in').show()
	    	$('.out').hide()
	    }


	
	var searchAlbums = function (query) {//RECEIVING QUERY INPUT FROM GIPHY SEARCH ABOVE
		$.ajax({
			url: 'https://api.spotify.com/v1/search',
			headers: {
				'Authorization': 'Bearer ' + access_token
			},

			data: { //search albums for keyword
				q: query,
				type: 'album'
			},
			success: function (response) {
				//resultsPlaceholder.innerHTML = template(response);
				console.log(response)
		       		albumQuery = response; 
				addAlbumIds(response); //adds album IDs to each Gif
			}
		});
	};
	var fetchTracks = function (albumId, callback) { //make ajax call using data-album-id to Spotify.com
		$.ajax({
			url: 'https://api.spotify.com/v1/albums/' + albumId,
			headers: {
				'Authorization': 'Bearer ' + access_token
			},

			success: function (response) {
				console.log(response)
				callback(response);
			},
			fail:function(err){
				//console.log(err)
			}
		});
	};

	function playSong(e){ 
		//console.log(e);
		var target = e.target;
		if (target !== null && target.classList.contains('cover')) {
			if (target.classList.contains(playingCssClass)) {
				audioObject.pause();
			} else {
				if (audioObject) {
					audioObject.pause();
				}
				fetchTracks(target.getAttribute('data-album-id'), function (data) { //gets albumID of giphy clicked on, and then fetch album tracks to play song
					////console.log(data)
					var preview_url;
					for(var i=0; i<	data.tracks.items.length; i++){		
						preview_url = data.tracks.items[i].preview_url
						if (preview_url != null){
							break;
						}
					}
					console.log(i);
					
					
					audioObject = new Audio(data.tracks.items[0].preview_url); //create a new audio object using the data returned from Spotify.com
					audioObject.play(); //play the song!!!
					target.classList.add(playingCssClass);
					audioObject.addEventListener('ended', function () {
						target.classList.remove(playingCssClass);
					});
					audioObject.addEventListener('pause', function () {
						target.classList.remove(playingCssClass);
					});
				});
			}
		}
	}



	function addAlbumIds(response){ 
		//console.log($('.gif'))
		$('.gif').each(function(i){ //adds Album ID to each GIF so that a different song plays for every image
			//console.log(this,i) 
			this.setAttribute('data-album-id',response.albums.items[i].id)
		})
		//Search has finished!!!
	}


	window.addEventListener("unhandledrejection", function(err, promise) { 
		// handle error here, for example log   
		$playing = $('.cover.gif.playing');
		$playing.click();
		searchRelatedArtists(albumQuery.albums.items[0].artists[0].id)
	       	
	});



	//RELATED ARTISTS
	function searchRelatedArtists(id) {
		var url = 'https://api.spotify.com/v1/artists/'+id+'/related-artists'
			
		$.ajax({
			url: url,
			headers: {
				'Authorization': 'Bearer ' + access_token
			},

			success: function (relatedArtists) {
				let newArtist = relatedArtists.artists[Math.floor(Math.random() * 3) + 1 ].name;
				let str = `Spotify doesn't have any previews for ${oldArtist}, so you're now listening to ${newArtist}`; 
				oldArtist = newArtist; 
				
				$('#artistPlaying').text(str)
 				console.log(newArtist)	
				searchAlbums(newArtist)
				$playing.click();
			},
			error:function(err){
				//console.log(err)
			}
		});
	};



Handlebars.registerHelper('toUpperCase', function(str) { //made captions of images to uppercase
	if(str.length==0){
		return "untitled"
	}
	return str.toUpperCase().split('-').slice(0,-1).join(' '); 

});
})();


//LOG IN


$(".accountlog").click(function(e){

	// $(this).text("Logged In")
	
})


