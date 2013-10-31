module.exports = function (models) {
    //Set Default Account
    if(!config.general.production) {
        models.users.create({
            name: config.profile.full_name,
            email: config.profile.email,
            screen_name: config.profile.name,
            password: config.profile.password,
            admin: true,
            code_pricing_id: 0
        }, blank_function);
    }

    //Create User Pricing
    models.users_pricing.clear(function() {
        models.users_pricing.create([
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
        ], blank_function); 
    });

    //Create Document Permissions
    models.documents_permissions.clear(function() {
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
        ], blank_function);
    });
};
