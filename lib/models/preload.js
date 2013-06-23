var config = require("../../config");

module.exports = function (models) {
    //Set Default Admin
    if(config.general.environment == "development") {
        models.users.create({
            name: "Admin",
            email: "admin@laborate.io",
            screen_name: "admin",
            password: "laborate",
            admin: true,
            code_pricing_id: 5
        }, function() {});
    }

    //Create User Pricing
    models.users_pricing.create([
        {
            name: "Micro",
            cost: 5,
            documents: 20
        },
        {
            name: "Small",
            cost: 10,
            documents: 40
        },
        {
            name: "Medium",
            cost: 15,
            documents: 60
        },
        {
            name: "Large",
            cost: 20,
            documents: 80
        },
        {
            name: "Extra Large",
            cost: 25,
            documents: 100
        },
        {
            name: "Unlimited",
            cost: 30,
            documents: null
        }

    ], function() {});

    //Create Document Permissions
    models.documents_permissions.create([
        {
            name: "Owner",
            description: "Owner of the document"
        },
        {
            name: "Editor",
            description: "Can only edit the document"
        },
        {
            name: "Viewer",
            description: "Can only view the document"
        }
    ], function() {});
};
