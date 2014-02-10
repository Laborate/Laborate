var fs = require('fs');
var tmp = require('tmp');

module.exports = function(credentials, path, data, callback) {
    var _this = this;
    data = data || "\n";

    _this.authorize(credentials, function(error, sftp) {
        if(!error && sftp) {
            tmp.file(function(error, tmp_path) {
                if(!error && path) {
                    fs.writeFile(tmp_path, data, function(error) {
                        if(!error) {
                            sftp.fastPut(tmp_path, path, {}, function(error) {
                                fs.unlinkSync(tmp_path);

                                if(!error) {
                                    _this.finish(sftp, callback)(null);
                                } else {
                                    _this.finish(sftp, callback)(error);
                                }
                            });
                        } else {
                            _this.finish(sftp, callback)(error);
                        }
                    });
                } else {
                    _this.finish(sftp, callback)(error);
                }
            });
        } else {
            _this.finish(sftp, callback)(error);
        }
    });
}
