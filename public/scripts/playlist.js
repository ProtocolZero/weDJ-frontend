var player;
var onYouTubeIframeAPIReady
var playerReady = new Promise((resolve, reject) => {

  onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
     //  events: {
     //    'onReady': resolve,
     //    'onStateChange': onPlayerStateChange
     //  }
    });
    resolve(player)
  }
})

$().ready(() => {

 const urlArr = window.location.href.split('=')
 const pId = urlArr[1]
 const url = "https://wedj.herokuapp.com"
 const YTurl = "https://www.youtube.com/embed/"


 function addSongs(song) {
     $('.songinfo').append(
      `<tr>
         <td class="songname">
          ${song.name}
         </td>
         <td>
           <button class="btn waves-effect waves-light">Like</button>
         </td>
         <td>
           <button class="btn waves-effect waves-light">Dislike</button>
         </td>
       </tr>`
     )
 }




  $.get(`${url}/playlist_song/playlist/${pId}`)
    .then(songs => {
      var firstSong = null
      songs.forEach(song => {
        $.get(`${url}/song/${song.s_id}`)
          .then(song => {
            addSongs(song)
            if (firstSong == null) {
              firstSong = song.URL
              $('#player').attr('src', `${YTurl}${firstSong}`)
            } else {
              playerReady.then(() => {
                console.log("Hello");
                player.cueVideoById({videoId: `${YTurl}${song.URL}`})
              })
            }
          })
      })
    })
})
