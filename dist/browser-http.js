/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 895:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var TaskQueue_1 = __importDefault(__webpack_require__(850));
var EventEmitter = (function () {
    function EventEmitter() {
        this.listeners = {};
        this.event = {
            event: 'idle',
            pattern: 'idle',
            variables: []
        };
        this.regexp = [];
    }
    EventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var matches, matchKeys, queue;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matches = this.match(event);
                        matchKeys = Object.keys(matches);
                        if (!matchKeys.length) {
                            return [2, EventEmitter.STATUS_NOT_FOUND];
                        }
                        queue = new TaskQueue_1.default;
                        matchKeys.forEach(function (key) {
                            var match = matches[key];
                            var event = match.pattern;
                            if (typeof _this.listeners[event] === 'undefined') {
                                return;
                            }
                            match.args = args;
                            _this.listeners[event].each(function (listener) {
                                queue.add(function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    Object.assign(this._utilityPurge(this.event), match, listener);
                                                    return [4, listener.callback.apply(listener, args)];
                                                case 1:
                                                    if ((_a.sent()) === false) {
                                                        return [2, false];
                                                    }
                                                    return [2];
                                            }
                                        });
                                    });
                                }, listener.priority);
                            });
                        });
                        return [4, queue.run.apply(queue, args)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    EventEmitter.prototype.match = function (event) {
        var matches = {};
        if (typeof this.listeners[event] !== 'undefined') {
            matches[event] = {
                event: event,
                pattern: event,
                variables: []
            };
        }
        this.regexp.forEach(function (pattern) {
            var regexp = new RegExp(pattern.substr(pattern.indexOf('/') + 1, pattern.lastIndexOf('/') - 1), pattern.substr(pattern.lastIndexOf('/') + 1));
            var match = event.match(regexp);
            if (!match || !match.length) {
                return;
            }
            var variables = [];
            if (Array.isArray(match)) {
                variables = match.slice();
                variables.shift();
            }
            matches[pattern] = { event: event, pattern: pattern, variables: variables };
        });
        return matches;
    };
    EventEmitter.prototype.on = function (event, callback, priority) {
        var _this = this;
        if (priority === void 0) { priority = 0; }
        if (Array.isArray(event)) {
            event.forEach(function (event) {
                _this.on(event, callback, priority);
            });
            return this;
        }
        if (event instanceof RegExp) {
            event = event.toString();
        }
        if (event.indexOf('/') === 0 && event.lastIndexOf('/') !== 0) {
            this.regexp.push(event);
        }
        if (typeof this.listeners[event] === 'undefined') {
            this.listeners[event] = new TaskQueue_1.default;
        }
        this.listeners[event].add(callback, priority);
        return this;
    };
    EventEmitter.prototype.unbind = function (event, callback) {
        var _this = this;
        if (event === void 0) { event = null; }
        if (callback === void 0) { callback = null; }
        if (!event && !callback) {
            this._utilityPurge(this.listeners);
            return this;
        }
        if (!callback && this.listeners[event]) {
            delete this.listeners[event];
            return this;
        }
        if (this.listeners[event] && typeof callback === 'function') {
            this.listeners[event].unbind(callback);
            if (!this.listeners[event].length) {
                delete this.listeners[event];
            }
        }
        if (!event && typeof callback === 'function') {
            Object.keys(this.listeners).forEach(function (event) {
                _this.listeners[event].unbind(callback);
                if (!_this.listeners[event].length) {
                    delete _this.listeners[event];
                }
            });
        }
        return this;
    };
    EventEmitter.prototype.use = function (callback) {
        var _this = this;
        if (arguments.length > 1) {
            Array.from(arguments).forEach(function (callback, index) {
                _this.use(callback);
            });
            return this;
        }
        if (Array.isArray(callback)) {
            this.use.apply(this, callback);
            return this;
        }
        if (callback instanceof EventEmitter) {
            Object.keys(callback.listeners).forEach(function (event) {
                callback.listeners[event].queue.forEach(function (listener) {
                    _this.on(event, listener.callback, listener.priority);
                });
                callback.event = _this.event;
            });
            return this;
        }
        if (typeof callback === 'function') {
            this.on('/.*/ig', callback);
            return this;
        }
        return this;
    };
    EventEmitter.prototype._utilityPurge = function (hash) {
        for (var key in hash) {
            delete hash[key];
        }
        return hash;
    };
    EventEmitter.STATUS_NOT_FOUND = TaskQueue_1.default.STATUS_EMPTY;
    EventEmitter.STATUS_INCOMPLETE = TaskQueue_1.default.STATUS_INCOMPLETE;
    EventEmitter.STATUS_OK = TaskQueue_1.default.STATUS_OK;
    return EventEmitter;
}());
exports.default = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map

