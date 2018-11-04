var express = require("express");
var cors = require('cors');
var app = express();


var twitterAnalysisInstance = require("./twitter.js");
var twitter = new twitterAnalysisInstance();
var score;

app.use(express.static('public'));
app.use(cors());

app.get('/api/results/:query', function (req, res) {

    twitter.getTwitterData(req.params.query, function (error, dataScores, twitterData) {
        if (error) console.log(error);

        var twData  = JSON.stringify(twitterData);
        var dScores = JSON.stringify(dataScores);
        var sendToClient = {'twData':twData, 'dScores':dScores,'message':'search finished succesfull'};
        res.send(JSON.stringify(sendToClient));
    });

});

var port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log("Listening to the app on port " + port);
});
