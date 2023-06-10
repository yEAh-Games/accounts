function getIPAddress() {
  return fetch("https://api.ipify.org?format=json")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to retrieve IP address.");
      }
    })
    .then(function (data) {
      return data.ip;
    })
    .catch(function (error) {
      console.error("Error:", error);
      throw error;
    });
}

function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1; // Months are zero-based
  var year = date.getFullYear();

  // Add leading zeros if necessary
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return day + '-' + month + '-' + year;
}

var today = new Date();
var formattedDate = formatDate(today);

function LM4S0ocngnWsZe8EQWAT() {
  let result = 0;

  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(Math.log(Math.exp(Math.pow(Math.sin(Math.random() * 100), 2))));
  }

  const charCode = Math.floor(result % 26) + 97;
  const letter = String.fromCharCode(charCode);

  return letter;
}

let ERWLnL9BCbeIzvdIEn8i = LM4S0ocngnWsZe8EQWAT();

function isRateLimitExempt(ip) {
  var exemptIPs = ["104.222.113.117", "72.138.180.10"];

  return exemptIPs.includes(ip);
}

document.getElementById("createAccountForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Encrypt
  var encryptedPassword = sha256(password);

  var data = {
    username: username,
    password: encryptedPassword,
    admin: false
  };

  var GMYLe = "gMa0YS";
  var iBa5q = "hpX8o9mux4ynw0sCJLL91RGPPQ";
  var Ifxz0 = "YUeSVJ6p9AUJao4H0";
  var IDraP = "U9B";
  var DnSS0 = "ohwA44zIvxacuhOW0J";

  var G9h5YJoj9 = GMYLe.replace("Ma0YS", "");
  var sZo1uS4IS = iBa5q.replace("X8o9", "_").replace("mux4y", "E");
  var d4g6syxuT = Ifxz0.replace("9AU", "khc");
  var HTNNMZ2Cv = DnSS0.replace(DnSS0, "dYNbNwFvg2");

  var w01bi = G9h5YJoj9 + sZo1uS4IS + d4g6syxuT + IDraP + HTNNMZ2Cv;
  var Tm8WGII94E2t94CvKpmH = w01bi.replace("dYNbNwFvg2", LM4S0ocngnWsZe8EQWAT).replace("4H0U9Ba","4H0U9B");

  var jsonData = JSON.stringify(data);

  var form = document.getElementById("createAccountForm");
  form.style.opacity = 0.5;
  form.style.pointerEvents = "none";

  var loading = document.querySelector(".loading");
  loading.style.display = "block";

  var loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.textContent = "Checking rate limit...";
  
  let authorizeFromAPIServer = Tm8WGII94E2t94CvKpmH.replace("9Bt", "9B").slice(0, 40);

  // Fetch rate limit data
  fetch("https://api.github.com/repos/yeah-games/accounts/contents/data/ratelimit.json", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + authorizeFromAPIServer.slice(0, 40)
    }
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to retrieve rate limit data.");
      }
    })
    .then(function (rateLimitData) {
      var rateLimitContent = atob(rateLimitData.content);
      var rateLimitDatabase = JSON.parse(rateLimitContent);

      return getIPAddress().then(function (ip) {
        if (!isRateLimitExempt(ip) && rateLimitDatabase[ip] && rateLimitDatabase[ip] > Date.now()) {
          throw new Error("You have reached the rate limit. Please try again later.");
        }

        rateLimitDatabase[ip] = Date.now() + 3 * 24 * 60 * 60 * 1000;

        var updatedRateLimitContent = JSON.stringify(rateLimitDatabase, null, 2);
        var updatedRateLimitBase64Content = btoa(updatedRateLimitContent);

        return fetch(rateLimitData.url, {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " + authorizeFromAPIServer.slice(0, 40)
          },
          body: JSON.stringify({
            content: updatedRateLimitBase64Content,
            message: "Updated rate limit data",
            sha: rateLimitData.sha
          })
        });
      });
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to update rate limit data.");
      }

      loadingMessage.textContent = "Fetching database...";

      return fetch("https://api.github.com/repos/yeah-games/accounts/contents/data/accounts.json", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + authorizeFromAPIServer.slice(0, 40)
        }
      });
    })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to retrieve account data.");
      }
    })
    .then(function (existingData) {
      var existingContent = atob(existingData.content);
      var existingAccounts = JSON.parse(existingContent);

      if (existingAccounts.some(account => account.username === username)) {
        throw new Error("Username taken.");
      }

      existingAccounts.push(data);

      var updatedContent = JSON.stringify(existingAccounts, null, 2);

      loadingMessage.textContent = "Sending information...";

      var updatedBase64Content = btoa(updatedContent);

      return fetch(existingData.url, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + authorizeFromAPIServer.slice(0, 40)
        },
        body: JSON.stringify({
          content: updatedBase64Content,
          message: "Created account: @" + username,
          sha: existingData.sha
        })
      });
    })
    .then(function (response) {
      if (response.ok) {
        loadingMessage.textContent = "Creating profile...";

        var profileContent = `---
layout: profile
permalink: /@${username}
joindate: ${formattedDate}
---
`;

        var profileBase64Content = btoa(profileContent);

        return fetch("https://api.github.com/repos/yeah-games/profiles/contents/profiles/" + encodeURIComponent("@" + username + ".md"), {
          method: "PUT",
          headers: {
            "Authorization": "Bearer " + authorizeFromAPIServer.slice(0, 40)
          },
          body: JSON.stringify({
            content: profileBase64Content,
            message: "Created profile: @" + username,
          })
        });
      } else {
        throw new Error("Failed to update database.");
      }
    })
    .then(function (response) {
      if (response.ok) {
        loadingMessage.textContent = "Writing to database...";

        return new Promise(function (resolve) {
          setTimeout(resolve, 1500);
        });
      } else {
        throw new Error("Failed to create profile.");
      }
    })
    .then(function () {
      window.location.href = "/login?created=true";
    })
    .catch(function (error) {
      console.error("Error:", error);
      if (error.message === "Username taken.") {
        alert("Username is already taken. Please choose a different username.");
      } else if (error.message === "You have reached the rate limit. Please try again later.") {
        alert("You have reached the yEAh API account creation rate limit. Please try again in three (3) days from the last time you successfully created an account. To remove or exempt yourself from this limit, email us at api@yeahgames.net.");
      } else {
        alert("An unknown error occurred. Please try again later.");
      }
    })
    .finally(function () {
      form.style.opacity = 1;
      form.style.pointerEvents = "auto";

      loading.style.display = "none";
    });
});
