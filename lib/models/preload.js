module.exports = function (models) {
    //Set Default Account
    if(!config.general.production) {
        models.users.create({
            id: 1,
            name: config.profile.full_name,
            email: config.profile.email,
            screen_name: config.profile.screen_name,
            password: config.profile.password,
            admin: true,
            pricing_id: 1
        }, lib.error.capture(true));

        models.organizations.create({
            id: 1,
            name: "University of Santa Cruz",
            logo: "UC Santa Cruz",
            email: config.profile.email,
            gravatar: config.profile.email,
            website: "ucsc.edu",
            dns: config.profile.name + ".dev.laborate.me",
            theme: "ucsc",
            acronym: "ucsc",
            reset: "https://cruzid.ucsc.edu/idmuser_self_service",
            pricing_id: 7,
            owner_id: 1,
            icons: {
                "ico": "http://www.ucsc.edu/favicon.ico",
                "196": "http://www.ucsc.edu/favicon.ico",
                "160": "http://www.ucsc.edu/favicon.ico",
                "114": "http://www.ucsc.edu/favicon.ico",
                "72": "http://www.ucsc.edu/favicon.ico",
                "57": "http://www.ucsc.edu/favicon.ico"
            }
        }, lib.error.capture(true));
    }

    //Create User Pricing
    models.pricing.clear(function() {
        models.pricing.create([
            {
                id: 0,
                plan: "free",
                name: "Free",
                amount: 0,
                documents: 0,
                interval: "month",
                interval_count: 1,
                priority: 0
            },
            {
                id: 2,
                plan: "standard",
                name: "Standard",
                amount: 7,
                documents: 50,
                interval: "month",
                interval_count: 1,
                priority: 1
            },
            {
                id: 3,
                plan: "pro",
                name: "Pro",
                amount: 14,
                documents: 100,
                pro: true,
                interval: "month",
                interval_count: 1,
                priority: 2
            },
            {
                id: 4,
                plan: "unlimited",
                name: "Unlimited",
                amount: 21,
                pro: true,
                interval: "month",
                interval_count: 1,
                priority: 3
            },
            {
                id: 5,
                plan: "student",
                name: "Student",
                amount: 0,
                interval: "month",
                interval_count: 1,
                student: true,
                priority: 0
            },
            {
                id: 6,
                plan: "student-pro",
                name: "Student Pro",
                amount: 5,
                pro: true,
                interval: "month",
                interval_count: 1,
                student: true,
                priority: 1
            },
            {
                id: 7,
                plan: "student-university",
                name: "Student University",
                amount: 5,
                interval: "month",
                interval_count: 1,
                organization: true,
                priority: 0
            }
        ], lib.error.capture(true));
    });

    //Create Organization Permissions
    models.organizations.permissions.clear(function() {
        models.organizations.permissions.create([
            {
                id: 1,
                name: "Owner",
                description: "Owner of the Organization",
                owner: true,
                admin: true,
                owned: false
            },
            {
                id: 2,
                name: "Admin",
                description: "Admin of the Organization",
                admin: true,
                owned: false
            },
            {
                id: 3,
                name: "Professor",
                description: "Professor of the Organization",
                owned: false
            },
            {
                id: 4,
                name: "Professor's Assistant",
                description: "Professor's Assistant of the Organization",
                student: true
            },
            {
                id: 5,
                name: "Student",
                description: "Student of the Organization",
                student: true
            }
        ], lib.error.capture(true));
    });

    //Create Document Permissions
    models.documents.permissions.clear(function() {
        models.documents.permissions.create([
            {
                id: 1,
                name: "Owner",
                description: "Owner of the document",
                owner: true
            },
            {
                id: 2,
                name: "Editor",
                description: "Can only edit the document"
            },
            {
                id: 3,
                name: "Viewer",
                description: "Can only view the document",
                readonly: true
            },
            {
                id: 4,
                name: "Blocked",
                description: "Can not view the document",
                access: false
            }
        ], lib.error.capture(true));
    });
};
