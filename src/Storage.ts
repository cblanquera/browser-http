type GenericObject = { [key: string]: string|number|boolean|null };

export class MemoryStorage implements Storage {
  protected _store: GenericObject = {};
  getItem(name: string): string|number|boolean|null {
    return this._store[name] || null;
  }
  removeItem(name: string) {
    delete this._store[name];
  }
  setItem(name: string, value: string|number|boolean|null) {
    if (value && typeof value === 'object' 
      || typeof value === 'function'
    ) {
      //@ts-ignore
      value = value.toString();
    }
    this._store[name] = value;
  }
}

export type Storage = {
  getItem(name: string): string|number|boolean|null;
  removeItem(name: string): void;
  setItem(name: string, value: string|number|boolean|null): void;
}