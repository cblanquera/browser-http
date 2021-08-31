type GenericObject = { [key: string]: any };

export default class IncomingResponse extends Response {
  /**
   * The actual current response that will read and changed incrementally
   */
  protected _response: Response;

  /**
   * A cache to everything writable that needs to be readable as well
   */
  protected _serialized: GenericObject = {};

  /**
   * The Response Body
   */
  protected _body: any;

  /**
   * Sets up the super Response and mocks some of the functionality
   */
  constructor(body?: any, options?: GenericObject) {
    //just for formalities
    super(body, options)
    //this is the actual current response 
    //that will read and changed incrementally
    this._response = new Response(body, options)

    //add everything that is writable to the serialized data
    writable.forEach((prop: string) => {
      //@ts-ignore No index signature with a parameter of 
      //type 'string' was found on type 'Response'
      this._serialized[prop] = this._response[prop]
    })

    this._body = null
    if (typeof options !== 'undefined'
      || typeof body !== 'object'
      || (body.constructor && body.constructor.name)
    ) {
      this._body = body
    }
  }

  /**
   * Request body always returns undefined.
   * So this is a pollyfill...
   */
  get body() {
    return this._body
  }

  /**
   * Sets body
   */
  set body(body) {
    this._body = body
    this._response = new Response(
      this._body, 
      this._serialized
    )
    writable.forEach(prop => {
      //@ts-ignore No index signature with a parameter of 
      //type 'string' was found on type 'Response'
      this._serialized[prop] = this._response[prop]
    })
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
  'arrayBuffer', 'blob', 'clone',    'error',
  'formData',    'json', 'redirect', 'text'
];

const readable = [
  'bodyUsed', 'headers',    'ok',   'redirected', 
  'status',   'statusText', 'type', 'url'
];

const writable = [
  'headers', 'redirected',
  'status',  'statusText'
];

readable.forEach(prop => {
  descriptors[prop] = {
    get: function() {
      return this._response[prop];
    }
  }
});

//populate readable descriptors to be eventually 
//added to the OutgoingMessage class prototype
writable.forEach(prop => {
  descriptors[prop] = Object.assign(descriptors[prop] || {}, {
    set: function(this: IncomingResponse, value: any) {
      this._serialized[prop] = value;
      this._response = new Response(
        this._body, 
        this._serialized
      );
      writable.forEach((prop: string) => {
        //@ts-ignore No index signature with a parameter of 
        //type 'string' was found on type 'Response'
        this._serialized[prop] = this._response[prop]
      });
    }
  });
});

//populate writable descriptors to be eventually 
//added to the OutgoingMessage class prototype
Object.keys(descriptors).forEach(prop => {
  Object.defineProperty(
    IncomingResponse.prototype, 
    prop, 
    descriptors[prop]
  );
});

//adds all methods as a "pass along" to the OutgoingMessage prototype
methods.forEach((method: string) => {
  //@ts-ignore No index signature with a parameter of 
  //type 'string' was found on type 'IncomingResponse'.
  IncomingResponse.prototype[method] = function(...args) {
    //@ts-ignore No index signature with a parameter of 
    //type 'string' was found on type 'Response'
    return this._response[method](...args);
  }
});