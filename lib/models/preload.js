module.exports = function (models) {
    //Set Default Account
    if(!config.general.production) {
        models.users.create({
            name: config.profile.full_name,
            email: config.profile.email,
            screen_name: config.profile.screen_name,
            password: config.profile.password,
            admin: true,
            pricing_id: 3
        }, blank_function(true));
    }

    //Create User Pricing
    models.users.pricing.clear(function() {
        models.users.pricing.create([
            {
                plan: "standard",
                name: "Standard",
                amount: 7,
                documents: 20,
                interval: "month",
                interval_count: 1,
                priority: 0
            },
            {
                plan: "pro",
                name: "Pro",
                amount: 14,
                documents: 40,
                pro: true,
                interval: "month",
                interval_count: 1,
                priority: 1
            },
            {
                plan: "unlimited",
                name: "Unlimited",
                amount: 21,
                pro: true,
                interval: "month",
                interval_count: 1,
                priority: 2
            },
            {
                plan: "student",
                name: "Student",
                amount: 5,
                interval: "month",
                interval_count: 1,
                student: true,
                priority: 0
            },
            {
                plan: "student-pro",
                name: "Student Pro",
                amount: 5,
                pro: true,
                interval: "month",
                interval_count: 1,
                student: true,
                priority: 1
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
