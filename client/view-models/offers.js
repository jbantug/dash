Template.info.list = function(){
	return games.find({},{sort:{name:1}});
}