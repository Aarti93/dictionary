var express = require('express');
var app = express();
var path = require('path');
var axios = require("axios");

app.use(express.static('client'));

app.get("/getWordDetails/:query", function (req, res) {
  axios(`https://owlbot.info/api/v2/dictionary/${req.params.query}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(function (response) {
    res.status(response.status).send(response.data);
  })
})

app.listen(3000);