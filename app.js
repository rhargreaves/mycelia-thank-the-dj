var express = require('express');
var exphbs  = require('express-handlebars');
var request = require('request');
var _ = require('underscore');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var url = "http://search.radioplayer.co.uk/qp/v3/onair?rpIds=340,1026,1094,1336,1254,425,341,342,343,344,347,349";
var requestedSongName = "No song entered please add a song";

app.get('/', function (req, res) {	
	getJsonFromJsonP(url, function(error, json){
		requestedSongName = req.query.songname;
		console.log(requestedSongName);
		
		//console.log(json.results)
		_.each(json.results, findSongPlay);
	});
	
	res.render('home');
});

app.listen(3000);

var findSongPlay = function(stationResult){

	var songPlays = _.findWhere(stationResult,{song : true });
	console.log(songPlays);
	
	//This line would be improved for a real situation
	//var queriedSongPlays = _.findWhere(songPlays, {name: requestedSongName });
		
}


var getJsonFromJsonP = function (url, callback) {
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var jsonpData = body;
    var json;
    try
    {
       json = JSON.parse(jsonpData);
    }
    catch(e)
    {
        var startPos = jsonpData.indexOf('({');
        var endPos = jsonpData.indexOf('})');
        var jsonString = jsonpData.substring(startPos+1, endPos+1);
        json = JSON.parse(jsonString);
    }
    callback(null, json);
  } else {
    callback(error);
  }
})
}
