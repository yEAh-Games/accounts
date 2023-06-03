document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Check if user is already logged in
    var userData = getLoggedInUserData();
    if (userData) {
        redirectToContinueURL(userData);
        return;
    }

    fetch('/data/accounts.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var foundUser = data.find(function (user) {
                return user.username === username;
            });

            if (!foundUser) {
                alert('Account does not exist! Create it at https://accounts.yeahgames.net/create, or by clicking the link below the log-in button.');
            } else {
                var encryptedPassword = sha256(password);

                if (foundUser.password === encryptedPassword) {
                    var userData = {
                        username: foundUser.username,
                        admin: foundUser.admin
                    };

                    writeUserData(userData);
                    redirectToContinueURL(userData);
                } else {
                    alert('Incorrect password!');
                }
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
            alert('An error occurred while logging in. Please try again later.');
        });
});

function writeUserData(userData) {
    var jsonData = JSON.stringify(userData);

    // Store user data in cookie and local storage
    document.cookie = 'yeahgames_userdata=' + encodeURIComponent(jsonData) + '; domain=yeahgames.net; path=/';
    localStorage.setItem('yeahgames_userdata', jsonData);
}

function getLoggedInUserData() {
    var cookieData = getCookie('yeahgames_userdata');

    if (cookieData) {
        return JSON.parse(cookieData);
    }

    return null;
}

function redirectToContinueURL(userData) {
    var continueURL = getParameterByName('continue');

    if (continueURL) {
        window.location.href = continueURL;
    } else {
        window.location.href = 'https://www.yeahgames.net';
    }
}

// Get cookie value by name
function getCookie(name) {
    var cookies = document.cookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();

        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }

    return null;
}

// Get URL parameter value by name
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
