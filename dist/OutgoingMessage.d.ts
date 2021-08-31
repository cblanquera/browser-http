declare type GenericObject = {
    [key: string]: any;
};
export default class OutgoingMessage extends Request {
    protected _request: Request;
    protected _serialized: GenericObject;
    constructor(input?: any, init?: GenericObject);
    get body(): any;
    serialize(): Promise<GenericObject>;
}
export {};