/***/ }),

/***/ 992:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Exception = (function () {
    function Exception(message, code) {
        if (code === void 0) { code = 500; }
        this.errors = {};
        this.stack = '';
        this.message = message;
        this.name = this.constructor.name;
        this.code = code;
        this.error = new Error(message);
        if (this.error.stack) {
            this.stack = this.error.stack;
        }
    }
    Exception.for = function (message) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        values.forEach(function (value) {
            message = message.replace('%s', value);
        });
        return new this(message);
    };
    Exception.forErrorsFound = function (errors) {
        var exception = new this('Invalid Parameters');
        exception.errors = errors;
        return exception;
    };
    return Exception;
}());
exports.default = Exception;
//# sourceMappingURL=Exception.js.map

/***/ }),

/***/ 784:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Reflection = (function () {
    function Reflection(definition) {
        this.nativeMethods = [
            'constructor',
            '__proto__',
            '__defineGetter__',
            '__defineSetter__',
            'hasOwnProperty',
            '__lookupGetter__',
            '__lookupSetter__',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'valueOf',
            'toLocaleString'
        ];
        this.definition = definition;
    }
    Reflection.prototype.isClass = function () {
        if (typeof this.definition === 'object') {
            return false;
        }
        var clause = this.definition.toString();
        return clause.indexOf('class') === 0
            || clause.indexOf('_classCallCheck(this,') !== -1;
    };
    Reflection.prototype.getArgumentNames = function () {
        if (typeof this.definition !== 'function') {
            return [];
        }
        var clause = this.definition.toString();
        if (clause.indexOf('function') !== 0) {
            clause = 'function ' + clause;
        }
        var matches = clause
            .replace(/[\r\n\s]+/g, ' ')
            .match(/(?:function\s*\w*)?\s*(?:\((.*?)\)|([^\s]+))/);
        if (!matches || !matches.length) {
            return [];
        }
        var names = matches.slice(1, 3).join('').split(/\s*,\s*/);
        if (names.length === 1 && names[0] === '') {
            names.pop();
        }
        return names;
    };
    Reflection.prototype.getDescriptors = function () {
        return Object.getOwnPropertyDescriptors(this.getMethods());
    };
    Reflection.prototype.getMethods = function () {
        var _this = this;
        var prototype = {};
        var definition = this.getPrototypeOf();
        if (!definition) {
            return prototype;
        }
        Object.getOwnPropertyNames(definition).forEach(function (property) {
            if (_this.nativeMethods.indexOf(property) !== -1) {
                return;
            }
            var descriptor = Object.getOwnPropertyDescriptor(definition, property);
            if (!descriptor) {
                return;
            }
            if (typeof descriptor.value === 'function') {
                prototype[property] = definition[property];
                return;
            }
            if (typeof descriptor.get === 'function'
                || typeof descriptor.set === 'function') {
                Object.defineProperty(prototype, property, descriptor);
            }
        });
        var reflection = new Reflection(Object.getPrototypeOf(definition));
        return Object.assign(prototype, reflection.getMethods());
    };
    Reflection.prototype.getPrototypeOf = function () {
        if (typeof this.definition === 'function') {
            return this.definition.prototype;
        }
        return this.definition;
    };
    return Reflection;
}());
exports.default = Reflection;
function reflect(definition) {
    return new Reflection(definition);
}
exports.reflect = reflect;
function traits() {
    var definitions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        definitions[_i] = arguments[_i];
    }
    var definition = (function () {
        function definition() {
        }
        return definition;
    }());
    if (!definitions.length) {
        return definition;
    }
    var reflection = new Reflection(definition);
    definitions.forEach(function (definition) {
        var descriptors = (new Reflection(definition)).getDescriptors();
        Object.keys(descriptors).forEach(function (method) {
            if (reflection.getDescriptors()[method]) {
                return;
            }
            Object.defineProperty(reflection.getPrototypeOf(), method, descriptors[method]);
        });
    });
    return definition;
}
exports.traits = traits;
//# sourceMappingURL=Reflection.js.map

/***/ }),

