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
                this.name = this.name.capitalize();
            },
            beforeRemove: function() {
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
            },
            afterAutoFetch: function() {
                this.gravatar = ("https://www.gravatar.com/avatar/" +
                                        this.hash(this.email) + "?s=152&d=mm");
                if(this.organizations) {
                    if(this.organizations.length != 0) {
                        if(this.organizations[0].gravatar) {
                            this.gravatar = this.organizations[0].gravatar;
                        }
                    }
                }
            }
        },
        methods: {
            verified: function(req, callback) {
                var _this = this;
                _this.add_stripe(req, function(stripe) {
                    _this.stripe = stripe;
                    _this.verify = null;
                    _this.save();
                    if(callback) callback(_this);
                });
            },
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            set_reset: function() {
                this.save({ reset: rand.generateKey(50) });
            },
            set_recovery: function(req, res) {
                this.save({
                    reset: null,
                    recovery: uuid.v4()
                });

                res.cookie(config.cookies.rememberme, this.recovery, {
                    maxAge: 1209600000,
                    httpOnly: true,
                    domain: "." + req.host
                });
            },
            add_stripe: function(req, callback) {
                var _this = this;
                req.stripe.customers.create({
                    email: _this.email,
                    plan: _this.pricing.plan,
                    trial_end: req.stripe.next_month(),
                    description: config.stripe.description,
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
            }
        },
        validations: {
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
