declare type GenericObject = {
    [key: string]: any;
};
export default class IncomingResponse extends Response {
    protected _response: Response;
    protected _serialized: GenericObject;
    protected _body: any;
    constructor(body?: any, options?: GenericObject);
    get body(): any;
    set body(body: any);
    serialize(): Promise<GenericObject>;
}
export {};
