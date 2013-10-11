Meteor.startup(function(){
	Games.remove({});
	Videos.remove({});
	Meteor.publish("games", function(){
		return Games.find();
	});
	Meteor.publish("videos", function(){
		return Videos.find();
	})

	var method = "GET";
	var hasoffers = "http://mmotm.api.hasoffers.com/Api/json?Format=json&Target=Report&Method=getStats&Service=HasOffers&Version=2&NetworkId=mmotm&NetworkToken=NETjE4MoLg7NarETCDruHecVmgLHbN&fields%5B0%5D=Stat.clicks&fields%5B1%5D=Stat.conversions&fields%5B2%5D=Stat.currency&fields%5B3%5D=Stat.payout&&sort=Offer.name&groups%5B0%5D=Offer.name&totals=1&limit=1000000";
	var youtube = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails%2Cstatistics%2Csnippet&forUsername=DevDiaryOnanyTV&key=AIzaSyDL6F2UDnezIht4VT-nnKpD_vZSu1ujEyY";

	Meteor.setInterval(function(){
		Meteor.http.call(
			method, 
			hasoffers, 
			function(error, results){
				var jsondecoded = json_decode(results.content);

				for (var key in jsondecoded.response.data.data) {
					if (jsondecoded.response.data.data.hasOwnProperty(key)) {
						var offer_id = parseInt(jsondecoded.response.data.data[key].Offer.id);
						var clicks = parseInt(jsondecoded.response.data.data[key].Stat.clicks);
						var conversions = parseInt(jsondecoded.response.data.data[key].Stat.conversions);
						var payout = parseInt(jsondecoded.response.data.data[key].Stat.payout);
						var currency = jsondecoded.response.data.data[key].Stat.currency;
						var name = jsondecoded.response.data.data[key].Offer.name;
						if(Games.find({offer_id:offer_id}).count() === 0 ){
							Games.insert({offer_id: offer_id, clicks: clicks, conversions: conversions, payout: payout, currency: currency, name: name});
						}else{
							var id = Games.findOne({offer_id:offer_id})._id;
							Games.update({_id:id},{$set:{offer_id: offer_id, clicks: clicks, conversions: conversions, payout: payout, currency: currency, name: name}});
						}
					}
				}
			}
		);

		Meteor.http.call(
			method,
			youtube,
			function(error, results){
				var ytjsondecoded = json_decode(results.content);
				
				var channel_id = ytjsondecoded.items[0].id;
				var title = ytjsondecoded.items[0].snippet.title;
				var views = ytjsondecoded.items[0].statistics.viewCount;
				var comments = ytjsondecoded.items[0].statistics.commentCount;
				var subscribers = ytjsondecoded.items[0].statistics.subscriberCount;
				var videos = ytjsondecoded.items[0].statistics.videoCount;

				if(Videos.find({channel_id:channel_id}).count() === 0){
					console.log("vids in");
					Videos.insert({channel_id:channel_id,title:title,views:views,comments:comments,subscribers:subscribers,videos:videos});
				}else{
					var id = Videos.findOne({channel_id:channel_id})._id;
					Videos.update({_id:id},{$set:{channel_id:channel_id,title:title,views:views,comments:comments,subscribers:subscribers,videos:videos}});
				}
			}
		);
	}, 2000);

});

//json_parse code
function json_decode (str_json) {	
	//var json = this.window.JSON;
	//if (typeof json === 'object' && typeof json.parse === 'function') {
		try {
			return EJSON.parse(str_json);
			//return json.parse(str_json);
		} catch (err) {
			if (!(err instanceof SyntaxError)) {
				throw new Error('Unexpected error type in json_decode()');
			}
		this.php_js = this.php_js || {};
		this.php_js.last_error_json = 4; // usable by json_last_error()
		return null;
		}
	//}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var j;
	var text = str_json;
	console.log(text);

	cx.lastIndex = 0;
	if (cx.test(text)) {
		text = text.replace(cx, function (a) {
			return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
	}

	if ((/^[\],:{}\s]*$/).
		test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
		replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
		replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

		j = eval('(' + text + ')');
		console.log(j);
		return j;
	}

	this.php_js = this.php_js || {};
		this.php_js.last_error_json = 4; // usable by json_last_error()
		return null;
}

