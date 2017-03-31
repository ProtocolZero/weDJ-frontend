const url = "https://www.googleapis.com/youtube/v3/search?q=";
const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus";
const path = "https://wedj.herokuapp.com";
const urlArr = window.location.href.split('=')
const pId = urlArr[1]
let pLength = 0;
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
  Promise.all([getPlaylist(pId), getPlaylistSongs(pId), getRoles(pId)])
    .then((results) => {
      const playlist = results[0];
      const playlistSongs = results[1];
      const roles = results[2];
      const $collabList = $('.collaborator-list');
      // Display collaborators
      roles.forEach((role) => {
        if (role.role === 'collaborator') {
          const userRole = $('<li>').text(role.u_id).append($('<button class="btn btn-floating red removerole">').val(role.id).append($('<i class="material-icons">').text('remove')));
          $collabList.prepend(userRole);
        }
      });
      pLength = playlistSongs.length;
      $('#playlist').val(playlist.name);
      // Get song info
      playlistSongs.forEach((item) => {
        $.get(`${path}/song/${item.s_id}`)
          .then((song) => {
            createPlaylistItem(song);
          })
      });
    });

    // Save playlist
    $('#save-playlist').click((e) => {
      console.log('hi');
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


    $('.myInput').keyup((e) => {
      if(!!to){ clearTimeout(to)}
      to = setTimeout(function(){
      // Remove previous search results
      $('.search-results').empty();
        let searchItem = $('#search-query').val();
        const url = "https://www.googleapis.com/youtube/v3/search?q="
        const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
        $.get(`${url}${searchItem}${setQuery}`)
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
      createPlaylistItem(playlistItem);
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
                .then(() => {
                  window.location.reload();
                });
              })
            }
          });
        });
    });

    // Add collaborator
    $('.addcollaborator').click((e) => {
      const $user = $('#collaborator').val();
      // Check to see if user exists
      $.get(`${path}/user`)
        .then((users) => {
          if (users.find(user => user.email === $user)) {
            // Post to collaborators with the matched user
            $.post(`${path}/role`, { role: 'collaborator', u_id: $user, p_id: pId })
              .then((results) => {
                window.location.reload();
              });
          } else {
            console.log('no match!');
          }
        });
    });

    // Remove collaborator
    $(document).on('click', '.removerole', (e) => {
      e.preventDefault();
      const roleId = $(e.target).parent().val();
      $.ajax({
        url: `${path}/role/${roleId}`,
        method: 'DELETE',
      })
      .then(() => {
        window.location.reload();
      });
    });

    function createPlaylistItem(resultObj) {
      $('.playlist-items').append(
        `<tr class="playlist-item">
        <td>
        <img class="video-img" src="${resultObj.album_img}" alt="search-result-thumbnail">
        <p class="video-title">${resultObj.name}</p>
        </td>
        <td>
        <button class="btn btn-floating waves-effect waves-light red removesong" value="${resultObj.id}"><i class="material-icons">remove</i></button>
        </td>
        </tr>`
      );
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
