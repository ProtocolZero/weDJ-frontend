const path = "https://wedj.herokuapp.com/"
const searchUrl = "https://www.googleapis.com/youtube/v3/search?q="
const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
var playlistData = []
var to
var pId

// Document Ready
$(function () {
	profileInfo()
	newPlay()
})

// Create New Playlist
function newPlay() {
    searchSong();
    // Save playlist
    $('.save').click((e) => {
        e.preventDefault()
				const playlistName = $('.playlist').val()
        // POST new playlist item
				postPlaylist(playlistName)
          .then((playlistId) => {
						pId = playlistId[0]
            console.log('Playlist ID: ', pId)
						const userRole = {
							role: "owner",
							u_id: email,
							p_id: pId
						}
						// POST user role
						postUserRole(userRole).then(function(newUserRole) {
							console.log('User Role: ',newUserRole)
						})
						// POST each song
						console.log('PlaylistData: ', playlistData)
						const songs = playlistData.map(song => postSong(song))
						return Promise.all(songs)
				})
				.then(songIds => {
					console.log('Song IDs: ', songIds)
					// POST each playlist_songs
					const playlistSongs = songIds.map((id, i) => postPlaylistSongs(id, i))
					return Promise.all(playlistSongs)
				})
				.then((results) => {
					console.log('Playlist Data Created!')
					window.location.href = `/playlist.html?id=${pId}`
				})
    })
}

// Add song to playlist
$(document).on('click', '.addsong', (e) => {
  const $songData = $(e.target).parents('.search-result-item');
  const playlistItem = {
    id: $songData.find('.addsong').val(),
    name: $songData.find('.video-title').text(),
    album_img: $songData.find('.video-img').attr('src')
  }
  playlistData.push(playlistItem);
  createPlaylistItem(playlistItem);
  $('.search-results').empty();
});

// Remove song from playlist
$(document).on('click', '.removesong', (e) => {
  $(e.target).parents('.playlist-item').remove();
});

function searchSong() {
    $('.myInput').keyup((e) => {
      if (!!to){
      clearTimeout(to)}
      to = setTimeout(function(){
      // Remove previous search results
      $('.search-results').empty();
        let searchItem = $('.myInput').val()
        $.get(`${searchUrl}${searchItem}${setQuery}`)
            .then(results => {
              const searchResults = results.items;
              searchResults.forEach((result) => {
                // Create list of results for user to add to playlist
                const videoResult = {
                  id: result.id.videoId,
                  name: result.snippet.title,
                  album_img: result.snippet.thumbnails.medium.url
                }
                createSearchResultItem(videoResult);
              });
            });
    }, 500);
  })
}

function createSearchResultItem(resultObj) {
  $('.search-results').append(
    `<tr class="search-result-item">
      <td>
        <img class="video-img" src="${resultObj.album_img}" alt="search-result-thumbnail">
        <p class="video-title">${resultObj.name}</p>
      </td>
      <td><button class="btn-floating waves-effect waves-light addsong" type="button" name="add-button" value="${resultObj.id}">&#43;</button></td>
    </tr>`
  );
}

let emptyPlaylist = true
function createPlaylistItem(resultObj) {
	if (emptyPlaylist) {
		$('.empty-playlist').remove()
		emptyPlaylist = false
	}
	$('.myInput').val('')
  $('.playlist-items').append(
    `<tr class="playlist-item">
      <td>
        <img class="video-img" src="${resultObj.album_img}" alt="search-result-thumbnail">
        <p class="video-title">${resultObj.name}</p>
      </td>
      <td>
        <button class="btn btn-floating waves-effect waves-light red removesong" value="${resultObj.id}"><i class="material-icons">remove</i></button>
      </td>
    </tr>`
  );
}

// Get user profile info
function profileInfo(){
	var user = localStorage.getItem('profile')
	var profile = JSON.parse(user)
	email = profile.email
}

// Database POST functions
function postPlaylist(name) {
	return $.post(`${path}playlist`, { name: name })
}

function postUserRole(userRole) {
	return $.post(`${path}role`, userRole)
}

function postSong(song) {
	console.log('Song: ', song)
	const newSong = {
		name: song.name,
		album_img: song.album_img,
		URL: song.id
	}
	return $.post(`${path}song`, newSong)
}

function postPlaylistSongs(id, index) {
	const newPlaylistSong = {
		p_id: pId,
		s_id: id[0],
		song_order: index + 1
	}
	console.log('newPlaylistSong: ', newPlaylistSong)
	return $.post(`${path}playlist_song`, newPlaylistSong)
}