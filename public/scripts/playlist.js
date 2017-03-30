var tag = document.createElement('script');
var pl = []
var playlist = []
const urlArr = window.location.href.split('=')
const pId = urlArr[1]
const url = "https://wedj.herokuapp.com"
const YTurl = "https://www.youtube.com/embed/"

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player

function onPlayerStateChange (e){
  // console.log('State Change! ', e)
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onReady': playerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}

function playerReady() {



  $(document).on('click', '.change-song', (e) => {
		console.log(pl)
		console.log('Song changed! New video ID: ', e.target.value)
		player.loadVideoById(e.target.value)
    // $('#player').attr('src', `${YTurl}${e.target.value}`)
  })

  function addSongs(song) {
		console.log('Adding song: ', song)
   $('.songinfo').append(
    `<tr class="playlist-item">
       <td class="songname">
        <button class="btn waves-effect waves-light change-song" value="${song.URL}"><i class="material-icons">play_arrow</i></button>
        ${song.name}
       </td>
       <td>
         <button class="btn waves-effect waves-light"><span class="like-number">${song.likes}</span> <i class="material-icons">thumb_up</i></button>
       </td>
       <td>
         <button class="btn waves-effect waves-light red"><span class="dislike-number">${song.dislikes}</span> <i class="material-icons">thumb_down</i></button>
       </td>
     </tr>`
    )
  }

	function getPlaylistData() {
		return Promise.all([
			$.get(`${url}/playlist/${pId}`), 
			$.get(`${url}/playlist_song/playlist/${pId}`)
		])
		.then(response => {
			const playlist = response[0]
			const playlistSongs = response[1]
			playlist.songs = []

			playlistSongs.map(song => {
				return $.get(`https://wedj.herokuapp.com/song/${song.s_id}`).then(songResponse => {
					songResponse.likes = song.likes
					songResponse.dislikes = song.dislikes
					playlist.songs.push(songResponse)
					addSongs(songResponse)
					pl.push(songResponse.URL)
					player.loadPlaylist({playlist: pl})
				})
			})
			// return Promise.all([songs])
		})
	}
	getPlaylistData().then(() => console.log('getPlaylistData Finished!'))


  function getSongs() {
    $.get(`${url}/playlist_song/playlist/${pId}`)
      .then(songs => {
        songs.forEach(song => {
          $.get(`${url}/song/${song.s_id}`)
            .then(song => {
              addSongs(song)
              pl.push(song.URL)
              player.loadPlaylist({playlist: pl})
            })
        })
      })
    }
    // getSongs()
}

let partyMode = false;
$('#party-mode').click(() => {
	if (partyMode) {
		$('#overlay').fadeOut('slow');
		$('body').css('color', 'black').fadeIn();
	} else {
		$('#overlay').fadeIn('slow');
		$('body').css('color', 'hsla(138, 54%, 78%, 1)').fadeIn('slow');
	}
	partyMode = !partyMode
})