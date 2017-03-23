$().ready(() => {

 const urlArr = window.location.href.split('=')
 const pId = urlArr[1]
 const url = "https://wedj.herokuapp.com"
 function addSongs(song) {
     $('.songinfo').append(
      `<tr>
         <td class="songname">
          ${song.name}
         </td>
         <td>
           <button class="btn waves-effect waves-light">Like</button>
         </td>
         <td>
           <button class="btn waves-effect waves-light">Dislike</button>
         </td>
       </tr>`
     )
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
