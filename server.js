console.log('may the node be with you');
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

//allows for the db to call the database in other functions
var db;

//connects to mongodb, and sets the app to local host 3000.
MongoClient.connect('mongodb://username:password@ds119533.mlab.com:19533/express-mongodb-example', (err, database) => {
	if (err) return console.log(err);
	db = database
	app.listen(3000, () => {
		console.log('listening on 3000')
	})
});

//body parser allows to render html files in browser
app.use(bodyParser.urlencoded({extended: true}));

//tells express to make public folder accessible to the public
app.use(express.static('public'));

//allows the app to read JSON data
app.use(bodyParser.json());

//sets app to a particular view engine, ejs or handlebars or pug etc
app.set('view engine', 'ejs');

//get function that
app.get('/', (req, res) => {
	//calls the db collection 'quotes' and uses the toArray to pull information from the db
	db.collection('quotes').find().toArray((err, result) => {
		if (err) return console.log(err)
		// renders index.ejs
		res.render('index.ejs', {quotes: result})
	})
})

//post function
app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err);
		console.log('saved to database');
		res.redirect('/')
	})
});

app.put('/quotes', (req, res) => {
	db.collection('quotes')
		.findOneAndUpdate({name: 'Yoda'}, {
			$set: {
				name: req.body.name,
				quote: req.body.quote
			}
		}, {
			sort: {_id: -1},
			upsert: true
		}, (err, result) => {
			if (err) return res.send(err);
			res.send(result)
		})
});

app.delete('/quotes', (req, res) => {
	db.collection('quotes').findOneAndDelete({name: req.body.name},
		(err, result) => {
			if (err) return res.send(500, err);
			res.send({message: 'A darth vadar quote got deleted'})
		})
});