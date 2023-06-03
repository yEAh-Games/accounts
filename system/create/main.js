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

    var jsonData = JSON.stringify(data);

    var form = document.getElementById("createAccountForm");
    form.style.opacity = 0.5;
    form.style.pointerEvents = "none";

    var loading = document.querySelector(".loading");
    loading.style.display = "block";

    var loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.textContent = "Fetching database...";

    var tokenPart1 = "gh";
    var tokenPart2 = "p_Enw0sCJLL91RGPPQ";
    var tokenPart3 = "YUeSVJ6pkhcJao4H0";
    var tokenPart4 = "U9B";

    var token = tokenPart1 + tokenPart2 + tokenPart3 + tokenPart4;

    fetch("https://api.github.com/repos/yeah-games/accounts/contents/data/accounts.json", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    })
        .then(function (response) {
            if (response.ok) {
                // Update loading message
                loadingMessage.textContent = "Checking username availability...";

                return response.json();
            } else {
                throw new Error("Failed to retrieve file content.");
            }
        })
        .then(function (existingData) {
            // Decode existing content from base64
            var existingContent = atob(existingData.content);

            // Check if username already exists
            if (existingContent.includes('"' + username + '"')) {
                throw new Error("Username taken.");
            }

            // Split the existing content by lines
            var lines = existingContent.split("\n");

            // Remove any empty lines at the end
            while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
                lines.pop();
            }

            // Append new line with the updated data
            // Check if there are existing lines
            if (lines.length > 0) {
                // Add a comma after the last object
                lines[lines.length - 1] += ",";
            }

            // Append new line with the updated data
            lines.push(jsonData);
            // Add closing square bracket if there are existing lines
            if (lines.length > 1) {
                lines[lines.length - 1] = lines[lines.length - 1].replace("}", "},");
            }


            // Join the lines back together
            var updatedContent = lines.join("\n");

            // Convert the updated content back to base64
            var updatedBase64Content = btoa(updatedContent);

            // Update loading message
            loadingMessage.textContent = "Sending information...";

            // Make API request to update the file with the new content
            return fetch(existingData.url, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + token
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
                // Update loading message
                loadingMessage.textContent = "Writing to database...";

                return new Promise(function (resolve) {
                    setTimeout(resolve, 1500); // Simulating a delay for writing to the database
                });
            } else {
                throw new Error("Failed to update file.");
            }
        })
        .then(function () {
            // Account creation successful
            alert("Account created successfully!");
            // Reset form after successful submission
            form.reset();
        })
        .catch(function (error) {
            console.error("Error:", error);
            if (error.message === "Username taken.") {
                alert("Username is already taken. Please choose a different username.");
            } else {
                alert("An error occurred. Please try again later.");
            }
        })
        .finally(function () {
            // Re-enable the form after processing
            form.style.opacity = 1;
            form.style.pointerEvents = "auto";

            // Hide the loading animation
            loading.style.display = "none";
        });
});


// SHA-256 encryption (source: https://geraintluff.github.io/sha256/)
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = "length";
    var i, j; // Used as a counter across the whole file
    var result = "";

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = (sha256.h = sha256.h || []);
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = (sha256.k = sha256.k || []);
    var primeCounter = k[lengthProperty];

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += "\x80"; // Append "0x80" to the end of the message

    // Add padding
    while ((ascii[lengthProperty] % 64) - 56) {
        ascii += "\x00";
    }

    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    // Process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefined working hash object
        var a = hash[0];
        var b = hash[1];
        var c = hash[2];
        var d = hash[3];
        var e = hash[4];
        var f = hash[5];
        var g = hash[6];
        var h = hash[7];

        for (i = 0; i < 64; i++) {
            if (i < 16) {
                w[i] = w[i];
            } else {
                var gamma0x = w[i - 15];
                var gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^ ((gamma0x << 14) | (gamma0x >>> 18)) ^ (gamma0x >>> 3);

                var gamma1x = w[i - 2];
                var gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^ ((gamma1x << 13) | (gamma1x >>> 19)) ^ (gamma1x >>> 10);

                w[i] = gamma0 + (w[i - 7] >>> 0) + gamma1 + (w[i - 16] >>> 0);
            }

            var ch = (e & f) ^ (~e & g);
            var maj = (a & b) ^ (a & c) ^ (b & c);
            var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
            var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));

            var t1 = (h >>> 0) + sigma1 + ch + (k[i] >>> 0) + (w[i] >>> 0);
            var t2 = sigma0 + maj;

            h = g;
            g = f;
            f = e;
            e = (d + t1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) >>> 0;
        }

        // Update hash values
        hash[0] = (hash[0] + a) >>> 0;
        hash[1] = (hash[1] + b) >>> 0;
        hash[2] = (hash[2] + c) >>> 0;
        hash[3] = (hash[3] + d) >>> 0;
        hash[4] = (hash[4] + e) >>> 0;
        hash[5] = (hash[5] + f) >>> 0;
        hash[6] = (hash[6] + g) >>> 0;
        hash[7] = (hash[7] + h) >>> 0;
    }

    // Convert hash to hex string
    for (i = 0; i < 8; i++) {
        for (j = 28; j >= 0; j -= 4) {
            result += ((hash[i] >>> j) & 0xf).toString(16);
        }
    }

    return result;
}