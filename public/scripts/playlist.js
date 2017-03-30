var tag = document.createElement('script');
var pl = []
var name = "playlist"
var sl = []

const urlArr = window.location.href.split('=')
const pId = urlArr[1]
const url = "https://wedj.herokuapp.com"
const YTurl = "https://www.youtube.com/embed/"

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player

function onPlayerStateChange (e){
  var state = player.getPlayerState()
  if ( state == 1 && player.getPlaylistIndex() != 0){
   var rotation = player.getPlaylistIndex()
   for (count = 0; count < rotation; count++){
     var temp = pl.shift()
     var temp2 = sl.shift()
     pl.push(temp)
     sl.push(temp2)

   }
   player.loadPlaylist(pl)
   $('.songinfo').empty()
	 setCurrentSong(sl[0])
   sl.forEach(function (song){
     addSongs(song)
   })
   $('.change-song').click(function (e){
     player.loadPlaylist({playlist: pl , index: $(this).index('.change-song') })
   })
  }
}
function addSongs(song) {
 $('.songinfo').append(
  `<tr class="playlist-item">
     <td class="songname">
      <button class="btn btn-floating waves-effect waves-light change-song" value="${song.URL}"><i class="material-icons">play_arrow</i></button>
      ${song.name}
     </td>
     <td>
       <button class="btn btn-floating waves-effect waves-light"><i class="material-icons">thumb_up</i></button>
     </td>
     <td>
       <button class="btn btn-floating waves-effect waves-light red"><i class="material-icons">thumb_down</i></button>
     </td>
   </tr>`
  )
}

function setCurrentSong(song) {
	console.log(song)
	$('.current-song').empty().hide().fadeOut('slow')
	$('.current-song').append(`${song.name}`).fadeIn('slow')
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onReady': playerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}

function changeName (){
  $.get(`${url}/playlist/${pId}`)
  .then(data=>{
    name = data.name
    $('#name').text(name)
  })
}
function playerReady() {


  function getSongs() {
    return $.get(`${url}/playlist_song/playlist/${pId}`)
      .then(songs => {
        songs.forEach(song => {
          $.get(`${url}/song/${song.s_id}`)
            .then(song => {
              addSongs(song)
							console.log(sl)
							if (sl.length === 0) {
								setCurrentSong(song)
							}
              pl.push(song.URL)
              sl.push(song)
              if (ind = songs.length - 1) {
								player.loadPlaylist({playlist: pl})
								$('.change-song').click(function (e){
									player.loadPlaylist({playlist: pl , index: $(this).index('.change-song') })
								})
            	}
            })
        })
    	})
	}
    getSongs()
    changeName()
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