Template.info.list = function(){
	return Games.find({},{sort:{name:1}});
}

Template.ytinfo.list = function(){
	return Videos.find({},{sort:{name:1}});
}