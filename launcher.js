/**
 * Deps.
 */
var HID = require('HID');
var debug = require('debug')('launcher');

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
*/
function Launcher() {

	if(arguments.length === 1) {
		this.hid_path = arguments[0];
	} else {
		var devices = HID.devices();
		var path;
		for(var i = 0; i <= devices.length; i++) {
			if( devices[i].manufacturer == 'Syntek' 
				&& devices[i].product == 'USB Missile Launcher' ) {
				path = devices[i].path;
				debug("Located device @ " + path);
				break;
			}
		}
		this.hid_path = path;
	}

  this.hid = null;
}

Launcher.prototype.connect = function() {
  this.hid = new HID.HID(this.hid_path);
  //this.hid.setNonBlocking(1);
  this.hid.read(this.gotData.bind(this));

  return this;
}

Launcher.prototype.reset = function(next) {
	//this.send_command(kCommands.kRight);
	var that = this;
	that.perform(kCommands.kLeft + kCommands.kDown, 6200, function() {
		that.perform(kCommands.kUp, 150, function() {
			that.perform(kCommands.kRight, 2800, function() {
				return next && next();
			});
		});
	});
}

Launcher.prototype.perform = function(action, duration, next) {
  debug("Performing: " + action);

  // Ensure time to fire
  if(action == kCommands.kFire) {
  	 duration = 5000;
  }


  this.sendCommand(action);
  var that = this;
  setTimeout(function(){
      that.sendCommand(kCommands.kStop);
      return next && next();
  }, duration);
}

Launcher.prototype.sendCommand = function(action) {
  debug("Sending: " + action);
  this.hid.write([0x21, 0x09, 0, 0]);
  this.hid.write([0x02, action, 0x00,0x00,0x00,0x00,0x00,0x00]);
}

Launcher.prototype.gotData = function(err, res) {
	debug('got data', res);
    this.hid.read(this.gotData.bind(this));
}


