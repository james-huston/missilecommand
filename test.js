
var Launcher = require("./launcher");
var l = new Launcher();

// For help...
console.log(Launcher.commands);

l.connect();
l.reset(function() {
	l.perform(Launcher.commands.kRight, 1000, function() {
 		l.perform(Launcher.commands.kUp, 1000, function() {
 			l.perform(Launcher.commands.kFire);
 		});
 	});
});

// 