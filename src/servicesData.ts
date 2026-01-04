export interface Price {
    duration: string;
    price: string;
    promoPrice?: string;
}

export interface Service {
    category: string;
    title: string;
    description: string;
    image: string;
    benefits: string[];
    hasPromo: boolean;
    prices: Price[];
    callToBook?: boolean;
    benefitsHeading?: string;
    isAddOn?: boolean;
}

export const SERVICES: Service[] = [
    {
        category: "RELAXATION",
        title: "Swedish Massage",
        description: "Our Swedish Massage is a classic, full-body treatment designed to promote deep relaxation and overall well-being. Using gentle, flowing movements, and light kneading with gentle to medium pressure, this massage helps ease muscle tension, improve circulation, and calm the nervous system.",
        image: "/therapies/swedish2.png",
        benefits: [
            "Promotes deep relaxation and stress relief",
            "Eases muscle tension with gentle to medium pressure",
            "Improves circulation throughout the body",
            "Ideal for relaxation and first-time massage clients"
        ],
        hasPromo: false,
        prices: [
            { duration: "30 Minutes", price: "$55" },
            { duration: "45 Minutes", price: "$75" },
            { duration: "60 Minutes", price: "$90" },
            { duration: "75 Minutes", price: "$110" },
            { duration: "90 Minutes", price: "$125" }
        ]
    },
    {
        category: "CUSTOMIZED",
        title: "Thai Combination Massage",
        description: "A customized blend of Swedish, deep tissue, and Thai techniques tailored to your specific needs. This unique therapy integrates the best of multiple modalities to address individual concerns, providing both relaxation and therapeutic relief where you need it most.",
        image: "/therapies/combination.png",
        benefits: [
            "Targeted relief for specific areas",
            "Combines multiple healing techniques",
            "Improves flexibility and range of motion"
        ],
        hasPromo: false,
        prices: [
            { duration: "30 Minutes", price: "$60" },
            { duration: "45 Minutes", price: "$80" },
            { duration: "60 Minutes", price: "$95" },
            { duration: "75 Minutes", price: "$115" },
            { duration: "90 Minutes", price: "$135" }
        ]
    },
    {
        category: "THERAPEUTIC",
        title: "Thai Deep Tissue Massage",
        description: "A therapeutic massage using firm pressure and Thai techniques to target the inner layers of your muscles and connective tissues. This is ideal for treating musculoskeletal issues, such as strains and sports injuries, breaking up scar tissue and physically breaking down muscle knots.  For those seeking a deeper level of release, optional Ashiatsu may be incorporated, using controlled, broad foot pressure to enhance relaxation and muscle relief while maintaining a soothing experience.",
        image: "/therapies/walking2.png",
        benefits: [
            "Targets chronic muscle tension and deep-seated knots",
            "Helps reduce muscle stiffness and tightness",
            "Supports muscle recovery and injury prevention",
            "Stretching improves range of motion and overall mobility",
            "Ideal for active individuals and athletes"
        ],
        hasPromo: false,
        prices: [
            { duration: "30 Minutes", price: "$65" },
            { duration: "45 Minutes", price: "$85" },
            { duration: "60 Minutes", price: "$100" },
            { duration: "75 Minutes", price: "$120" },
            { duration: "90 Minutes", price: "$140" }
        ]
    },
    {
        category: "FOCUSED RELIEF",
        title: "Back, Neck & Shoulder Release",
        description: "Relieve built-up tension where it's felt most. This focused massage targets the neck, back, and shoulders using therapeutic techniques to release tight muscles and ease stress, perfect for those with desk jobs or carrying stress in their upper body.",
        image: "/therapies/tension.png",
        benefits: [
            "Relieves upper body tension",
            "Reduces tension headaches",
            "Improves posture and alignment"
        ],
        hasPromo: true,
        prices: [
            { duration: "30 Minutes", price: "$55", promoPrice: "$50" },
            { duration: "45 Minutes", price: "$75", promoPrice: "$65" }
        ]
    },
    {
        category: "MATERNITY",
        title: "Prenatal Massage",
        description: "A gentle, nurturing massage designed specifically for expectant mothers. This safe and effective treatment helps alleviate common discomforts during pregnancy such as back pain, leg cramps, and swelling, while promoting better sleep and reducing anxiety.",
        image: "/therapies/prenatal.png",
        benefits: [
            "Reduces swelling and joint pain",
            "Alleviates lower back discomfort",
            "Promotes better sleep and relaxation"
        ],
        hasPromo: false,
        prices: [
            { duration: "30 Minutes", price: "$55" },
            { duration: "60 Minutes", price: "$90" },
            { duration: "90 Minutes", price: "$125" }
        ]
    },
    {
        category: "SHARED EXPERIENCE",
        title: "Couples Massage",
        description: "Share a relaxing experience together with designed side-by-side massage. Whether for romance, bonding with a friend, or mother-daughter time, enjoy the benefits of massage therapy in our private couple's suite.",
        image: "/therapies/couples.png",
        benefitsHeading: "Notes",
        benefits: [
            "Bookings must be made by phone only",
            "Each person can choose their own individual massage type",
            "The prices below are for our most popular couples massages"
        ],
        hasPromo: false,
        callToBook: true,
        prices: [
            { duration: "60 Minutes Swedish", price: "$180" },
            { duration: "60 Minutes Thai Combination", price: "$190" },
            { duration: "60 Minutes Thai Deep Tissue", price: "$200" },
            { duration: "90 Minutes Swedish", price: "$250" },
            { duration: "90 Minutes Thai Combination", price: "$270" },
            { duration: "90 Minutes Thai Deep Tissue", price: "$280" }
        ]
    },
    {
        category: "WELLNESS ADD-ON",
        title: "Aromatherapy",
        description: "Enhance your massage experience with the therapeutic power of essential oils. Aromatherapy uses naturally extracted plant essences to promote health and well-being, helping to reduce stress, improve sleep quality, and boost your mood during and after your session at no additional cost.",
        image: "/therapies/aroma_desk.png",
        benefitsHeading: "Available Scents:",
        benefits: [
            "Eucalyptus",
            "Lavender Blend",
            "Citrus Blend",
            "Wintergreen Blend",
            "Clary Sage Blend",

        ],
        hasPromo: false,
        isAddOn: true,
        prices: [
            { duration: "Add-on to any service", price: "$10" }
        ]
    }
];
