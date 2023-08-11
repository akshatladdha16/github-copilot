// create web server with express
const express = require('express');
const app = express();

// create application/x-www-form-urlencoded parser
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// set up handlebars view engine
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set up MongoDB
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
let dbo;

// connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    dbo = db.db("comments");
    console.log("Connected to MongoDB");
});

// set up static files
app.use(express.static(__dirname + '/public'));

// set up port
app.set('port', process.env.PORT || 3000);

// set up route
app.get('/', function (req, res) {
    res.render('home');
});

// set up post request
app.post('/post', urlencodedParser, function (req, res) {
    // get the name and comment from the form
    let name = req.body.name;
    let comment = req.body.comment;
    // create a new document
    let myobj = { name: name, comment: comment };
    // insert the document to the collection
    dbo.collection("comments").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    // redirect to the home page
    res.redirect('/');
});

// set up get request
app.get('/get', function (req, res) {
    // find all documents in the collection
    dbo.collection("comments").find({}).toArray(function (err, result) {
        if (err) throw err;
        // render the comments page and pass the data
        res.render('comments', { comments: result });
    });
});

// set up 404 page
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// set up 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');