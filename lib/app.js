//PREAMBLE STUFF
var assert = require('assert');

var log = require('./config/logger');

var config = require('./config/config.json');

var tokenManager = require('./config/token.js');

var appInitialSetup = function appInitialSetup(){

  //logging in to the profiles microservice
  tokenManager.requestAPIToken( {
            'username' : config.module.user,
            'password' : config.module.password
            }, loadCronJobs ); 

}();

function loadCronJobs(){
    //Define job dispatching, passing the API token
    require('./jobs/dispatcher.js')(tokenManager.API_TOKEN);
}


//API DEFINITION

//v0.0.6 middleware
