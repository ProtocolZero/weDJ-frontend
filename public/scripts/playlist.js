var tag = document.createElement('script');
var pl = []
const urlArr = window.location.href.split('=')
const pId = urlArr[1]
const url = "https://wedj.herokuapp.com"
const YTurl = "https://www.youtube.com/embed/"

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player

function onPlayerStateChange (e){
  console.log('Changed')
  var state = player.getPlayerState()
  if ( state == 1 && player.getPlaylistIndex() != 0){
   var rotation = player.getPlaylistIndex()
   for (count = 0; count < rotation; count++){
     var temp = pl.shift()
     pl.push(temp)
   }
   player.loadPlaylist(pl)
  }
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

  function changeSong(e) {
   var songsCount = pl.length
   player.loadPlaylist({playlist: pl, index: e.target.index() })
}



  function addSongs(song) {
   $('.songinfo').append(
    `<tr>
       <td class="songname">
        ${song.name}
        <button class="btn waves-effect waves-light change-song right" value="${song.URL}">Play</button>
       </td>
       <td>
         <button class="btn waves-effect waves-light"><i class="material-icons">thumb_up</i></button>
       </td>
       <td>
         <button class="btn waves-effect waves-light"><i class="material-icons">thumb_down</i></button>
       </td>
     </tr>`
    )
  }

function changeName (){
  $.get(`${url}/playlist/${pId}`)
  .then(data=>{
    var name = data[0].title
    $('#name').text(name)
  })
}
  function getSongs() {
    $.get(`${url}/playlist_song/playlist/${pId}`)
      .then(songs => {

        var firstSong = null
        songs.forEach(song => {
          $.get(`${url}/song/${song.s_id}`)
            .then(song => {
              addSongs(song)
              pl.push(song.URL)
              if (ind = songs.length - 1){
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
}
