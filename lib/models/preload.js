module.exports = function (models) {
    //Set Default Account
    if(!config.general.production) {
        models.users.create({
            name: config.profile.full_name,
            email: config.profile.email,
            screen_name: config.profile.screen_name,
            password: config.profile.password,
            admin: true,
            code_pricing_id: 0
        }, blank_function(true));
    }

    //Create User Pricing
    models.users.pricing.clear(function() {
        models.users.pricing.create([
            {
                name: "Standard",
                cost: 7,
                documents: 20
            },
            {
                name: "Pro",
                cost: 14,
                documents: 40,
                pro: true
            },
            {
                name: "Unlimited",
                cost: 21,
                pro: true
            },
            {
                name: "Student",
                cost: 5
            },
            {
                name: "Pro Student",
                cost: 10,
                pro: true
            }
        ], blank_function(true));
    });

    //Create Document Permissions
    models.documents.permissions.clear(function() {
        models.documents.permissions.create([
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
        ], blank_function(true));
    });
};
