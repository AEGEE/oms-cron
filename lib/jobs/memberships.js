var assert = require('assert');
var restify = require('restify');

var config = require('../config/config.json');

// Creates a REST client talking JSON
  var restClient = restify.createJsonClient({
    url: config.rest_core.url
  });

module.exports = function(agenda, APItoken) {

  agenda.define('Check membership expiration', function(job, done) {

    var today = new Date();
    //remember that months go from 0 to 11 - also padding with leading 0
    var date = today.getFullYear()+""+('0' + (today.getMonth()+1)).slice(-2)+""+('0' + today.getDate()).slice(-2);

    var options = {
      'path': '/users?membertype=member&memberuntildate='+date,
      'headers': {
        'x-access-token': APItoken
      }
    };
    console.log(restClient);
    //Query (or receive queried object) for an array containing
    //ACTIVE memberships who have expiration date before Today()
    //--------------------
    restClient.get(options, function(resterr, restreq, restres, restobj) {
      assert.ifError(resterr);
      console.log('\n %j \n', restobj); 
      var expiredUsers = restobj;
      return expireMemberships(expiredUsers);
    });

  });

  // More scheduled membership-related jobs (save member list every X months)
}

//USEFUL
function expireMemberships(users){

  console.log(users);

  /*  var usersDN = [];
    //we extract the DN of the users
    for(var i=0; i<users.length; ++i){
      usersDN.push(users[i].dn);
    }

    console.log("Expiring membership from cron for %s users", users.length);
    _ldap.modifyMembershipCron(users, "Suspended");
  */
  
  users.foreach(function(user){

        var options = {
          'path': 'users/'+user.uid+'/memberships/modify',
          'headers': {
            'x-access-token': APItoken
          }
        };
        
        restClient.post(options, {"memberType": Suspended}, function(resterr, restreq, restres, restobj) {
          assert.ifError(resterr);
          console.log('\n %j \n', restobj); 
        });

  });

};
