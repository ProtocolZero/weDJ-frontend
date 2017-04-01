var tag = document.createElement('script');
var pl = []
var name = "playlist"
var sl = []
var plsl = []
var newarr = []
var newarr2 = []
var j = false
const urlArr = window.location.href.split('=')
const pId = urlArr[1]
const url = "https://wedj.herokuapp.com"
const YTurl = "https://www.youtube.com/embed/"

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player

function onPlayerStateChange (e){
  var state = player.getPlayerState()
  if (player.getPlaylistIndex() != 0 && state == 1){
    player.stopVideo()
   var rotation = player.getPlaylistIndex()
   for (count = 0; count < rotation; count++){
     var temp = pl.shift()
     var temp2 = sl.shift()
     var temp3 = plsl.shift()
     pl.push(temp)
     sl.push(temp2)
     plsl.push(temp3)
   }
   plsl.forEach(function(el, ind, arr){
     el.song_order = ind +1
   })
   plsl.forEach(function (el, ind, arr){
     $.ajax({
       method: 'PUT',
       url: `${url}/playlist_song/`+el.id,
       data: el
     })
     .done(function (data){
       if (ind == arr.length-1){
         $('.songinfo').empty()
         getSongs()
       }
         })
       })
     }
   }
function addSongs(song) {
 $('.songinfo').append(
  `<tr class="playlist-item value="${song.URL}" id="${song.name}">
     <td class="songname">
      <button class="btn btn-floating waves-effect waves-light change-song" value="${song.URL}"><i class="material-icons">play_arrow</i></button>
      ${song.name}
     </td>
     <td>
       <button class="like btn btn-floating waves-effect waves-light"><i class="material-icons">arrow_upward</i></button>
     </td>
     <td>
       <button class="dislike btn btn-floating waves-effect waves-light red"><i class="material-icons">arrow_downward</i></button>
     </td>
   </tr>`
  )
}

function setCurrentSong(song) {
	console.log(song)
	$('.current-song').empty().hide().fadeOut('slow')
	$('.current-song').append(`${song.name}`).fadeIn('slow')
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onReady': playerReady,
      'onStateChange': onPlayerStateChange
    }
  })
}

function changeName (){
  $.get(`${url}/playlist/${pId}`)
  .then(data=>{
    name = data.name
    $('#name').text(name)
  })
}
function addDislikeHandler(){
  $('.dislike').click(function(e){
    var j = false
    var index = $(this).index('.dislike') +1
    var next = index + 1
    var plslnext = plsl[next]
    var plslcurr = plsl[index]
    if (index < plsl.length){
      plsl[next].song_order = index +1
      plsl[index].song_order = next + 1
      plsl.forEach(function (el, ind, arr){
        $.ajax({
          method: 'PUT',
          url: `${url}/playlist_song/`+el.id,
          data: el
        })
        .done(function (data){
          if (ind == arr.length-1){
            $('.songinfo').empty()
            var j = true
            getSongs(j)
          }
        })
      })
    }
  })
}
function addLikeHandler(){
  $('.like').click(function(e){
    var j = false
    var index = $(this).index('.like') + 1
    var next = index - 1
    var plslnext = plsl[next]
    var plslcurr = plsl[index]
    if (index > 1){
      plsl[next].song_order = index +1
      plsl[index].song_order = next + 1
      plsl.forEach(function (el, ind, arr){
        $.ajax({
          method: 'PUT',
          url: `${url}/playlist_song/`+el.id,
          data: el
        })
        .done(function (data){
          if (ind == arr.length-1){
            $('.songinfo').empty()
            var j = true
            getSongs(j)
          }
        })
      })
    }
  })
}
function changeTrack(j){
  pl.forEach(function(element, index, array){
    for (var i = 0; i < plsl.length; i++){
      if (plsl[i].s_id == element.id) {
      newarr[i] = element
      }
    }
  })
  setCurrentSong(newarr[0])
  newarr.forEach(function(e,i,a){
    if (i != 0){
      addSongs(e)
    }
    newarr2.push(e.URL)
  })
  if (!j){
  player.loadPlaylist({playlist: newarr2})}
  $('.change-song').click(function (e){
    player.loadPlaylist({playlist: newarr2 , index: $(this).index('.change-song')+1 })
  })
  addLikeHandler()
  addDislikeHandler()
}
function getSongs(j) {
  pl = []
  newarr= []
  newarr2 = []
  var count = 0
  $.get(`${url}/playlist_song/playlist/${pId}`)
  .then(songs => {
    var target = songs.length
    console.log(songs)
    songs.sort(function (a, b){
      return a.song_order - b.song_order
    })
    plsl = songs
    console.log(plsl)
    songs.forEach(function (song, ind, arr) {
      $.get(`${url}/song/${song.s_id}`)
      .then(song => {
        count++
        pl.push(song)
        if (count == target) {
          changeTrack(j)
        }
      })
    })
  })
}
function playerReady() {
    getSongs()
    changeName()
}

let partyMode = false;
$('#party-mode').click(() => {
	if (partyMode) {
		$('#overlay').fadeOut('slow');
		$('body').css('color', 'black').fadeIn();
	} else {
		$('#overlay').fadeIn('slow');
		$('body').css('color', 'hsla(138, 54%, 78%, 1)').fadeIn('slow');
	}
	partyMode = !partyMode
})
