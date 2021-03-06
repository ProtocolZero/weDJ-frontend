const url = "https://www.googleapis.com/youtube/v3/search?q=";
const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus";
const path = "https://wedj.herokuapp.com";
const urlArr = window.location.href.split('=')
const pId = urlArr[1]
let pLength = 0;

$.ajaxPrefilter(function( options ) {
    if ( !options.beforeSend) {
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+ localStorage.getItem('accessToken'));
        }
    }
});
var to
$(() => {
  // Get playlist info, playlist_song, and roles
  const getPlaylist = function(id) {
    return $.get(`${path}/playlist/${id}`);
  }
  const getPlaylistSongs = function(id) {
    return $.get(`${path}/playlist_song/playlist/${id}`);
  }
  const getRoles = function(id) {
    return $.get(`${path}/role/playlist/${id}`);
  }
  function getSongs(){
  Promise.all([getPlaylist(pId), getPlaylistSongs(pId), getRoles(pId)])
    .then((results) => {
      const playlist = results[0];
      var playlistSongs = results[1];
      playlistSongs.sort(function(a,b){
        return a.song_order - b.song_order
      })
      const roles = results[2];
      const $collabList = $('.collaborator-list');
      // Display collaborators
      $collabList.remove('.addedli')
      roles.forEach((role) => {
        if (role.role === 'collaborator') {
          const userRole = $('<li>').text(role.u_id).append($('<button class="btn btn-floating red removerole">').val(role.id).append($('<i class="material-icons">').text('remove')));
          $collabList.prepend(userRole).addClass('addedli');
        }
      });
      pLength = playlistSongs.length;
      $('#playlist').val(playlist.name);
      // Get song info
      var songarr = []
      var count = 0
      var target = playlistSongs.length
      plsl = playlistSongs
      playlistSongs.forEach(function(el, ind, arr){
        createPlaylistItem(el)
        if (ind == arr.length-1 ){
              addLikeHandler(playlistSongs)
            addDislikeHandler(playlistSongs)            }
          })
      });
    }
 getSongs()
    // Save playlist
    $('#save-playlist').click((e) => {
      $.ajax({
        url: `${path}/playlist/${pId}`,
        method: 'PUT',
        data: {
          name: $('#playlist').val()
        }
      })
      .then((result) => {
        window.location.href = `./playlist.html?id=${pId}`;
      });
    });

		// Delete Playlist
		$('#delete-playlist').click((e) => {
			// Get playlist_songs and user roles
			Promise.all([getPlaylistSongs(pId), getRoles(pId)])
				.then(results => {
					const playlistSongs = results[0]
					const userRoles = results[1]
					// Delete playlist_songs, roles, playlist
					const delPlSongs = playlistSongs.map(item => {
						deletePlaylistSong(item)
					})
					const delRoles = userRoles.map(role => {
						deleteUserRole(role)
					})
					return Promise.all([delPlSongs, delRoles, deletePlaylist()])
				})
				.then(() => {
					window.location.href = './dashboard.html'
					console.log('PLAYLIST DATA DELETED')
				})
		});

		function deletePlaylistSong(item) {
			return $.ajax({
				url: `${path}/playlist_song/${item.id}`,
				method: 'DELETE'
			})
			.done(() => {
				console.log('PLS DELETED')
			})
			.fail((err) => {
				console.log(err)
			})
		}

		function deleteUserRole(role) {
			return $.ajax({
				url: `${path}/role/${role.id}`,
				method: 'DELETE'
			})
			.done(() => {
				console.log('ROLE DELETED')
			})
			.fail((err) => {
				console.log(err)
			})
		}

		function deletePlaylist() {
			return $.ajax({
				url: `${path}/playlist/${pId}`,
				method: 'DELETE'
			})
			.done(() => {
				console.log('PLAYLIST DELETED')
			})
			.fail((err) => {
				console.log(err)
			})
		}

    $('.myInput').keyup((e) => {
      if(!!to){ clearTimeout(to)}
      to = setTimeout(function(){
      // Remove previous search results
      $('.search-results').empty();
        let searchItem = $('#search-query').val();
        const url = "https://www.googleapis.com/youtube/v3/search?q="
        const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
        $.ajax({url:`${url}${searchItem}${setQuery}`,
        type: 'GET', beforeSend: function(e){console.log('aaa')}})
            .then(results => {
              const searchResults = results.items;
              searchResults.forEach((result) => {
                // Create list of results for user to add to playlist
                const videoResult = {
                  id: result.id.videoId,
                  title: result.snippet.title,
                  image: result.snippet.thumbnails.medium.url
                }
                createSearchResultItem(videoResult);
              });
            });
          }, 500)
    });

    // Add new song to playlist
    $(document).on('click', '.addsong', (e) => {
      const $songData = $(e.target).parents('.search-result-item');
      const playlistItem = {
        URL: $songData.find('.addsong').val(),
        name: $songData.find('.video-title').text(),
        album_img: $songData.find('.video-img').attr('src')
      }
      // Post new song
      // Then post new playlist_song
      $.post(`${path}/song`, playlistItem)
        .then((result) => {
          pLength++;
          $.post(`${path}/playlist_song`, { p_id: pId, s_id: result[0].id, song_order: pLength })
            .then((item) => {
            });
        });
      createPlaylistItem(playlistItem, false);
      $('.search-results').empty();
    });

    // Delete song from playlist
    $(document).on('click', '.removesong', (e) => {
      const $songData = $(e.target).parents('.playlist-item');
      const songId = $songData.find('.removesong').val();
      $.get(`${path}/playlist_song/playlist/${pId}`)
        .then((results) => {
          results.forEach((item) => {
            if (item.s_id === parseInt(songId)) {
              const id = item.id;
              $.ajax({
                url: `${path}/playlist_song/${id}`,
                method: 'DELETE',
              })
              .then(() => {
                $.ajax({
                  url: `${path}/song/${songId}`,
                  method: 'DELETE'
                })
                .then((result) => {
                  console.log(result)
                  window.location.reload();
                }).catch(function(err){
                  window.location.reload();
              })
              })
            }
          });
        });
    });

    // Add collaborator
    $('.addcollaborator').click((e) => {
      const $user = $('#collaborator').val();
            $.post(`${path}/role`, { role: 'collaborator', u_id: $user, p_id: pId })
              .then((results) => {
                window.location.reload();
              });
          })

    // Remove collaborator
    $(document).on('click', '.removerole', (e) => {
      e.preventDefault();
      const roleId = $(e.target).parent().val();
      $.ajax({
        url: `${path}/role/${roleId}`,
        method: 'DELETE',
      })
      .then(() => {
				$(e.target).parents('.collaborator-item').remove();
      });
    });

    function createPlaylistItem(resultObj, j) {
      $('.playlist-items').append(
        `<tr class="playlist-item">
        <td>
        <img class="video-img" src="${resultObj.album_img}" alt="search-result-thumbnail">
        <p class="video-title">${resultObj.name}</p>
        </td>
        <td>
          <button class="like btn btn-floating waves-effect waves-light"><i class="material-icons">arrow_upward</i></button>
        </td>
        <td>
          <button class="dislike btn btn-floating waves-effect waves-light red"><i class="material-icons">arrow_downward</i></button>
        </td>
        <td>
        <button class="btn btn-floating waves-effect waves-light red removesong" value="${resultObj.id}"><i class="material-icons">remove</i></button>
        </td>
        </tr>`
      );
    }
    function addDislikeHandler(pl){
      $('.dislike').click(function(e){
        var plsl = pl
        var j = false
        var index = $(this).index('.dislike')
        var next = index + 1
        var plslnext = plsl[next]
        var plslcurr = plsl[index]
        if (index < plsl.length){
          plsl[next].song_order = index +1
          plsl[index].song_order = next + 1
          var count = 0
          plsl = plsl.map(function(el, ind, arr){
            return {id: el.id, s_id: el.s_id, p_id: el.p_id, song_order: el.song_order, likes: el.likes, dislikes: el.dislikes}
          })
          plsl.forEach(function (el, ind, arr){
            if (ind == index || ind == next){
            $.ajax({
              method: 'PUT',
              url: `${path}/playlist_song/`+el.id,
              data: el
            })
            .done(function (data){
              count++
              if (count == 2){
                $('.playlist-items').empty()
                var j = true
                getSongs()
              }
            })
          }
          })
        }
      })
    }
    function addLikeHandler(pl){
      $('.like').click(function(e){
        var plsl = pl
        var j = false
        var index = $(this).index('.like')
        var next = index - 1
        var plslnext = plsl[next]
        var plslcurr = plsl[index]
        if (index > 0){
          plsl[next].song_order = index +1
          plsl[index].song_order = next + 1
          var count = 0
          plsl = plsl.map(function(el, ind, arr){
            return {id: el.id, s_id: el.s_id, p_id: el.p_id, song_order: el.song_order, likes: el.likes, dislikes: el.dislikes}
          })
          plsl.forEach(function (el, ind, arr){
            if (ind == index || ind == next){
            $.ajax({
              method: 'PUT',
              url: `${path}/playlist_song/`+el.id,
              data: el
            })
            .done(function (data){
              count++
              if (count == 2){
                $('.playlist-items').empty()
                var j = true
                getSongs()
              }
            })
          }
          })
        }
      })
    }
    function createSearchResultItem(resultObj) {
      $('.search-results').append(
        `<tr class="search-result-item">
        <td>
        <img class="video-img" src="${resultObj.image}" alt="search-result-thumbnail">
        <p class="video-title">${resultObj.title}</p>
        </td>
        <td><button class="btn-floating waves-effect waves-light addsong" type="button" name="add-button" value="${resultObj.id}">&#43;</button></td>
        </tr>`
      );
    }
});
