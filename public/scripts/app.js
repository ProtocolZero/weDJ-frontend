window.addEventListener('load', function() {


    var lock = new Auth0Lock('7rC5bCOIFS04j08SeFAygi7fvdCGoeK9', 'shep222.auth0.com', {
        container: 'root',
        // auth: {
        //     // redirectUrl: 'http://localhost:5000/dashboard.html',
        //     responseType: 'code',
        //     params: {
        //         scope: 'openid email' // Learn about scopes: https://auth0.com/docs/scopes
        //     }
        // }
    });
    lock.show();


    // buttons
    var btn_login = document.getElementById('btn-login');
    var btn_logout = document.getElementById('btn-logout');

    // btn_login.addEventListener('click', function() {
    //     lock.show();
    // });

    // btn_logout.addEventListener('click', function() {
    //     logout();
    // });

    lock.on("authenticated", function(authResult) {
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) {
                // Handle error
                return;
            }

            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('profile', JSON.stringify(profile))
            // Display user information
        }).then(function() {
          window.location.href = "/dashboard.html"
        })
        ;
    });

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
