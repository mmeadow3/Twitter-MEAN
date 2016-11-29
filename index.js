const url = require("url");
const authenticator = require("./authenticator")
const express = require("express");
const config = require("./config")
const app = express();

app.use(require("cookie-parser")())

// redirects user to Twitter's login page
app.get('/auth/twitter', authenticator.redirectToTwitterLoginPage);

// This is the callback url that the user is redirected to after signing in
app.get(url.parse(config.oauth_callback).path, function(req, res) {
    authenticator.authenticate(req, res, function(err) {
        if (err) {
            res.redirect('/login');
        } else {
            res.redirect('/');
        }
    });
});

app.get("/", (req, res) => {
    res.send("Testing")
})

app.listen(3000, () => {
    console.log(`server is running on ${config.port}`)
})