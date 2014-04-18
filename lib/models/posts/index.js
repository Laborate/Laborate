var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("posts", {
        pub_id: String,
        content: {
            type: 'text',
            required: true,
            big: true
        },
        markdown: {
            type: 'text',
            required: true,
            big: true
        }
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            },
            beforeRemove: function() {
                this.tags = [];
                this.likes = [];
                this.save(lib.error.capture);

                models.posts.find({
                    parent_id: this.id
                }).remove(lib.error.capture);
            }
        },
        methods: {
            shortner: function(callback) {
                models.shortner.generate("/news/" + this.pub_id + "/", callback);
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
};