/***/ 434:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Registry = (function () {
    function Registry(data) {
        if (data === void 0) { data = {}; }
        this.data = data;
    }
    Registry.prototype.get = function () {
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        if (!path.length) {
            return this.data;
        }
        if (!this.has.apply(this, path)) {
            return null;
        }
        var last = path.pop();
        var data = this.data;
        path.forEach(function (key) {
            data = data[key];
        });
        return data[last];
    };
    Registry.prototype.has = function () {
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        if (!path.length) {
            return false;
        }
        var found = true;
        var last = path.pop();
        var data = this.data;
        path.forEach(function (key) {
            if (!found) {
                return;
            }
            if (typeof data[key] !== 'object') {
                found = false;
                return;
            }
            data = data[key];
        });
        return !(!found || typeof data[last] === 'undefined');
    };
    Registry.prototype.remove = function () {
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        if (!path.length) {
            return this;
        }
        if (!this.has.apply(this, path)) {
            return this;
        }
        var last = path.pop();
        var data = this.data;
        path.forEach(function (key) {
            data = data[key];
        });
        delete data[last];
        return this;
    };
    Registry.prototype.set = function () {
        var _this = this;
        var path = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            path[_i] = arguments[_i];
        }
        if (path.length < 1) {
            return this;
        }
        if (typeof path[0] === 'object') {
            Object.keys(path[0]).forEach(function (key) {
                _this.set(key, path[0][key]);
            });
            return this;
        }
        var value = path.pop();
        this.walk(this.data, path, value);
        return this;
    };
    Registry.prototype.makeArray = function (hash) {
        var array = [];
        var keys = Object.keys(hash);
        keys.sort();
        keys.forEach(function (key) {
            array.push(hash[key]);
        });
        return array;
    };
    Registry.prototype.makeObject = function (array) {
        return Object.assign({}, array);
    };
    Registry.prototype.shouldBeAnArray = function (hash) {
        if (typeof hash !== 'object') {
            return false;
        }
        if (!Object.keys(hash).length) {
            return false;
        }
        for (var key in hash) {
            if (isNaN(parseInt(key)) || String(key).indexOf('.') !== -1) {
                return false;
            }
        }
        return true;
    };
    Registry.prototype.walk = function (data, path, value) {
        var key = path.shift();
        if (key === null || key === '') {
            key = Object.keys(data).length;
        }
        if (typeof data[key] !== 'object') {
            data[key] = {};
        }
        if (path.length) {
            this.walk(data[key], path, value);
            if (!Array.isArray(data[key]) && this.shouldBeAnArray(data[key])) {
                data[key] = this.makeArray(data[key]);
            }
            else if (Array.isArray(data[key]) && !this.shouldBeAnArray(data[key])) {
                data[key] = this.makeObject(data[key]);
            }
            return this;
        }
        data[key] = value;
        return this;
    };
    return Registry;
}());
exports.default = Registry;
//# sourceMappingURL=Registry.js.map

/***/ }),

/***/ 850:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var TaskQueue = (function () {
    function TaskQueue() {
        this.queue = [];
        this.lower = 0;
        this.upper = 0;
    }
    Object.defineProperty(TaskQueue.prototype, "length", {
        get: function () {
            return this.queue.length;
        },
        enumerable: true,
        configurable: true
    });
    TaskQueue.prototype.add = function (callback, priority) {
        if (priority === void 0) { priority = 0; }
        if (priority > this.upper) {
            this.upper = priority;
        }
        else if (priority < this.lower) {
            this.lower = priority;
        }
        var task = { callback: callback, priority: priority };
        this.queue.push(task);
        this.queue.sort(function (a, b) {
            return a.priority <= b.priority ? 1 : -1;
        });
        return this;
    };
    TaskQueue.prototype.each = function (callback) {
        for (var _i = 0, _a = this.queue; _i < _a.length; _i++) {
            var task = _a[_i];
            if (callback(task) === false) {
                return this;
            }
        }
        return this;
    };
    TaskQueue.prototype.purge = function (callback) {
        if (typeof callback !== 'function') {
            this.queue.length = 0;
            return this;
        }
        var task;
        while (this.queue.length) {
            task = this.queue.shift();
            if (typeof callback === 'function') {
                callback(task);
            }
        }
        return this;
    };
    TaskQueue.prototype.push = function (callback) {
        return this.add(callback, this.lower - 1);
    };
    TaskQueue.prototype.shift = function (callback) {
        return this.add(callback, this.upper + 1);
    };
    TaskQueue.prototype.then = function (callback) {
        this.run().then(callback);
        return this;
    };
    TaskQueue.prototype.run = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.queue.length) {
                            return [2, TaskQueue.STATUS_EMPTY];
                        }
                        _a.label = 1;
                    case 1:
                        if (!this.queue.length) return [3, 3];
                        task = this.queue.shift();
                        return [4, task.callback.apply(task, args)];
                    case 2:
                        if ((_a.sent()) === false) {
                            return [2, TaskQueue.STATUS_INCOMPLETE];
                        }
                        return [3, 1];
                    case 3: return [2, TaskQueue.STATUS_OK];
                }
            });
        });
    };
    TaskQueue.prototype.unbind = function (callback) {
        var _this = this;
        this.queue.forEach(function (task, i) {
            if (callback === task.callback) {
                _this.queue.splice(i, 1);
            }
        });
        return this;
    };
    TaskQueue.STATUS_EMPTY = 404;
    TaskQueue.STATUS_INCOMPLETE = 308;
    TaskQueue.STATUS_OK = 200;
    return TaskQueue;
}());
exports.default = TaskQueue;
//# sourceMappingURL=TaskQueue.js.map

