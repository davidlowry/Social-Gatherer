var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
    util = require("util");

var facebookLikeUrl="https://api.facebook.com/method/fql.query?format=json&query=select%20like_count,%20total_count,%20share_count,%20click_count%20from%20link_stat%20where%20url=%22{URI}%22",
    twitterCountUrl="http://urls.api.twitter.com/1/urls/count.json?url={URI}", //&callback=twttr.receiveCount
    defaultURI="http://www.thezimbabwean.co.uk";

var twitter_client = http.createClient(80, "api.facebook.com"),
    facebook_client = http.createClient(80, "urls.api.twitter.com"),
    tweet_response = '',
    fb_response = '';

function getTweetCount(cli, uri) {
    
    var req = twitter_client;
	var tweetCount = 0;	
	var body = "";

	req
	.addListener("response", function(response) {
		req.addListener("data", function(data) {
		    console.log(data);
			body = body + data;
		});
		
		req.addListener("end", function() {

			tweetCount = JSON.parse(body);
			console.log(tweetCount);
			cli.write(typeof(tweetCount)=='Array') ? tweetCount['count'] : tweetCount;
		});
	})
	.request("GET", "/1/urls/count.json?url="+uri)
	.end();
	
}
    
http.createServer(function(request, response) {
    var query = "hello!";
    query = util.inspect(request.inspect);
    
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(query);
    
    uris=new Array("http://www.thoughtcollective.com", "http://www.thezimbabwean.co.uk");
    for(i=0; i<uris.length; i++) {
        getTweetCount(response, uris[i]);
    };
    
 //JSON.stringify(json));
    response.end("Ending");

}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');




/* Expected behaviour */

// server starts
// request for string or array of hostnames appears
// parameters define which webservice to poll
// check twitter, facebook, etc. for counts
// return aggregate JSON (or xml?) feed.