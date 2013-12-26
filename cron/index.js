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

            //Start (On Reboot)
            var foreverCommand = path.join(npmBinRoot, 'forever');
            var startLocation = path.join(root_dir, "/start.js");
            var startCommand = util.format('%s && %s start %s', exportCommand, foreverCommand, startLocation);

            tab.remove(tab.findComment("laborate_middleware"));
            tab.create(startCommand, "laborate_middleware").everyReboot();

            //Users Feedback (On: 1st hour)
            tab.remove(tab.findComment("users_feedback"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/users/feedback.js"), "users_feedback").hour().on(1);

            //Users Feedback (On: 1st hour)
            tab.remove(tab.findComment("users_feedback_notifications"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/users/feedback_notifications.js"), "users_feedback_notifications").hour().on(1);

            //Users Tracking (Every: 10 minutes)
            tab.remove(tab.findComment("users_tracking"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/users/tracking.js"), "users_tracking").minute().every(10);

            //Users Deliquent (Every: 1 Month)
            tab.remove(tab.findComment("users_deliquent"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/users/deliquent.js"), "users_deliquent").dom().on(1);

            //Editor Changes (Every: 5 Minutes)
            tab.remove(tab.findComment("editor_changes"));
            tab.create(exportCommand + " && node " + path.join(root_dir, "/cron/editor/changes.js"), "editor_changes").minute().every(5);

            //Save Crontab
            tab.save();
        });
    });
}
