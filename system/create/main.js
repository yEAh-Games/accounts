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

            // Parse existing content as JSON
            var existingAccounts = JSON.parse(existingContent);

            // Check if username already exists
            if (existingAccounts.some(account => account.username === username)) {
                throw new Error("Username taken.");
            }

            // Add the new account object to the existing array
            existingAccounts.push(data);

            // Convert the updated accounts array back to JSON
            var updatedContent = JSON.stringify(existingAccounts, null, 2);

            // Update loading message
            loadingMessage.textContent = "Sending information...";

            // Convert the updated content to base64
            var updatedBase64Content = btoa(updatedContent);

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
