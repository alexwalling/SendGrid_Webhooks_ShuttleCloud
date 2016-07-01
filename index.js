var line = 50000;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Spreadsheet = require('edit-google-spreadsheet');

var init = 0;

readLineNumber();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser());

app.post('/event', function (req, res) {
  var events = req.body;
  events.forEach(function (event) {
		//console.log(event);
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
				writeToGoogle(em, formattedDate, formattedTime, ev, ur);
			}
		}
		//console.log(em + ',' + formattedTime + ',' + formattedDate + ' ' + ev + ',' + cat + ',' + ur);
}

function timetotime(stamp){
	var date = new Date(stamp*1000);
	var hours = date.getHours() - 5; // -5 is to convert from UTC to Central time
	if(hours <= 0){
		hours = 24 + hours;
	}
	var minutes = '0' + date.getMinutes();
	var seconds = '0' + date.getSeconds();
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

function writeToGoogle(emails, dates, times, events, url){
	Spreadsheet.load({
		debug: false,
		//spreadsheetName: 'node-edit-spreadsheet',
		spreadsheetId: '1Nr2PZpHWcs8_53NRnhLDv0CztKIm19GNHhQD0JKqHh8',
		//worksheetName: 'Sheet1',
		worksheetId: 'od6',

		oauth2: {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			refresh_token: process.env.REFRESH_TOKEN
		}
	}, function sheetReady(err, spreadsheet) {
		if(err) {
			throw err;
		}

			//console.log('line number: ' + line);
			var nextRowObj = {};

			nextRowObj[line] = {1: [[emails, dates + ' ' + times, events, url]] };
			//console.log(nextRowObj[last]);
			/*
			if(init == 0){
				console.log(init);
				spreadsheet.receive(function(err2, rows, info){
					line = info.lastRow;
					console.log(line);
				});
				init = 1;
			}
			*/
			line++;
			spreadsheet.add(nextRowObj);
			spreadsheet.send(function(err3) {
				if(err3) {
					throw err3;
				}
			});
	});
}

function readLineNumber(emails, times, events, category, url){
  Spreadsheet.load({
    debug: false,
    //spreadsheetName: 'node-edit-spreadsheet',
    spreadsheetId: '1Nr2PZpHWcs8_53NRnhLDv0CztKIm19GNHhQD0JKqHh8',
    //worksheetName: 'Sheet1',
    worksheetId: 'od6',

    oauth2: {
      	client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		refresh_token: process.env.REFRESH_TOKEN
    }   
  }, function sheetReady(err, spreadsheet) {
    if(err) {
      throw err;
    }   

    spreadsheet.receive(function(err, rows, info) {
      if(err) throw err;
      line = info.nextRow;
			//console.log('line init: ' + line);
    }); 
  }); 
}

