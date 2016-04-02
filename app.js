var express = require('express');
var exphbs  = require('express-handlebars');
var request = require('request');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var url = "http://search.radioplayer.co.uk/qp/v3/onair?rpIds=340";

app.get('/', function (req, res) {	
	getJsonFromJsonP(url, function(error, json){
		console.log(json);
	    res.render('home');
	})
	
	
});

app.listen(3000);


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
