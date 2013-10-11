Template.info.list = function(){
	return Games.find({},{sort:{clicks:-1}});
}

Template.ytinfo.list = function(){
	return Videos.find({}, {sort:{views:-1}});
}