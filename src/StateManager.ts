import Server from './Server'
import OutgoingMessage from './OutgoingMessage'
import IncomingResponse from './IncomingResponse'
import { MemoryStorage, Storage } from './Storage'

/**
 * Push state manager
 */
export default class StateManager {
  /**
   * key to use when storing history states
   */
  public static readonly StorageKey: string = '__http_server_states';

  /**
   * The bound `clickPush` handler 
   */
  protected _clickPush: Function = function() {};
  
  /**
   * Provisioned context (usually it should be window)
   */
  protected _context: Window;

  /**
   * The current state index number for the stored history of states
   */
  protected _currentState: number = -1;

  /**
   * Shortbut for `window.history`
   */
  protected _history: History;

  /**
   * Whether if the push states are being listened to
   */
  protected _listening: boolean = false;

  /**
   * Shortbut for `window.location`
   */
  protected _location: Location;

  /**
   * The original `window.onpopstate` function
   */
  protected _originalPopState: Function|null;

  /**
   * The original `window.history.pushState` function
   */
  protected _originalPushState: Function;

  /**
   * Servers listening for state changes
   */
  protected _servers: Set<Server> = new Set;

  /**
   * Where to keep the state history.
   * Push states on window cannot store objects so we have to do this...
   */
  protected _storage: Storage;

  /**
   * The bound `submitPush` handler 
   */
  protected _submitPush: Function = function() {};

  /**
   * Returns all the servers
   */
  get servers() {
    return this._servers;
  }

  /**
   * Sets the context and storage
   */
  constructor(context: Window, storage?: Storage) {
    this._context = context;
    this._location = context.location;
    this._history = context.history;
    this._originalPopState = context.onpopstate;
    this._originalPushState = this._history.pushState;
    this._storage = storage || new MemoryStorage;
  }

  /**
   * This is the new `window.history.pushState` function to use
   */
  async pushState(state: any, title: string, href: string) {
    //call the original push state
    //dont add state because data needs to be serialized
    this._originalPushState.call(
      this._history, 
      ++this._currentState, 
      title, 
      href
    );
    
    //if state is an object, it's meant to be request options
    const options = typeof state === 'object' ? state || {} : {};
    //if state is not an object, it's meant to be the request body
    if (typeof state !== 'object' && typeof state !== 'undefined') {
      options.body = state;
    }
  
    const request = new OutgoingMessage(this._location.href, options);
    const response = new IncomingResponse;
    //save the state to localstorage
    const item = this._storage.getItem(StateManager.StorageKey) as string;
    const states = JSON.parse(item || '[]');
    //if 0 == 0, 1 === 1
    if (this._currentState === states.length) {
      //push the state to the history
      states.push({
        request: await request.serialize(),
        response: await response.serialize()
      });
    } else {
      //we need to replace it
      states[this._currentState] = {
        request: await request.serialize(),
        response: await response.serialize()
      };
    }
    
    this._storage.setItem(
      StateManager.StorageKey, 
      JSON.stringify(states)
    );
  
    for (const server of this._servers) {
      await server.emit('request', request, response);
      await server.handler(request, response);
      await server.emit('response', request, response);
    }
  }

  /**
   * This is the new `window.onpopstate` function to use
   */
  async popState(e: Event) {
    const states = JSON.parse(
      this._context.localStorage.getItem(StateManager.StorageKey) || '[]'
    );
  
    let request, response
    //@ts-ignore state does not exist on Event however, 
    // in a popstate event it does
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
    const eventState = e.state;
    if (states[eventState]) {
      request = new OutgoingMessage(
        this._location.href, 
        states[eventState].request
      );
      response = new IncomingResponse(states[eventState].response);
    } else {
      request = new OutgoingMessage(this._location.href);
      response = new IncomingResponse;
    }
  
    for (const server of this._servers) {
      await server.emit('request', request, response);
      await server.handler(request, response);
      await server.emit('response', request, response);
    }
  }

  /**
   * Makes a server, adds it to the list of servers
   * @param handler 
   * @returns 
   */
  add(server: Function|Server, autoStart: boolean = true): Server {
    if (typeof server === 'function') {
      server = new Server(server, this);
    }
    
    this._servers.add(server);
    if (autoStart) {
      this.start();
    }
    return server;
  }

