Meteor.startup(function(){
	Games.remove({});
	Meteor.publish("games", function(){
		return Games.find();
	});
	Meteor.publish("videos", function(){
		return Videos.find();
	})
});