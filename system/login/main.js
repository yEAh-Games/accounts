document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent 

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

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

                    //  success message
                    var successMessage = document.createElement('p');
                    successMessage.textContent = 'Logged in!';
                    document.body.appendChild(successMessage);

                    // Redirect to param or def to homepage
                    var continueURL = getParameterByName('continue');
                    if (continueURL) {
                        setTimeout(function () {
                            window.location.href = continueURL;
                        }, 2000); 
                    } else {
                        setTimeout(function () {
                            window.location.href = 'https://www.yeahgames.net';
                        }, 2000); 
                    }
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

    // cookie
    document.cookie = 'yeahgames_userdata=' + encodeURIComponent(jsonData) + '; domain=yeahgames.net; path=/';
    localStorage.setItem('yeahgames_userdata', jsonData);
}

// param
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}