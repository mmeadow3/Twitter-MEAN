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
            console.log(err);
            res.sendStatus(401);
        } else {
            res.send('success');
        }
    });
});

app.get("/tweet", (req, res) => {
    if (!req.cookies.access_token || !req.cookies.access_token_secret) {
        return sendStatus(401);
    }
    authenticator.post(`https://api.twitter.com/1.1/statuses/update.json`,
        req.cookies.access_token, req.cookies.access_token_secret, {
            status: "This is a test tweet to interact with twitters REST API"
        },
        (error, data) => {
            if (error) {
                return res.status(400).send(error)
            }
            res.send("tweet sucessful")
        })
})



app.listen(3000, () => {
    console.log(`server is running on ${config.port}`)
})