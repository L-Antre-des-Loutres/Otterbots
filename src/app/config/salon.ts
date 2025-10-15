import {SalonCategory, SalonType} from "../../otterbots/type/salonType";

const ROLE_ID = "1254833145749049385";

export const salonCategory: SalonCategory[] = [
    {
        id: 1,
        name: "Test",
        role_id: ROLE_ID
    }
]

export const botSalon: SalonType[] = [
    {
        name: "general",
        role_id: ROLE_ID,
        type: 0,
        category: 1
    },
    {
        name: "annonces",
        role_id: ROLE_ID,
        type: 0,
        category: 1
    },
    {
        name: "discussions",
        role_id: ROLE_ID,
        type: 0,
        category: 1
    },
    {
        name: "bot-commands",
        role_id: ROLE_ID,
        type: 0,
        category: 1
    },
    {
        name: "musique",
        role_id: ROLE_ID,
        type: 0,
        category: 1
    }
];