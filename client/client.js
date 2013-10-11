Session.setDefault('pagecurrent','home-container');
Session.setDefault('current_user',null);
Session.setDefault('logged_in',false);

Meteor.subscribe("games");
Meteor.subscribe("videos");

Meteor.startup(function () {

});