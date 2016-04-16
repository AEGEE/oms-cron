
var restify = require('restify');
var app = require('./app'); //the real place where the API callbacks are
var log = require('./config/logger');

var config = require('./config/config.json');

var server = restify.createServer({
    name: 'cron',
    log: log
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

//Define your API here

//this endpoint is for public access

//for endpoints declared from here onwards, apply the middleware "verifyToken"
//server.use(app.validateToken);

//GET: a list of the cron jobs, so the user(admin) can decide if revoke them or not
//server.get({path: userPath, version: '0.1.0'} , core.findAllUsers);


server.listen(config.port, function() {
    console.log('%s listening at %s ', server.name, server.url);
});
