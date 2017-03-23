$().ready(() => {

 const urlArr = window.location.href.split('=')
 const pId = urlArr[1]
 const url = "https://wedj.herokuapp.com"
 function addSongs(song) {
     $('songname').html(song.name)
     $('.artist').html(song.artist_name)
     $('.album').html(song.album_name)
 }

  $.get(`${url}/playlist_song/playlist/${pId}`)
    .then(songs => {
      songs.forEach(song => {
        $.get(`${url}/song/${song.s_id}`)
          .then(song => {
            console.log(song);
            addSongs(song)
          })
      })
    })
})
