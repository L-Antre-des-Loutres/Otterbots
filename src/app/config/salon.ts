import {SalonCategory, SalonType} from "../../otterbots/type/salonType";

const ROLE_ID = "1254833145749049385";

 /**
 * @type {SalonCategory[]} Array of salon category objects.
 * @property {number} id The unique identifier of the category.
 * @property {string} name The name of the category.
 * @property {string} role_id The identifier of the role associated with the category.
  **/
export const salonCategory: SalonCategory[] = [
    {
        id: 1,
        name: "Test",
        role_id: ROLE_ID
    }
]


/**
 * @type {SalonType[]} Array of salon configuration objects.
 * @property {string} name The name of the salon.
 * @property {string} role_id The identifier of the role associated with the salon.
 * @property {number} type The type of the salon (e.g., 0 for default types).
 * @property {number} category The category ID associated with the salon.
 */
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