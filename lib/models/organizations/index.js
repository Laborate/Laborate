var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("organizations", {
        name: {
            type: "text",
            required: true
        },
        logo: {
            type: "text",
            required: true
        },
        acronym: {
            type: "text",
            required: true
        },
        email: {
            type: "text",
            required: true
        },
        trial: {
            type: "boolean",
            required: true,
            defaultValue: true
        },
        register: {
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
        card: Object,
        stripe: String,
        key: String,
        website: String,
        dns: String,
        theme: String,
        gravatar: String,
        icons: Object
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                if(!this.icons) this.icons = {};
                this.card = {};

                models.organizations.roles.create({
                    user_id: this.owner_id,
                    organization_id: this.id,
                    permission_id: 1
                }, lib.error.capture);
            },
            beforeRemove: function() {
                models.organizations.roles.find({
                    organization_id: this.id
                }).remove(lib.error.capture);

                models.organizations.notifications.find({
                    organization_id: this.id
                }).remove(lib.error.capture);
            },
            afterLoad: function() {
                if(this.gravatar) {
                    this.gravatar = ("https://www.gravatar.com/avatar/" +
                                        this.hash(this.email) + "?s=152&d=mm");
                } else if(this.icons) {
                    this.gravatar = this.icons.gravatar || config.gravatar;
                }
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            add_stripe: function(req, callback) {
                var _this = this;
                req.stripe.customers.create({
                    email: _this.email,
                    plan: _this.pricing.plan,
                    trial_end: req.stripe.next_month(),
                    metadata: {
                        created: "created on registration",
                        type: "organization"
                    }
                }, function(error, customer) {
                    if(!error && customer) {
                        _this.stripe = customer.id;
                        _this.save();
                        callback(_this);
                    } else {
                        lib.error.capture(error, callback);
                    }
                });
            }
        },
        validations: {
            name: db.enforce.unique(),
            website: db.enforce.unique(),
            dns: db.enforce.unique(),
            email: [
                db.enforce.patterns.email(),
                db.enforce.unique()
            ]
        }
    });
}