/***/ }),

/***/ 574:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var EventEmitter_1 = __importDefault(__webpack_require__(895));
exports.EventEmitter = EventEmitter_1.default;
var Exception_1 = __importDefault(__webpack_require__(992));
exports.Exception = Exception_1.default;
var Registry_1 = __importDefault(__webpack_require__(434));
exports.Registry = Registry_1.default;
var TaskQueue_1 = __importDefault(__webpack_require__(850));
exports.TaskQueue = TaskQueue_1.default;
var Reflection_1 = __importStar(__webpack_require__(784));
exports.Reflection = Reflection_1.default;
exports.reflect = Reflection_1.reflect;
exports.traits = Reflection_1.traits;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 68:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
class IncomingResponse extends Response {
    constructor(body, options) {
        super(body, options);
        this._serialized = {};
        this._response = new Response(body, options);
        writable.forEach((prop) => {
            this._serialized[prop] = this._response[prop];
        });
        this._body = null;
        if (typeof options !== 'undefined'
            || typeof body !== 'object'
            || (body.constructor && body.constructor.name)) {
            this._body = body;
        }
    }
    get body() {
        return this._body;
    }
    set body(body) {
        this._body = body;
        this._response = new Response(this._body, this._serialized);
        writable.forEach(prop => {
            this._serialized[prop] = this._response[prop];
        });
    }
    serialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const serialized = Object.assign({}, this._serialized);
            if (this.bodyUsed) {
                serialized.body = yield this.text();
            }
            const headers = serialized.headers;
            if (headers instanceof Headers) {
                serialized.headers = [];
                for (const [name, value] of headers) {
                    serialized.headers.push([name, value]);
                }
            }
            return serialized;
        });
    }
}
exports.default = IncomingResponse;
const descriptors = {};
const methods = [
    'arrayBuffer', 'blob', 'clone', 'error',
    'formData', 'json', 'redirect', 'text'
];
const readable = [
    'bodyUsed', 'headers', 'ok', 'redirected',
    'status', 'statusText', 'type', 'url'
];
const writable = [
    'headers', 'redirected',
    'status', 'statusText'
];
readable.forEach(prop => {
    descriptors[prop] = {
        get: function () {
            return this._response[prop];
        }
    };
});
writable.forEach(prop => {
    descriptors[prop] = Object.assign(descriptors[prop] || {}, {
        set: function (value) {
            this._serialized[prop] = value;
            this._response = new Response(this._body, this._serialized);
            writable.forEach((prop) => {
                this._serialized[prop] = this._response[prop];
            });
        }
    });
});
Object.keys(descriptors).forEach(prop => {
    Object.defineProperty(IncomingResponse.prototype, prop, descriptors[prop]);
});
methods.forEach((method) => {
    IncomingResponse.prototype[method] = function (...args) {
        return this._response[method](...args);
    };
});


/***/ }),

