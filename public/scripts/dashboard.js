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
console.log(playlists);
  playlists.forEach(playlist => {
    $('.playlist-area').append(
      `<div class="card-image-dc">
          <img src="./stylesheets/party.jpg">
          <span><a class="plist-name-${playlist.id}" href="${url}/playlist/${playlist.id}">${playlist.title}</a></span>
          <p>Role: ${playlist.role}</p>
          <a class="btn-floating halfway-fab waves-effect waves-light"><i class="material-icons">add</i></a>
        </div>  `)
  })
}




$.get(`${url}/role/${email}`)
  .then(playlists => {
    showPlaylists(playlists)
  })
  .catch((err) => {console.log(err.message)})

})
