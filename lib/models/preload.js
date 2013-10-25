module.exports = function (models) {
    //Set Default Admin
    if(!config.general.production) {
        models.users.create({
            name: "Support",
            email: "support@laborate.io",
            screen_name: "support",
            password: "laborate",
            admin: true,
            code_pricing_id: 0
        }, function() {});
    }

    //Create User Pricing
    models.users_pricing.create([
        {
            name: "Standard",
            cost: 7,
            documents: 20
        },
        {
            name: "Pro",
            cost: 14,
            documents: 40
        },
        {
            name: "Unlimited",
            cost: 21
        },
        {
            name: "Student",
            cost: 10
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
