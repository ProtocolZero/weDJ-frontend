window.addEventListener('load', function() {


  var lock = new Auth0Lock('31RMIV2OvJCPgnLT3uGZROlu6BiFZBFS', 'tcats.auth0.com', {
  container: 'root',
  auth: {
    redirect: false,
    redirectUrl: 'http://wedj-youtube.firebaseapp.com/dashboard.html',
    responseType: 'token',
    params: {
      scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
    }
  }
});
lock.show();

    lock.on("authenticated", function(authResult) {
      console.log('test66666')
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    // Save token and profile locally
    localStorage.setItem("accessToken", authResult.idToken);
    localStorage.setItem("profile", JSON.stringify(profile));

    // Update DOM
  });
})
    //retrieve the profile:
    //   var retrieve_profile = function() {
    //     var access_token = localStorage.getItem('access_token');
    //     if (access_token) {
    //       lock.getUserInfo(access_token, function (err, profile) {
    //         if (err) {
    //           return alert('There was an error getting the profile: ' + err.message);
    //         }
    //         // Display user information
    //         show_profile_info(profile);
    //       });
    //     }
    //   };
    //
    //   var show_profile_info = function(profile) {
    //     var avatar = document.getElementById('avatar');
    //     document.getElementById('nickname').textContent = profile.nickname;
    //     btn_login.style.display = "none";
    //     avatar.src = profile.picture;
    //     avatar.style.display = "block";
    //     btn_logout.style.display = "block";
    //   };
    //
    //   var logout = function() {
    //     localStorage.removeItem('access_token');
    //     window.location.href = "/";
    //   };
    //
    //   retrieve_profile();
});
