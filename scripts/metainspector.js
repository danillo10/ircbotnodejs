'use strict';
/* module built by github.com/sempiternum */

const MetaInspector = require('node-metainspector');

module.exports.description = "Show metadata from URLs in messages";

module.exports.main = function(irc_client){
  irc_client.addListener('message#', function(nick,to,text,message) {
    if(text.indexOf('http://') + text.indexOf('https://') !== -2){
      const urls = text.match(/http(s)?:\/\/[^ ]+/ig);
      console.log('seen ' + urls.length + ' urls');
      if(urls.length > 3) {
        //too many URLs, ignoring them
        return;
      }
      for(let u of urls){
        console.log('analyzing URL ' + u);
        let client = new MetaInspector(u, { timeout: 5000, limit: 1024*1024*1 });
        client.on("fetch", function(){
          console.log('fetched ' + u + ' -- ' + client);
          irc_client.say(to, client.title + ' - ' + u);
        });

        client.on("error", function(err){
          console.log('error: ', err)
          irc_client.say(to, err);
        });
        client.fetch();
      }
    }
  });
};
