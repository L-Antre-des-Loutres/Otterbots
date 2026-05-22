export interface PocketBaseAlias {
    alias: string;
    collection: string;
    action: 'getList' | 'getOne' | 'create' | 'update' | 'delete' | 'getFirstListItem' | 'getFullList';
    options?: unknown;
}

export interface PocketBaseConfig {
    aliases: PocketBaseAlias[];
}
