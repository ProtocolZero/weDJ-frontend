
function newPlay() {
    const url = "https://www.googleapis.com/youtube/v3/search?q="
    const setQuery = "&type=video&part=snippet&key=AIzaSyCMWuzTs2X2BxnT4PJ7_23YmEHBoLPhTus"
    $('.save').click((e) => {
        e.preventDefault()
       let searchItem = $('#search').val(); 
       console.log(searchItem) 
       console.log('save button clicked')
    })

}
// send a post to playlist|  and maybe send a post to the playlistsong join 
// btn same class for cancel and save button 
//$('#playlist').val() = newplaylist name 

























$(function() {
    console.log("js linked and ready")
    newPlay(); 
})