var twitterAnalysis = function () {
    var async     = require('async');
    var twitter   = require("twitter");
    var sentiment = require("sentiment");
    var config    = require("./config.js");

    var twitterApi = new twitter({
        consumer_key        : config.CONSUMER_KEY,
        consumer_secret     : config.CONSUMER_SECRET,
        access_token_key    : config.ACCESS_TOKEN_KEY,
        access_token_secret : config.ACCESS_TOKEN_SECRET
    });


    this.getTwitterData = function (query, callback) {
        var dataScore = {
            "Very Negative" : 0,
            "Negative"      : 0,
            "Neutral"       : 0,
            "Positive"      : 0,
            "Very Positive" : 0
        };
        var sum = 0;

        twitterApi.get("search/tweets", {q: "#" + query, lang: "en"}, function (error, tweets, response) {
            var twitterData = [];
            var sortedTwitterData = [];
            if (error) callback(error);
            async.each(tweets.statuses, function (item, callEach) {

                twitterData.push(item.text);
                var sentScore = sentiment(item.text, function (err, data) {
                    if (data.score < -4) {
                        sortedTwitterData.unshift(item.text);
                        dataScore["Very Negative"] += 1;
                    }
                    else if (data.score >= -3 && data.score < 0) {
                        sortedTwitterData.splice(2, 0, item.text);
                        dataScore["Negative"] += 1;
                    }
                    else if (data.score == 0) {
                        sortedTwitterData.splice(3, 0, item.text);
                        dataScore["Neutral"] += 1;
                    }
                    else if (data.score > 0 && data.score <= 3) {
                        sortedTwitterData.splice(4, 0, item.text);
                        dataScore["Positive"] += 1;
                    }
                    else {
                        sortedTwitterData.push(item.text);
                        dataScore["Very Positive"] += 1;
                    }
                    callEach();
                });

            }, function () {

                callback(null, dataScore, sortedTwitterData);

            });

        });
    };
};

module.exports = twitterAnalysis;
