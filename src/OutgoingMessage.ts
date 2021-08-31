type GenericObject = { [key: string]: any };

export default class OutgoingMessage extends Request {
  /**
   * The actual current request that will read and changed incrementally
   */
  protected _request: Request;

  /**
   * A cache to everything writable that needs to be readable as well
   */
  protected _serialized: GenericObject = {};

  /**
   * Sets up the super Request and mocks some of the functionality
   */
  constructor(input?: any, init?: GenericObject) {
    //just for formalities
    super(input, init);
    //this is the actual current request 
    //that will read and changed incrementally
    this._request = new Request(input, init);

    //add everything that is writable to the serialized data
    writable.forEach(prop => {
      //@ts-ignore No index signature with a parameter of 
      //type 'string' was found on type 'Response'
      this._serialized[prop] = this._request[prop]
    })

    //also grab the body because in a window.Request, 
    //you can only retrieve it once..
    if (init && init.body) {
      this._serialized.body = init.body
    }
  }

  /**
   * Request body always returns undefined.
   * So this is a pollyfill...
   */
  get body() {
    return this._serialized.body
  }

  /**
   * Serializes data so it can be passed around
   */
  async serialize() {
    const serialized = Object.assign({}, this._serialized)
    if (this.bodyUsed) {
      serialized.body = await this.text()
    }

    const headers = serialized.headers as Headers;
    if (headers instanceof Headers) {
      serialized.headers = []
      //@ts-ignore Type 'Headers' must have a 
      //'[Symbol.iterator]()' method that returns an iterator.
      for (const [name, value] of headers) {
        serialized.headers.push([name, value])
      }
    }
    return serialized
  }
}

const descriptors: GenericObject = {};

const methods = [
  'arrayBuffer', 'blob', 'clone', 
  'formData',    'json', 'text'
];

const readable = [
  'bodyUsed',    'cache',          'credentials', 
  'destination', 'headers',        'integrity', 
  'method',      'mode',           'redirect',    
  'referrer',    'referrerPolicy', 'url'
];

const writable = [
  'body',        'method',   'cache', 
  'credentials', 'headers',  'integrity', 
  'mode',        'redirect', 'referrer',
  'url'
];

//populate readable descriptors to be eventually 
//added to the OutgoingMessage class prototype
readable.forEach(prop => {
  descriptors[prop] = {
    get: function() {
      return this._request[prop];
    }
  }
});

//populate writable descriptors to be eventually 
//added to the OutgoingMessage class prototype
writable.forEach(prop => {
  descriptors[prop] = Object.assign(descriptors[prop] || {}, {
    set: function(this: OutgoingMessage, value: any) {
      this._serialized[prop] = value
      this._request = new Request(
        this._serialized.url, 
        this._serialized
      );
      writable.forEach(prop => {
        //@ts-ignore No index signature with a parameter of 
        //type 'string' was found on type 'Response'
        this._serialized[prop] = this._request[prop];
      });
      if (prop === 'body') {
        this._serialized.body = value;
      }
    }
  });
});

//adds all descriptors to the OutgoingMessage prototype
Object.keys(descriptors).forEach(prop => {
  Object.defineProperty(
    OutgoingMessage.prototype, 
    prop, 
    descriptors[prop]
  );
});

//adds all methods as a "pass along" to the OutgoingMessage prototype
methods.forEach(method => {
  //@ts-ignore No index signature with a parameter of 
  //type 'string' was found on type 'IncomingResponse'.
  OutgoingMessage.prototype[method] = function(...args) {
    //@ts-ignore No index signature with a parameter of 
    //type 'string' was found on type 'Response'
    return this._request[method](...args);
  };
});