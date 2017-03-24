window.addEventListener('load', function() {


    var lock = new Auth0Lock('7rC5bCOIFS04j08SeFAygi7fvdCGoeK9', 'shep222.auth0.com', {
        container: 'root',
    });
    lock.show();

    lock.on("authenticated", function(authResult) {
        lock.getUserInfo(authResult.accessToken, function(error, profile) {
            if (error) {
                // Handle error
                return;
            }
            console.log('HERE', profile.email);

            $.post('https://wedj.herokuapp.com/user', {
              email: profile.email,
              username: profile.email
            }).then(function (data){
              console.log("You Posted the UserName");
            })


            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('profile', JSON.stringify(profile))
            // Display user information
        }).then(function() {
          window.location.href = "/dashboard.html"
        })
        ;
    });
});
