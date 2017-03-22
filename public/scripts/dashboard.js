$().ready(() => {
  const url = "https://wedj.herokuapp.com"
  const email = "be.daria@gmail.com"
  // $('.go-user').click((e) => {
  //   e.preventDefault()
  //   let searchString = $('#search-user').val()
  //   let userUrl = `${url}/user/${searchString}`
  //   console.log(userUrl);
  //   $.get(userUrl, function(result) {
  //   console.log(result)
  //   })
  // })

//steps: 1.make a call to a role to get all playlists for a specific user. Show role on page, store p_id
//2. make a call to playlist to get playlist name, append it to the bottom of the image
//3. make a call for playlist_song to get id of songs[0] for a specific playlist
//.4 make a call for song to get album_image
function showPlaylists(playlists) {
  playlists.forEach(playlist => {
    $('.playlist-area').append(
      `<div class="col l6 m6 s12 card-image-dc">
          <img class="album-image" id="${playlist.id}" src="./stylesheets/party.jpg">
          <span><a class="plist-name-${playlist.id}" href="${url}/playlist/${playlist.id}">${playlist.title}</a></span>
          <p>Role: ${playlist.role}</p>
          <a class="btn-floating edit halfway-fab waves-effect waves-light"><i class="material-icons">edit</i></a>
          `)
    $.get(`${url}/playlist_song/playlist/${playlist.id}`)
      .then(songs => {
        let firstSongId = songs[0].s_id
        // let pId = songs[0].p_id
        $.get(`${url}/song/${firstSongId}`)
          .then(song => {
               appendImage(song[0], playlist.id)
          })
      })
  })
}

function appendImage(song, id) {
  const imgUrl = song.album_img
  $(`#${id}`).attr('src', imgUrl)
}



$.get(`${url}/role/${email}`)
  .then(playlists => {
    showPlaylists(playlists)
  })
  .catch((err) => {console.log(err.message)})

})
