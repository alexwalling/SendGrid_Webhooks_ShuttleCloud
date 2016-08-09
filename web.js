var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.set('port', process.env.PORT || 8080);
app.use(bodyParser());

app.post('/event', function (req, res) {
  var events = req.body;
  events.forEach(function (event) {
		processEvent(event);
  });
	res.end('end');
});

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port %d', server.address().port);
});

function processEvent(event){
		var em = event.email;
		var ev = event.event;
		var time = event.timestamp;
		var cat = event.category;
		var ur = event.url;
		var formattedDate = timetodate(time);
		var formattedTime = timetotime(time);		

		if(cat != undefined){
			if(cat[0] == 'tactics2' || cat[0] == 'email metrics report'){
				log(em, formattedDate, formattedTime, ev, ur);
			}
		}
}

function log(em, formattedDate, formattedTime, ev, ur){
	if(ur == undefined){
		ur = '';
	}

	var data = em + ',' + formattedDate + ' ' + formattedTime + ',' + ev + ',' + ur + '\n';

	fs.appendFile('logs.csv', data, function (err) {
	});
}

function timetotime(stamp){
	var date = new Date(stamp*1000);
	var hours = date.getHours() - 5; // -5 is to convert from UTC to Central time
	if(hours <= 0){
		hours = 24 + hours;
	}
	var minutes = '0' + date.getMinutes();
	var seconds = '0' + date.getSeconds();
	if(hours == 24){
		hours = 0;
	}

	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	return formattedTime;
}


function timetodate(stamp){
	var date = new Date(stamp*1000);
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();
	var hours = date.getHours() - 5;
	if(hours <= 0){
		day = day - 1;
	}

	returnDate = month + '/' + day + '/' + year;
	return returnDate;
}
