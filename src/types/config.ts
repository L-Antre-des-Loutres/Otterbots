import { ClientOptions, Message } from "discord.js";
import { SalonCategory, SalonType } from "./salonType";

export interface OtterbotsConfig {
    clientOptions?: ClientOptions;
    salons?: {
        categories: SalonCategory[];
        botSalons: SalonType[];
    };
    otterguard?: {
        protectLink?: boolean;
        protectScam?: boolean;
        protectSpam?: boolean;
        authorizedDomains?: string[];
    };
    reactions?: Array<{
        condition: (msg: Message) => boolean;
        emoji: string;
    }>;
    tasks?: Array<{
        name: string;
        time: string;
        task: () => Promise<void>;
        period?: string;
    }>;
}
