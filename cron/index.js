var crontab = require('crontab');
var path = require('path');
var util = require('util');

module.exports = function() {
    crontab.load(function(err, tab) {
        require('npm').load(function (err, npm) {
            //Get Path
            var npmPrefix = npm.config.get('prefix');
            var npmBinRoot = path.join(npmPrefix, 'bin');
            var nodePath = process.execPath.split('/').slice(0, -1).join('/');
            var exportCommand = 'export PATH=' + nodePath + ':$PATH';

            //Start @Reboot
            var foreverCommand = path.join(npmBinRoot, 'forever');
            var startLocation = path.join(__dirname, "../start.js");
            var startCommand = util.format('%s && %s start %s', exportCommand, foreverCommand, startLocation);
            tab.remove(tab.findComment("laborate_code"));
            tab.create(startCommand, "laborate_code").everyReboot();

            //Editor Users @30 Seconds
            tab.remove(tab.findComment("editor_users"));
            tab.create(exportCommand + " && sleep 30; " + path.join(__dirname, "editor/users.js"), "editor_users");

            //Editor Changes @5 Minutes
            tab.remove(tab.findComment("editor_changes"));
            tab.create(exportCommand + " && " + path.join(__dirname, "editor/changes.js"), "editor_changes").minute().every(5);

            //Save Crontab
            tab.save();
        });
    });
}
