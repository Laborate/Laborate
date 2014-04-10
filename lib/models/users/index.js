var aes = require("../../core/aes");
var http = require("http");
var crypto = require('crypto');
var rand = require("generate-key");
var uuid = require('node-uuid');
var mailgun = require('mailgun-js')(
    config.email.key,
    config.general.host
);

module.exports = function (db, models) {
    var users = db.define("users", {
        pub_id: {
            type: "text"
        },
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
        feedback: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        feedback_asked: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        deliquent: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        reset: String,
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
        location: String,
        url: String
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                this.password = this.hash(this.password);
                this.card = {};
                this.locations = {};
                this.bitbucket = {};
                this.google = {};
                this.dropbox = {};

                if(!this.admin) {
                    this.set_verify(false);
                }
            },
            beforeSave: function() {
                this.name = this.name.capitalize;
            },
            beforeRemove: function() {
                models.users.groups.find({
                    owner_id: this.id
                }).remove(lib.error.capture);

                models.documents.find({
                    owner_id: this.id
                }).remove(lib.error.capture);

                models.documents.roles.find({
                    user_id: this.id
                }).remove(lib.error.capture);

                models.notifications.find({
                    user_id: this.id
                }).remove(lib.error.capture);

                models.organizations.roles.find({
                    user_id: this.id
                }).remove(lib.error.capture);

                this.remove_stripe();
            },
            afterCreate: function(success) {
                if(success) {
                    models.users.groups.create({
                        name: "Friends",
                        owner_id: this.id
                    }, lib.error.capture);
                }
            },
            afterAutoFetch: function() {
                var _this = this;
                if(_this.email) {
                    _this.gravatar = ("https://www.gravatar.com/avatar/" +
                                            _this.hash(_this.email) + "?s=152&d=identicon");

                    if(_this.organizations) {
                        if(!_this.organizations.empty) {
                            if(_this.organizations[0].gravatar) {
                                _this.gravatar = _this.organizations[0].gravatar;
                            }
                        }
                    }
                }
            }
        },
        methods: {
            verified: function(callback) {
                var _this = this;
                _this.add_mailgun();
                _this.add_stripe(function(stripe) {
                    _this.stripe = stripe;
                    _this.verify = null;
                    _this.save(lib.error.capture);
                    if(callback) callback(_this);
                });
            },
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            set_verify: function(save) {
                this.verify = rand.generateKey(30).toLowerCase();

                if(save != false) {
                    this.save();
                }
            },
            set_reset: function() {
                this.save({
                    reset: rand.generateKey(50).toLowerCase()
                });
            },
            set_recovery: function(req, res) {
                this.save({
                    reset: null,
                    recovery: uuid.v4()
                });

                res.cookie(config.cookies.rememberme, this.recovery, {
                    maxAge: 1209600000,
                    httpOnly: true
                });
            },
            add_stripe: function(callback) {
                var _this = this;
                lib.stripe.customers.create({
                    email: _this.email,
                    plan: _this.pricing.plan,
                    trial_end: lib.core.days.next_month(),
                    metadata: {
                        created: "created on registration",
                        type: "user"
                    }
                }, function(error, customer) {
                    if(!error && customer) {
                        callback(customer.id);
                    } else {
                        lib.error.capture(error, callback);
                    }
                });
            },
            add_mailgun: function() {
                mailgun.lists.members.create(
                    config.email.list,
                    {
                        name: this.name,
                        address: this.email,
                        subscribed: true
                    },
                    function(error, req, res) {
                        lib.error.capture(error);
                    }
                );
            },
            add_organization: function(organization, permission) {
                var _this = this;
                models.organizations.roles.create({
                    user_id: _this.id,
                    organization_id: organization,
                    permission_id: permission || 5
                }, function(error, role) {
                    lib.error.capture(error);

                    models.organizations.permissions.get(role.permission_id, function(error, permission) {
                        lib.error.capture(error);
                        if(permission.student) {
                            _this.save({
                                pricing_id: 5
                            }, lib.error.capture);
                        }
                    });
                });
            },
            get_groups: function(user) {
                var user_owned = $.map(user.groups, function(group) {
                    if(group.owner_id == user.id) {
                        return group.pub_id;
                    }
                });

                return $.map(this.groups, function(group) {
                    if(user_owned.indexOf(group.pub_id) != -1) {
                        return group;
                    }
                });
            },
            has_organization: function(organization, callback) {
                if(organization) {
                    models.organizations.roles.exists({
                        user_id: this.id,
                        organization_id: organization
                    }, function(error, exists) {
                        lib.error.capture(error);
                        callback(exists);
                    });
                } else {
                    callback(true);
                }
            },
            has_gravatar: function(callback) {
                http.get("http://www.gravatar.com/avatar/" + this.hash(this.email) + "?&d=404", function(res) {
                    callback(res.statusCode == 200);
                }).on("error", function(error){
                    callback(false);
                });
            },
            remove_stripe: function() {
                lib.stripe.customers.del(this.stripe, lib.error.capture);
            }
        },
        validations: {
            pub_id: db.enforce.unique(),
            screen_name: db.enforce.unique(),
            email: [
                db.enforce.patterns.email(),
                db.enforce.unique()
            ]
        }
    });

    users.hash = function(data) {
        return crypto.createHash('md5').update(data).digest("hex");
    }

    return users;
};
