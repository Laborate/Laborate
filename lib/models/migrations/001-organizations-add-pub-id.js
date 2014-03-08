exports.up = function(next){
    this.addColumn('organizations', {
         pub_id: {
             type: "text"
         }
    }, next);
};

exports.down = function(next) {
    next();
}
