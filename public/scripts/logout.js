var btn_logout = document.getElementById('btn-logout');

btn_logout.addEventListener('click', function() {
    logout();
});

var logout = function() {
    localStorage.removeItem('access_token');
    window.location.href = "/";
  };

  function notLoggedIn() {
    var access_token = localStorage.getItem('access_token')
    if (access_token === null) {
      window.location.href = "/"
    }
  }

  notLoggedIn()
