$().ready(() => {
  const url = "https://wedj.herokuapp.com"
  const email = "be.daria@gmail.com"
  const plistArr = []
  const userArr = []


  function showPlaylists(playlists) {
    playlists.forEach(playlist => {
      var playlistObj = {
        title: playlist.title,
        id: playlist.id
      }
      plistArr.push(playlist)
      $('.playlist-area').append(
        `<div class="col l6 m6 s12 card-image-dc ${playlist.id}">
            <a href="#" id=atag${playlist.id}""><img class="album-image" id="${playlist.id}" src="./stylesheets/party.jpg">
            <span><a class="plist-name-${playlist.id}" href="./playlist.html?id=${playlist.id}">${playlist.title}</a></span>
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
    const plistUrl = `./editPlaylist.html?id=${id}`
    $(`#${id}`).attr('src', imgUrl)
    $(`#atag${id}`).attr("href", plistUrl)
  }

  function searchPlaylists() {
    $('.go-playlist').click(() => {
      let searchStr = $('#search-playlist').val()
      if(searchStr) {
        var results = null;
        plistArr.forEach(playlistObj => {
          playlistObj.title === searchStr ? ($(`.${playlistObj.id}`).fadeIn(),  results = true): $(`.${playlistObj.id}`).hide()
        })
        if(!results) {
          $('.playlist-area').append("<p>No playlist found</p>")
        }
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
