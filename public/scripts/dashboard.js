$().ready(() => {
  const url = "https://wedjtestserver.herokuapp.com"
  let email = ""
  let userName = ""
  const plistArr = []
  const userArr = []
  $.ajaxSetup({
      headers: { 'Authorization': 'Bearer '+ localStorage.getItem('accessToken') }
  });
  function profileInfo() {
   var token = localStorage.getItem('accessToken')
   var user = localStorage.getItem('profile')
   var profile = JSON.parse(user)

   email = profile.email
   userName = profile.nickname
  }

  profileInfo()
  // Check for user in the database, if they do not exist create user
  if (!validUser(email)) {
    createUser(email, userName)
  }


  $('.dash-header').html(`${userName}'s playlists`)

  function validUser(email) {
    $.get(`${url}/user/${email}`)
        .then((result) => {
          return result ? true : false
        })
  }

  function createUser(email, userName) {
    const user = { email: email, username: userName }
    $.post(`${url}/user`, user)
      .then((data) => {
        console.log(data)
      })
  }

  function showPlaylists(playlists) {
    playlists.forEach(playlist => {
      var playlistObj = {
        title: playlist.title,
        id: playlist.id
      }
      plistArr.push(playlist)
      $('.playlist-area').append(
        `<div class="col l6 m6 s12 card-image-dc ${playlist.id}">
            <a href="./playlist.html?id=${playlist.id}"><img class="album-image" id="${playlist.id}" src="./stylesheets/party.jpg">
            <span><a class="plist-name-${playlist.id}" href="./playlist.html?id=${playlist.id}">${playlist.title}</a></span>
            <p>Role: ${playlist.role}</p>
            <a href="./editPlaylist.html?id=${playlist.id}" class="btn-floating edit halfway-fab waves-effect waves-light"><i class="material-icons">edit</i></a>
            `)
      $.ajax({url:`${url}/playlist_song/playlist/${playlist.id}`,
      method: 'GET'})
        .done(songs => {
          let firstSongId = songs[0].s_id
          $.get(`${url}/song/${firstSongId}`)
            .then(song => {
                 appendImage(song, playlist.id)
            })
        })
      $.ajax({url:`${url}/role/playlist/${playlist.id}`,
      method: 'GET'})
        .done(users => {
          users.forEach(user => {
            userArr.push(user.u_id)
          })
        })
    })
  }

  function appendImage(song, id) {
    const imgUrl = song.album_img
    const plistUrl = `./playlist.html?id=${id}`
    $(`#${id}`).attr('src', imgUrl)
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


  $.ajax({url:`${url}/role/${email}`,
  method: 'GET'})
    .done(playlists => {
      showPlaylists(playlists)
      searchPlaylists()
    })
    .catch((err) => {console.log(err.message)})

})
