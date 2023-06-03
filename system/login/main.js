document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

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
          redirectToContinueURL(userData);
        } else {
          alert('Incorrect password!');
        }
      }
    })
    .catch(function (error) {
      console.error('Error:', error);
      alert('An unknown error occurred while logging in. Please try again later.');
    });
});

function writeUserData(userData) {
  var usernameMapping = {
    'a': 'bR',
    'b': 'cY',
    'c': 'dX',
    'd': 'eQ',
    'e': 'fZ',
    'f': 'gP',
    'g': 'hO',
    'h': 'iN',
    'i': 'jM',
    'j': 'kL',
    'k': 'lK',
    'l': 'mJ',
    'm': 'nI',
    'n': 'oH',
    'o': 'pG',
    'p': 'qF',
    'q': 'rE',
    'r': 'sD',
    's': 'tC',
    't': 'uB',
    'u': 'vA',
    'v': 'wZ',
    'w': 'xY',
    'x': 'yX',
    'y': 'zW',
    'z': 'aV',
    '0': '1Q',
    '1': '2P',
    '2': '3O',
    '3': '4N',
    '4': '5M',
    '5': '6L',
    '6': '7K',
    '7': '8J',
    '8': '9I',
    '9': '0H',
    '-': '-G',
    '.': '.F',
  };

  var encasingStart = '';
  var encasingEnd = '';

  if (userData.username.length > 0) {
    var firstChar = userData.username[0];
    var lastChar = userData.username[userData.username.length - 1];

    if (usernameMapping.hasOwnProperty(firstChar) && usernameMapping.hasOwnProperty(lastChar)) {
      encasingStart = usernameMapping[firstChar];
      encasingEnd = usernameMapping[lastChar].split('').reverse().join('');
    }
  }

  var jsonData = JSON.stringify(userData);
  var encasedData = encasingStart + '---' + userData.username + ',admin=' + userData.admin + '---' + encasingEnd;
  var encryptedData = sha256(encasedData);

  var rememberCheckbox = document.getElementById('remember');
  var expiration = rememberCheckbox.checked ? 'expires=365' : 'expires=0'; // 1 year or session expiration

  document.cookie = 'yeahgames_userdata=' + encodeURIComponent(jsonData) + '; domain=yeahgames.net; path=/; ' + expiration;
  document.cookie = 'yeahgames_v=' + encodeURIComponent(encryptedData) + '; domain=yeahgames.net; path=/; ' + expiration;
  localStorage.setItem('yeahgames_userdata', jsonData);
}


function redirectToContinueURL(userData) {
  var continueURL = getParameterByName('continue');

  if (continueURL) {
    window.location.href = continueURL;
  } else {
    window.location.href = 'https://www.yeahgames.net';
  }
}

function getParameterByName(name) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(window.location.href);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var storedUserData = getLoggedInUserData();

if (storedUserData) {
  console.log('User data is valid');
} else {
  console.log('Error fetching localStorage userdata. Using cookies instead.');
}
