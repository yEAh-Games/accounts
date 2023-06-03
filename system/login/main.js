document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form submission

  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

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
  var encasedData = generateEncasing(userData.username) + ',admin=' + userData.admin;
  var encryptedData = sha256(encasedData);

  document.cookie = 'yeahgames_userdata=' + encodeURIComponent(jsonData) + '; domain=yeahgames.net; path=/';
  document.cookie = 'yeahgames_v=' + encodeURIComponent(encryptedData) + '; domain=yeahgames.net; path=/';
  localStorage.setItem('yeahgames_userdata', jsonData);
}

function generateEncasing(username) {
  var encasedData = '';

  for (var i = 0; i < username.length; i++) {
    var char = username[i];
    var randomString = generateRandomString(char);
    encasedData += randomString;
  }

  return encasedData;
}

function generateRandomString(char) {
  var mappings = {
    '.': 'gj',
    '-': 'xz',
    '0': 'kr',
    '1': 'yt',
    '2': 'lm',
    '3': 'ab',
    '4': 'nc',
    '5': 'pw',
    '6': 'qe',
    '7': 'dh',
    '8': 'sf',
    '9': 'vi',
    'a': 'uj',
    'b': 're',
    'c': 'xo',
    'd': 'pt',
    'e': 'kl',
    'f': 'nh',
    'g': 'mw',
    'h': 'ib',
    'i': 'cq',
    'j': 'ya',
    'k': 'vf',
    'l': 'zt',
    'm': 'gs',
    'n': 'dx',
    'o': 'ec',
    'p': 'lr',
    'q': 'on',
    'r': 'jh',
    's': 'uf',
    't': 'bk',
    'u': 'vp',
    'v': 'ai',
    'w': 'ym',
    'x': 'sz',
    'y': 'td',
    'z': 'fx'
  };

  return mappings[char] || '';
}


function getLoggedInUserData() {
  var cookieData = getCookie('yeahgames_userdata');
  var vCookieData = getCookie('yeahgames_v');
  var localStorageData = localStorage.getItem('yeahgames_userdata');

  if (cookieData && vCookieData && localStorageData && validateCookies(cookieData, vCookieData, localStorageData)) {
    return JSON.parse(localStorageData);
  }

  return null;
}

function validateCookies(cookieData, vCookieData, localStorageData) {
  var encasedData = generateEncasing(JSON.parse(localStorageData).username) + ',admin=' + JSON.parse(localStorageData).admin;
  var encryptedData = sha256(encasedData);

  return encryptedData === vCookieData;
}

function redirectToContinueURL(userData) {
  var continueURL = getParameterByName('continue');

  if (continueURL) {
    window.location.href = continueURL;
  } else {
    window.location.href = 'https://www.yeahgames.net';
  }
}

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
  // User data is valid
  console.log('User data is valid');
  // Do something
} else {
  // User data is not found or tampered
  console.log('User data is not found or tampered');
  // Do something else
}
