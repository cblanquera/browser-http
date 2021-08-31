import { EventEmitter } from '@openovate/jsm'

/**
 * Push state manager
 */
type StateManager = {
  /**
   * Returns all the servers
   */
  get servers(): Set<Server>

  /**
   * Makes a server, adds it to the list of servers
   * @param handler 
   * @returns 
   */
  add(server: Function|Server, autoStart?: boolean): Server;

  /**
   * Closes a Server
   */
  remove(server: Server, autoStop?: boolean): StateManager;
}

export default class Server extends EventEmitter {
  /**
   * The handler for when the state changes
   */
  protected _handler: Function;

  /**
   * The overall state manager
   */
  protected _stateManager: StateManager;

  /**
   * Adds the handler and state manager
   */
  constructor(handler: Function, stateManager: StateManager) {
    super();
    this._handler = handler;
    this._stateManager = stateManager;
  }

  /**
   * Returns the handler
   */
  get handler(): Function {
    return this._handler
  }

  /**
   * Returns true if this server is being listened to
   */
  get listening(): boolean {
    return this._stateManager.servers.has(this);
  }

  /**
   * Listens to the state manager
   */
  listen(): Server {
    this._stateManager.add(this);
    return this;
  }

  /**
   * Stops listening to the state manager
   */
  close(): Server {
    if (this.listening) {
      this._stateManager.remove(this);
      this.emit('close');
    }

    return this;
  }
}