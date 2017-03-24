const path = "https://wedj.herokuapp.com/"
const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
var playlistData = []
function newPlay() {
    searchSong();
    // Save playlist
    $('.save').click((e) => {
        e.preventDefault()
        // Create new playlist item
        $.post(`${path}playlist`, { name: $('.playlist').val() })
          .then((data) => {
            console.log(data)
            // SHOULD RETURN THE NEW PLAYLIST ID WHEN POSTED
            // WE CAN USE THIS TO POST TO THE ROLE TABLE AND PL_SONG TABLE
            $.get(`${path}playlist`)
              .then((data) => {
                var last = data.length
                last --;
                console.log(data[last].id)
                $.post(`${path}role`,{
                    role: "owner",
                    u_id: email,
                    p_id: data[last].id
                })
                .then(function(data) {
                    console.log(data)
                })
              })
            })
        // save search info in a variable then post
        // loop post until all songs are posted
        var recentAppened = playlistData.length;
        console.log(playlistData)
        for (var i = 0; i < playlistData.length; i++) {
            //console.log(playlistData[i])
            $.post(`${path}song`, {
                name: playlistData[i].title,
                album_img: playlistData[i].image,
                URL: playlistData[i].id
            })
                .then(function (data) {
                    console.log(data)
                })
        }

        $.get(`${path}song`).then(function (result) {
            var songOrder = recentAppened;
            var last = result.length - recentAppened;
            for (var i = result.length; i > last; i--) {
                do {
                    i--;
                } while (false) { }
                //console.log(i)
                //console.log('inside for loop')
                var songID = result[i].id;
                //console.log(songID)

                $.get(`${path}playlist`).then(function (plist) {
                    var i = plist.length;
                    i -- ; // chenk
                    var playID = plist[i].id;
                    console.log(playID + "playlist id")
                    console.log(songID + "song id")
                    console.log(plist[i])
                    songID ++;
                    $.post(`${path}playlist_song`, {
                        p_id: playID,
                        s_id: songID,
                        song_order: songOrder
                    }).then(function (data){
                        console.log(data)
                    })
                })
                songOrder--;
            }
        })
    })
}
// send a post to playlist|  and maybe send a post to the playlistsong join
// btn same class for cancel and save button
//$('#playlist').val() = newplaylist name

// make new new play a function that gets passed the value of the playlist name

function addSong(songData) {
    $('.addsong').click((e) => {
        //console.log("addSong clicked")
        //console.log(songData)
        //$('.songinfo').empty();
        $('.songname').append(`<tr><td>${songData.title}</td></tr>`)
        // $('.artist').appened(songData.)
        playlistData.push(songData)
    })
}

$(document).on('click', '.addsong', (e) => {
  const $songData = $(e.target).parents('.search-result-item');
  const playlistItem = {
    id: $songData.find('.addsong').val(),
    title: $songData.find('.video-title').text(),
    image: $songData.find('.video-img').attr('src')
  }
  playlistData.push(playlistItem);
  createPlaylistItem(playlistItem);
  $('.search-results').empty();
});

function searchSong() {
    $('.search').click((e) => {
      // Remove previous search results
      $('.search-results').empty();
        let searchItem = $('.myInput').val()
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
    });
}
// post to songs
// doees song already exist in database
// if not send git request to youtube

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

function createPlaylistItem(resultObj) {
  $('.playlist-items').append(
    `<tr class="playlist-item">
      <td>
        <img class="video-img" src="${resultObj.image}" alt="search-result-thumbnail">
        <p class="video-title">${resultObj.title}</p>
      </td>
    </tr>`
  );
}

$(function () {
    console.log("document.ready working");

    function profileInfo(){
            var user = localStorage.getItem('profile')
            var profile = JSON.parse(user)
            email = profile.email
    }
    profileInfo()
    newPlay();
})
