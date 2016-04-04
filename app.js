var express = require('express');
var exphbs  = require('express-handlebars');
var request = require('request');
var _ = require('underscore');
var Handlebars = require('handlebars');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//app.engine('handlebars', exphbs.engine);

var url = "http://search.radioplayer.co.uk/qp/v3/onair?rpIds=340,1026,1094,1336,1254,425,341,342,343,344,347,349";
var requestedArtist = "No song entered please add a song";
var successfulPlay = [];

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        link: function (stationName) {return new Handlebars.SafeString(
    stationName.replace(' ', '%20')
  );}
    }
});


//var formatFunction = function('link', function(stationName) {
  //stationName = Handlebars.escapeExpression(stationName);

  //return new Handlebars.SafeString(
    //stationName.replace(' ', '%20')
  //);
//});



app.get('/', function (req, res) {	
	getJsonFromJsonP(url, function(error, json){
	    successfulPlay = [];
		requestedArtist = req.query.artistname;
		console.log(requestedArtist);
		_.each(json.results, findSongPlay);
	});
	
	var cleanPlays = successfulPlay;
	
	console.log(cleanPlays);
	
	var songToReport = cleanPlays[0];
	
	
	
	res.render('home', {songName: songToReport.name, showName: songToReport.name, stationName:songToReport.serviceName,image: songToReport.imageUrl, helpers: {link: function (stationName) {return new Handlebars.SafeString(
    stationName.replace(' ', '%20')
  );}}});
});

app.listen(3000);



var findSongPlay = function(stationResult){
	var songPlaysFromResults = _.findWhere(stationResult,{ artistName: requestedArtist });

	if(typeof songPlaysFromResults !== 'undefined' && songPlaysFromResults)
	{
		successfulPlay.push(songPlaysFromResults);
	}
	

}


function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
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
