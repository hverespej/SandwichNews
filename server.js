var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var multer = require('multer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(express.static('static'));

var terms = JSON.parse(fs.readFileSync('terms.json', 'utf8'));

app.post('/mapwords', function(req, res) {
	console.log(req.body);
	res.json(terms);
});

var server = app.listen(process.env.PORT || 5000, function() {
	var host = server.address().address;
	var port = server.address().port;

	if (host === '::') {
		host = '127.0.0.1';
	}

	console.log('Listening at http://%s:%s', host, port);
});

