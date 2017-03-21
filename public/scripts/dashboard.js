const spotifyUrl = "https://api.spotify.com/v1/search?q="
$('.go').click((e) => {
  e.preventDefault()
  let searchItem = $('#search').val()
  console.log(searchItem);
  $.get(`spotifyUrl${searchItem}&type=track`)
    .then(results => {
      const result = results.tracks.items[0]
      song = {
        uri: result.uri,
        name: result.name,
        album_name: result.album.name,
        image: result.album.images[1].url
      }
    })
})
