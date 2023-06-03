function validateUserDataFromCookie() {
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
  
    var cookieData = getCookie('yeahgames_userdata');
    var vCookieData = getCookie('yeahgames_v');
  
    if (!cookieData || !vCookieData) {
      console.log('User data is not found or incomplete');
      redirectToLogin(true);
      return null;
    }
  
    var jsonData = decodeURIComponent(cookieData);
    var userData = JSON.parse(jsonData);
  
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
  
    var encasedData = encasingStart + '---' + userData.username + ',admin=' + userData.admin + '---' + encasingEnd;
    var encryptedData = sha256(encasedData);
  
    if (encryptedData === vCookieData) {
      console.log('User data is valid');
      console.log('Username:', userData.username);
      console.log('Admin:', userData.admin);
  
      return {
        username: userData.username,
        admin: userData.admin
      };
    } else {
      console.log('User data is tampered or invalid');
      redirectToLogin(true);
      return null;
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
  
  function redirectToLogin(corrupted) {
    var url = 'https://accounts.yeahgames.net/login';
  
    if (corrupted) {
      url += '?corrupted=true';
    }
  
    window.location.href = url;
  }
  
  function fetchScript(url, callback) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  fetchScript('https://accounts.yeahgames.net/system/all/sha256.js', validateUserDataFromCookie);
  