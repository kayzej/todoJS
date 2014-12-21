var express  = require('express'),
	MongoClient = require('mongodb').MongoClient, 
	format = require('util').format,
	bodyParser = require('body-parser');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();

app.set('views', __dirname + '/src');
app.use(express.static(__dirname + '/src'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/init', function(req, res){
	console.log('Initializing application\n');
	MongoClient.connect('mongodb://JeffK:mongoadmin1126@ds047940.mongolab.com:47940/jeffdb', 
	function(err, db) {
	    if(err) console.log('error connectiong to db');

	    console.log('Welcome to JeffDB\n');

	    var collection = db.collection('jeffdb');
	   
	    collection.find().toArray(function(err, results) {
	        res.send(results);
	        db.close();
	    });
	});
});

app.get('/deleteall', function(req, res) {
	console.log('Removing all messages');
  	MongoClient.connect('mongodb://JeffK:mongoadmin1126@ds047940.mongolab.com:47940/jeffdb', 
	function(err, db) {
	    if(err) console.log('error connectiong to db');

	    var collection = db.collection('jeffdb');
	   
	    collection.remove({}, function(err, results) {
	        if(!err){res.send('Success')}else{res.send('Error')};
	        db.close();
	    });
	});
});

app.post('/newmessage', function(req, res){
	console.log(req.body.user);
	MongoClient.connect('mongodb://JeffK:mongoadmin1126@ds047940.mongolab.com:47940/jeffdb', 
	function(err, db) {
	    if(err) console.log('error connectiong to db');

	    console.log('Welcome to JeffDB\n');

	    var collection = db.collection('jeffdb');
	     collection.insert(req.body, function(err, docs) {
	     	
	     	if(!err){res.send('Success')}else{res.send('Error')};
	        db.close();

	        collection.count(function(err, count) {
	            console.log(format("count = %s", count));
	        });
	    });
	});
});

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port ' + port + '...\n');