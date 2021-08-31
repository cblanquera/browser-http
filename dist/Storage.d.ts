declare type GenericObject = {
    [key: string]: string | number | boolean | null;
};
export declare class MemoryStorage implements Storage {
    protected _store: GenericObject;
    getItem(name: string): string | number | boolean | null;
    removeItem(name: string): void;
    setItem(name: string, value: string | number | boolean | null): void;
}
export declare type Storage = {
    getItem(name: string): string | number | boolean | null;
    removeItem(name: string): void;
    setItem(name: string, value: string | number | boolean | null): void;
};
export {};
