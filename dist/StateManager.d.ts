import Server from './Server';
import { Storage } from './Storage';
export default class StateManager {
    static readonly StorageKey: string;
    protected _clickPush: Function;
    protected _context: Window;
    protected _currentState: number;
    protected _history: History;
    protected _listening: boolean;
    protected _location: Location;
    protected _originalPopState: Function | null;
    protected _originalPushState: Function;
    protected _servers: Set<Server>;
    protected _storage: Storage;
    protected _submitPush: Function;
    get servers(): Set<Server>;
    constructor(context: Window, storage?: Storage);
    pushState(state: any, title: string, href: string): Promise<void>;
    popState(e: Event): Promise<void>;
    add(server: Function | Server, autoStart?: boolean): Server;
    clickPush(e: Event): void;
    remove(server: Server, autoStop?: boolean): StateManager;
    start(): StateManager;
    stop(): StateManager;
    submitPush(e: Event): void;
}
