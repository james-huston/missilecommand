/**
 * Example usage covering connection, reset, composite and chanined movement, and fire
 * Usage:
 *   DEBUG=* node basic.js
 * 
 * @author Colin Mutter <colin.mutter@gmail.com>
 */
var Launcher = require("../launcher");
var l = new Launcher();

// For help output...
console.log(Launcher.commands);

l.connect();

l.reset(function() {
	console.log('Device reset, activating mayhem...');
	setTimeout(function(){
		l.perform(Launcher.commands.kRight + Launcher.commands.kDown, 500, function() {
	 		l.perform(Launcher.commands.kUp, 500, function() {
	 			l.perform(Launcher.commands.kFire);
	 		});
	 	});
	}, 3000);

});