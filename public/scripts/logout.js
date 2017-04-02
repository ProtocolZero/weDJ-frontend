var btn_logout = document.getElementById('btn-logout');

btn_logout.addEventListener('click', function() {
    logout();
});

var logout = function() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('profile');
    window.location.href = "/";
  };

  function notLoggedIn() {
    var access_token = localStorage.getItem('accessToken')
    if (access_token === null) {
      console.log('why')
    }
  }

  notLoggedIn()
