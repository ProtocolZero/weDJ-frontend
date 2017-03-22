$().ready(() => {
  const url = "https://wedj.herokuapp.com"
  const email = "be.daria@gmail.com"
  const plistArr = []
  const userArr = []


  function showPlaylists(playlists) {
    playlists.forEach(playlist => {
      plistArr.push(playlist.title)
      $('.playlist-area').append(
        `<div class="col l6 m6 s12 card-image-dc ${playlist.title}">
            <img class="album-image" id="${playlist.id}" src="./stylesheets/party.jpg">
            <span><a class="plist-name-${playlist.id}" href="${url}/playlist/${playlist.id}">${playlist.title}</a></span>
            <p>Role: ${playlist.role}</p>
            <a class="btn-floating edit halfway-fab waves-effect waves-light"><i class="material-icons">edit</i></a>
            `)
      $.get(`${url}/playlist_song/playlist/${playlist.id}`)
        .then(songs => {
          let firstSongId = songs[0].s_id
          $.get(`${url}/song/${firstSongId}`)
            .then(song => {
                 appendImage(song[0], playlist.id)
            })
        })
      $.get(`${url}/role/playlist/${playlist.id}`)
        .then(users => {
          users.forEach(user => {
            userArr.push(user.u_id)
          })
        })
    })
  }

  function appendImage(song, id) {
    const imgUrl = song.album_img
    $(`#${id}`).attr('src', imgUrl)
  }

  function searchPlaylists() {
    $('.go-playlist').click((e) => {
      e.preventDefault()
      let searchStr = $('#search-playlist').val()
      if(!plistArr.includes(searchStr)) {
        console.log("Hello");
        $('.car-image-dc.playlist-title').hide()
      } else {
        console.log("Hi");
      }
    })
  }


  $.get(`${url}/role/${email}`)
    .then(playlists => {
      showPlaylists(playlists)
      searchPlaylists()
    })
    .catch((err) => {console.log(err.message)})

})
