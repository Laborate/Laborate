var crontab = require('crontab');
var path = require('path');
var util = require('util');

module.exports = function(root_dir) {
    crontab.load(function(err, tab) {
        require('npm').load(function (err, npm) {
            //Get Path
            var npmPrefix = npm.config.get('prefix');
            var npmBinRoot = path.join(npmPrefix, 'bin');
            var nodePath = process.execPath.split('/').slice(0, -1).join('/');
            var exportCommand = 'export PATH=' + nodePath + ':$PATH';

            //Start @Reboot
            var foreverCommand = path.join(npmBinRoot, 'forever');
            var startLocation = path.join(root_dir, "/start.js");
            var startCommand = util.format('%s && %s start %s', exportCommand, foreverCommand, startLocation);
            tab.remove(tab.findComment("laborate_middleware"));
            tab.create(startCommand, "laborate_middleware").everyReboot();

            //Users Deliquent @1 Month
            tab.remove(tab.findComment("users_deliquent"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/users/deliquent.js"), "users_deliquent").dom().on(1);

            //Editor Users @30 Seconds
            tab.remove(tab.findComment("editor_users"));
            tab.create(exportCommand + " && sleep 30; node " + path.join(root_dir, "/cron/editor/users.js"), "editor_users");

            //Editor Changes @5 Minutes
            tab.remove(tab.findComment("editor_changes"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/editor/changes.js"), "editor_changes").minute().every(5);

            //Save Crontab
            tab.save();
        });
    });
}
