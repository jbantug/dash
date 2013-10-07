Meteor.startup(function(){
	
});

Template.navbarmain.events({
	'click .nav-li': function(e,t){
		$("."+Session.get('pagecurrent')).addClass('hidden');
		$("#"+Session.get('pagecurrent')).removeClass('active');
		$(e.currentTarget).addClass('active');
		$("."+e.currentTarget.id).removeClass('hidden');
		Session.set('pagecurrent',e.currentTarget.id);
		console.log(e.currentTarget);
		console.log('HURRAY! SUCCESS!');
	}
});