/***/ 581:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
class OutgoingMessage extends Request {
    constructor(input, init) {
        super(input, init);
        this._serialized = {};
        this._request = new Request(input, init);
        writable.forEach(prop => {
            this._serialized[prop] = this._request[prop];
        });
        if (init && init.body) {
            this._serialized.body = init.body;
        }
    }
    get body() {
        return this._serialized.body;
    }
    serialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const serialized = Object.assign({}, this._serialized);
            if (this.bodyUsed) {
                serialized.body = yield this.text();
            }
            const headers = serialized.headers;
            if (headers instanceof Headers) {
                serialized.headers = [];
                for (const [name, value] of headers) {
                    serialized.headers.push([name, value]);
                }
            }
            return serialized;
        });
    }
}
exports.default = OutgoingMessage;
const descriptors = {};
const methods = [
    'arrayBuffer', 'blob', 'clone',
    'formData', 'json', 'text'
];
const readable = [
    'bodyUsed', 'cache', 'credentials',
    'destination', 'headers', 'integrity',
    'method', 'mode', 'redirect',
    'referrer', 'referrerPolicy', 'url'
];
const writable = [
    'body', 'method', 'cache',
    'credentials', 'headers', 'integrity',
    'mode', 'redirect', 'referrer',
    'url'
];
readable.forEach(prop => {
    descriptors[prop] = {
        get: function () {
            return this._request[prop];
        }
    };
});
writable.forEach(prop => {
    descriptors[prop] = Object.assign(descriptors[prop] || {}, {
        set: function (value) {
            this._serialized[prop] = value;
            this._request = new Request(this._serialized.url, this._serialized);
            writable.forEach(prop => {
                this._serialized[prop] = this._request[prop];
            });
            if (prop === 'body') {
                this._serialized.body = value;
            }
        }
    });
});
Object.keys(descriptors).forEach(prop => {
    Object.defineProperty(OutgoingMessage.prototype, prop, descriptors[prop]);
});
methods.forEach(method => {
    OutgoingMessage.prototype[method] = function (...args) {
        return this._request[method](...args);
    };
});


/***/ }),

/***/ 763:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const jsm_1 = __webpack_require__(574);
class Server extends jsm_1.EventEmitter {
    constructor(handler, stateManager) {
        super();
        this._handler = handler;
        this._stateManager = stateManager;
    }
    get handler() {
        return this._handler;
    }
    get listening() {
        return this._stateManager.servers.has(this);
    }
    listen() {
        this._stateManager.add(this);
        return this;
    }
    close() {
        if (this.listening) {
            this._stateManager.remove(this);
            this.emit('close');
        }
        return this;
    }
}
exports.default = Server;


/***/ }),