  /**
   * This listens for `<a>` clicks and stops it from reloading.
   * insteads forwards the request to push state.
   * 
   * To make a link run like normal, add `e.stop=true` to the event
   */
  clickPush(e: Event) {
    //if another event says to do nothing
    //@ts-ignore
    if(e.stop) {
      //do nothing
      return;
    }

    let targetElement = e.target as HTMLElement
    while (targetElement != null) {
      //if the link
      if (targetElement.tagName.toUpperCase() !== 'A') {
        //@ts-ignore Type 'null' is not assignable to type 'HTMLElement'
        targetElement = targetElement.parentElement;
        continue;
      }
      
      //if the link is in the same domain
      //@ts-ignore
      const href = targetElement.href || '';
      if (href.indexOf(this._location.origin) === 0) {
        //stop it
        e.preventDefault();
        this._history.pushState({}, '', href);
      }
      
      break;
    }
  }

  /**
   * Closes a Server
   */
  remove(server: Server, autoStop: boolean = true): StateManager {
    this._servers.delete(server);

    if (!this._servers.size && autoStop) {
      this.stop();
    }

    return this;
  }

  /**
   * Starts up the state manager
   */
  start(): StateManager {
    if (this._listening) {
      return this;
    }

    this._history.pushState = this.pushState.bind(this);
    this._context.onpopstate = this.popState.bind(this);
    this._clickPush = this.clickPush.bind(this);
    this._submitPush = this.submitPush.bind(this);
    this._context.document.body.addEventListener(
      'click', 
      //@ts-ignore
      this._clickPush, 
      true
    );
    this._context.document.body.addEventListener(
      'submit', 
      //@ts-ignore
      this._submitPush, 
      true
    );

    this._listening = true;

    return this;
  }

  /**
   * Returns the state manager to the original configuration
   */
  stop(): StateManager {
    if (!this._listening) {
      return this;
    }

    //@ts-ignore
    this._history.pushState = this._originalPushState;
    //@ts-ignore
    this._context.onpopstate = this._originalPopState;
    this._context.document.body.removeEventListener(
      'click', 
      //@ts-ignore
      this._clickPush, 
      true
    );
    this._context.document.body.removeEventListener(
      'submit', 
      //@ts-ignore
      this._submitPush, 
      true
    );

    this._context.localStorage.removeItem(StateManager.StorageKey);
    this._currentState = -1;
    this._listening = false;

    return this;
  }

  /**
   * This listens for `<form>` submits and stops it from reloading.
   * insteads forwards the request to push state.
   * 
   * To make a form run like normal, add `e.stop=true` to the event
   */
  submitPush(e: Event) {
    //if another event says to do nothing
    //@ts-ignore
    if(e.stop) {
      //do nothing
      return;
    }
    let targetElement = e.target as HTMLFormElement
    while (targetElement != null) {
      //if the link
      if (targetElement.tagName.toUpperCase() !== 'FORM') {
        //@ts-ignore Type 'null' is not assignable to type 'HTMLElement'
        targetElement = targetElement.parentElement;
        continue;
      }

      const action = targetElement.getAttribute('action') 
        || this._location.href;
        
      //if it has ://
      if (action.indexOf('://') !== -1 
        //but it's not the same origin
        && action.indexOf(this._location.origin) !== 0
      ) {
        break;
      }

      //at this point, the form is for local processing.
      
      //stop it
      e.preventDefault();

      const state = {
        method: targetElement.getAttribute('method') || 'GET',
        // no-cors, *cors, same-origin
        mode: 'cors', 
        // *default, no-cache, reload, force-cache, only-if-cached
        cache: 'no-cache', 
        // include, *same-origin, omit
        credentials: 'same-origin', 
        headers: {
          'Content-Type': targetElement.getAttribute('enctype') 
            || 'application/x-www-form-urlencoded'
        },
        // manual, *follow, error
        redirect: 'follow', 
        // no-referrer, *no-referrer-when-downgrade, origin, 
        // origin-when-cross-origin, same-origin, strict-origin, 
        // strict-origin-when-cross-origin, unsafe-url
        referrerPolicy: 'no-referrer',
        body: new FormData(targetElement)
      }

      this._history.pushState(state, '', action);
      break
    }
  }
}
