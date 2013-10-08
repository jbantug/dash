Session.setDefault('pagecurrent','home-container');
Session.setDefault('current_user',null);
Session.setDefault('logged_in',false);

Meteor.subscribe("games");

Meteor.startup(function () {	
	// var current_page = 1;
	var offers_url = "http://mmotm.api.hasoffers.com/Api/json?Format=json&Target=Report&Method=getStats&Service=HasOffers&Version=2&NetworkId=mmotm&NetworkToken=NETjE4MoLg7NarETCDruHecVmgLHbN&fields%5B0%5D=Stat.clicks&fields%5B1%5D=Stat.conversions&fields%5B2%5D=Stat.currency&fields%5B3%5D=Stat.payout&&sort=Offer.name&groups%5B0%5D=Offer.name&totals=1&limit=1000000";
	var jsonresponse = file_get_contents(offers_url);
	var jsondecoded = json_decode(jsonresponse);
	// while(jsondecoded.response.data.data.length > 0){
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
	// 	console.log(jsondecoded.response.data.data.length > 0);
	// 	current_page += 1;
	// }

	var youtube_url = "https://www.googleapis.com/youtube/v3/channels?part=contentDetails%2Cstatistics%2Csnippet&forUsername=DevDiaryOnanyTV&key=AIzaSyDL6F2UDnezIht4VT-nnKpD_vZSu1ujEyY";
	var ytjsonresponse = file_get_contents(youtube_url);
	var ytjsondecoded = json_decode(ytjsonresponse);
	var channel_id = ytjsondecoded.items[0].id;
	var title = ytjsondecoded.items[0].snippet.title;
	var views = ytjsondecoded.items[0].statistics.viewCount;
	var comments = ytjsondecoded.items[0].statistics.commentCount;
	var subscribers = ytjsondecoded.items[0].statistics.subscriberCount;
	var videos = ytjsondecoded.items[0].statistics.videoCount;

	Videos.insert({channel_id:channel_id,title:title,views:views,comments:comments,subscribers:subscribers,videos:videos});

	console.log("Channel name: " + title);
	console.log("Channel Views: " + views + " Views");
	console.log("Channel Subscribers: " + subscribers + " Subscribers");
	console.log("Channel Video Count: " + videos + " videos");
});

//json_parse code
function json_decode (str_json) {	
	var json = this.window.JSON;
	if (typeof json === 'object' && typeof json.parse === 'function') {
		try {
			return json.parse(str_json);
		} catch (err) {
			if (!(err instanceof SyntaxError)) {
				throw new Error('Unexpected error type in json_decode()');
			}
		this.php_js = this.php_js || {};
		this.php_js.last_error_json = 4; // usable by json_last_error()
		return null;
		}
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var j;
	var text = str_json;

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

		return j;
	}

	this.php_js = this.php_js || {};
		this.php_js.last_error_json = 4; // usable by json_last_error()
		return null;
}