/***/ 318:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Server_1 = __importDefault(__webpack_require__(763));
const OutgoingMessage_1 = __importDefault(__webpack_require__(581));
const IncomingResponse_1 = __importDefault(__webpack_require__(68));
const Storage_1 = __webpack_require__(12);
class StateManager {
    constructor(context, storage) {
        this._clickPush = function () { };
        this._currentState = -1;
        this._listening = false;
        this._servers = new Set;
        this._submitPush = function () { };
        this._context = context;
        this._location = context.location;
        this._history = context.history;
        this._originalPopState = context.onpopstate;
        this._originalPushState = this._history.pushState;
        this._storage = storage || new Storage_1.MemoryStorage;
    }
    get servers() {
        return this._servers;
    }
    pushState(state, title, href) {
        return __awaiter(this, void 0, void 0, function* () {
            this._originalPushState.call(this._history, ++this._currentState, title, href);
            const options = typeof state === 'object' ? state || {} : {};
            if (typeof state !== 'object' && typeof state !== 'undefined') {
                options.body = state;
            }
            const request = new OutgoingMessage_1.default(this._location.href, options);
            const response = new IncomingResponse_1.default;
            const item = this._storage.getItem(StateManager.StorageKey);
            const states = JSON.parse(item || '[]');
            if (this._currentState === states.length) {
                states.push({
                    request: yield request.serialize(),
                    response: yield response.serialize()
                });
            }
            else {
                states[this._currentState] = {
                    request: yield request.serialize(),
                    response: yield response.serialize()
                };
            }
            this._storage.setItem(StateManager.StorageKey, JSON.stringify(states));
            for (const server of this._servers) {
                yield server.emit('request', request, response);
                yield server.handler(request, response);
                yield server.emit('response', request, response);
            }
        });
    }
    popState(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const states = JSON.parse(this._context.localStorage.getItem(StateManager.StorageKey) || '[]');
            let request, response;
            const eventState = e.state;
            if (states[eventState]) {
                request = new OutgoingMessage_1.default(this._location.href, states[eventState].request);
                response = new IncomingResponse_1.default(states[eventState].response);
            }
            else {
                request = new OutgoingMessage_1.default(this._location.href);
                response = new IncomingResponse_1.default;
            }
            for (const server of this._servers) {
                yield server.emit('request', request, response);
                yield server.handler(request, response);
                yield server.emit('response', request, response);
            }
        });
    }
    add(server, autoStart = true) {
        if (typeof server === 'function') {
            server = new Server_1.default(server, this);
        }
        this._servers.add(server);
        if (autoStart) {
            this.start();
        }
        return server;
    }
    clickPush(e) {
        if (e.stop) {
            return;
        }
        let targetElement = e.target;
        while (targetElement != null) {
            if (targetElement.tagName.toUpperCase() !== 'A') {
                targetElement = targetElement.parentElement;
                continue;
            }
            const href = targetElement.href || '';
            if (href.indexOf(this._location.origin) === 0) {
                e.preventDefault();
                this._history.pushState({}, '', href);
            }
            break;
        }
    }
    remove(server, autoStop = true) {
        this._servers.delete(server);
        if (!this._servers.size && autoStop) {
            this.stop();
        }
        return this;
    }
    start() {
        if (this._listening) {
            return this;
        }
        this._history.pushState = this.pushState.bind(this);
        this._context.onpopstate = this.popState.bind(this);
        this._clickPush = this.clickPush.bind(this);
        this._submitPush = this.submitPush.bind(this);
        this._context.document.body.addEventListener('click', this._clickPush, true);
        this._context.document.body.addEventListener('submit', this._submitPush, true);
        this._listening = true;
        return this;
    }
    stop() {
        if (!this._listening) {
            return this;
        }
        this._history.pushState = this._originalPushState;
        this._context.onpopstate = this._originalPopState;
        this._context.document.body.removeEventListener('click', this._clickPush, true);
        this._context.document.body.removeEventListener('submit', this._submitPush, true);
        this._context.localStorage.removeItem(StateManager.StorageKey);
        this._currentState = -1;
        this._listening = false;
        return this;
    }
    submitPush(e) {
        if (e.stop) {
            return;
        }
        let targetElement = e.target;
        while (targetElement != null) {
            if (targetElement.tagName.toUpperCase() !== 'FORM') {
                targetElement = targetElement.parentElement;
                continue;
            }
            const action = targetElement.getAttribute('action')
                || this._location.href;
            if (action.indexOf('://') !== -1
                && action.indexOf(this._location.origin) !== 0) {
                break;
            }
            e.preventDefault();
            const state = {
                method: targetElement.getAttribute('method') || 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': targetElement.getAttribute('enctype')
                        || 'application/x-www-form-urlencoded'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: new FormData(targetElement)
            };
            this._history.pushState(state, '', action);
            break;
        }
    }
}
exports.default = StateManager;
StateManager.StorageKey = '__http_server_states';


/***/ }),

/***/ 12:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemoryStorage = void 0;
class MemoryStorage {
    constructor() {
        this._store = {};
    }
    getItem(name) {
        return this._store[name] || null;
    }
    removeItem(name) {
        delete this._store[name];
    }
    setItem(name, value) {
        if (value && typeof value === 'object'
            || typeof value === 'function') {
            value = value.toString();
        }
        this._store[name] = value;
    }
}
exports.MemoryStorage = MemoryStorage;


/***/ }),

/***/ 722:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const _1 = __importDefault(__webpack_require__(607));
(function (ctx) {
    const stateManager = new _1.default.StateManager(ctx, ctx.localStorage);
    _1.default.createServer = function (handler) {
        return stateManager.add(handler, false);
    };
    ctx.http = _1.default;
})(window);


/***/ }),

/***/ 607:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Server_1 = __importDefault(__webpack_require__(763));
const IncomingResponse_1 = __importDefault(__webpack_require__(68));
const OutgoingMessage_1 = __importDefault(__webpack_require__(581));
const StateManager_1 = __importDefault(__webpack_require__(318));
const Storage_1 = __webpack_require__(12);
exports.default = {
    Server: Server_1.default,
    IncomingResponse: IncomingResponse_1.default,
    OutgoingMessage: OutgoingMessage_1.default,
    StateManager: StateManager_1.default,
    MemoryStorage: Storage_1.MemoryStorage
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(722);
/******/ 	
/******/ })()
;