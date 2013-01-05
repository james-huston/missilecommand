/**
 * Deps.
 */
var HID = require('HID');

/** 
 * Commands
 */
var kCommands = {
	kDown : 0x01,
	kUp : 0x02,
	kLeft : 0x04,
	kRight : 0x08,
	kFire : 0x10,
	kStop : 0x20
};

/**
 * Expose `launcher`.
 */
module.exports = Launcher;

/**
 * Expose launcher command set
 */
module.exports.commands = kCommands;

/**
 * Launcher
 * @param hid_path [optional] path of the hid device, will attempt to detect
 * @ todo...attempt to detect ;)
*/
function Launcher() {
console.log('new');
	if(arguments.length === 1) {
		this.hid_path = arguments[0];
	} else {
		this.hid_path = 'USB_2123_1010_fd121000';
	}

  this.hid = null;
}

Launcher.prototype.connect = function() {
  this.hid = new HID.HID(this.hid_path);
  return this;
}

Launcher.prototype.reset = function(next) {
	//this.send_command(kCommands.kRight);
	var that = this;
	that.perform(kCommands.kDown, 2000, function() {
		that.perform(kCommands.kUp, 120, function() {
			return next && next()
		})
	})
}

Launcher.prototype.perform = function(action, duration, next) {
  console.log("Performing: " + action);

  // Ensure time to fire
  if(action == kCommands.kFire) {
  	 duration = 3000;
  }

  
  this.send_command(action);
  var that = this;
  setTimeout(function(){
      that.send_command(kCommands.kStop);
      return next && next();
  }, duration);
}

Launcher.prototype.send_command = function(action) {
	console.log("Sending: " + action);
  this.hid.write([0x21, 0x09, 0, 0]);
  this.hid.write([0x02, action, 0x00,0x00,0x00,0x00,0x00,0x00]);
}