//file_get_contents
function file_get_contents (url, flags, context, offset, maxLen) {
	var tmp, headers = [],
	newTmp = [],
	k = 0,
	i = 0,
	href = '',
	pathPos = -1,
	flagNames = 0,
	content = null,
	http_stream = false;
	var func = function (value) {
		return value.substring(1) !== '';
	};

	this.php_js = this.php_js || {};
	this.php_js.ini = this.php_js.ini || {};
	var ini = this.php_js.ini;
	context = context || this.php_js.default_streams_context || null;

	if (!flags) {
		flags = 0;
	}
	var OPTS = {
		FILE_USE_INCLUDE_PATH: 1,
		FILE_TEXT: 32,
		FILE_BINARY: 64
	};
	if (typeof flags === 'number') { // Allow for a single string or an array of string flags
		flagNames = flags;
	} else {
		flags = [].concat(flags);
		for (i = 0; i < flags.length; i++) {
			if (OPTS[flags[i]]) {
				flagNames = flagNames | OPTS[flags[i]];
			}
		}
	}

	if (flagNames & OPTS.FILE_BINARY && (flagNames & OPTS.FILE_TEXT)) { // These flags shouldn't be together
		throw 'You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()';
	}

	if ((flagNames & OPTS.FILE_USE_INCLUDE_PATH) && ini.include_path && ini.include_path.local_value) {
		var slash = ini.include_path.local_value.indexOf('/') !== -1 ? '/' : '\\';
		url = ini.include_path.local_value + slash + url;
	} else if (!/^(https?|file):/.test(url)) { // Allow references within or below the same directory (should fix to allow other relative references or root reference; could make dependent on parse_url())
		href = this.window.location.href;
		pathPos = url.indexOf('/') === 0 ? href.indexOf('/', 8) - 1 : href.lastIndexOf('/');
		url = href.slice(0, pathPos + 1) + url;
	}

	if (context) {
		var http_options = context.stream_options && context.stream_options.http;
		http_stream = !! http_options;
	}

	if (!context || http_stream) {
		var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
		if (!req) {
			throw new Error('XMLHttpRequest not supported');
		}

		var method = http_stream ? http_options.method : 'GET';
		var async = !! (context && context.stream_params && context.stream_params['phpjs.async']);

		if (ini['phpjs.ajaxBypassCache'] && ini['phpjs.ajaxBypassCache'].local_value) {
			url += (url.match(/\?/) == null ? "?" : "&") + (new Date()).getTime(); // Give optional means of forcing bypass of cache
		}

		req.open(method, url, async);
		if (async) {
			var notification = context.stream_params.notification;
			if (typeof notification === 'function') {
			// Fix: make work with req.addEventListener if available: https://developer.mozilla.org/En/Using_XMLHttpRequest
				if (0 && req.addEventListener) { // Unimplemented so don't allow to get here
			} else {
				req.onreadystatechange = function (aEvt) { // aEvt has stopPropagation(), preventDefault(); see https://developer.mozilla.org/en/NsIDOMEvent
					var objContext = {
					responseText: req.responseText,
					responseXML: req.responseXML,
					status: req.status,
					statusText: req.statusText,
					readyState: req.readyState,
					evt: aEvt
					}; 

					var bytes_transferred;
					switch (req.readyState) {
						case 0:
						//     UNINITIALIZED     open() has not been called yet.
						notification.call(objContext, 0, 0, '', 0, 0, 0);
						break;
						case 1:
						//     LOADING     send() has not been called yet.
						notification.call(objContext, 0, 0, '', 0, 0, 0);
						break;
						case 2:
						//     LOADED     send() has been called, and headers and status are available.
						notification.call(objContext, 0, 0, '', 0, 0, 0);
						break;
						case 3:
						//     INTERACTIVE     Downloading; responseText holds partial data.
						bytes_transferred = req.responseText.length * 2; // One character is two bytes
						notification.call(objContext, 7, 0, '', 0, bytes_transferred, 0);
						break;
						case 4:
						//     COMPLETED     The operation is complete.
						if (req.status >= 200 && req.status < 400) {
						  bytes_transferred = req.responseText.length * 2; // One character is two bytes
						  notification.call(objContext, 8, 0, '', req.status, bytes_transferred, 0);
						} else if (req.status === 403) { // Fix: These two are finished except for message
						  notification.call(objContext, 10, 2, '', req.status, 0, 0);
						} else { // Errors
						  notification.call(objContext, 9, 2, '', req.status, 0, 0);
						}
						break;
						default:
						throw 'Unrecognized ready state for file_get_contents()';
					}
				}
			}
		}
	}

	if (http_stream) {
		var sendHeaders = http_options.header && http_options.header.split(/\r?\n/);
		var userAgentSent = false;
		for (i = 0; i < sendHeaders.length; i++) {
			var sendHeader = sendHeaders[i];
			var breakPos = sendHeader.search(/:\s*/);
			var sendHeaderName = sendHeader.substring(0, breakPos);
			req.setRequestHeader(sendHeaderName, sendHeader.substring(breakPos + 1));
			if (sendHeaderName === 'User-Agent') {
				userAgentSent = true;
			}
		}
		if (!userAgentSent) {
			var user_agent = http_options.user_agent || (ini.user_agent && ini.user_agent.local_value);
			if (user_agent) {
				req.setRequestHeader('User-Agent', user_agent);
			}
		}
		content = http_options.content || null;
	}

	if (flagNames & OPTS.FILE_TEXT) { // Overrides how encoding is treated (regardless of what is returned from the server)
		var content_type = 'text/html';
		if (http_options && http_options['phpjs.override']) { // Fix: Could allow for non-HTTP as well
			content_type = http_options['phpjs.override']; // We use this, e.g., in gettext-related functions if character set
			//   overridden earlier by bind_textdomain_codeset()
		} else {
			var encoding = (ini['unicode.stream_encoding'] && ini['unicode.stream_encoding'].local_value) || 'UTF-8';
			if (http_options && http_options.header && (/^content-type:/im).test(http_options.header)) { // We'll assume a content-type expects its own specified encoding if present
				content_type = http_options.header.match(/^content-type:\s*(.*)$/im)[1]; // We let any header encoding stand
			}
			if (!(/;\s*charset=/).test(content_type)) { // If no encoding
				content_type += '; charset=' + encoding;
			}
		}
		req.overrideMimeType(content_type);
	}
	else if (flagNames & OPTS.FILE_BINARY) { // Trick at https://developer.mozilla.org/En/Using_XMLHttpRequest to get binary
		req.overrideMimeType('text/plain; charset=x-user-defined');
	}

	try {
		if (http_options && http_options['phpjs.sendAsBinary']) { // For content sent in a POST or PUT request (use with file_put_contents()?)
			req.sendAsBinary(content); // In Firefox, only available FF3+
		} else {
			req.send(content);
		}
	} catch (e) {
		return false;
	}

	tmp = req.getAllResponseHeaders();
	if (tmp) {
		tmp = tmp.split('\n');
		for (k = 0; k < tmp.length; k++) {
			if (func(tmp[k])) {
				newTmp.push(tmp[k]);
			}
		}
		tmp = newTmp;
		for (i = 0; i < tmp.length; i++) {
			headers[i] = tmp[i];
		}
		this.$http_response_header = headers; // see http://php.net/manual/en/reserved.variables.httpresponseheader.php
	}

	if (offset || maxLen) {
		if (maxLen) {
			return req.responseText.substr(offset || 0, maxLen);
		}
		return req.responseText.substr(offset);
	}
	return req.responseText;
	}
	return false;
}