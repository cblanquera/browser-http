import { EventEmitter } from '@openovate/jsm';
declare type StateManager = {
    get servers(): Set<Server>;
    add(server: Function | Server, autoStart?: boolean): Server;
    remove(server: Server, autoStop?: boolean): StateManager;
};
export default class Server extends EventEmitter {
    protected _handler: Function;
    protected _stateManager: StateManager;
    constructor(handler: Function, stateManager: StateManager);
    get handler(): Function;
    get listening(): boolean;
    listen(): Server;
    close(): Server;
}
export {};
