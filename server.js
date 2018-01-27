const express = require('express');
const routes = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const jsonpatch = require("jsonpatch");
const request = require("request");
const fs = require("fs");
const Jimp = require("jimp");

// const uuidv1 = require('uuid/v1');

// Setup Mongo DB
const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;

let db;
const DbName = "cloudboost";
MongoClient.connect("mongodb://localhost:27017/" + DbName, function (err, database) {
    if (err) {
        console.log("Error connecting to MongoDB Server. \nError:" + err);
        db = null;
    }
    else {
        console.log("Connection established to MongoDB");
        db = database;
    }
});

const app = express();
// app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true}));
// apply the routes to our application with the prefix /
app.use('/', routes);
app.listen(8000, function(){
	console.log('App running at port 8000');
});

// Routes
routes.post('/login', function(req, res){
    // db.collection('users').find({}).toArray(function (err, result) {
    //     console.log(result);
    //     res.send(result);
    // });
    const secretKey = '7760279446';
    let username = req.body.username;
    let token = jwt.sign(
        {
            name : username
        }, 
        secretKey
    );
    console.log(token);
    res.send({token : token, msg : "successfully logged in", status : 200});
});

routes.get('/', function (req, res) {

});

// Protected Routes

// route middleware to verify a token
routes.use(function(req, res, next){
    // check header for token
    let token = req.get('token');
    
    // decode token
    if (token) {
        console.log('token present');
        // verifies secret and checks exp
        jwt.verify(token, '7760279446', function (err, decoded) {
            if (err) {
                console.log('token authentication failed');
                return res.send({ success: false, msg: 'Failed to authenticate token.' });
            } else {
                console.log('token verified');
                // if everything is good, save to request for use in other routes
                next();
            }
        });

    } else {
        console.log('no token');
        // if there is no token return an error
        return res.send({ status : 403, success: false, msg: 'No token provided.' });
    }
});

routes.post('/json-patch', function (req, res) {
    let jsonObject = JSON.parse(JSON.parse(req.body.jsonObject));
    let jsonPatchObject = JSON.parse(JSON.parse(req.body.jsonPatchObject));
    
    // console.log(typeof jsonObject);
    // console.log(jsonPatchObject);
    
    let patch = jsonpatch.apply_patch(jsonObject, jsonPatchObject);
    console.log(patch);
    res.send({ patch : patch, msg: "patch object", status: 200 });
});

routes.post('/create-thumbnail', function (req, res) {
    let url = req.body.link;
    // url = 'https://www.google.com/images/srpr/logo3w.png';
    console.log(req.get('token'));
    console.log(JSON.stringify(req.headers));

    let extension = url.split('.').pop();
    let filename = new Date().getTime();

    let file = filename + '.' + extension;
    // console.log(file);

    const process = async () => {
        await download();
        await resize();
    }
    // process();

    function download(){
        request(url).pipe(fs.createWriteStream(file));
    }

    function resize() {
        Jimp.read(file, function (err, imageFile) {
            console.log("file resized..");
            if (err) throw err;
            imageFile.resize(250, 250)
                .write(filename + '-resized' + '.' + extension); // save 
        });
    }  
    res.send({ msg: "patch object", status: 200 });  
});