var config = require("../../../config");
var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");
var uuid = require('node-uuid');

module.exports = function (db, models) {
    var users = db.define("users", {
        name: {
            type: "text",
            required: true
        },
        screen_name: {
            type: "text",
            required: true
        },
        email: {
            type: "text",
            required: true
        },
        password: {
            type: "text",
            required: true
        },
        admin: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        trial: {
            type: "boolean",
            required: true,
            defaultValue: true
        },
        deliquent: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        verify: String,
        locations: {
            type: "object",
            big: true
        },
        card: Object,
        stripe: String,
        github: String,
        bitbucket: Object,
        google: Object,
        dropbox: Object,
        recovery: String,
        key: String,
        created: {
            type: "date",
            defaultValue: new Date()
        },
        updated: {
            type: "date",
            defaultValue: new Date()
        }
    }, {
        hooks: {
            beforeCreate: function() {
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                this.password = this.hash(this.password);
                this.verify = (!this.admin) ? rand.generateKey(30).toLowerCase() : null;
                this.card = {};
                this.locations = {};
                this.bitbucket = {};
                this.google = {};
                this.dropbox = {};
            },
            beforeSave: function() {
                this.updated = new Date();
            },
            beforeRemove: function() {
                models.documents.find({
                    owner_id: this.id
                }).remove(blank_function);

                models.documents.roles.find({
                    user_id: this.id
                }).remove(blank_function);

                models.users.notifications.find({
                    user_id: this.id
                }).remove(blank_function);
            },
            afterLoad: function() {
                var _this = this;

                if(_this.email) {
                    _this.email_hash = _this.hash(this.email);
                }

                _this.documents = {};

                models.documents.count({
                    owner_id: _this.id
                }, function(error, count) {
                     _this.documents.total = (!error) ? count : 0;
                     //blank_function(error);
                });

                models.documents.count({
                    owner_id: _this.id,
                    password: db.tools.ne(null)
                }, function(error, count) {
                     _this.documents.password = (!error) ? count : 0;
                     //blank_function(error);
                });

                models.documents.roles.find({
                    user_id: _this.id
                }, 10, "viewed",
                function(error, documents) {
                     _this.documents.top_viewed = (!error) ? documents : [];
                     //blank_function(error);
                });
            },
        },
        methods: {
            verified: function(req, callback) {
                var _this = this;
                _this.customer(req, function(stripe) {
                    _this.stripe = stripe;
                    _this.verify = null;
                    _this.save();
                    if(callback) callback(_this);
                });
            },
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            set_recovery: function(req, res) {
                this.save({ recovery: uuid.v4() });

                res.cookie(config.cookies.rememberme, this.recovery, {
                    maxAge: 9000000000,
                    httpOnly: true,
                    domain: "." + req.host
                });
            },
            customer: function(req, callback) {
                if(this.pricing) {
                    var _this = this;
                    req.stripe.customers.create({
                        email: _this.email,
                        plan: _this.pricing.plan,
                        description: "created on registration",
                        trial_end: req.stripe.next_month(),
                        metadata: {
                            type: "user"
                        }
                    }, function(error, customer) {
                        if(!error && customer) {
                            callback(customer.id);
                        } else {
                            blank_function(error, callback);
                        }
                    });
                }
            }
        },
        validations: {
            email: [
                db.validators.patterns.email(),
                db.validators.unique()
            ],
            screen_name: [
                db.validators.unique()
            ]
        }
    });

    users.hash = function(data) {
        return crypto.createHash('md5').update(data).digest("hex");
    }

    return users;
};
