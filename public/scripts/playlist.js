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
  console.log(e)
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

  function changeSong(url) {
   $('#player').attr('src', `${YTurl}url`)
  }

  $(document).on('click', '.change-song', (e) => {
    $('#player').attr('src', `${YTurl}${e.target.value}`)
  })

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


  function getSongs() {
    $.get(`${url}/playlist_song/playlist/${pId}`)
      .then(songs => {
        var firstSong = null
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
    getSongs()
}
