
const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
var playlistData = []
var to
var ids
$.ajaxPrefilter(function( options ) {
    if ( !options.beforeSend) {
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem('accessToken'));
        }
    }
});
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

function newPlay() {
    searchSong();
    // Save playlist
    $('.save').click((e) => {
        e.preventDefault()
        // Create new playlist item
        $.post(`${path}playlist`, { name: $('.playlist').val() })
          .then((data) => {
            ids= data
            // console.log(data)
            // SHOULD RETURN THE NEW PLAYLIST ID WHEN POSTED
            // WE CAN USE THIS TO POST TO THE ROLE TABLE AND PL_SONG TABLE
            console.log(data)
                $.post(`${path}role`,{
                    role: "owner",
                    u_id: email,
                    p_id: ids.id
                })
                .then(function(data) {
                    // console.log(data)
                    var recentAppened = playlistData.length;
                    // console.log(playlistData)
                    for (var i = 0; i < playlistData.length; i++) {
                      var count = 0
                      var target = playlistData.length
                        $.post(`${path}song`, {
                            name: playlistData[i].name,
                            album_img: playlistData[i].album_img,
                            URL: playlistData[i].id
                        })
                            .then(function (data3) {
                                console.log(data3)
                                var songID = data3[0].id
                                      $.post(`${path}playlist_song`, {
                                          p_id: ids.id,
                                          s_id: songID,
                                          song_order: i+1
                                      }).then(function (data){
                                          console.log(data)
                                      })
                                  })
                                }
                    })
                })
              })
            }
        // save search info in a variable then post
        // loop post until all songs are post

        // $.get(`${path}song`).then(function (result) {
        //     var songOrder = recentAppened;
        //     var last = result.length - recentAppened;
        //     for (var i = result.length; i > last; i--) {
        //         do {
        //             i--;
        //         } while (false) { }
        //         //console.log(i)
        //         //console.log('inside for loop')
        //         var songID = result[i].id;
                //console.log(songID)

// send a post to playlist|  and maybe send a post to the playlistsong join
// btn same class for cancel and save button
//$('#playlist').val() = newplaylist name

// make new new play a function that gets passed the value of the playlist name

function addSong(songData) {
    $('.addsong').click((e) => {
        //console.log("addSong clicked")
        //console.log(songData)
        //$('.songinfo').empty();
        $('.songname').append(`<tr><td>${songData.title}</td></tr>`)
        // $('.artist').appened(songData.)
        playlistData.push(songData)
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
        const url = "https://www.googleapis.com/youtube/v3/search?q="
        const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
        $.ajax({url:`${url}${searchItem}${setQuery}`,
        type: 'get', beforeSend: function(){console.log('')}})
            .done(results => {

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