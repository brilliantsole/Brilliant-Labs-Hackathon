/**
 * @copyright Zack Qattan 2024
 * @license MIT
 */
import autoBind$1 from 'auto-bind';
import * as webbluetooth from 'webbluetooth';
import noble from '@abandonware/noble';

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const isInProduction = "__BRILLIANTSOLE__PROD__" == "__BRILLIANTSOLE__PROD__";
const isInDev = "__BRILLIANTSOLE__PROD__" == "__BRILLIANTSOLE__DEV__";
const isInBrowser = typeof window !== "undefined" && typeof window?.document !== "undefined";
const isInNode = typeof process !== "undefined" && process?.versions?.node != null;
const userAgent = (isInBrowser && navigator.userAgent) || "";
let isBluetoothSupported = false;
if (isInBrowser) {
    isBluetoothSupported = Boolean(navigator.bluetooth);
}
else if (isInNode) {
    isBluetoothSupported = true;
}
const isInBluefy = isInBrowser && /Bluefy/i.test(userAgent);
const isInWebBLE = isInBrowser && /WebBLE/i.test(userAgent);
const isAndroid = isInBrowser && /Android/i.test(userAgent);
const isSafari = isInBrowser && /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
const isIOS = isInBrowser && /iPad|iPhone|iPod/i.test(userAgent);
const isMac = isInBrowser && /Macintosh/i.test(userAgent);
const isInLensStudio = !isInBrowser && !isInNode && typeof global !== "undefined" && typeof Studio !== "undefined";

var environment = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isAndroid: isAndroid,
    get isBluetoothSupported () { return isBluetoothSupported; },
    isIOS: isIOS,
    isInBluefy: isInBluefy,
    isInBrowser: isInBrowser,
    isInDev: isInDev,
    isInLensStudio: isInLensStudio,
    isInNode: isInNode,
    isInProduction: isInProduction,
    isInWebBLE: isInWebBLE,
    isMac: isMac,
    isSafari: isSafari
});

var _a$7, _Console_consoles, _Console_levelFlags;
var __console;
if (isInLensStudio) {
    const log = function (...args) {
        Studio.log(args.map((value) => new String(value)).join(","));
    };
    __console = {};
    __console.log = log;
    __console.warn = log.bind(__console, "WARNING");
    __console.error = log.bind(__console, "ERROR");
}
else {
    __console = console;
}
if (!__console.assert) {
    const assert = (condition, ...data) => {
        if (!condition) {
            __console.warn(...data);
        }
    };
    __console.assert = assert;
}
if (!__console.table) {
    const table = (...data) => {
        __console.log(...data);
    };
    __console.table = table;
}
function emptyFunction() { }
const log = __console.log.bind(__console);
const warn = __console.warn.bind(__console);
const error = __console.error.bind(__console);
const table = __console.table.bind(__console);
const assert = __console.assert.bind(__console);
class Console {
    constructor(type) {
        _Console_levelFlags.set(this, {
            log: isInDev,
            warn: isInDev,
            assert: true,
            error: true,
            table: true,
        });
        if (__classPrivateFieldGet(_a$7, _a$7, "f", _Console_consoles)[type]) {
            throw new Error(`"${type}" console already exists`);
        }
        __classPrivateFieldGet(_a$7, _a$7, "f", _Console_consoles)[type] = this;
    }
    setLevelFlags(levelFlags) {
        Object.assign(__classPrivateFieldGet(this, _Console_levelFlags, "f"), levelFlags);
    }
    static setLevelFlagsForType(type, levelFlags) {
        if (!__classPrivateFieldGet(this, _a$7, "f", _Console_consoles)[type]) {
            throw new Error(`no console found with type "${type}"`);
        }
        __classPrivateFieldGet(this, _a$7, "f", _Console_consoles)[type].setLevelFlags(levelFlags);
    }
    static setAllLevelFlags(levelFlags) {
        for (const type in __classPrivateFieldGet(this, _a$7, "f", _Console_consoles)) {
            __classPrivateFieldGet(this, _a$7, "f", _Console_consoles)[type].setLevelFlags(levelFlags);
        }
    }
    static create(type, levelFlags) {
        const console = __classPrivateFieldGet(this, _a$7, "f", _Console_consoles)[type] || new _a$7(type);
        return console;
    }
    get log() {
        return __classPrivateFieldGet(this, _Console_levelFlags, "f").log ? log : emptyFunction;
    }
    get warn() {
        return __classPrivateFieldGet(this, _Console_levelFlags, "f").warn ? warn : emptyFunction;
    }
    get error() {
        return __classPrivateFieldGet(this, _Console_levelFlags, "f").error ? error : emptyFunction;
    }
    get assert() {
        return __classPrivateFieldGet(this, _Console_levelFlags, "f").assert ? assert : emptyFunction;
    }
    get table() {
        return __classPrivateFieldGet(this, _Console_levelFlags, "f").table ? table : emptyFunction;
    }
    assertWithError(condition, message) {
        if (!Boolean(condition)) {
            throw new Error(message);
        }
    }
    assertTypeWithError(value, type) {
        this.assertWithError(typeof value == type, `value ${value} of type "${typeof value}" not of type "${type}"`);
    }
    assertEnumWithError(value, enumeration) {
        this.assertWithError(enumeration.includes(value), `invalid enum "${value}"`);
    }
}
_a$7 = Console, _Console_levelFlags = new WeakMap();
_Console_consoles = { value: {} };
function createConsole(type, levelFlags) {
    return Console.create(type, levelFlags);
}
function setConsoleLevelFlagsForType(type, levelFlags) {
    Console.setLevelFlagsForType(type, levelFlags);
}
function setAllConsoleLevelFlags(levelFlags) {
    Console.setAllLevelFlags(levelFlags);
}

const _console$x = createConsole("EventDispatcher", { log: false });
class EventDispatcher {
    constructor(target, validEventTypes) {
        this.target = target;
        this.validEventTypes = validEventTypes;
        this.listeners = {};
        this.addEventListener = this.addEventListener.bind(this);
        this.removeEventListener = this.removeEventListener.bind(this);
        this.dispatchEvent = this.dispatchEvent.bind(this);
        this.waitForEvent = this.waitForEvent.bind(this);
    }
    isValidEventType(type) {
        return this.validEventTypes.includes(type);
    }
    addEventListener(type, listener, options = { once: false }) {
        if (!this.isValidEventType(type)) {
            throw new Error(`Invalid event type: ${type}`);
        }
        if (!this.listeners[type]) {
            this.listeners[type] = [];
            _console$x.log(`creating "${type}" listeners array`, this.listeners[type]);
        }
        _console$x.log(`adding "${type}" listener`, listener, options);
        this.listeners[type].push({ listener, once: options.once });
    }
    removeEventListener(type, listener) {
        if (!this.isValidEventType(type)) {
            throw new Error(`Invalid event type: ${type}`);
        }
        if (!this.listeners[type])
            return;
        _console$x.log(`removing "${type}" listener`, listener);
        this.listeners[type] = this.listeners[type].filter((l) => l.listener !== listener);
    }
    dispatchEvent(type, message) {
        if (!this.isValidEventType(type)) {
            throw new Error(`Invalid event type: ${type}`);
        }
        if (!this.listeners[type])
            return;
        const listeners = this.listeners[type];
        this.listeners[type] = listeners.filter((listenerObj) => {
            listenerObj.listener({ type, target: this.target, message });
            if (listenerObj.once) {
                _console$x.log(`removing "${type}" listener`, listenerObj);
                return false;
            }
            return true;
        });
    }
    waitForEvent(type) {
        return new Promise((resolve) => {
            const onceListener = (event) => {
                resolve(event);
            };
            this.addEventListener(type, onceListener, { once: true });
        });
    }
}

var _Timer_callback, _Timer_interval, _Timer_intervalId;
const _console$w = createConsole("Timer", { log: false });
class Timer {
    get callback() {
        return __classPrivateFieldGet(this, _Timer_callback, "f");
    }
    set callback(newCallback) {
        _console$w.assertTypeWithError(newCallback, "function");
        _console$w.log({ newCallback });
        __classPrivateFieldSet(this, _Timer_callback, newCallback, "f");
        if (this.isRunning) {
            this.restart();
        }
    }
    get interval() {
        return __classPrivateFieldGet(this, _Timer_interval, "f");
    }
    set interval(newInterval) {
        _console$w.assertTypeWithError(newInterval, "number");
        _console$w.assertWithError(newInterval > 0, "interval must be above 0");
        _console$w.log({ newInterval });
        __classPrivateFieldSet(this, _Timer_interval, newInterval, "f");
        if (this.isRunning) {
            this.restart();
        }
    }
    constructor(callback, interval) {
        _Timer_callback.set(this, void 0);
        _Timer_interval.set(this, void 0);
        _Timer_intervalId.set(this, void 0);
        this.interval = interval;
        this.callback = callback;
    }
    get isRunning() {
        return __classPrivateFieldGet(this, _Timer_intervalId, "f") != undefined;
    }
    start() {
        if (this.isRunning) {
            _console$w.log("interval already running");
            return;
        }
        _console$w.log("starting interval");
        __classPrivateFieldSet(this, _Timer_intervalId, setInterval(__classPrivateFieldGet(this, _Timer_callback, "f"), __classPrivateFieldGet(this, _Timer_interval, "f")), "f");
    }
    stop() {
        if (!this.isRunning) {
            _console$w.log("interval already not running");
            return;
        }
        _console$w.log("stopping interval");
        clearInterval(__classPrivateFieldGet(this, _Timer_intervalId, "f"));
        __classPrivateFieldSet(this, _Timer_intervalId, undefined, "f");
    }
    restart() {
        this.stop();
        this.start();
    }
}
_Timer_callback = new WeakMap(), _Timer_interval = new WeakMap(), _Timer_intervalId = new WeakMap();

createConsole("checksum", { log: true });
function crc32ForByte(r) {
    for (let j = 0; j < 8; ++j) {
        r = (r & 1 ? 0 : 0xedb88320) ^ (r >>> 1);
    }
    return r ^ 0xff000000;
}
const tableSize = 256;
const crc32Table = new Uint32Array(tableSize);
for (let i = 0; i < tableSize; ++i) {
    crc32Table[i] = crc32ForByte(i);
}
function crc32(dataIterable) {
    let dataBytes = new Uint8Array(dataIterable);
    let crc = 0;
    for (let i = 0; i < dataBytes.byteLength; ++i) {
        const crcLowByte = crc & 0x000000ff;
        const dataByte = dataBytes[i];
        const tableIndex = crcLowByte ^ dataByte;
        crc = (crc32Table[tableIndex] ^ (crc >>> 8)) >>> 0;
    }
    return crc;
}

var _TextEncoder;
if (typeof TextEncoder == "undefined") {
    _TextEncoder = class {
        encode(string) {
            const encoding = Array.from(string).map((char) => char.charCodeAt(0));
            return Uint8Array.from(encoding);
        }
    };
}
else {
    _TextEncoder = TextEncoder;
}
var _TextDecoder;
if (typeof TextDecoder == "undefined") {
    _TextDecoder = class {
        decode(data) {
            const byteArray = Array.from(new Uint8Array(data));
            return byteArray
                .map((value) => {
                return String.fromCharCode(value);
            })
                .join("");
        }
    };
}
else {
    _TextDecoder = TextDecoder;
}
const textEncoder = new _TextEncoder();
const textDecoder = new _TextDecoder();

const _console$v = createConsole("ArrayBufferUtils", { log: false });
function concatenateArrayBuffers(...arrayBuffers) {
    arrayBuffers = arrayBuffers.filter((arrayBuffer) => arrayBuffer != undefined || arrayBuffer != null);
    arrayBuffers = arrayBuffers.map((arrayBuffer) => {
        if (typeof arrayBuffer == "number") {
            const number = arrayBuffer;
            return Uint8Array.from([Math.floor(number)]);
        }
        else if (typeof arrayBuffer == "boolean") {
            const boolean = arrayBuffer;
            return Uint8Array.from([boolean ? 1 : 0]);
        }
        else if (typeof arrayBuffer == "string") {
            const string = arrayBuffer;
            return stringToArrayBuffer(string);
        }
        else if (arrayBuffer instanceof Array) {
            const array = arrayBuffer;
            return concatenateArrayBuffers(...array);
        }
        else if (arrayBuffer instanceof ArrayBuffer) {
            return arrayBuffer;
        }
        else if ("buffer" in arrayBuffer && arrayBuffer.buffer instanceof ArrayBuffer) {
            const bufferContainer = arrayBuffer;
            return bufferContainer.buffer;
        }
        else if (arrayBuffer instanceof DataView) {
            const dataView = arrayBuffer;
            return dataView.buffer;
        }
        else if (typeof arrayBuffer == "object") {
            const object = arrayBuffer;
            return objectToArrayBuffer(object);
        }
        else {
            return arrayBuffer;
        }
    });
    arrayBuffers = arrayBuffers.filter((arrayBuffer) => arrayBuffer && "byteLength" in arrayBuffer);
    const length = arrayBuffers.reduce((length, arrayBuffer) => length + arrayBuffer.byteLength, 0);
    const uint8Array = new Uint8Array(length);
    let byteOffset = 0;
    arrayBuffers.forEach((arrayBuffer) => {
        uint8Array.set(new Uint8Array(arrayBuffer), byteOffset);
        byteOffset += arrayBuffer.byteLength;
    });
    return uint8Array.buffer;
}
function dataToArrayBuffer(data) {
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}
function stringToArrayBuffer(string) {
    const encoding = textEncoder.encode(string);
    return concatenateArrayBuffers(encoding.byteLength, encoding);
}
function objectToArrayBuffer(object) {
    return stringToArrayBuffer(JSON.stringify(object));
}
function sliceDataView(dataView, begin, length) {
    let end;
    if (length != undefined) {
        end = dataView.byteOffset + begin + length;
    }
    _console$v.log({ dataView, begin, end, length });
    return new DataView(dataView.buffer.slice(dataView.byteOffset + begin, end));
}
async function getFileBuffer(file) {
    let fileBuffer;
    if (file instanceof Array) {
        fileBuffer = Uint8Array.from(file);
    }
    else if (file instanceof DataView) {
        fileBuffer = file.buffer;
    }
    else if (typeof file == "string" || file instanceof URL) {
        const response = await fetch(file);
        fileBuffer = await response.arrayBuffer();
    }
    else if (file instanceof File) {
        fileBuffer = await file.arrayBuffer();
    }
    else if (file instanceof ArrayBuffer) {
        fileBuffer = file;
    }
    else {
        throw { error: "invalid file type", file };
    }
    return fileBuffer;
}

var _FileTransferManager_instances, _a$6, _FileTransferManager_dispatchEvent_get, _FileTransferManager_assertValidType, _FileTransferManager_assertValidTypeEnum, _FileTransferManager_assertValidStatusEnum, _FileTransferManager_assertValidCommand, _FileTransferManager_MaxLength, _FileTransferManager_maxLength, _FileTransferManager_parseMaxLength, _FileTransferManager_updateMaxLength, _FileTransferManager_assertValidLength, _FileTransferManager_type, _FileTransferManager_parseType, _FileTransferManager_updateType, _FileTransferManager_setType, _FileTransferManager_length, _FileTransferManager_parseLength, _FileTransferManager_updateLength, _FileTransferManager_setLength, _FileTransferManager_checksum, _FileTransferManager_parseChecksum, _FileTransferManager_updateChecksum, _FileTransferManager_setChecksum, _FileTransferManager_setCommand, _FileTransferManager_status, _FileTransferManager_parseStatus, _FileTransferManager_updateStatus, _FileTransferManager_assertIsIdle, _FileTransferManager_assertIsNotIdle, _FileTransferManager_receivedBlocks, _FileTransferManager_parseBlock, _FileTransferManager_send, _FileTransferManager_sendBlock;
const _console$u = createConsole("FileTransferManager", { log: true });
const FileTransferMessageTypes = [
    "maxFileLength",
    "getFileType",
    "setFileType",
    "getFileLength",
    "setFileLength",
    "getFileChecksum",
    "setFileChecksum",
    "setFileTransferCommand",
    "fileTransferStatus",
    "getFileBlock",
    "setFileBlock",
];
const FileTypes = ["tflite"];
const FileTransferStatuses = ["idle", "sending", "receiving"];
const FileTransferCommands = ["startSend", "startReceive", "cancel"];
const FileTransferDirections = ["sending", "receiving"];
const FileTransferEventTypes = [
    ...FileTransferMessageTypes,
    "fileTransferProgress",
    "fileTransferComplete",
    "fileReceived",
];
class FileTransferManager {
    constructor() {
        _FileTransferManager_instances.add(this);
        _FileTransferManager_maxLength.set(this, _a$6.MaxLength);
        _FileTransferManager_type.set(this, void 0);
        _FileTransferManager_length.set(this, 0);
        _FileTransferManager_checksum.set(this, 0);
        _FileTransferManager_status.set(this, "idle");
        _FileTransferManager_receivedBlocks.set(this, []);
        autoBind$1(this);
    }
    get addEventListener() {
        return this.eventDispatcher.addEventListener;
    }
    get removeEventListener() {
        return this.eventDispatcher.removeEventListener;
    }
    get waitForEvent() {
        return this.eventDispatcher.waitForEvent;
    }
    static get MaxLength() {
        return __classPrivateFieldGet(this, _a$6, "f", _FileTransferManager_MaxLength);
    }
    get maxLength() {
        return __classPrivateFieldGet(this, _FileTransferManager_maxLength, "f");
    }
    get type() {
        return __classPrivateFieldGet(this, _FileTransferManager_type, "f");
    }
    get length() {
        return __classPrivateFieldGet(this, _FileTransferManager_length, "f");
    }
    get checksum() {
        return __classPrivateFieldGet(this, _FileTransferManager_checksum, "f");
    }
    get status() {
        return __classPrivateFieldGet(this, _FileTransferManager_status, "f");
    }
    parseMessage(messageType, dataView) {
        _console$u.log({ messageType });
        switch (messageType) {
            case "maxFileLength":
                __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_parseMaxLength).call(this, dataView);
                break;
            case "getFileType":
            case "setFileType":
                __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_parseType).call(this, dataView);
                break;
            case "getFileLength":
            case "setFileLength":
                __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_parseLength).call(this, dataView);
                break;
            case "getFileChecksum":
            case "setFileChecksum":
                __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_parseChecksum).call(this, dataView);
                break;
            case "fileTransferStatus":
                __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_parseStatus).call(this, dataView);
                break;
            case "getFileBlock":
                __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_parseBlock).call(this, dataView);
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
    async send(type, file) {
        __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertIsIdle).call(this);
        __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidType).call(this, type);
        const fileBuffer = await getFileBuffer(file);
        const promises = [];
        promises.push(__classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setType).call(this, type, false));
        const fileLength = fileBuffer.byteLength;
        promises.push(__classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setLength).call(this, fileLength, false));
        const checksum = crc32(fileBuffer);
        promises.push(__classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setChecksum).call(this, checksum, false));
        promises.push(__classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setCommand).call(this, "startSend", false));
        this.sendMessage();
        await Promise.all(promises);
        await __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_send).call(this, fileBuffer);
    }
    async receive(type) {
        __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertIsIdle).call(this);
        __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidType).call(this, type);
        await __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setType).call(this, type);
        await __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setCommand).call(this, "startReceive");
    }
    async cancel() {
        __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertIsNotIdle).call(this);
        await __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_setCommand).call(this, "cancel");
    }
}
_a$6 = FileTransferManager, _FileTransferManager_maxLength = new WeakMap(), _FileTransferManager_type = new WeakMap(), _FileTransferManager_length = new WeakMap(), _FileTransferManager_checksum = new WeakMap(), _FileTransferManager_status = new WeakMap(), _FileTransferManager_receivedBlocks = new WeakMap(), _FileTransferManager_instances = new WeakSet(), _FileTransferManager_dispatchEvent_get = function _FileTransferManager_dispatchEvent_get() {
    return this.eventDispatcher.dispatchEvent;
}, _FileTransferManager_assertValidType = function _FileTransferManager_assertValidType(type) {
    _console$u.assertEnumWithError(type, FileTypes);
}, _FileTransferManager_assertValidTypeEnum = function _FileTransferManager_assertValidTypeEnum(typeEnum) {
    _console$u.assertWithError(typeEnum in FileTypes, `invalid typeEnum ${typeEnum}`);
}, _FileTransferManager_assertValidStatusEnum = function _FileTransferManager_assertValidStatusEnum(statusEnum) {
    _console$u.assertWithError(statusEnum in FileTransferStatuses, `invalid statusEnum ${statusEnum}`);
}, _FileTransferManager_assertValidCommand = function _FileTransferManager_assertValidCommand(command) {
    _console$u.assertEnumWithError(command, FileTransferCommands);
}, _FileTransferManager_parseMaxLength = function _FileTransferManager_parseMaxLength(dataView) {
    _console$u.log("parseFileMaxLength", dataView);
    const maxLength = dataView.getUint32(0, true);
    _console$u.log(`maxLength: ${maxLength / 1024}kB`);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_updateMaxLength).call(this, maxLength);
}, _FileTransferManager_updateMaxLength = function _FileTransferManager_updateMaxLength(maxLength) {
    _console$u.log({ maxLength });
    __classPrivateFieldSet(this, _FileTransferManager_maxLength, maxLength, "f");
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "maxFileLength", { maxFileLength: maxLength });
}, _FileTransferManager_assertValidLength = function _FileTransferManager_assertValidLength(length) {
    _console$u.assertWithError(length <= this.maxLength, `file length ${length}kB too large - must be ${this.maxLength}kB or less`);
}, _FileTransferManager_parseType = function _FileTransferManager_parseType(dataView) {
    _console$u.log("parseFileType", dataView);
    const typeEnum = dataView.getUint8(0);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidTypeEnum).call(this, typeEnum);
    const type = FileTypes[typeEnum];
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_updateType).call(this, type);
}, _FileTransferManager_updateType = function _FileTransferManager_updateType(type) {
    _console$u.log({ fileTransferType: type });
    __classPrivateFieldSet(this, _FileTransferManager_type, type, "f");
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "getFileType", { fileType: type });
}, _FileTransferManager_setType = async function _FileTransferManager_setType(newType, sendImmediately) {
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidType).call(this, newType);
    if (this.type == newType) {
        _console$u.log(`redundant type assignment ${newType}`);
        return;
    }
    const promise = this.waitForEvent("getFileType");
    const typeEnum = FileTypes.indexOf(newType);
    this.sendMessage([{ type: "setFileType", data: Uint8Array.from([typeEnum]).buffer }], sendImmediately);
    await promise;
}, _FileTransferManager_parseLength = function _FileTransferManager_parseLength(dataView) {
    _console$u.log("parseFileLength", dataView);
    const length = dataView.getUint32(0, true);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_updateLength).call(this, length);
}, _FileTransferManager_updateLength = function _FileTransferManager_updateLength(length) {
    _console$u.log(`length: ${length / 1024}kB`);
    __classPrivateFieldSet(this, _FileTransferManager_length, length, "f");
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "getFileLength", { fileLength: length });
}, _FileTransferManager_setLength = async function _FileTransferManager_setLength(newLength, sendImmediately) {
    _console$u.assertTypeWithError(newLength, "number");
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidLength).call(this, newLength);
    if (this.length == newLength) {
        _console$u.log(`redundant length assignment ${newLength}`);
        return;
    }
    const promise = this.waitForEvent("getFileLength");
    const dataView = new DataView(new ArrayBuffer(4));
    dataView.setUint32(0, newLength, true);
    this.sendMessage([{ type: "setFileLength", data: dataView.buffer }], sendImmediately);
    await promise;
}, _FileTransferManager_parseChecksum = function _FileTransferManager_parseChecksum(dataView) {
    _console$u.log("checksum", dataView);
    const checksum = dataView.getUint32(0, true);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_updateChecksum).call(this, checksum);
}, _FileTransferManager_updateChecksum = function _FileTransferManager_updateChecksum(checksum) {
    _console$u.log({ checksum });
    __classPrivateFieldSet(this, _FileTransferManager_checksum, checksum, "f");
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "getFileChecksum", { fileChecksum: checksum });
}, _FileTransferManager_setChecksum = async function _FileTransferManager_setChecksum(newChecksum, sendImmediately) {
    _console$u.assertTypeWithError(newChecksum, "number");
    if (this.checksum == newChecksum) {
        _console$u.log(`redundant checksum assignment ${newChecksum}`);
        return;
    }
    const promise = this.waitForEvent("getFileChecksum");
    const dataView = new DataView(new ArrayBuffer(4));
    dataView.setUint32(0, newChecksum, true);
    this.sendMessage([{ type: "setFileChecksum", data: dataView.buffer }], sendImmediately);
    await promise;
}, _FileTransferManager_setCommand = async function _FileTransferManager_setCommand(command, sendImmediately) {
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidCommand).call(this, command);
    const promise = this.waitForEvent("fileTransferStatus");
    const commandEnum = FileTransferCommands.indexOf(command);
    this.sendMessage([{ type: "setFileTransferCommand", data: Uint8Array.from([commandEnum]).buffer }], sendImmediately);
    await promise;
}, _FileTransferManager_parseStatus = function _FileTransferManager_parseStatus(dataView) {
    _console$u.log("parseFileStatus", dataView);
    const statusEnum = dataView.getUint8(0);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_assertValidStatusEnum).call(this, statusEnum);
    const status = FileTransferStatuses[statusEnum];
    __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_updateStatus).call(this, status);
}, _FileTransferManager_updateStatus = function _FileTransferManager_updateStatus(status) {
    _console$u.log({ status });
    __classPrivateFieldSet(this, _FileTransferManager_status, status, "f");
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "fileTransferStatus", { fileTransferStatus: status });
    __classPrivateFieldGet(this, _FileTransferManager_receivedBlocks, "f").length = 0;
}, _FileTransferManager_assertIsIdle = function _FileTransferManager_assertIsIdle() {
    _console$u.assertWithError(__classPrivateFieldGet(this, _FileTransferManager_status, "f") == "idle", "status is not idle");
}, _FileTransferManager_assertIsNotIdle = function _FileTransferManager_assertIsNotIdle() {
    _console$u.assertWithError(__classPrivateFieldGet(this, _FileTransferManager_status, "f") != "idle", "status is idle");
}, _FileTransferManager_parseBlock = async function _FileTransferManager_parseBlock(dataView) {
    _console$u.log("parseFileBlock", dataView);
    __classPrivateFieldGet(this, _FileTransferManager_receivedBlocks, "f").push(dataView.buffer);
    const bytesReceived = __classPrivateFieldGet(this, _FileTransferManager_receivedBlocks, "f").reduce((sum, arrayBuffer) => (sum += arrayBuffer.byteLength), 0);
    const progress = bytesReceived / __classPrivateFieldGet(this, _FileTransferManager_length, "f");
    _console$u.log(`received ${bytesReceived} of ${__classPrivateFieldGet(this, _FileTransferManager_length, "f")} bytes (${progress * 100}%)`);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "fileTransferProgress", { progress });
    if (bytesReceived != __classPrivateFieldGet(this, _FileTransferManager_length, "f")) {
        return;
    }
    _console$u.log("file transfer complete");
    let fileName = new Date().toLocaleString();
    switch (this.type) {
        case "tflite":
            fileName += ".tflite";
            break;
    }
    let file;
    if (typeof File !== "undefined") {
        file = new File(__classPrivateFieldGet(this, _FileTransferManager_receivedBlocks, "f"), fileName);
    }
    else {
        file = new Blob(__classPrivateFieldGet(this, _FileTransferManager_receivedBlocks, "f"));
    }
    const arrayBuffer = await file.arrayBuffer();
    const checksum = crc32(arrayBuffer);
    _console$u.log({ checksum });
    if (checksum != __classPrivateFieldGet(this, _FileTransferManager_checksum, "f")) {
        _console$u.error(`wrong checksum - expected ${__classPrivateFieldGet(this, _FileTransferManager_checksum, "f")}, got ${checksum}`);
        return;
    }
    _console$u.log("received file", file);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "getFileBlock", { fileTransferBlock: dataView });
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "fileTransferComplete", { direction: "receiving" });
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "fileReceived", { file });
}, _FileTransferManager_send = async function _FileTransferManager_send(buffer) {
    return __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_sendBlock).call(this, buffer);
}, _FileTransferManager_sendBlock = async function _FileTransferManager_sendBlock(buffer, offset = 0) {
    if (this.status != "sending") {
        return;
    }
    const slicedBuffer = buffer.slice(offset, offset + (this.mtu - 3 - 3));
    _console$u.log("slicedBuffer", slicedBuffer);
    const bytesLeft = buffer.byteLength - offset;
    const progress = 1 - bytesLeft / buffer.byteLength;
    _console$u.log(`sending bytes ${offset}-${offset + slicedBuffer.byteLength} of ${buffer.byteLength} bytes (${progress * 100}%)`);
    __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "fileTransferProgress", { progress });
    if (slicedBuffer.byteLength == 0) {
        _console$u.log("finished sending buffer");
        __classPrivateFieldGet(this, _FileTransferManager_instances, "a", _FileTransferManager_dispatchEvent_get).call(this, "fileTransferComplete", { direction: "sending" });
    }
    else {
        await this.sendMessage([{ type: "setFileBlock", data: slicedBuffer }]);
        return __classPrivateFieldGet(this, _FileTransferManager_instances, "m", _FileTransferManager_sendBlock).call(this, buffer, offset + slicedBuffer.byteLength);
    }
};
_FileTransferManager_MaxLength = { value: 0 };

const _console$t = createConsole("MathUtils", { log: true });
const Uint16Max = 2 ** 16;
function removeLower2Bytes(number) {
    const lower2Bytes = number % Uint16Max;
    return number - lower2Bytes;
}
const timestampThreshold = 60_000;
function parseTimestamp(dataView, byteOffset) {
    const now = Date.now();
    const nowWithoutLower2Bytes = removeLower2Bytes(now);
    const lower2Bytes = dataView.getUint16(byteOffset, true);
    let timestamp = nowWithoutLower2Bytes + lower2Bytes;
    if (Math.abs(now - timestamp) > timestampThreshold) {
        _console$t.log("correcting timestamp delta");
        timestamp += Uint16Max * Math.sign(now - timestamp);
    }
    return timestamp;
}

var _RangeHelper_range;
const initialRange = { min: Infinity, max: -Infinity, range: 0 };
class RangeHelper {
    constructor() {
        _RangeHelper_range.set(this, Object.assign({}, initialRange));
    }
    reset() {
        Object.assign(__classPrivateFieldGet(this, _RangeHelper_range, "f"), initialRange);
    }
    update(value) {
        __classPrivateFieldGet(this, _RangeHelper_range, "f").min = Math.min(value, __classPrivateFieldGet(this, _RangeHelper_range, "f").min);
        __classPrivateFieldGet(this, _RangeHelper_range, "f").max = Math.max(value, __classPrivateFieldGet(this, _RangeHelper_range, "f").max);
        __classPrivateFieldGet(this, _RangeHelper_range, "f").range = __classPrivateFieldGet(this, _RangeHelper_range, "f").max - __classPrivateFieldGet(this, _RangeHelper_range, "f").min;
    }
    getNormalization(value) {
        return __classPrivateFieldGet(this, _RangeHelper_range, "f").range * value || 0;
    }
    updateAndGetNormalization(value) {
        this.update(value);
        return this.getNormalization(value);
    }
}
_RangeHelper_range = new WeakMap();

var _CenterOfPressureHelper_range;
class CenterOfPressureHelper {
    constructor() {
        _CenterOfPressureHelper_range.set(this, {
            x: new RangeHelper(),
            y: new RangeHelper(),
        });
    }
    reset() {
        __classPrivateFieldGet(this, _CenterOfPressureHelper_range, "f").x.reset();
        __classPrivateFieldGet(this, _CenterOfPressureHelper_range, "f").y.reset();
    }
    update(centerOfPressure) {
        __classPrivateFieldGet(this, _CenterOfPressureHelper_range, "f").x.update(centerOfPressure.x);
        __classPrivateFieldGet(this, _CenterOfPressureHelper_range, "f").y.update(centerOfPressure.y);
    }
    getNormalization(centerOfPressure) {
        return {
            x: __classPrivateFieldGet(this, _CenterOfPressureHelper_range, "f").x.getNormalization(centerOfPressure.x),
            y: __classPrivateFieldGet(this, _CenterOfPressureHelper_range, "f").y.getNormalization(centerOfPressure.y),
        };
    }
    updateAndGetNormalization(centerOfPressure) {
        this.update(centerOfPressure);
        return this.getNormalization(centerOfPressure);
    }
}
_CenterOfPressureHelper_range = new WeakMap();

function createArray(arrayLength, objectOrCallback) {
    return new Array(arrayLength).fill(1).map((_, index) => {
        if (typeof objectOrCallback == "function") {
            const callback = objectOrCallback;
            return callback(index);
        }
        else {
            const object = objectOrCallback;
            return Object.assign({}, object);
        }
    });
}
function arrayWithoutDuplicates(array) {
    return array.filter((value, index) => array.indexOf(value) == index);
}

var _PressureSensorDataManager_positions, _PressureSensorDataManager_sensorRangeHelpers, _PressureSensorDataManager_centerOfPressureHelper;
const _console$s = createConsole("PressureDataManager", { log: true });
const PressureSensorTypes = ["pressure"];
const ContinuousPressureSensorTypes = PressureSensorTypes;
const DefaultNumberOfPressureSensors = 8;
class PressureSensorDataManager {
    constructor() {
        _PressureSensorDataManager_positions.set(this, []);
        _PressureSensorDataManager_sensorRangeHelpers.set(this, void 0);
        _PressureSensorDataManager_centerOfPressureHelper.set(this, new CenterOfPressureHelper());
    }
    get positions() {
        return __classPrivateFieldGet(this, _PressureSensorDataManager_positions, "f");
    }
    get numberOfSensors() {
        return this.positions.length;
    }
    parsePositions(dataView) {
        const positions = [];
        for (let pressureSensorIndex = 0, byteOffset = 0; byteOffset < dataView.byteLength; pressureSensorIndex++, byteOffset += 2) {
            positions.push({
                x: dataView.getUint8(byteOffset) / 2 ** 8,
                y: dataView.getUint8(byteOffset + 1) / 2 ** 8,
            });
        }
        _console$s.log({ positions });
        __classPrivateFieldSet(this, _PressureSensorDataManager_positions, positions, "f");
        __classPrivateFieldSet(this, _PressureSensorDataManager_sensorRangeHelpers, createArray(this.numberOfSensors, () => new RangeHelper()), "f");
        this.resetRange();
    }
    resetRange() {
        __classPrivateFieldGet(this, _PressureSensorDataManager_sensorRangeHelpers, "f").forEach((rangeHelper) => rangeHelper.reset());
        __classPrivateFieldGet(this, _PressureSensorDataManager_centerOfPressureHelper, "f").reset();
    }
    parseData(dataView, scalar) {
        const pressure = { sensors: [], scaledSum: 0, normalizedSum: 0 };
        for (let index = 0, byteOffset = 0; byteOffset < dataView.byteLength; index++, byteOffset += 2) {
            const rawValue = dataView.getUint16(byteOffset, true);
            const scaledValue = rawValue * scalar;
            const rangeHelper = __classPrivateFieldGet(this, _PressureSensorDataManager_sensorRangeHelpers, "f")[index];
            const normalizedValue = rangeHelper.updateAndGetNormalization(scaledValue);
            const position = this.positions[index];
            pressure.sensors[index] = { rawValue, scaledValue, normalizedValue, position, weightedValue: 0 };
            pressure.scaledSum += scaledValue;
            pressure.normalizedSum += normalizedValue / this.numberOfSensors;
        }
        if (pressure.scaledSum > 0) {
            pressure.center = { x: 0, y: 0 };
            pressure.sensors.forEach((sensor) => {
                sensor.weightedValue = sensor.scaledValue / pressure.scaledSum;
                pressure.center.x += sensor.position.x * sensor.weightedValue;
                pressure.center.y += sensor.position.y * sensor.weightedValue;
            });
            pressure.normalizedCenter = __classPrivateFieldGet(this, _PressureSensorDataManager_centerOfPressureHelper, "f").updateAndGetNormalization(pressure.center);
        }
        _console$s.log({ pressure });
        return pressure;
    }
}
_PressureSensorDataManager_positions = new WeakMap(), _PressureSensorDataManager_sensorRangeHelpers = new WeakMap(), _PressureSensorDataManager_centerOfPressureHelper = new WeakMap();

const _console$r = createConsole("MotionSensorDataManager", { log: true });
const MotionSensorTypes = [
    "acceleration",
    "gravity",
    "linearAcceleration",
    "gyroscope",
    "magnetometer",
    "gameRotation",
    "rotation",
    "orientation",
    "activity",
    "stepCounter",
    "stepDetector",
    "deviceOrientation",
];
const ContinuousMotionTypes = [
    "acceleration",
    "gravity",
    "linearAcceleration",
    "gyroscope",
    "magnetometer",
    "gameRotation",
    "rotation",
];
const ActivityTypes = ["still", "walking", "running", "bicycle", "vehicle", "tilting"];
const DeviceOrientations = [
    "portraitUpright",
    "landscapeLeft",
    "portraitUpsideDown",
    "landscapeRight",
    "unknown",
];
class MotionSensorDataManager {
    parseVector3(dataView, scalar) {
        let [x, y, z] = [dataView.getInt16(0, true), dataView.getInt16(2, true), dataView.getInt16(4, true)].map((value) => value * scalar);
        const vector = { x, y, z };
        _console$r.log({ vector });
        return vector;
    }
    parseQuaternion(dataView, scalar) {
        let [x, y, z, w] = [
            dataView.getInt16(0, true),
            dataView.getInt16(2, true),
            dataView.getInt16(4, true),
            dataView.getInt16(6, true),
        ].map((value) => value * scalar);
        const quaternion = { x, y, z, w };
        _console$r.log({ quaternion });
        return quaternion;
    }
    parseEuler(dataView, scalar) {
        let [heading, pitch, roll] = [
            dataView.getInt16(0, true),
            dataView.getInt16(2, true),
            dataView.getInt16(4, true),
        ].map((value) => value * scalar);
        pitch *= -1;
        heading *= -1;
        const euler = { heading, pitch, roll };
        _console$r.log({ euler });
        return euler;
    }
    parseStepCounter(dataView) {
        _console$r.log("parseStepCounter", dataView);
        const stepCount = dataView.getUint32(0, true);
        _console$r.log({ stepCount });
        return stepCount;
    }
    parseActivity(dataView) {
        _console$r.log("parseActivity", dataView);
        const activity = {};
        const activityBitfield = dataView.getUint8(0);
        _console$r.log("activityBitfield", activityBitfield.toString(2));
        ActivityTypes.forEach((activityType, index) => {
            activity[activityType] = Boolean(activityBitfield & (1 << index));
        });
        _console$r.log("activity", activity);
        return activity;
    }
    parseDeviceOrientation(dataView) {
        _console$r.log("parseDeviceOrientation", dataView);
        const index = dataView.getUint8(0);
        const deviceOrientation = DeviceOrientations[index];
        _console$r.assertWithError(deviceOrientation, "undefined deviceOrientation");
        _console$r.log({ deviceOrientation });
        return deviceOrientation;
    }
}

var _BarometerSensorDataManager_instances, _BarometerSensorDataManager_calculcateAltitude;
const BarometerSensorTypes = ["barometer"];
const ContinuousBarometerSensorTypes = BarometerSensorTypes;
const _console$q = createConsole("BarometerSensorDataManager", { log: true });
class BarometerSensorDataManager {
    constructor() {
        _BarometerSensorDataManager_instances.add(this);
    }
    parseData(dataView, scalar) {
        const pressure = dataView.getUint32(0, true) * scalar;
        const altitude = __classPrivateFieldGet(this, _BarometerSensorDataManager_instances, "m", _BarometerSensorDataManager_calculcateAltitude).call(this, pressure);
        _console$q.log({ pressure, altitude });
        return { pressure };
    }
}
_BarometerSensorDataManager_instances = new WeakSet(), _BarometerSensorDataManager_calculcateAltitude = function _BarometerSensorDataManager_calculcateAltitude(pressure) {
    const P0 = 101325;
    const T0 = 288.15;
    const L = 0.0065;
    const R = 8.3144598;
    const g = 9.80665;
    const M = 0.0289644;
    const exponent = (R * L) / (g * M);
    const h = (T0 / L) * (1 - Math.pow(pressure / P0, exponent));
    return h;
};

const _console$p = createConsole("ParseUtils", { log: true });
function parseStringFromDataView(dataView, byteOffset = 0) {
    const stringLength = dataView.getUint8(byteOffset++);
    const string = textDecoder.decode(dataView.buffer.slice(dataView.byteOffset + byteOffset, dataView.byteOffset + byteOffset + stringLength));
    byteOffset += stringLength;
    return { string, byteOffset };
}
function parseMessage(dataView, messageTypes, callback, context, parseMessageLengthAsUint16 = false) {
    let byteOffset = 0;
    while (byteOffset < dataView.byteLength) {
        const messageTypeEnum = dataView.getUint8(byteOffset++);
        _console$p.assertWithError(messageTypeEnum in messageTypes, `invalid messageTypeEnum ${messageTypeEnum}`);
        const messageType = messageTypes[messageTypeEnum];
        let messageLength;
        if (parseMessageLengthAsUint16) {
            messageLength = dataView.getUint16(byteOffset, true);
            byteOffset += 2;
        }
        else {
            messageLength = dataView.getUint8(byteOffset++);
        }
        _console$p.log({ messageTypeEnum, messageType, messageLength, dataView, byteOffset });
        const _dataView = sliceDataView(dataView, byteOffset, messageLength);
        _console$p.log({ _dataView });
        callback(messageType, _dataView, context);
        byteOffset += messageLength;
    }
}

var _SensorDataManager_scalars;
const _console$o = createConsole("SensorDataManager", { log: true });
const SensorTypes = [...PressureSensorTypes, ...MotionSensorTypes, ...BarometerSensorTypes];
const ContinuousSensorTypes = [
    ...ContinuousPressureSensorTypes,
    ...ContinuousMotionTypes,
    ...ContinuousBarometerSensorTypes,
];
const SensorDataMessageTypes = ["getPressurePositions", "getSensorScalars", "sensorData"];
const SensorDataEventTypes = [...SensorDataMessageTypes, ...SensorTypes];
class SensorDataManager {
    constructor() {
        this.pressureSensorDataManager = new PressureSensorDataManager();
        this.motionSensorDataManager = new MotionSensorDataManager();
        this.barometerSensorDataManager = new BarometerSensorDataManager();
        _SensorDataManager_scalars.set(this, new Map());
    }
    static AssertValidSensorType(sensorType) {
        _console$o.assertEnumWithError(sensorType, SensorTypes);
    }
    static AssertValidSensorTypeEnum(sensorTypeEnum) {
        _console$o.assertTypeWithError(sensorTypeEnum, "number");
        _console$o.assertWithError(sensorTypeEnum in SensorTypes, `invalid sensorTypeEnum ${sensorTypeEnum}`);
    }
    get dispatchEvent() {
        return this.eventDispatcher.dispatchEvent;
    }
    parseMessage(messageType, dataView) {
        _console$o.log({ messageType });
        switch (messageType) {
            case "getSensorScalars":
                this.parseScalars(dataView);
                break;
            case "getPressurePositions":
                this.pressureSensorDataManager.parsePositions(dataView);
                break;
            case "sensorData":
                this.parseData(dataView);
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
    parseScalars(dataView) {
        for (let byteOffset = 0; byteOffset < dataView.byteLength; byteOffset += 5) {
            const sensorTypeIndex = dataView.getUint8(byteOffset);
            const sensorType = SensorTypes[sensorTypeIndex];
            if (!sensorType) {
                _console$o.warn(`unknown sensorType index ${sensorTypeIndex}`);
                continue;
            }
            const sensorScalar = dataView.getFloat32(byteOffset + 1, true);
            _console$o.log({ sensorType, sensorScalar });
            __classPrivateFieldGet(this, _SensorDataManager_scalars, "f").set(sensorType, sensorScalar);
        }
    }
    parseData(dataView) {
        _console$o.log("sensorData", Array.from(new Uint8Array(dataView.buffer)));
        let byteOffset = 0;
        const timestamp = parseTimestamp(dataView, byteOffset);
        byteOffset += 2;
        const _dataView = new DataView(dataView.buffer, byteOffset);
        parseMessage(_dataView, SensorTypes, this.parseDataCallback.bind(this), { timestamp });
    }
    parseDataCallback(sensorType, dataView, { timestamp }) {
        const scalar = __classPrivateFieldGet(this, _SensorDataManager_scalars, "f").get(sensorType) || 1;
        let sensorData = null;
        switch (sensorType) {
            case "pressure":
                sensorData = this.pressureSensorDataManager.parseData(dataView, scalar);
                break;
            case "acceleration":
            case "gravity":
            case "linearAcceleration":
            case "gyroscope":
            case "magnetometer":
                sensorData = this.motionSensorDataManager.parseVector3(dataView, scalar);
                break;
            case "gameRotation":
            case "rotation":
                sensorData = this.motionSensorDataManager.parseQuaternion(dataView, scalar);
                break;
            case "orientation":
                sensorData = this.motionSensorDataManager.parseEuler(dataView, scalar);
                break;
            case "stepCounter":
                sensorData = this.motionSensorDataManager.parseStepCounter(dataView);
                break;
            case "stepDetector":
                sensorData = {};
                break;
            case "activity":
                sensorData = this.motionSensorDataManager.parseActivity(dataView);
                break;
            case "deviceOrientation":
                sensorData = this.motionSensorDataManager.parseDeviceOrientation(dataView);
                break;
            case "barometer":
                sensorData = this.barometerSensorDataManager.parseData(dataView, scalar);
                break;
            default:
                _console$o.error(`uncaught sensorType "${sensorType}"`);
        }
        _console$o.assertWithError(sensorData != null, `no sensorData defined for sensorType "${sensorType}"`);
        _console$o.log({ sensorType, sensorData });
        this.dispatchEvent(sensorType, { sensorType, [sensorType]: sensorData, timestamp });
        this.dispatchEvent("sensorData", { sensorType, [sensorType]: sensorData, timestamp });
    }
}
_SensorDataManager_scalars = new WeakMap();

const getAllProperties = object => {
	const properties = new Set();
	do {
		for (const key of Reflect.ownKeys(object)) {
			properties.add([object, key]);
		}
	} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);
	return properties;
};
function autoBind(self, {include, exclude} = {}) {
	const filter = key => {
		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
		if (include) {
			return include.some(match);
		}
		if (exclude) {
			return !exclude.some(match);
		}
		return true;
	};
	for (const [object, key] of getAllProperties(self.constructor.prototype)) {
		if (key === 'constructor' || !filter(key)) {
			continue;
		}
		const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
		if (descriptor && typeof descriptor.value === 'function') {
			self[key] = self[key].bind(self);
		}
	}
	return self;
}

var _SensorConfigurationManager_instances, _a$5, _SensorConfigurationManager_dispatchEvent_get, _SensorConfigurationManager_availableSensorTypes, _SensorConfigurationManager_assertAvailableSensorType, _SensorConfigurationManager_configuration, _SensorConfigurationManager_updateConfiguration, _SensorConfigurationManager_isRedundant, _SensorConfigurationManager_parse, _SensorConfigurationManager_AssertValidSensorRate, _SensorConfigurationManager_assertValidSensorRate, _SensorConfigurationManager_createData, _SensorConfigurationManager_ZeroSensorConfiguration;
const _console$n = createConsole("SensorConfigurationManager", { log: true });
const MaxSensorRate = 2 ** 16 - 1;
const SensorRateStep = 5;
const SensorConfigurationMessageTypes = ["getSensorConfiguration", "setSensorConfiguration"];
const SensorConfigurationEventTypes = SensorConfigurationMessageTypes;
class SensorConfigurationManager {
    constructor() {
        _SensorConfigurationManager_instances.add(this);
        _SensorConfigurationManager_availableSensorTypes.set(this, void 0);
        _SensorConfigurationManager_configuration.set(this, void 0);
        autoBind(this);
    }
    get addEventListener() {
        return this.eventDispatcher.addEventListener;
    }
    get waitForEvent() {
        return this.eventDispatcher.waitForEvent;
    }
    get configuration() {
        return __classPrivateFieldGet(this, _SensorConfigurationManager_configuration, "f");
    }
    async setConfiguration(newSensorConfiguration, clearRest) {
        if (clearRest) {
            newSensorConfiguration = Object.assign({ ...this.zeroSensorConfiguration }, newSensorConfiguration);
        }
        _console$n.log({ newSensorConfiguration });
        if (__classPrivateFieldGet(this, _SensorConfigurationManager_instances, "m", _SensorConfigurationManager_isRedundant).call(this, newSensorConfiguration)) {
            _console$n.log("redundant sensor configuration");
            return;
        }
        const setSensorConfigurationData = __classPrivateFieldGet(this, _SensorConfigurationManager_instances, "m", _SensorConfigurationManager_createData).call(this, newSensorConfiguration);
        _console$n.log({ setSensorConfigurationData });
        const promise = this.waitForEvent("getSensorConfiguration");
        this.sendMessage([{ type: "setSensorConfiguration", data: setSensorConfigurationData.buffer }]);
        await promise;
    }
    static get ZeroSensorConfiguration() {
        return __classPrivateFieldGet(this, _a$5, "f", _SensorConfigurationManager_ZeroSensorConfiguration);
    }
    get zeroSensorConfiguration() {
        const zeroSensorConfiguration = {};
        SensorTypes.forEach((sensorType) => {
            zeroSensorConfiguration[sensorType] = 0;
        });
        return zeroSensorConfiguration;
    }
    async clearSensorConfiguration() {
        return this.setConfiguration(this.zeroSensorConfiguration);
    }
    parseMessage(messageType, dataView) {
        _console$n.log({ messageType });
        switch (messageType) {
            case "getSensorConfiguration":
            case "setSensorConfiguration":
                const newSensorConfiguration = __classPrivateFieldGet(this, _SensorConfigurationManager_instances, "m", _SensorConfigurationManager_parse).call(this, dataView);
                __classPrivateFieldGet(this, _SensorConfigurationManager_instances, "m", _SensorConfigurationManager_updateConfiguration).call(this, newSensorConfiguration);
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
}
_a$5 = SensorConfigurationManager, _SensorConfigurationManager_availableSensorTypes = new WeakMap(), _SensorConfigurationManager_configuration = new WeakMap(), _SensorConfigurationManager_instances = new WeakSet(), _SensorConfigurationManager_dispatchEvent_get = function _SensorConfigurationManager_dispatchEvent_get() {
    return this.eventDispatcher.dispatchEvent;
}, _SensorConfigurationManager_assertAvailableSensorType = function _SensorConfigurationManager_assertAvailableSensorType(sensorType) {
    _console$n.assertWithError(__classPrivateFieldGet(this, _SensorConfigurationManager_availableSensorTypes, "f"), "must get initial sensorConfiguration");
    const isSensorTypeAvailable = __classPrivateFieldGet(this, _SensorConfigurationManager_availableSensorTypes, "f")?.includes(sensorType);
    _console$n.assert(isSensorTypeAvailable, `unavailable sensor type "${sensorType}"`);
    return isSensorTypeAvailable;
}, _SensorConfigurationManager_updateConfiguration = function _SensorConfigurationManager_updateConfiguration(updatedConfiguration) {
    __classPrivateFieldSet(this, _SensorConfigurationManager_configuration, updatedConfiguration, "f");
    _console$n.log({ updatedConfiguration: __classPrivateFieldGet(this, _SensorConfigurationManager_configuration, "f") });
    __classPrivateFieldGet(this, _SensorConfigurationManager_instances, "a", _SensorConfigurationManager_dispatchEvent_get).call(this, "getSensorConfiguration", { sensorConfiguration: this.configuration });
}, _SensorConfigurationManager_isRedundant = function _SensorConfigurationManager_isRedundant(sensorConfiguration) {
    let sensorTypes = Object.keys(sensorConfiguration);
    return sensorTypes.every((sensorType) => {
        return this.configuration[sensorType] == sensorConfiguration[sensorType];
    });
}, _SensorConfigurationManager_parse = function _SensorConfigurationManager_parse(dataView) {
    const parsedSensorConfiguration = {};
    for (let byteOffset = 0; byteOffset < dataView.byteLength; byteOffset += 3) {
        const sensorTypeIndex = dataView.getUint8(byteOffset);
        const sensorType = SensorTypes[sensorTypeIndex];
        if (!sensorType) {
            _console$n.warn(`unknown sensorType index ${sensorTypeIndex}`);
            continue;
        }
        const sensorRate = dataView.getUint16(byteOffset + 1, true);
        _console$n.log({ sensorType, sensorRate });
        parsedSensorConfiguration[sensorType] = sensorRate;
    }
    _console$n.log({ parsedSensorConfiguration });
    __classPrivateFieldSet(this, _SensorConfigurationManager_availableSensorTypes, Object.keys(parsedSensorConfiguration), "f");
    return parsedSensorConfiguration;
}, _SensorConfigurationManager_AssertValidSensorRate = function _SensorConfigurationManager_AssertValidSensorRate(sensorRate) {
    _console$n.assertTypeWithError(sensorRate, "number");
    _console$n.assertWithError(sensorRate >= 0, `sensorRate must be 0 or greater (got ${sensorRate})`);
    _console$n.assertWithError(sensorRate < MaxSensorRate, `sensorRate must be 0 or greater (got ${sensorRate})`);
    _console$n.assertWithError(sensorRate % SensorRateStep == 0, `sensorRate must be multiple of ${SensorRateStep}`);
}, _SensorConfigurationManager_assertValidSensorRate = function _SensorConfigurationManager_assertValidSensorRate(sensorRate) {
    __classPrivateFieldGet(_a$5, _a$5, "m", _SensorConfigurationManager_AssertValidSensorRate).call(_a$5, sensorRate);
}, _SensorConfigurationManager_createData = function _SensorConfigurationManager_createData(sensorConfiguration) {
    let sensorTypes = Object.keys(sensorConfiguration);
    sensorTypes = sensorTypes.filter((sensorType) => __classPrivateFieldGet(this, _SensorConfigurationManager_instances, "m", _SensorConfigurationManager_assertAvailableSensorType).call(this, sensorType));
    const dataView = new DataView(new ArrayBuffer(sensorTypes.length * 3));
    sensorTypes.forEach((sensorType, index) => {
        SensorDataManager.AssertValidSensorType(sensorType);
        const sensorTypeEnum = SensorTypes.indexOf(sensorType);
        dataView.setUint8(index * 3, sensorTypeEnum);
        const sensorRate = sensorConfiguration[sensorType];
        __classPrivateFieldGet(this, _SensorConfigurationManager_instances, "m", _SensorConfigurationManager_assertValidSensorRate).call(this, sensorRate);
        dataView.setUint16(index * 3 + 1, sensorRate, true);
    });
    _console$n.log({ sensorConfigurationData: dataView });
    return dataView;
};
_SensorConfigurationManager_ZeroSensorConfiguration = { value: {} };
(() => {
    SensorTypes.forEach((sensorType) => {
        __classPrivateFieldGet(_a$5, _a$5, "f", _SensorConfigurationManager_ZeroSensorConfiguration)[sensorType] = 0;
    });
})();

var _TfliteManager_instances, _TfliteManager_assertValidTask, _TfliteManager_assertValidTaskEnum, _TfliteManager_dispatchEvent_get, _TfliteManager_name, _TfliteManager_parseName, _TfliteManager_updateName, _TfliteManager_task, _TfliteManager_parseTask, _TfliteManager_updateTask, _TfliteManager_sampleRate, _TfliteManager_parseSampleRate, _TfliteManager_updateSampleRate, _TfliteManager_sensorTypes, _TfliteManager_parseSensorTypes, _TfliteManager_updateSensorTypes, _TfliteManager_isReady, _TfliteManager_parseIsReady, _TfliteManager_updateIsReady, _TfliteManager_assertIsReady, _TfliteManager_captureDelay, _TfliteManager_parseCaptureDelay, _TfliteManager_updateCaptueDelay, _TfliteManager_threshold, _TfliteManager_parseThreshold, _TfliteManager_updateThreshold, _TfliteManager_inferencingEnabled, _TfliteManager_parseInferencingEnabled, _TfliteManager_updateInferencingEnabled, _TfliteManager_parseInference;
const _console$m = createConsole("TfliteManager", { log: true });
const TfliteMessageTypes = [
    "getTfliteName",
    "setTfliteName",
    "getTfliteTask",
    "setTfliteTask",
    "getTfliteSampleRate",
    "setTfliteSampleRate",
    "getTfliteSensorTypes",
    "setTfliteSensorTypes",
    "tfliteIsReady",
    "getTfliteCaptureDelay",
    "setTfliteCaptureDelay",
    "getTfliteThreshold",
    "setTfliteThreshold",
    "getTfliteInferencingEnabled",
    "setTfliteInferencingEnabled",
    "tfliteInference",
];
const TfliteEventTypes = TfliteMessageTypes;
const TfliteTasks = ["classification", "regression"];
const TfliteSensorTypes = ["pressure", "linearAcceleration", "gyroscope", "magnetometer"];
class TfliteManager {
    constructor() {
        _TfliteManager_instances.add(this);
        _TfliteManager_name.set(this, void 0);
        _TfliteManager_task.set(this, void 0);
        _TfliteManager_sampleRate.set(this, void 0);
        _TfliteManager_sensorTypes.set(this, []);
        _TfliteManager_isReady.set(this, void 0);
        _TfliteManager_captureDelay.set(this, void 0);
        _TfliteManager_threshold.set(this, void 0);
        _TfliteManager_inferencingEnabled.set(this, void 0);
        autoBind$1(this);
    }
    get addEventListenter() {
        return this.eventDispatcher.addEventListener;
    }
    get removeEventListener() {
        return this.eventDispatcher.removeEventListener;
    }
    get waitForEvent() {
        return this.eventDispatcher.waitForEvent;
    }
    get name() {
        return __classPrivateFieldGet(this, _TfliteManager_name, "f");
    }
    async setName(newName, sendImmediately) {
        _console$m.assertTypeWithError(newName, "string");
        if (this.name == newName) {
            _console$m.log(`redundant name assignment ${newName}`);
            return;
        }
        const promise = this.waitForEvent("getTfliteName");
        const setNameData = textEncoder.encode(newName);
        this.sendMessage([{ type: "setTfliteName", data: setNameData.buffer }], sendImmediately);
        await promise;
    }
    get task() {
        return __classPrivateFieldGet(this, _TfliteManager_task, "f");
    }
    async setTask(newTask, sendImmediately) {
        __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_assertValidTask).call(this, newTask);
        if (this.task == newTask) {
            _console$m.log(`redundant task assignment ${newTask}`);
            return;
        }
        const promise = this.waitForEvent("getTfliteTask");
        const taskEnum = TfliteTasks.indexOf(newTask);
        this.sendMessage([{ type: "setTfliteTask", data: Uint8Array.from([taskEnum]).buffer }], sendImmediately);
        await promise;
    }
    get sampleRate() {
        return __classPrivateFieldGet(this, _TfliteManager_sampleRate, "f");
    }
    async setSampleRate(newSampleRate, sendImmediately) {
        _console$m.assertTypeWithError(newSampleRate, "number");
        newSampleRate -= newSampleRate % SensorRateStep;
        _console$m.assertWithError(newSampleRate >= SensorRateStep, `sampleRate must be multiple of ${SensorRateStep} greater than 0 (got ${newSampleRate})`);
        if (__classPrivateFieldGet(this, _TfliteManager_sampleRate, "f") == newSampleRate) {
            _console$m.log(`redundant sampleRate assignment ${newSampleRate}`);
            return;
        }
        const promise = this.waitForEvent("getTfliteSampleRate");
        const dataView = new DataView(new ArrayBuffer(2));
        dataView.setUint16(0, newSampleRate, true);
        this.sendMessage([{ type: "setTfliteSampleRate", data: dataView.buffer }], sendImmediately);
        await promise;
    }
    static AssertValidSensorType(sensorType) {
        SensorDataManager.AssertValidSensorType(sensorType);
        _console$m.assertWithError(TfliteSensorTypes.includes(sensorType), `invalid tflite sensorType "${sensorType}"`);
    }
    get sensorTypes() {
        return __classPrivateFieldGet(this, _TfliteManager_sensorTypes, "f").slice();
    }
    async setSensorTypes(newSensorTypes, sendImmediately) {
        newSensorTypes.forEach((sensorType) => {
            TfliteManager.AssertValidSensorType(sensorType);
        });
        const promise = this.waitForEvent("getTfliteSensorTypes");
        newSensorTypes = arrayWithoutDuplicates(newSensorTypes);
        const newSensorTypeEnums = newSensorTypes.map((sensorType) => SensorTypes.indexOf(sensorType)).sort();
        _console$m.log(newSensorTypes, newSensorTypeEnums);
        this.sendMessage([{ type: "setTfliteSensorTypes", data: Uint8Array.from(newSensorTypeEnums).buffer }], sendImmediately);
        await promise;
    }
    get isReady() {
        return __classPrivateFieldGet(this, _TfliteManager_isReady, "f");
    }
    get captureDelay() {
        return __classPrivateFieldGet(this, _TfliteManager_captureDelay, "f");
    }
    async setCaptureDelay(newCaptureDelay, sendImmediately) {
        _console$m.assertTypeWithError(newCaptureDelay, "number");
        if (__classPrivateFieldGet(this, _TfliteManager_captureDelay, "f") == newCaptureDelay) {
            _console$m.log(`redundant captureDelay assignment ${newCaptureDelay}`);
            return;
        }
        const promise = this.waitForEvent("getTfliteCaptureDelay");
        const dataView = new DataView(new ArrayBuffer(2));
        dataView.setUint16(0, newCaptureDelay, true);
        this.sendMessage([{ type: "setTfliteCaptureDelay", data: dataView.buffer }], sendImmediately);
        await promise;
    }
    get threshold() {
        return __classPrivateFieldGet(this, _TfliteManager_threshold, "f");
    }
    async setThreshold(newThreshold, sendImmediately) {
        _console$m.assertTypeWithError(newThreshold, "number");
        _console$m.assertWithError(newThreshold >= 0, `threshold must be positive (got ${newThreshold})`);
        if (__classPrivateFieldGet(this, _TfliteManager_threshold, "f") == newThreshold) {
            _console$m.log(`redundant threshold assignment ${newThreshold}`);
            return;
        }
        const promise = this.waitForEvent("getTfliteThreshold");
        const dataView = new DataView(new ArrayBuffer(4));
        dataView.setFloat32(0, newThreshold, true);
        this.sendMessage([{ type: "setTfliteThreshold", data: dataView.buffer }], sendImmediately);
        await promise;
    }
    get inferencingEnabled() {
        return __classPrivateFieldGet(this, _TfliteManager_inferencingEnabled, "f");
    }
    async setInferencingEnabled(newInferencingEnabled, sendImmediately = true) {
        _console$m.assertTypeWithError(newInferencingEnabled, "boolean");
        if (!newInferencingEnabled && !this.isReady) {
            return;
        }
        __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_assertIsReady).call(this);
        if (__classPrivateFieldGet(this, _TfliteManager_inferencingEnabled, "f") == newInferencingEnabled) {
            _console$m.log(`redundant inferencingEnabled assignment ${newInferencingEnabled}`);
            return;
        }
        const promise = this.waitForEvent("getTfliteInferencingEnabled");
        this.sendMessage([
            {
                type: "setTfliteInferencingEnabled",
                data: Uint8Array.from([Number(newInferencingEnabled)]).buffer,
            },
        ], sendImmediately);
        await promise;
    }
    async toggleInferencingEnabled() {
        return this.setInferencingEnabled(!this.inferencingEnabled);
    }
    async enableInferencing() {
        if (this.inferencingEnabled) {
            return;
        }
        this.setInferencingEnabled(true);
    }
    async disableInferencing() {
        if (!this.inferencingEnabled) {
            return;
        }
        this.setInferencingEnabled(false);
    }
    parseMessage(messageType, dataView) {
        _console$m.log({ messageType });
        switch (messageType) {
            case "getTfliteName":
            case "setTfliteName":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseName).call(this, dataView);
                break;
            case "getTfliteTask":
            case "setTfliteTask":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseTask).call(this, dataView);
                break;
            case "getTfliteSampleRate":
            case "setTfliteSampleRate":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseSampleRate).call(this, dataView);
                break;
            case "getTfliteSensorTypes":
            case "setTfliteSensorTypes":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseSensorTypes).call(this, dataView);
                break;
            case "tfliteIsReady":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseIsReady).call(this, dataView);
                break;
            case "getTfliteCaptureDelay":
            case "setTfliteCaptureDelay":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseCaptureDelay).call(this, dataView);
                break;
            case "getTfliteThreshold":
            case "setTfliteThreshold":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseThreshold).call(this, dataView);
                break;
            case "getTfliteInferencingEnabled":
            case "setTfliteInferencingEnabled":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseInferencingEnabled).call(this, dataView);
                break;
            case "tfliteInference":
                __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_parseInference).call(this, dataView);
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
}
_TfliteManager_name = new WeakMap(), _TfliteManager_task = new WeakMap(), _TfliteManager_sampleRate = new WeakMap(), _TfliteManager_sensorTypes = new WeakMap(), _TfliteManager_isReady = new WeakMap(), _TfliteManager_captureDelay = new WeakMap(), _TfliteManager_threshold = new WeakMap(), _TfliteManager_inferencingEnabled = new WeakMap(), _TfliteManager_instances = new WeakSet(), _TfliteManager_assertValidTask = function _TfliteManager_assertValidTask(task) {
    _console$m.assertEnumWithError(task, TfliteTasks);
}, _TfliteManager_assertValidTaskEnum = function _TfliteManager_assertValidTaskEnum(taskEnum) {
    _console$m.assertWithError(taskEnum in TfliteTasks, `invalid taskEnum ${taskEnum}`);
}, _TfliteManager_dispatchEvent_get = function _TfliteManager_dispatchEvent_get() {
    return this.eventDispatcher.dispatchEvent;
}, _TfliteManager_parseName = function _TfliteManager_parseName(dataView) {
    _console$m.log("parseName", dataView);
    const name = textDecoder.decode(dataView.buffer);
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateName).call(this, name);
}, _TfliteManager_updateName = function _TfliteManager_updateName(name) {
    _console$m.log({ name });
    __classPrivateFieldSet(this, _TfliteManager_name, name, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteName", { tfliteName: name });
}, _TfliteManager_parseTask = function _TfliteManager_parseTask(dataView) {
    _console$m.log("parseTask", dataView);
    const taskEnum = dataView.getUint8(0);
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_assertValidTaskEnum).call(this, taskEnum);
    const task = TfliteTasks[taskEnum];
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateTask).call(this, task);
}, _TfliteManager_updateTask = function _TfliteManager_updateTask(task) {
    _console$m.log({ task });
    __classPrivateFieldSet(this, _TfliteManager_task, task, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteTask", { tfliteTask: task });
}, _TfliteManager_parseSampleRate = function _TfliteManager_parseSampleRate(dataView) {
    _console$m.log("parseSampleRate", dataView);
    const sampleRate = dataView.getUint16(0, true);
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateSampleRate).call(this, sampleRate);
}, _TfliteManager_updateSampleRate = function _TfliteManager_updateSampleRate(sampleRate) {
    _console$m.log({ sampleRate });
    __classPrivateFieldSet(this, _TfliteManager_sampleRate, sampleRate, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteSampleRate", { tfliteSampleRate: sampleRate });
}, _TfliteManager_parseSensorTypes = function _TfliteManager_parseSensorTypes(dataView) {
    _console$m.log("parseSensorTypes", dataView);
    const sensorTypes = [];
    for (let index = 0; index < dataView.byteLength; index++) {
        const sensorTypeEnum = dataView.getUint8(index);
        const sensorType = SensorTypes[sensorTypeEnum];
        if (sensorType) {
            sensorTypes.push(sensorType);
        }
        else {
            _console$m.error(`invalid sensorTypeEnum ${sensorTypeEnum}`);
        }
    }
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateSensorTypes).call(this, sensorTypes);
}, _TfliteManager_updateSensorTypes = function _TfliteManager_updateSensorTypes(sensorTypes) {
    _console$m.log({ sensorTypes });
    __classPrivateFieldSet(this, _TfliteManager_sensorTypes, sensorTypes, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteSensorTypes", { tfliteSensorTypes: sensorTypes });
}, _TfliteManager_parseIsReady = function _TfliteManager_parseIsReady(dataView) {
    _console$m.log("parseIsReady", dataView);
    const isReady = Boolean(dataView.getUint8(0));
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateIsReady).call(this, isReady);
}, _TfliteManager_updateIsReady = function _TfliteManager_updateIsReady(isReady) {
    _console$m.log({ isReady });
    __classPrivateFieldSet(this, _TfliteManager_isReady, isReady, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "tfliteIsReady", { tfliteIsReady: isReady });
}, _TfliteManager_assertIsReady = function _TfliteManager_assertIsReady() {
    _console$m.assertWithError(this.isReady, `tflite is not ready`);
}, _TfliteManager_parseCaptureDelay = function _TfliteManager_parseCaptureDelay(dataView) {
    _console$m.log("parseCaptureDelay", dataView);
    const captureDelay = dataView.getUint16(0, true);
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateCaptueDelay).call(this, captureDelay);
}, _TfliteManager_updateCaptueDelay = function _TfliteManager_updateCaptueDelay(captureDelay) {
    _console$m.log({ captureDelay });
    __classPrivateFieldSet(this, _TfliteManager_captureDelay, captureDelay, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteCaptureDelay", { tfliteCaptureDelay: captureDelay });
}, _TfliteManager_parseThreshold = function _TfliteManager_parseThreshold(dataView) {
    _console$m.log("parseThreshold", dataView);
    const threshold = dataView.getFloat32(0, true);
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateThreshold).call(this, threshold);
}, _TfliteManager_updateThreshold = function _TfliteManager_updateThreshold(threshold) {
    _console$m.log({ threshold });
    __classPrivateFieldSet(this, _TfliteManager_threshold, threshold, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteThreshold", { tfliteThreshold: threshold });
}, _TfliteManager_parseInferencingEnabled = function _TfliteManager_parseInferencingEnabled(dataView) {
    _console$m.log("parseInferencingEnabled", dataView);
    const inferencingEnabled = Boolean(dataView.getUint8(0));
    __classPrivateFieldGet(this, _TfliteManager_instances, "m", _TfliteManager_updateInferencingEnabled).call(this, inferencingEnabled);
}, _TfliteManager_updateInferencingEnabled = function _TfliteManager_updateInferencingEnabled(inferencingEnabled) {
    _console$m.log({ inferencingEnabled });
    __classPrivateFieldSet(this, _TfliteManager_inferencingEnabled, inferencingEnabled, "f");
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "getTfliteInferencingEnabled", { tfliteInferencingEnabled: inferencingEnabled });
}, _TfliteManager_parseInference = function _TfliteManager_parseInference(dataView) {
    _console$m.log("parseInference", dataView);
    const timestamp = parseTimestamp(dataView, 0);
    _console$m.log({ timestamp });
    const values = [];
    for (let index = 0, byteOffset = 2; byteOffset < dataView.byteLength; index++, byteOffset += 4) {
        const value = dataView.getFloat32(byteOffset, true);
        values.push(value);
    }
    _console$m.log("values", values);
    const inference = {
        timestamp,
        values,
    };
    __classPrivateFieldGet(this, _TfliteManager_instances, "a", _TfliteManager_dispatchEvent_get).call(this, "tfliteInference", { tfliteInference: inference });
};

var _DeviceInformationManager_instances, _DeviceInformationManager_dispatchEvent_get, _DeviceInformationManager_information, _DeviceInformationManager_isComplete_get, _DeviceInformationManager_update;
const _console$l = createConsole("DeviceInformationManager", { log: true });
const DeviceInformationMessageTypes = [
    "manufacturerName",
    "modelNumber",
    "softwareRevision",
    "hardwareRevision",
    "firmwareRevision",
    "pnpId",
    "serialNumber",
];
const DeviceInformationEventTypes = [...DeviceInformationMessageTypes, "deviceInformation"];
class DeviceInformationManager {
    constructor() {
        _DeviceInformationManager_instances.add(this);
        _DeviceInformationManager_information.set(this, {});
    }
    get information() {
        return __classPrivateFieldGet(this, _DeviceInformationManager_information, "f");
    }
    clear() {
        __classPrivateFieldSet(this, _DeviceInformationManager_information, {}, "f");
    }
    parseMessage(messageType, dataView) {
        _console$l.log({ messageType });
        switch (messageType) {
            case "manufacturerName":
                const manufacturerName = textDecoder.decode(dataView.buffer);
                _console$l.log({ manufacturerName });
                __classPrivateFieldGet(this, _DeviceInformationManager_instances, "m", _DeviceInformationManager_update).call(this, { manufacturerName });
                break;
            case "modelNumber":
                const modelNumber = textDecoder.decode(dataView.buffer);
                _console$l.log({ modelNumber });
                __classPrivateFieldGet(this, _DeviceInformationManager_instances, "m", _DeviceInformationManager_update).call(this, { modelNumber });
                break;
            case "softwareRevision":
                const softwareRevision = textDecoder.decode(dataView.buffer);
                _console$l.log({ softwareRevision });
                __classPrivateFieldGet(this, _DeviceInformationManager_instances, "m", _DeviceInformationManager_update).call(this, { softwareRevision });
                break;
            case "hardwareRevision":
                const hardwareRevision = textDecoder.decode(dataView.buffer);
                _console$l.log({ hardwareRevision });
                __classPrivateFieldGet(this, _DeviceInformationManager_instances, "m", _DeviceInformationManager_update).call(this, { hardwareRevision });
                break;
            case "firmwareRevision":
                const firmwareRevision = textDecoder.decode(dataView.buffer);
                _console$l.log({ firmwareRevision });
                __classPrivateFieldGet(this, _DeviceInformationManager_instances, "m", _DeviceInformationManager_update).call(this, { firmwareRevision });
                break;
            case "pnpId":
                const pnpId = {
                    source: dataView.getUint8(0) === 1 ? "Bluetooth" : "USB",
                    productId: dataView.getUint16(3, true),
                    productVersion: dataView.getUint16(5, true),
                    vendorId: 0,
                };
                if (pnpId.source == "Bluetooth") {
                    pnpId.vendorId = dataView.getUint16(1, true);
                }
                _console$l.log({ pnpId });
                __classPrivateFieldGet(this, _DeviceInformationManager_instances, "m", _DeviceInformationManager_update).call(this, { pnpId });
                break;
            case "serialNumber":
                const serialNumber = textDecoder.decode(dataView.buffer);
                _console$l.log({ serialNumber });
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
}
_DeviceInformationManager_information = new WeakMap(), _DeviceInformationManager_instances = new WeakSet(), _DeviceInformationManager_dispatchEvent_get = function _DeviceInformationManager_dispatchEvent_get() {
    return this.eventDispatcher.dispatchEvent;
}, _DeviceInformationManager_isComplete_get = function _DeviceInformationManager_isComplete_get() {
    return DeviceInformationMessageTypes.every((key) => key in __classPrivateFieldGet(this, _DeviceInformationManager_information, "f"));
}, _DeviceInformationManager_update = function _DeviceInformationManager_update(partialDeviceInformation) {
    _console$l.log({ partialDeviceInformation });
    const deviceInformationNames = Object.keys(partialDeviceInformation);
    deviceInformationNames.forEach((deviceInformationName) => {
        __classPrivateFieldGet(this, _DeviceInformationManager_instances, "a", _DeviceInformationManager_dispatchEvent_get).call(this, deviceInformationName, {
            [deviceInformationName]: partialDeviceInformation[deviceInformationName],
        });
    });
    Object.assign(__classPrivateFieldGet(this, _DeviceInformationManager_information, "f"), partialDeviceInformation);
    _console$l.log({ deviceInformation: __classPrivateFieldGet(this, _DeviceInformationManager_information, "f") });
    if (__classPrivateFieldGet(this, _DeviceInformationManager_instances, "a", _DeviceInformationManager_isComplete_get)) {
        _console$l.log("completed deviceInformation");
        __classPrivateFieldGet(this, _DeviceInformationManager_instances, "a", _DeviceInformationManager_dispatchEvent_get).call(this, "deviceInformation", { deviceInformation: this.information });
    }
};

var _InformationManager_instances, _InformationManager_dispatchEvent_get, _InformationManager_isCharging, _InformationManager_updateIsCharging, _InformationManager_batteryCurrent, _InformationManager_updateBatteryCurrent, _InformationManager_id, _InformationManager_updateId, _InformationManager_name, _InformationManager_type, _InformationManager_assertValidDeviceType, _InformationManager_assertValidDeviceTypeEnum, _InformationManager_setTypeEnum, _InformationManager_mtu, _InformationManager_updateMtu, _InformationManager_isCurrentTimeSet, _InformationManager_onCurrentTime, _InformationManager_setCurrentTime;
const _console$k = createConsole("InformationManager", { log: true });
const DeviceTypes = ["leftInsole", "rightInsole"];
const InsoleSides = ["left", "right"];
const MinNameLength = 2;
const MaxNameLength = 30;
const InformationMessageTypes = [
    "isCharging",
    "getBatteryCurrent",
    "getMtu",
    "getId",
    "getName",
    "setName",
    "getType",
    "setType",
    "getCurrentTime",
    "setCurrentTime",
];
const InformationEventTypes = InformationMessageTypes;
class InformationManager {
    constructor() {
        _InformationManager_instances.add(this);
        _InformationManager_isCharging.set(this, false);
        _InformationManager_batteryCurrent.set(this, void 0);
        _InformationManager_id.set(this, void 0);
        _InformationManager_name.set(this, "");
        _InformationManager_type.set(this, void 0);
        _InformationManager_mtu.set(this, 0);
        _InformationManager_isCurrentTimeSet.set(this, false);
        autoBind$1(this);
    }
    get waitForEvent() {
        return this.eventDispatcher.waitForEvent;
    }
    get isCharging() {
        return __classPrivateFieldGet(this, _InformationManager_isCharging, "f");
    }
    get batteryCurrent() {
        return __classPrivateFieldGet(this, _InformationManager_batteryCurrent, "f");
    }
    async getBatteryCurrent() {
        _console$k.log("getting battery current...");
        const promise = this.waitForEvent("getBatteryCurrent");
        this.sendMessage([{ type: "getBatteryCurrent" }]);
        await promise;
    }
    get id() {
        return __classPrivateFieldGet(this, _InformationManager_id, "f");
    }
    get name() {
        return __classPrivateFieldGet(this, _InformationManager_name, "f");
    }
    updateName(updatedName) {
        _console$k.assertTypeWithError(updatedName, "string");
        __classPrivateFieldSet(this, _InformationManager_name, updatedName, "f");
        _console$k.log({ updatedName: __classPrivateFieldGet(this, _InformationManager_name, "f") });
        __classPrivateFieldGet(this, _InformationManager_instances, "a", _InformationManager_dispatchEvent_get).call(this, "getName", { name: __classPrivateFieldGet(this, _InformationManager_name, "f") });
    }
    async setName(newName) {
        _console$k.assertTypeWithError(newName, "string");
        _console$k.assertWithError(newName.length >= MinNameLength, `name must be greater than ${MinNameLength} characters long ("${newName}" is ${newName.length} characters long)`);
        _console$k.assertWithError(newName.length < MaxNameLength, `name must be less than ${MaxNameLength} characters long ("${newName}" is ${newName.length} characters long)`);
        const setNameData = textEncoder.encode(newName);
        _console$k.log({ setNameData });
        const promise = this.waitForEvent("getName");
        this.sendMessage([{ type: "setName", data: setNameData.buffer }]);
        await promise;
    }
    get type() {
        return __classPrivateFieldGet(this, _InformationManager_type, "f");
    }
    get typeEnum() {
        return DeviceTypes.indexOf(this.type);
    }
    updateType(updatedType) {
        __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_assertValidDeviceType).call(this, updatedType);
        if (updatedType == this.type) {
            _console$k.log("redundant type assignment");
            return;
        }
        __classPrivateFieldSet(this, _InformationManager_type, updatedType, "f");
        _console$k.log({ updatedType: __classPrivateFieldGet(this, _InformationManager_type, "f") });
        __classPrivateFieldGet(this, _InformationManager_instances, "a", _InformationManager_dispatchEvent_get).call(this, "getType", { type: __classPrivateFieldGet(this, _InformationManager_type, "f") });
    }
    async setType(newType) {
        __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_assertValidDeviceType).call(this, newType);
        const newTypeEnum = DeviceTypes.indexOf(newType);
        __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_setTypeEnum).call(this, newTypeEnum);
    }
    get isInsole() {
        switch (this.type) {
            case "leftInsole":
            case "rightInsole":
                return true;
            default:
                return false;
        }
    }
    get insoleSide() {
        switch (this.type) {
            case "leftInsole":
                return "left";
            case "rightInsole":
                return "right";
        }
    }
    get mtu() {
        return __classPrivateFieldGet(this, _InformationManager_mtu, "f");
    }
    get isCurrentTimeSet() {
        return __classPrivateFieldGet(this, _InformationManager_isCurrentTimeSet, "f");
    }
    parseMessage(messageType, dataView) {
        _console$k.log({ messageType });
        switch (messageType) {
            case "isCharging":
                const isCharging = Boolean(dataView.getUint8(0));
                _console$k.log({ isCharging });
                __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_updateIsCharging).call(this, isCharging);
                break;
            case "getBatteryCurrent":
                const batteryCurrent = dataView.getFloat32(0, true);
                _console$k.log({ batteryCurrent });
                __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_updateBatteryCurrent).call(this, batteryCurrent);
                break;
            case "getId":
                const id = textDecoder.decode(dataView.buffer);
                _console$k.log({ id });
                __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_updateId).call(this, id);
                break;
            case "getName":
            case "setName":
                const name = textDecoder.decode(dataView.buffer);
                _console$k.log({ name });
                this.updateName(name);
                break;
            case "getType":
            case "setType":
                const typeEnum = dataView.getUint8(0);
                const type = DeviceTypes[typeEnum];
                _console$k.log({ typeEnum, type });
                this.updateType(type);
                break;
            case "getMtu":
                const mtu = dataView.getUint16(0, true);
                _console$k.log({ mtu });
                __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_updateMtu).call(this, mtu);
                break;
            case "getCurrentTime":
            case "setCurrentTime":
                const currentTime = Number(dataView.getBigUint64(0, true));
                __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_onCurrentTime).call(this, currentTime);
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
    clear() {
        __classPrivateFieldSet(this, _InformationManager_isCurrentTimeSet, false, "f");
    }
}
_InformationManager_isCharging = new WeakMap(), _InformationManager_batteryCurrent = new WeakMap(), _InformationManager_id = new WeakMap(), _InformationManager_name = new WeakMap(), _InformationManager_type = new WeakMap(), _InformationManager_mtu = new WeakMap(), _InformationManager_isCurrentTimeSet = new WeakMap(), _InformationManager_instances = new WeakSet(), _InformationManager_dispatchEvent_get = function _InformationManager_dispatchEvent_get() {
    return this.eventDispatcher.dispatchEvent;
}, _InformationManager_updateIsCharging = function _InformationManager_updateIsCharging(updatedIsCharging) {
    _console$k.assertTypeWithError(updatedIsCharging, "boolean");
    __classPrivateFieldSet(this, _InformationManager_isCharging, updatedIsCharging, "f");
    _console$k.log({ isCharging: __classPrivateFieldGet(this, _InformationManager_isCharging, "f") });
    __classPrivateFieldGet(this, _InformationManager_instances, "a", _InformationManager_dispatchEvent_get).call(this, "isCharging", { isCharging: __classPrivateFieldGet(this, _InformationManager_isCharging, "f") });
}, _InformationManager_updateBatteryCurrent = function _InformationManager_updateBatteryCurrent(updatedBatteryCurrent) {
    _console$k.assertTypeWithError(updatedBatteryCurrent, "number");
    __classPrivateFieldSet(this, _InformationManager_batteryCurrent, updatedBatteryCurrent, "f");
    _console$k.log({ batteryCurrent: __classPrivateFieldGet(this, _InformationManager_batteryCurrent, "f") });
    __classPrivateFieldGet(this, _InformationManager_instances, "a", _InformationManager_dispatchEvent_get).call(this, "getBatteryCurrent", { batteryCurrent: __classPrivateFieldGet(this, _InformationManager_batteryCurrent, "f") });
}, _InformationManager_updateId = function _InformationManager_updateId(updatedId) {
    _console$k.assertTypeWithError(updatedId, "string");
    __classPrivateFieldSet(this, _InformationManager_id, updatedId, "f");
    _console$k.log({ id: __classPrivateFieldGet(this, _InformationManager_id, "f") });
    __classPrivateFieldGet(this, _InformationManager_instances, "a", _InformationManager_dispatchEvent_get).call(this, "getId", { id: __classPrivateFieldGet(this, _InformationManager_id, "f") });
}, _InformationManager_assertValidDeviceType = function _InformationManager_assertValidDeviceType(type) {
    _console$k.assertEnumWithError(type, DeviceTypes);
}, _InformationManager_assertValidDeviceTypeEnum = function _InformationManager_assertValidDeviceTypeEnum(typeEnum) {
    _console$k.assertTypeWithError(typeEnum, "number");
    _console$k.assertWithError(typeEnum in DeviceTypes, `invalid typeEnum ${typeEnum}`);
}, _InformationManager_setTypeEnum = async function _InformationManager_setTypeEnum(newTypeEnum) {
    __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_assertValidDeviceTypeEnum).call(this, newTypeEnum);
    const setTypeData = Uint8Array.from([newTypeEnum]);
    _console$k.log({ setTypeData });
    const promise = this.waitForEvent("getType");
    this.sendMessage([{ type: "setType", data: setTypeData.buffer }]);
    await promise;
}, _InformationManager_updateMtu = function _InformationManager_updateMtu(newMtu) {
    _console$k.assertTypeWithError(newMtu, "number");
    if (__classPrivateFieldGet(this, _InformationManager_mtu, "f") == newMtu) {
        _console$k.log("redundant mtu assignment", newMtu);
        return;
    }
    __classPrivateFieldSet(this, _InformationManager_mtu, newMtu, "f");
    __classPrivateFieldGet(this, _InformationManager_instances, "a", _InformationManager_dispatchEvent_get).call(this, "getMtu", { mtu: __classPrivateFieldGet(this, _InformationManager_mtu, "f") });
}, _InformationManager_onCurrentTime = function _InformationManager_onCurrentTime(currentTime) {
    _console$k.log({ currentTime });
    __classPrivateFieldSet(this, _InformationManager_isCurrentTimeSet, currentTime != 0 || Math.abs(Date.now() - currentTime) < Uint16Max, "f");
    if (!__classPrivateFieldGet(this, _InformationManager_isCurrentTimeSet, "f")) {
        __classPrivateFieldGet(this, _InformationManager_instances, "m", _InformationManager_setCurrentTime).call(this);
    }
}, _InformationManager_setCurrentTime = async function _InformationManager_setCurrentTime() {
    _console$k.log("setting current time...");
    const dataView = new DataView(new ArrayBuffer(8));
    dataView.setBigUint64(0, BigInt(Date.now()), true);
    const promise = this.waitForEvent("getCurrentTime");
    this.sendMessage([{ type: "setCurrentTime", data: dataView.buffer }]);
    await promise;
};

const VibrationWaveformEffects = [
    "none",
    "strongClick100",
    "strongClick60",
    "strongClick30",
    "sharpClick100",
    "sharpClick60",
    "sharpClick30",
    "softBump100",
    "softBump60",
    "softBump30",
    "doubleClick100",
    "doubleClick60",
    "tripleClick100",
    "softFuzz60",
    "strongBuzz100",
    "alert750ms",
    "alert1000ms",
    "strongClick1_100",
    "strongClick2_80",
    "strongClick3_60",
    "strongClick4_30",
    "mediumClick100",
    "mediumClick80",
    "mediumClick60",
    "sharpTick100",
    "sharpTick80",
    "sharpTick60",
    "shortDoubleClickStrong100",
    "shortDoubleClickStrong80",
    "shortDoubleClickStrong60",
    "shortDoubleClickStrong30",
    "shortDoubleClickMedium100",
    "shortDoubleClickMedium80",
    "shortDoubleClickMedium60",
    "shortDoubleSharpTick100",
    "shortDoubleSharpTick80",
    "shortDoubleSharpTick60",
    "longDoubleSharpClickStrong100",
    "longDoubleSharpClickStrong80",
    "longDoubleSharpClickStrong60",
    "longDoubleSharpClickStrong30",
    "longDoubleSharpClickMedium100",
    "longDoubleSharpClickMedium80",
    "longDoubleSharpClickMedium60",
    "longDoubleSharpTick100",
    "longDoubleSharpTick80",
    "longDoubleSharpTick60",
    "buzz100",
    "buzz80",
    "buzz60",
    "buzz40",
    "buzz20",
    "pulsingStrong100",
    "pulsingStrong60",
    "pulsingMedium100",
    "pulsingMedium60",
    "pulsingSharp100",
    "pulsingSharp60",
    "transitionClick100",
    "transitionClick80",
    "transitionClick60",
    "transitionClick40",
    "transitionClick20",
    "transitionClick10",
    "transitionHum100",
    "transitionHum80",
    "transitionHum60",
    "transitionHum40",
    "transitionHum20",
    "transitionHum10",
    "transitionRampDownLongSmooth2_100",
    "transitionRampDownLongSmooth1_100",
    "transitionRampDownMediumSmooth1_100",
    "transitionRampDownMediumSmooth2_100",
    "transitionRampDownShortSmooth1_100",
    "transitionRampDownShortSmooth2_100",
    "transitionRampDownLongSharp1_100",
    "transitionRampDownLongSharp2_100",
    "transitionRampDownMediumSharp1_100",
    "transitionRampDownMediumSharp2_100",
    "transitionRampDownShortSharp1_100",
    "transitionRampDownShortSharp2_100",
    "transitionRampUpLongSmooth1_100",
    "transitionRampUpLongSmooth2_100",
    "transitionRampUpMediumSmooth1_100",
    "transitionRampUpMediumSmooth2_100",
    "transitionRampUpShortSmooth1_100",
    "transitionRampUpShortSmooth2_100",
    "transitionRampUpLongSharp1_100",
    "transitionRampUpLongSharp2_100",
    "transitionRampUpMediumSharp1_100",
    "transitionRampUpMediumSharp2_100",
    "transitionRampUpShortSharp1_100",
    "transitionRampUpShortSharp2_100",
    "transitionRampDownLongSmooth1_50",
    "transitionRampDownLongSmooth2_50",
    "transitionRampDownMediumSmooth1_50",
    "transitionRampDownMediumSmooth2_50",
    "transitionRampDownShortSmooth1_50",
    "transitionRampDownShortSmooth2_50",
    "transitionRampDownLongSharp1_50",
    "transitionRampDownLongSharp2_50",
    "transitionRampDownMediumSharp1_50",
    "transitionRampDownMediumSharp2_50",
    "transitionRampDownShortSharp1_50",
    "transitionRampDownShortSharp2_50",
    "transitionRampUpLongSmooth1_50",
    "transitionRampUpLongSmooth2_50",
    "transitionRampUpMediumSmooth1_50",
    "transitionRampUpMediumSmooth2_50",
    "transitionRampUpShortSmooth1_50",
    "transitionRampUpShortSmooth2_50",
    "transitionRampUpLongSharp1_50",
    "transitionRampUpLongSharp2_50",
    "transitionRampUpMediumSharp1_50",
    "transitionRampUpMediumSharp2_50",
    "transitionRampUpShortSharp1_50",
    "transitionRampUpShortSharp2_50",
    "longBuzz100",
    "smoothHum50",
    "smoothHum40",
    "smoothHum30",
    "smoothHum20",
    "smoothHum10",
];

var _VibrationManager_instances, _VibrationManager_verifyLocation, _VibrationManager_verifyLocations, _VibrationManager_createLocationsBitmask, _VibrationManager_assertNonEmptyArray, _VibrationManager_verifyWaveformEffect, _VibrationManager_verifyWaveformEffectSegment, _VibrationManager_verifyWaveformEffectSegmentLoopCount, _VibrationManager_verifyWaveformEffectSegments, _VibrationManager_verifyWaveformEffectSequenceLoopCount, _VibrationManager_verifyWaveformSegment, _VibrationManager_verifyWaveformSegments, _VibrationManager_createWaveformEffectsData, _VibrationManager_createWaveformData, _VibrationManager_verifyVibrationType, _VibrationManager_createData;
const _console$j = createConsole("VibrationManager");
const VibrationLocations = ["front", "rear"];
const VibrationTypes = ["waveformEffect", "waveform"];
const VibrationMessageTypes = ["triggerVibration"];
const MaxNumberOfVibrationWaveformEffectSegments = 8;
const MaxVibrationWaveformSegmentDuration = 2550;
const MaxVibrationWaveformEffectSegmentDelay = 1270;
const MaxVibrationWaveformEffectSegmentLoopCount = 3;
const MaxNumberOfVibrationWaveformSegments = 20;
const MaxVibrationWaveformEffectSequenceLoopCount = 6;
class VibrationManager {
    constructor() {
        _VibrationManager_instances.add(this);
        autoBind$1(this);
    }
    async triggerVibration(vibrationConfigurations, sendImmediately = true) {
        let triggerVibrationData;
        vibrationConfigurations.forEach((vibrationConfiguration) => {
            const { type } = vibrationConfiguration;
            let { locations } = vibrationConfiguration;
            locations = locations || VibrationLocations.slice();
            let arrayBuffer;
            switch (type) {
                case "waveformEffect":
                    {
                        const { segments, loopCount } = vibrationConfiguration;
                        arrayBuffer = __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_createWaveformEffectsData).call(this, locations, segments, loopCount);
                    }
                    break;
                case "waveform":
                    {
                        const { segments } = vibrationConfiguration;
                        arrayBuffer = __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_createWaveformData).call(this, locations, segments);
                    }
                    break;
                default:
                    throw Error(`invalid vibration type "${type}"`);
            }
            _console$j.log({ type, arrayBuffer });
            triggerVibrationData = concatenateArrayBuffers(triggerVibrationData, arrayBuffer);
        });
        await this.sendMessage([{ type: "triggerVibration", data: triggerVibrationData }], sendImmediately);
    }
}
_VibrationManager_instances = new WeakSet(), _VibrationManager_verifyLocation = function _VibrationManager_verifyLocation(location) {
    _console$j.assertTypeWithError(location, "string");
    _console$j.assertWithError(VibrationLocations.includes(location), `invalid location "${location}"`);
}, _VibrationManager_verifyLocations = function _VibrationManager_verifyLocations(locations) {
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_assertNonEmptyArray).call(this, locations);
    locations.forEach((location) => {
        __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyLocation).call(this, location);
    });
}, _VibrationManager_createLocationsBitmask = function _VibrationManager_createLocationsBitmask(locations) {
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyLocations).call(this, locations);
    let locationsBitmask = 0;
    locations.forEach((location) => {
        const locationIndex = VibrationLocations.indexOf(location);
        locationsBitmask |= 1 << locationIndex;
    });
    _console$j.log({ locationsBitmask });
    _console$j.assertWithError(locationsBitmask > 0, `locationsBitmask must not be zero`);
    return locationsBitmask;
}, _VibrationManager_assertNonEmptyArray = function _VibrationManager_assertNonEmptyArray(array) {
    _console$j.assertWithError(Array.isArray(array), "passed non-array");
    _console$j.assertWithError(array.length > 0, "passed empty array");
}, _VibrationManager_verifyWaveformEffect = function _VibrationManager_verifyWaveformEffect(waveformEffect) {
    _console$j.assertWithError(VibrationWaveformEffects.includes(waveformEffect), `invalid waveformEffect "${waveformEffect}"`);
}, _VibrationManager_verifyWaveformEffectSegment = function _VibrationManager_verifyWaveformEffectSegment(waveformEffectSegment) {
    if (waveformEffectSegment.effect != undefined) {
        const waveformEffect = waveformEffectSegment.effect;
        __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformEffect).call(this, waveformEffect);
    }
    else if (waveformEffectSegment.delay != undefined) {
        const { delay } = waveformEffectSegment;
        _console$j.assertWithError(delay >= 0, `delay must be 0ms or greater (got ${delay})`);
        _console$j.assertWithError(delay <= MaxVibrationWaveformEffectSegmentDelay, `delay must be ${MaxVibrationWaveformEffectSegmentDelay}ms or less (got ${delay})`);
    }
    else {
        throw Error("no effect or delay found in waveformEffectSegment");
    }
    if (waveformEffectSegment.loopCount != undefined) {
        const { loopCount } = waveformEffectSegment;
        __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformEffectSegmentLoopCount).call(this, loopCount);
    }
}, _VibrationManager_verifyWaveformEffectSegmentLoopCount = function _VibrationManager_verifyWaveformEffectSegmentLoopCount(waveformEffectSegmentLoopCount) {
    _console$j.assertTypeWithError(waveformEffectSegmentLoopCount, "number");
    _console$j.assertWithError(waveformEffectSegmentLoopCount >= 0, `waveformEffectSegmentLoopCount must be 0 or greater (got ${waveformEffectSegmentLoopCount})`);
    _console$j.assertWithError(waveformEffectSegmentLoopCount <= MaxVibrationWaveformEffectSegmentLoopCount, `waveformEffectSegmentLoopCount must be ${MaxVibrationWaveformEffectSegmentLoopCount} or fewer (got ${waveformEffectSegmentLoopCount})`);
}, _VibrationManager_verifyWaveformEffectSegments = function _VibrationManager_verifyWaveformEffectSegments(waveformEffectSegments) {
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_assertNonEmptyArray).call(this, waveformEffectSegments);
    _console$j.assertWithError(waveformEffectSegments.length <= MaxNumberOfVibrationWaveformEffectSegments, `must have ${MaxNumberOfVibrationWaveformEffectSegments} waveformEffectSegments or fewer (got ${waveformEffectSegments.length})`);
    waveformEffectSegments.forEach((waveformEffectSegment) => {
        __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformEffectSegment).call(this, waveformEffectSegment);
    });
}, _VibrationManager_verifyWaveformEffectSequenceLoopCount = function _VibrationManager_verifyWaveformEffectSequenceLoopCount(waveformEffectSequenceLoopCount) {
    _console$j.assertTypeWithError(waveformEffectSequenceLoopCount, "number");
    _console$j.assertWithError(waveformEffectSequenceLoopCount >= 0, `waveformEffectSequenceLoopCount must be 0 or greater (got ${waveformEffectSequenceLoopCount})`);
    _console$j.assertWithError(waveformEffectSequenceLoopCount <= MaxVibrationWaveformEffectSequenceLoopCount, `waveformEffectSequenceLoopCount must be ${MaxVibrationWaveformEffectSequenceLoopCount} or fewer (got ${waveformEffectSequenceLoopCount})`);
}, _VibrationManager_verifyWaveformSegment = function _VibrationManager_verifyWaveformSegment(waveformSegment) {
    _console$j.assertTypeWithError(waveformSegment.amplitude, "number");
    _console$j.assertWithError(waveformSegment.amplitude >= 0, `amplitude must be 0 or greater (got ${waveformSegment.amplitude})`);
    _console$j.assertWithError(waveformSegment.amplitude <= 1, `amplitude must be 1 or less (got ${waveformSegment.amplitude})`);
    _console$j.assertTypeWithError(waveformSegment.duration, "number");
    _console$j.assertWithError(waveformSegment.duration > 0, `duration must be greater than 0ms (got ${waveformSegment.duration}ms)`);
    _console$j.assertWithError(waveformSegment.duration <= MaxVibrationWaveformSegmentDuration, `duration must be ${MaxVibrationWaveformSegmentDuration}ms or less (got ${waveformSegment.duration}ms)`);
}, _VibrationManager_verifyWaveformSegments = function _VibrationManager_verifyWaveformSegments(waveformSegments) {
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_assertNonEmptyArray).call(this, waveformSegments);
    _console$j.assertWithError(waveformSegments.length <= MaxNumberOfVibrationWaveformSegments, `must have ${MaxNumberOfVibrationWaveformSegments} waveformSegments or fewer (got ${waveformSegments.length})`);
    waveformSegments.forEach((waveformSegment) => {
        __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformSegment).call(this, waveformSegment);
    });
}, _VibrationManager_createWaveformEffectsData = function _VibrationManager_createWaveformEffectsData(locations, waveformEffectSegments, waveformEffectSequenceLoopCount = 0) {
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformEffectSegments).call(this, waveformEffectSegments);
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformEffectSequenceLoopCount).call(this, waveformEffectSequenceLoopCount);
    let dataArray = [];
    let byteOffset = 0;
    const hasAtLeast1WaveformEffectWithANonzeroLoopCount = waveformEffectSegments.some((waveformEffectSegment) => {
        const { loopCount } = waveformEffectSegment;
        return loopCount != undefined && loopCount > 0;
    });
    const includeAllWaveformEffectSegments = hasAtLeast1WaveformEffectWithANonzeroLoopCount || waveformEffectSequenceLoopCount != 0;
    for (let index = 0; index < waveformEffectSegments.length ||
        (includeAllWaveformEffectSegments && index < MaxNumberOfVibrationWaveformEffectSegments); index++) {
        const waveformEffectSegment = waveformEffectSegments[index] || { effect: "none" };
        if (waveformEffectSegment.effect != undefined) {
            const waveformEffect = waveformEffectSegment.effect;
            dataArray[byteOffset++] = VibrationWaveformEffects.indexOf(waveformEffect);
        }
        else if (waveformEffectSegment.delay != undefined) {
            const { delay } = waveformEffectSegment;
            dataArray[byteOffset++] = (1 << 7) | Math.floor(delay / 10);
        }
        else {
            throw Error("invalid waveformEffectSegment");
        }
    }
    const includeAllWaveformEffectSegmentLoopCounts = waveformEffectSequenceLoopCount != 0;
    for (let index = 0; index < waveformEffectSegments.length ||
        (includeAllWaveformEffectSegmentLoopCounts && index < MaxNumberOfVibrationWaveformEffectSegments); index++) {
        const waveformEffectSegmentLoopCount = waveformEffectSegments[index]?.loopCount || 0;
        if (index == 0 || index == 4) {
            dataArray[byteOffset] = 0;
        }
        const bitOffset = 2 * (index % 4);
        dataArray[byteOffset] |= waveformEffectSegmentLoopCount << bitOffset;
        if (index == 3 || index == 7) {
            byteOffset++;
        }
    }
    if (waveformEffectSequenceLoopCount != 0) {
        dataArray[byteOffset++] = waveformEffectSequenceLoopCount;
    }
    const dataView = new DataView(Uint8Array.from(dataArray).buffer);
    _console$j.log({ dataArray, dataView });
    return __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_createData).call(this, locations, "waveformEffect", dataView);
}, _VibrationManager_createWaveformData = function _VibrationManager_createWaveformData(locations, waveformSegments) {
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyWaveformSegments).call(this, waveformSegments);
    const dataView = new DataView(new ArrayBuffer(waveformSegments.length * 2));
    waveformSegments.forEach((waveformSegment, index) => {
        dataView.setUint8(index * 2, Math.floor(waveformSegment.amplitude * 127));
        dataView.setUint8(index * 2 + 1, Math.floor(waveformSegment.duration / 10));
    });
    _console$j.log({ dataView });
    return __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_createData).call(this, locations, "waveform", dataView);
}, _VibrationManager_verifyVibrationType = function _VibrationManager_verifyVibrationType(vibrationType) {
    _console$j.assertTypeWithError(vibrationType, "string");
    _console$j.assertWithError(VibrationTypes.includes(vibrationType), `invalid vibrationType "${vibrationType}"`);
}, _VibrationManager_createData = function _VibrationManager_createData(locations, vibrationType, dataView) {
    _console$j.assertWithError(dataView?.byteLength > 0, "no data received");
    const locationsBitmask = __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_createLocationsBitmask).call(this, locations);
    __classPrivateFieldGet(this, _VibrationManager_instances, "m", _VibrationManager_verifyVibrationType).call(this, vibrationType);
    const vibrationTypeIndex = VibrationTypes.indexOf(vibrationType);
    _console$j.log({ locationsBitmask, vibrationTypeIndex, dataView });
    const data = concatenateArrayBuffers(locationsBitmask, vibrationTypeIndex, dataView.byteLength, dataView);
    _console$j.log({ data });
    return data;
};

var _BaseConnectionManager_instances, _a$4, _BaseConnectionManager_AssertValidTxRxMessageType, _BaseConnectionManager_assertIsSupported, _BaseConnectionManager_status, _BaseConnectionManager_assertIsNotConnected, _BaseConnectionManager_assertIsNotConnecting, _BaseConnectionManager_assertIsConnected, _BaseConnectionManager_assertIsNotDisconnecting, _BaseConnectionManager_assertIsConnectedAndNotDisconnecting, _BaseConnectionManager_pendingMessages, _BaseConnectionManager_onRxMessage, _BaseConnectionManager_timer, _BaseConnectionManager_checkConnection;
const _console$i = createConsole("BaseConnectionManager", { log: true });
const ConnectionStatuses = ["notConnected", "connecting", "connected", "disconnecting"];
const ConnectionEventTypes = [...ConnectionStatuses, "connectionStatus", "isConnected"];
const TxRxMessageTypes = [
    ...InformationMessageTypes,
    ...SensorConfigurationMessageTypes,
    ...SensorDataMessageTypes,
    ...VibrationMessageTypes,
    ...TfliteMessageTypes,
    ...FileTransferMessageTypes,
];
const SMPMessageTypes = ["smp"];
const BatteryLevelMessageTypes = ["batteryLevel"];
const MetaConnectionMessageTypes = ["rx", "tx"];
const ConnectionMessageTypes = [
    ...BatteryLevelMessageTypes,
    ...DeviceInformationMessageTypes,
    ...MetaConnectionMessageTypes,
    ...TxRxMessageTypes,
    ...SMPMessageTypes,
];
class BaseConnectionManager {
    get baseConstructor() {
        return this.constructor;
    }
    static get isSupported() {
        return false;
    }
    get isSupported() {
        return this.baseConstructor.isSupported;
    }
    get type() {
        return this.baseConstructor.type;
    }
    constructor() {
        _BaseConnectionManager_instances.add(this);
        _BaseConnectionManager_status.set(this, "notConnected");
        _BaseConnectionManager_pendingMessages.set(this, []);
        _BaseConnectionManager_timer.set(this, new Timer(__classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_checkConnection).bind(this), 5000));
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsSupported).call(this);
    }
    get status() {
        return __classPrivateFieldGet(this, _BaseConnectionManager_status, "f");
    }
    set status(newConnectionStatus) {
        _console$i.assertEnumWithError(newConnectionStatus, ConnectionStatuses);
        if (__classPrivateFieldGet(this, _BaseConnectionManager_status, "f") == newConnectionStatus) {
            _console$i.log(`tried to assign same connection status "${newConnectionStatus}"`);
            return;
        }
        _console$i.log(`new connection status "${newConnectionStatus}"`);
        __classPrivateFieldSet(this, _BaseConnectionManager_status, newConnectionStatus, "f");
        this.onStatusUpdated(this.status);
        if (this.isConnected) {
            __classPrivateFieldGet(this, _BaseConnectionManager_timer, "f").start();
        }
        else {
            __classPrivateFieldGet(this, _BaseConnectionManager_timer, "f").stop();
        }
        if (__classPrivateFieldGet(this, _BaseConnectionManager_status, "f") == "notConnected") {
            this.mtu = undefined;
        }
    }
    get isConnected() {
        return this.status == "connected";
    }
    async connect() {
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsNotConnected).call(this);
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsNotConnecting).call(this);
        this.status = "connecting";
    }
    get canReconnect() {
        return false;
    }
    async reconnect() {
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsNotConnected).call(this);
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsNotConnecting).call(this);
        _console$i.assert(this.canReconnect, "unable to reconnect");
    }
    async disconnect() {
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsConnected).call(this);
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsNotDisconnecting).call(this);
        this.status = "disconnecting";
        _console$i.log("disconnecting from device...");
    }
    async sendSmpMessage(data) {
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsConnectedAndNotDisconnecting).call(this);
        _console$i.log("sending smp message", data);
    }
    async sendTxMessages(messages, sendImmediately = true) {
        __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsConnectedAndNotDisconnecting).call(this);
        if (messages) {
            __classPrivateFieldGet(this, _BaseConnectionManager_pendingMessages, "f").push(...messages);
        }
        if (!sendImmediately) {
            return;
        }
        _console$i.log("sendTxMessages", __classPrivateFieldGet(this, _BaseConnectionManager_pendingMessages, "f").slice());
        const arrayBuffers = __classPrivateFieldGet(this, _BaseConnectionManager_pendingMessages, "f").map((message) => {
            __classPrivateFieldGet(_a$4, _a$4, "m", _BaseConnectionManager_AssertValidTxRxMessageType).call(_a$4, message.type);
            const messageTypeEnum = TxRxMessageTypes.indexOf(message.type);
            const dataLength = new DataView(new ArrayBuffer(2));
            dataLength.setUint16(0, message.data?.byteLength || 0, true);
            return concatenateArrayBuffers(messageTypeEnum, dataLength, message.data);
        });
        if (this.mtu) {
            while (arrayBuffers.length > 0) {
                let arrayBufferByteLength = 0;
                let arrayBufferCount = 0;
                arrayBuffers.some((arrayBuffer) => {
                    if (arrayBufferByteLength + arrayBuffer.byteLength > this.mtu - 3) {
                        return true;
                    }
                    arrayBufferCount++;
                    arrayBufferByteLength += arrayBuffer.byteLength;
                });
                const arrayBuffersToSend = arrayBuffers.splice(0, arrayBufferCount);
                _console$i.log({ arrayBufferCount, arrayBuffersToSend });
                const arrayBuffer = concatenateArrayBuffers(...arrayBuffersToSend);
                _console$i.log("sending arrayBuffer", arrayBuffer);
                await this.sendTxData(arrayBuffer);
            }
        }
        else {
            const arrayBuffer = concatenateArrayBuffers(...arrayBuffers);
            _console$i.log("sending arrayBuffer", arrayBuffer);
            await this.sendTxData(arrayBuffer);
        }
        __classPrivateFieldGet(this, _BaseConnectionManager_pendingMessages, "f").length = 0;
    }
    async sendTxData(data) {
        _console$i.log("sendTxData", data);
    }
    parseRxMessage(dataView) {
        parseMessage(dataView, TxRxMessageTypes, __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_onRxMessage).bind(this), null, true);
    }
}
_a$4 = BaseConnectionManager, _BaseConnectionManager_status = new WeakMap(), _BaseConnectionManager_pendingMessages = new WeakMap(), _BaseConnectionManager_timer = new WeakMap(), _BaseConnectionManager_instances = new WeakSet(), _BaseConnectionManager_AssertValidTxRxMessageType = function _BaseConnectionManager_AssertValidTxRxMessageType(messageType) {
    _console$i.assertEnumWithError(messageType, TxRxMessageTypes);
}, _BaseConnectionManager_assertIsSupported = function _BaseConnectionManager_assertIsSupported() {
    _console$i.assertWithError(this.isSupported, `${this.constructor.name} is not supported`);
}, _BaseConnectionManager_assertIsNotConnected = function _BaseConnectionManager_assertIsNotConnected() {
    _console$i.assertWithError(!this.isConnected, "device is already connected");
}, _BaseConnectionManager_assertIsNotConnecting = function _BaseConnectionManager_assertIsNotConnecting() {
    _console$i.assertWithError(this.status != "connecting", "device is already connecting");
}, _BaseConnectionManager_assertIsConnected = function _BaseConnectionManager_assertIsConnected() {
    _console$i.assertWithError(this.isConnected, "device is not connected");
}, _BaseConnectionManager_assertIsNotDisconnecting = function _BaseConnectionManager_assertIsNotDisconnecting() {
    _console$i.assertWithError(this.status != "disconnecting", "device is already disconnecting");
}, _BaseConnectionManager_assertIsConnectedAndNotDisconnecting = function _BaseConnectionManager_assertIsConnectedAndNotDisconnecting() {
    __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsConnected).call(this);
    __classPrivateFieldGet(this, _BaseConnectionManager_instances, "m", _BaseConnectionManager_assertIsNotDisconnecting).call(this);
}, _BaseConnectionManager_onRxMessage = function _BaseConnectionManager_onRxMessage(messageType, dataView) {
    _console$i.log({ messageType, dataView });
    this.onMessageReceived(messageType, dataView);
}, _BaseConnectionManager_checkConnection = function _BaseConnectionManager_checkConnection() {
    if (!this.isConnected) {
        _console$i.log("timer detected disconnection");
        this.status = "notConnected";
    }
};

function capitalizeFirstCharacter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

const _console$h = createConsole("EventUtils", { log: false });
function addEventListeners(target, boundEventListeners) {
    let addEventListener = target.addEventListener || target.addListener || target.on || target.AddEventListener;
    _console$h.assertWithError(addEventListener, "no add listener function found for target");
    addEventListener = addEventListener.bind(target);
    Object.entries(boundEventListeners).forEach(([eventType, eventListener]) => {
        addEventListener(eventType, eventListener);
    });
}
function removeEventListeners(target, boundEventListeners) {
    let removeEventListener = target.removeEventListener || target.removeListener || target.RemoveEventListener;
    _console$h.assertWithError(removeEventListener, "no remove listener function found for target");
    removeEventListener = removeEventListener.bind(target);
    Object.entries(boundEventListeners).forEach(([eventType, eventListener]) => {
        removeEventListener(eventType, eventListener);
    });
}

const _console$g = createConsole("bluetoothUUIDs", { log: false });
var BluetoothUUID = webbluetooth.BluetoothUUID;
function generateBluetoothUUID(value) {
    _console$g.assertTypeWithError(value, "string");
    _console$g.assertWithError(value.length == 4, "value must be 4 characters long");
    return `ea6da725-${value}-4f9b-893d-c3913e33b39f`;
}
function stringToCharacteristicUUID(identifier) {
    return BluetoothUUID?.getCharacteristic?.(identifier);
}
function stringToServiceUUID(identifier) {
    return BluetoothUUID?.getService?.(identifier);
}
const bluetoothUUIDs = Object.freeze({
    services: {
        deviceInformation: {
            uuid: stringToServiceUUID("device_information"),
            characteristics: {
                manufacturerName: {
                    uuid: stringToCharacteristicUUID("manufacturer_name_string"),
                },
                modelNumber: {
                    uuid: stringToCharacteristicUUID("model_number_string"),
                },
                hardwareRevision: {
                    uuid: stringToCharacteristicUUID("hardware_revision_string"),
                },
                firmwareRevision: {
                    uuid: stringToCharacteristicUUID("firmware_revision_string"),
                },
                softwareRevision: {
                    uuid: stringToCharacteristicUUID("software_revision_string"),
                },
                pnpId: {
                    uuid: stringToCharacteristicUUID("pnp_id"),
                },
                serialNumber: {
                    uuid: stringToCharacteristicUUID("serial_number_string"),
                },
            },
        },
        battery: {
            uuid: stringToServiceUUID("battery_service"),
            characteristics: {
                batteryLevel: {
                    uuid: stringToCharacteristicUUID("battery_level"),
                },
            },
        },
        main: {
            uuid: generateBluetoothUUID("0000"),
            characteristics: {
                rx: { uuid: generateBluetoothUUID("1000") },
                tx: { uuid: generateBluetoothUUID("1001") },
            },
        },
        smp: {
            uuid: "8d53dc1d-1db7-4cd3-868b-8a527460aa84",
            characteristics: {
                smp: { uuid: "da2e7828-fbce-4e01-ae9e-261174997c48" },
            },
        },
    },
});
const serviceUUIDs = [bluetoothUUIDs.services.main.uuid];
const optionalServiceUUIDs = [
    bluetoothUUIDs.services.deviceInformation.uuid,
    bluetoothUUIDs.services.battery.uuid,
    bluetoothUUIDs.services.smp.uuid,
];
const allServiceUUIDs = [...serviceUUIDs, ...optionalServiceUUIDs];
function getServiceNameFromUUID(serviceUUID) {
    serviceUUID = serviceUUID.toString().toLowerCase();
    const serviceNames = Object.keys(bluetoothUUIDs.services);
    return serviceNames.find((serviceName) => {
        const serviceInfo = bluetoothUUIDs.services[serviceName];
        let serviceInfoUUID = serviceInfo.uuid.toString();
        if (serviceUUID.length == 4) {
            serviceInfoUUID = serviceInfoUUID.slice(4, 8);
        }
        if (!serviceUUID.includes("-")) {
            serviceInfoUUID = serviceInfoUUID.replaceAll("-", "");
        }
        return serviceUUID == serviceInfoUUID;
    });
}
const characteristicUUIDs = [];
const allCharacteristicUUIDs = [];
const allCharacteristicNames = [];
Object.values(bluetoothUUIDs.services).forEach((serviceInfo) => {
    if (!serviceInfo.characteristics) {
        return;
    }
    const characteristicNames = Object.keys(serviceInfo.characteristics);
    characteristicNames.forEach((characteristicName) => {
        const characteristicInfo = serviceInfo.characteristics[characteristicName];
        if (serviceUUIDs.includes(serviceInfo.uuid)) {
            characteristicUUIDs.push(characteristicInfo.uuid);
            characteristicNames.push(characteristicName);
        }
        allCharacteristicUUIDs.push(characteristicInfo.uuid);
        allCharacteristicNames.push(characteristicName);
    });
}, []);
function getCharacteristicNameFromUUID(characteristicUUID) {
    characteristicUUID = characteristicUUID.toString().toLowerCase();
    var characteristicName;
    Object.values(bluetoothUUIDs.services).some((serviceInfo) => {
        const characteristicNames = Object.keys(serviceInfo.characteristics);
        characteristicName = characteristicNames.find((_characteristicName) => {
            const characteristicInfo = serviceInfo.characteristics[_characteristicName];
            let characteristicInfoUUID = characteristicInfo.uuid.toString();
            if (characteristicUUID.length == 4) {
                characteristicInfoUUID = characteristicInfoUUID.slice(4, 8);
            }
            if (!characteristicUUID.includes("-")) {
                characteristicInfoUUID = characteristicInfoUUID.replaceAll("-", "");
            }
            return characteristicUUID == characteristicInfoUUID;
        });
        return characteristicName;
    });
    return characteristicName;
}
function getCharacteristicProperties(characteristicName) {
    const properties = {
        broadcast: false,
        read: true,
        writeWithoutResponse: false,
        write: false,
        notify: false,
        indicate: false,
        authenticatedSignedWrites: false,
        reliableWrite: false,
        writableAuxiliaries: false,
    };
    switch (characteristicName) {
        case "rx":
        case "tx":
        case "smp":
            properties.read = false;
            break;
    }
    switch (characteristicName) {
        case "batteryLevel":
        case "rx":
        case "smp":
            properties.notify = true;
            break;
    }
    switch (characteristicName) {
        case "tx":
        case "smp":
            properties.writeWithoutResponse = true;
            break;
    }
    return properties;
}
const serviceDataUUID = "0000";

const _console$f = createConsole("BluetoothConnectionManager", { log: true });
class BluetoothConnectionManager extends BaseConnectionManager {
    constructor() {
        super(...arguments);
        this.isInRange = true;
    }
    onCharacteristicValueChanged(characteristicName, dataView) {
        if (characteristicName == "rx") {
            this.parseRxMessage(dataView);
        }
        else {
            this.onMessageReceived?.(characteristicName, dataView);
        }
    }
    async writeCharacteristic(characteristicName, data) {
        _console$f.log("writeCharacteristic", ...arguments);
    }
    async sendSmpMessage(data) {
        super.sendSmpMessage(data);
        await this.writeCharacteristic("smp", data);
    }
    async sendTxData(data) {
        super.sendTxData(data);
        await this.writeCharacteristic("tx", data);
    }
}

var _WebBluetoothConnectionManager_instances, _WebBluetoothConnectionManager_boundBluetoothCharacteristicEventListeners, _WebBluetoothConnectionManager_boundBluetoothDeviceEventListeners, _WebBluetoothConnectionManager_device, _WebBluetoothConnectionManager_services, _WebBluetoothConnectionManager_characteristics, _WebBluetoothConnectionManager_getServicesAndCharacteristics, _WebBluetoothConnectionManager_removeEventListeners, _WebBluetoothConnectionManager_onCharacteristicvaluechanged, _WebBluetoothConnectionManager_onCharacteristicValueChanged, _WebBluetoothConnectionManager_onGattserverdisconnected;
const _console$e = createConsole("WebBluetoothConnectionManager", { log: true });
var bluetooth;
if (isInNode) {
    bluetooth = webbluetooth.bluetooth;
}
class WebBluetoothConnectionManager extends BluetoothConnectionManager {
    constructor() {
        super(...arguments);
        _WebBluetoothConnectionManager_instances.add(this);
        _WebBluetoothConnectionManager_boundBluetoothCharacteristicEventListeners.set(this, {
            characteristicvaluechanged: __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_onCharacteristicvaluechanged).bind(this),
        });
        _WebBluetoothConnectionManager_boundBluetoothDeviceEventListeners.set(this, {
            gattserverdisconnected: __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_onGattserverdisconnected).bind(this),
        });
        _WebBluetoothConnectionManager_device.set(this, void 0);
        _WebBluetoothConnectionManager_services.set(this, new Map());
        _WebBluetoothConnectionManager_characteristics.set(this, new Map());
    }
    get bluetoothId() {
        return this.device.id;
    }
    static get isSupported() {
        return Boolean(bluetooth);
    }
    static get type() {
        return "webBluetooth";
    }
    get device() {
        return __classPrivateFieldGet(this, _WebBluetoothConnectionManager_device, "f");
    }
    set device(newDevice) {
        if (__classPrivateFieldGet(this, _WebBluetoothConnectionManager_device, "f") == newDevice) {
            _console$e.log("tried to assign the same BluetoothDevice");
            return;
        }
        if (__classPrivateFieldGet(this, _WebBluetoothConnectionManager_device, "f")) {
            removeEventListeners(__classPrivateFieldGet(this, _WebBluetoothConnectionManager_device, "f"), __classPrivateFieldGet(this, _WebBluetoothConnectionManager_boundBluetoothDeviceEventListeners, "f"));
        }
        if (newDevice) {
            addEventListeners(newDevice, __classPrivateFieldGet(this, _WebBluetoothConnectionManager_boundBluetoothDeviceEventListeners, "f"));
        }
        __classPrivateFieldSet(this, _WebBluetoothConnectionManager_device, newDevice, "f");
    }
    get server() {
        return __classPrivateFieldGet(this, _WebBluetoothConnectionManager_device, "f")?.gatt;
    }
    get isConnected() {
        return this.server?.connected || false;
    }
    async connect() {
        await super.connect();
        try {
            const device = await bluetooth.requestDevice({
                filters: [{ services: serviceUUIDs }],
                optionalServices: isInBrowser ? optionalServiceUUIDs : [],
            });
            _console$e.log("got BluetoothDevice");
            this.device = device;
            _console$e.log("connecting to device...");
            const server = await this.server.connect();
            _console$e.log(`connected to device? ${server.connected}`);
            await __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_getServicesAndCharacteristics).call(this);
            _console$e.log("fully connected");
            this.status = "connected";
        }
        catch (error) {
            _console$e.error(error);
            this.status = "notConnected";
            this.server?.disconnect();
            __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_removeEventListeners).call(this);
        }
    }
    async disconnect() {
        await __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_removeEventListeners).call(this);
        await super.disconnect();
        this.server?.disconnect();
        this.status = "notConnected";
    }
    async writeCharacteristic(characteristicName, data) {
        super.writeCharacteristic(characteristicName, data);
        const characteristic = __classPrivateFieldGet(this, _WebBluetoothConnectionManager_characteristics, "f").get(characteristicName);
        _console$e.assertWithError(characteristic, `${characteristicName} characteristic not found`);
        _console$e.log("writing characteristic", characteristic, data);
        const characteristicProperties = characteristic.properties || getCharacteristicProperties(characteristicName);
        if (characteristicProperties.writeWithoutResponse) {
            _console$e.log("writing without response");
            await characteristic.writeValueWithoutResponse(data);
        }
        else {
            _console$e.log("writing with response");
            await characteristic.writeValueWithResponse(data);
        }
        _console$e.log("wrote characteristic");
        if (characteristicProperties.read && !characteristicProperties.notify) {
            _console$e.log("reading value after write...");
            await characteristic.readValue();
            if (isInBluefy || isInWebBLE) {
                __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_onCharacteristicValueChanged).call(this, characteristic);
            }
        }
    }
    get canReconnect() {
        return Boolean(this.server && !this.server.connected && this.isInRange);
    }
    async reconnect() {
        await super.reconnect();
        _console$e.log("attempting to reconnect...");
        this.status = "connecting";
        try {
            await this.server.connect();
        }
        catch (error) {
            _console$e.error(error);
            this.isInRange = false;
        }
        if (this.isConnected) {
            _console$e.log("successfully reconnected!");
            await __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_getServicesAndCharacteristics).call(this);
            this.status = "connected";
        }
        else {
            _console$e.log("unable to reconnect");
            this.status = "notConnected";
        }
    }
}
_WebBluetoothConnectionManager_boundBluetoothCharacteristicEventListeners = new WeakMap(), _WebBluetoothConnectionManager_boundBluetoothDeviceEventListeners = new WeakMap(), _WebBluetoothConnectionManager_device = new WeakMap(), _WebBluetoothConnectionManager_services = new WeakMap(), _WebBluetoothConnectionManager_characteristics = new WeakMap(), _WebBluetoothConnectionManager_instances = new WeakSet(), _WebBluetoothConnectionManager_getServicesAndCharacteristics = async function _WebBluetoothConnectionManager_getServicesAndCharacteristics() {
    __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_removeEventListeners).call(this);
    _console$e.log("getting services...");
    const services = await this.server.getPrimaryServices();
    _console$e.log("got services", services.length);
    await this.server.getPrimaryService("8d53dc1d-1db7-4cd3-868b-8a527460aa84");
    _console$e.log("getting characteristics...");
    for (const serviceIndex in services) {
        const service = services[serviceIndex];
        _console$e.log({ service });
        const serviceName = getServiceNameFromUUID(service.uuid);
        _console$e.assertWithError(serviceName, `no name found for service uuid "${service.uuid}"`);
        _console$e.log(`got "${serviceName}" service`);
        service.name = serviceName;
        __classPrivateFieldGet(this, _WebBluetoothConnectionManager_services, "f").set(serviceName, service);
        _console$e.log(`getting characteristics for "${serviceName}" service`);
        const characteristics = await service.getCharacteristics();
        _console$e.log(`got characteristics for "${serviceName}" service`);
        for (const characteristicIndex in characteristics) {
            const characteristic = characteristics[characteristicIndex];
            _console$e.log({ characteristic });
            const characteristicName = getCharacteristicNameFromUUID(characteristic.uuid);
            _console$e.assertWithError(Boolean(characteristicName), `no name found for characteristic uuid "${characteristic.uuid}" in "${serviceName}" service`);
            _console$e.log(`got "${characteristicName}" characteristic in "${serviceName}" service`);
            characteristic.name = characteristicName;
            __classPrivateFieldGet(this, _WebBluetoothConnectionManager_characteristics, "f").set(characteristicName, characteristic);
            addEventListeners(characteristic, __classPrivateFieldGet(this, _WebBluetoothConnectionManager_boundBluetoothCharacteristicEventListeners, "f"));
            const characteristicProperties = characteristic.properties || getCharacteristicProperties(characteristicName);
            if (characteristicProperties.notify) {
                _console$e.log(`starting notifications for "${characteristicName}" characteristic`);
                await characteristic.startNotifications();
            }
            if (characteristicProperties.read) {
                _console$e.log(`reading "${characteristicName}" characteristic...`);
                await characteristic.readValue();
                if (isInBluefy || isInWebBLE) {
                    __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_onCharacteristicValueChanged).call(this, characteristic);
                }
            }
        }
    }
}, _WebBluetoothConnectionManager_removeEventListeners = async function _WebBluetoothConnectionManager_removeEventListeners() {
    if (this.device) {
        removeEventListeners(this.device, __classPrivateFieldGet(this, _WebBluetoothConnectionManager_boundBluetoothDeviceEventListeners, "f"));
    }
    const promises = Array.from(__classPrivateFieldGet(this, _WebBluetoothConnectionManager_characteristics, "f").keys()).map((characteristicName) => {
        const characteristic = __classPrivateFieldGet(this, _WebBluetoothConnectionManager_characteristics, "f").get(characteristicName);
        removeEventListeners(characteristic, __classPrivateFieldGet(this, _WebBluetoothConnectionManager_boundBluetoothCharacteristicEventListeners, "f"));
        const characteristicProperties = characteristic.properties || getCharacteristicProperties(characteristicName);
        if (characteristicProperties.notify) {
            _console$e.log(`stopping notifications for "${characteristicName}" characteristic`);
            return characteristic.stopNotifications();
        }
    });
    return Promise.allSettled(promises);
}, _WebBluetoothConnectionManager_onCharacteristicvaluechanged = function _WebBluetoothConnectionManager_onCharacteristicvaluechanged(event) {
    _console$e.log("oncharacteristicvaluechanged");
    const characteristic = event.target;
    __classPrivateFieldGet(this, _WebBluetoothConnectionManager_instances, "m", _WebBluetoothConnectionManager_onCharacteristicValueChanged).call(this, characteristic);
}, _WebBluetoothConnectionManager_onCharacteristicValueChanged = function _WebBluetoothConnectionManager_onCharacteristicValueChanged(characteristic) {
    _console$e.log("onCharacteristicValue");
    const characteristicName = characteristic.name;
    _console$e.assertWithError(Boolean(characteristicName), `no name found for characteristic with uuid "${characteristic.uuid}"`);
    _console$e.log(`oncharacteristicvaluechanged for "${characteristicName}" characteristic`);
    const dataView = characteristic.value;
    _console$e.assertWithError(dataView, `no data found for "${characteristicName}" characteristic`);
    _console$e.log(`data for "${characteristicName}" characteristic`, Array.from(new Uint8Array(dataView.buffer)));
    try {
        this.onCharacteristicValueChanged(characteristicName, dataView);
    }
    catch (error) {
        _console$e.error(error);
    }
}, _WebBluetoothConnectionManager_onGattserverdisconnected = function _WebBluetoothConnectionManager_onGattserverdisconnected() {
    _console$e.log("gattserverdisconnected");
    this.status = "notConnected";
};

const POW_2_24 = 5.960464477539063e-8;
const POW_2_32 = 4294967296;
const POW_2_53 = 9007199254740992;
function encode(value) {
  let data = new ArrayBuffer(256);
  let dataView = new DataView(data);
  let lastLength;
  let offset = 0;
  function prepareWrite(length) {
    let newByteLength = data.byteLength;
    const requiredLength = offset + length;
    while (newByteLength < requiredLength) {
      newByteLength <<= 1;
    }
    if (newByteLength !== data.byteLength) {
      const oldDataView = dataView;
      data = new ArrayBuffer(newByteLength);
      dataView = new DataView(data);
      const uint32count = (offset + 3) >> 2;
      for (let i = 0; i < uint32count; ++i) {
        dataView.setUint32(i << 2, oldDataView.getUint32(i << 2));
      }
    }
    lastLength = length;
    return dataView;
  }
  function commitWrite() {
    offset += lastLength;
  }
  function writeFloat64(value) {
    commitWrite(prepareWrite(8).setFloat64(offset, value));
  }
  function writeUint8(value) {
    commitWrite(prepareWrite(1).setUint8(offset, value));
  }
  function writeUint8Array(value) {
    const dataView = prepareWrite(value.length);
    for (let i = 0; i < value.length; ++i) {
      dataView.setUint8(offset + i, value[i]);
    }
    commitWrite();
  }
  function writeUint16(value) {
    commitWrite(prepareWrite(2).setUint16(offset, value));
  }
  function writeUint32(value) {
    commitWrite(prepareWrite(4).setUint32(offset, value));
  }
  function writeUint64(value) {
    const low = value % POW_2_32;
    const high = (value - low) / POW_2_32;
    const dataView = prepareWrite(8);
    dataView.setUint32(offset, high);
    dataView.setUint32(offset + 4, low);
    commitWrite();
  }
  function writeTypeAndLength(type, length) {
    if (length < 24) {
      writeUint8((type << 5) | length);
    } else if (length < 0x100) {
      writeUint8((type << 5) | 24);
      writeUint8(length);
    } else if (length < 0x10000) {
      writeUint8((type << 5) | 25);
      writeUint16(length);
    } else if (length < 0x100000000) {
      writeUint8((type << 5) | 26);
      writeUint32(length);
    } else {
      writeUint8((type << 5) | 27);
      writeUint64(length);
    }
  }
  function encodeItem(value) {
    let i;
    const utf8data = [];
    let length;
    if (value === false) {
      return writeUint8(0xf4);
    }
    if (value === true) {
      return writeUint8(0xf5);
    }
    if (value === null) {
      return writeUint8(0xf6);
    }
    if (value === undefined) {
      return writeUint8(0xf7);
    }
    switch (typeof value) {
      case "number":
        if (Math.floor(value) === value) {
          if (value >= 0 && value <= POW_2_53) {
            return writeTypeAndLength(0, value);
          }
          if (-POW_2_53 <= value && value < 0) {
            return writeTypeAndLength(1, -(value + 1));
          }
        }
        writeUint8(0xfb);
        return writeFloat64(value);
      case "string":
        for (i = 0; i < value.length; ++i) {
          let charCode = value.charCodeAt(i);
          if (charCode < 0x80) {
            utf8data.push(charCode);
          } else if (charCode < 0x800) {
            utf8data.push(0xc0 | (charCode >> 6));
            utf8data.push(0x80 | (charCode & 0x3f));
          } else if (charCode < 0xd800) {
            utf8data.push(0xe0 | (charCode >> 12));
            utf8data.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8data.push(0x80 | (charCode & 0x3f));
          } else {
            charCode = (charCode & 0x3ff) << 10;
            charCode |= value.charCodeAt(++i) & 0x3ff;
            charCode += 0x10000;
            utf8data.push(0xf0 | (charCode >> 18));
            utf8data.push(0x80 | ((charCode >> 12) & 0x3f));
            utf8data.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8data.push(0x80 | (charCode & 0x3f));
          }
        }
        writeTypeAndLength(3, utf8data.length);
        return writeUint8Array(utf8data);
      default:
        if (Array.isArray(value)) {
          length = value.length;
          writeTypeAndLength(4, length);
          for (i = 0; i < length; ++i) {
            encodeItem(value[i]);
          }
        } else if (value instanceof Uint8Array) {
          writeTypeAndLength(2, value.length);
          writeUint8Array(value);
        } else {
          const keys = Object.keys(value);
          length = keys.length;
          writeTypeAndLength(5, length);
          for (i = 0; i < length; ++i) {
            const key = keys[i];
            encodeItem(key);
            encodeItem(value[key]);
          }
        }
    }
  }
  encodeItem(value);
  if ("slice" in data) {
    return data.slice(0, offset);
  }
  const ret = new ArrayBuffer(offset);
  const retView = new DataView(ret);
  for (let i = 0; i < offset; ++i) {
    retView.setUint8(i, dataView.getUint8(i));
  }
  return ret;
}
function decode(data, tagger, simpleValue) {
  const dataView = new DataView(data);
  let offset = 0;
  if (typeof tagger !== "function") {
    tagger = function (value) {
      return value;
    };
  }
  if (typeof simpleValue !== "function") {
    simpleValue = function () {
      return undefined;
    };
  }
  function commitRead(length, value) {
    offset += length;
    return value;
  }
  function readArrayBuffer(length) {
    return commitRead(length, new Uint8Array(data, offset, length));
  }
  function readFloat16() {
    const tempArrayBuffer = new ArrayBuffer(4);
    const tempDataView = new DataView(tempArrayBuffer);
    const value = readUint16();
    const sign = value & 0x8000;
    let exponent = value & 0x7c00;
    const fraction = value & 0x03ff;
    if (exponent === 0x7c00) {
      exponent = 0xff << 10;
    } else if (exponent !== 0) {
      exponent += (127 - 15) << 10;
    } else if (fraction !== 0) {
      return (sign ? -1 : 1) * fraction * POW_2_24;
    }
    tempDataView.setUint32(0, (sign << 16) | (exponent << 13) | (fraction << 13));
    return tempDataView.getFloat32(0);
  }
  function readFloat32() {
    return commitRead(4, dataView.getFloat32(offset));
  }
  function readFloat64() {
    return commitRead(8, dataView.getFloat64(offset));
  }
  function readUint8() {
    return commitRead(1, dataView.getUint8(offset));
  }
  function readUint16() {
    return commitRead(2, dataView.getUint16(offset));
  }
  function readUint32() {
    return commitRead(4, dataView.getUint32(offset));
  }
  function readUint64() {
    return readUint32() * POW_2_32 + readUint32();
  }
  function readBreak() {
    if (dataView.getUint8(offset) !== 0xff) {
      return false;
    }
    offset += 1;
    return true;
  }
  function readLength(additionalInformation) {
    if (additionalInformation < 24) {
      return additionalInformation;
    }
    if (additionalInformation === 24) {
      return readUint8();
    }
    if (additionalInformation === 25) {
      return readUint16();
    }
    if (additionalInformation === 26) {
      return readUint32();
    }
    if (additionalInformation === 27) {
      return readUint64();
    }
    if (additionalInformation === 31) {
      return -1;
    }
    throw new Error("Invalid length encoding");
  }
  function readIndefiniteStringLength(majorType) {
    const initialByte = readUint8();
    if (initialByte === 0xff) {
      return -1;
    }
    const length = readLength(initialByte & 0x1f);
    if (length < 0 || initialByte >> 5 !== majorType) {
      throw new Error("Invalid indefinite length element");
    }
    return length;
  }
  function appendUtf16Data(utf16data, length) {
    for (let i = 0; i < length; ++i) {
      let value = readUint8();
      if (value & 0x80) {
        if (value < 0xe0) {
          value = ((value & 0x1f) << 6) | (readUint8() & 0x3f);
          length -= 1;
        } else if (value < 0xf0) {
          value = ((value & 0x0f) << 12) | ((readUint8() & 0x3f) << 6) | (readUint8() & 0x3f);
          length -= 2;
        } else {
          value =
            ((value & 0x0f) << 18) | ((readUint8() & 0x3f) << 12) | ((readUint8() & 0x3f) << 6) | (readUint8() & 0x3f);
          length -= 3;
        }
      }
      if (value < 0x10000) {
        utf16data.push(value);
      } else {
        value -= 0x10000;
        utf16data.push(0xd800 | (value >> 10));
        utf16data.push(0xdc00 | (value & 0x3ff));
      }
    }
  }
  function decodeItem() {
    const initialByte = readUint8();
    const majorType = initialByte >> 5;
    const additionalInformation = initialByte & 0x1f;
    let i;
    let length;
    if (majorType === 7) {
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    }
    length = readLength(additionalInformation);
    if (length < 0 && (majorType < 2 || majorType > 6)) {
      throw new Error("Invalid length");
    }
    const utf16data = [];
    let retArray;
    const retObject = {};
    switch (majorType) {
      case 0:
        return length;
      case 1:
        return -1 - length;
      case 2:
        if (length < 0) {
          const elements = [];
          let fullArrayLength = 0;
          while ((length = readIndefiniteStringLength(majorType)) >= 0) {
            fullArrayLength += length;
            elements.push(readArrayBuffer(length));
          }
          const fullArray = new Uint8Array(fullArrayLength);
          let fullArrayOffset = 0;
          for (i = 0; i < elements.length; ++i) {
            fullArray.set(elements[i], fullArrayOffset);
            fullArrayOffset += elements[i].length;
          }
          return fullArray;
        }
        return readArrayBuffer(length);
      case 3:
        if (length < 0) {
          while ((length = readIndefiniteStringLength(majorType)) >= 0) {
            appendUtf16Data(utf16data, length);
          }
        } else {
          appendUtf16Data(utf16data, length);
        }
        return String.fromCharCode.apply(null, utf16data);
      case 4:
        if (length < 0) {
          retArray = [];
          while (!readBreak()) {
            retArray.push(decodeItem());
          }
        } else {
          retArray = new Array(length);
          for (i = 0; i < length; ++i) {
            retArray[i] = decodeItem();
          }
        }
        return retArray;
      case 5:
        for (i = 0; i < length || (length < 0 && !readBreak()); ++i) {
          const key = decodeItem();
          retObject[key] = decodeItem();
        }
        return retObject;
      case 6:
        return tagger(decodeItem(), length);
      case 7:
        switch (length) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return undefined;
          default:
            return simpleValue(length);
        }
    }
  }
  const ret = decodeItem();
  if (offset !== data.byteLength) {
    throw new Error("Remaining bytes");
  }
  return ret;
}
const CBOR = {
  encode,
  decode,
};

const _console$d = createConsole("mcumgr", { log: true });
const constants = {
  MGMT_OP_READ: 0,
  MGMT_OP_READ_RSP: 1,
  MGMT_OP_WRITE: 2,
  MGMT_OP_WRITE_RSP: 3,
  MGMT_GROUP_ID_OS: 0,
  MGMT_GROUP_ID_IMAGE: 1,
  MGMT_GROUP_ID_STAT: 2,
  MGMT_GROUP_ID_CONFIG: 3,
  MGMT_GROUP_ID_LOG: 4,
  MGMT_GROUP_ID_CRASH: 5,
  MGMT_GROUP_ID_SPLIT: 6,
  MGMT_GROUP_ID_RUN: 7,
  MGMT_GROUP_ID_FS: 8,
  MGMT_GROUP_ID_SHELL: 9,
  OS_MGMT_ID_ECHO: 0,
  OS_MGMT_ID_CONS_ECHO_CTRL: 1,
  OS_MGMT_ID_TASKSTAT: 2,
  OS_MGMT_ID_MPSTAT: 3,
  OS_MGMT_ID_DATETIME_STR: 4,
  OS_MGMT_ID_RESET: 5,
  IMG_MGMT_ID_STATE: 0,
  IMG_MGMT_ID_UPLOAD: 1,
  IMG_MGMT_ID_FILE: 2,
  IMG_MGMT_ID_CORELIST: 3,
  IMG_MGMT_ID_CORELOAD: 4,
  IMG_MGMT_ID_ERASE: 5,
  FS_MGMT_ID_FILE: 0,
};
class MCUManager {
  constructor() {
    this._mtu = 256;
    this._messageCallback = null;
    this._imageUploadProgressCallback = null;
    this._imageUploadNextCallback = null;
    this._fileUploadProgressCallback = null;
    this._fileUploadNextCallback = null;
    this._uploadIsInProgress = false;
    this._downloadIsInProgress = false;
    this._buffer = new Uint8Array();
    this._seq = 0;
  }
  onMessage(callback) {
    this._messageCallback = callback;
    return this;
  }
  onImageUploadNext(callback) {
    this._imageUploadNextCallback = callback;
    return this;
  }
  onImageUploadProgress(callback) {
    this._imageUploadProgressCallback = callback;
    return this;
  }
  onImageUploadFinished(callback) {
    this._imageUploadFinishedCallback = callback;
    return this;
  }
  onFileUploadNext(callback) {
    this._fileUploadNextCallback = callback;
    return this;
  }
  onFileUploadProgress(callback) {
    this._fileUploadProgressCallback = callback;
    return this;
  }
  onFileUploadFinished(callback) {
    this._fileUploadFinishedCallback = callback;
    return this;
  }
  onFileDownloadNext(callback) {
    this._fileDownloadNextCallback = callback;
    return this;
  }
  onFileDownloadProgress(callback) {
    this._fileDownloadProgressCallback = callback;
    return this;
  }
  onFileDownloadFinished(callback) {
    this._fileDownloadFinishedCallback = callback;
    return this;
  }
  _getMessage(op, group, id, data) {
    const _flags = 0;
    let encodedData = [];
    if (typeof data !== "undefined") {
      encodedData = [...new Uint8Array(CBOR.encode(data))];
    }
    const lengthLo = encodedData.length & 255;
    const lengthHi = encodedData.length >> 8;
    const groupLo = group & 255;
    const groupHi = group >> 8;
    const message = [op, _flags, lengthHi, lengthLo, groupHi, groupLo, this._seq, id, ...encodedData];
    this._seq = (this._seq + 1) % 256;
    return message;
  }
  _notification(buffer) {
    _console$d.log("mcumgr - message received");
    const message = new Uint8Array(buffer);
    this._buffer = new Uint8Array([...this._buffer, ...message]);
    const messageLength = this._buffer[2] * 256 + this._buffer[3];
    if (this._buffer.length < messageLength + 8) return;
    this._processMessage(this._buffer.slice(0, messageLength + 8));
    this._buffer = this._buffer.slice(messageLength + 8);
  }
  _processMessage(message) {
    const [op, , lengthHi, lengthLo, groupHi, groupLo, , id] = message;
    const data = CBOR.decode(message.slice(8).buffer);
    const length = lengthHi * 256 + lengthLo;
    const group = groupHi * 256 + groupLo;
    _console$d.log("mcumgr - Process Message - Group: " + group + ", Id: " + id + ", Off: " + data.off);
    if (group === constants.MGMT_GROUP_ID_IMAGE && id === constants.IMG_MGMT_ID_UPLOAD && data.off) {
      this._uploadOffset = data.off;
      this._uploadNext();
      return;
    }
    if (
      op === constants.MGMT_OP_WRITE_RSP &&
      group === constants.MGMT_GROUP_ID_FS &&
      id === constants.FS_MGMT_ID_FILE &&
      data.off
    ) {
      this._uploadFileOffset = data.off;
      this._uploadFileNext();
      return;
    }
    if (op === constants.MGMT_OP_READ_RSP && group === constants.MGMT_GROUP_ID_FS && id === constants.FS_MGMT_ID_FILE) {
      this._downloadFileOffset += data.data.length;
      if (data.len != undefined) {
        this._downloadFileLength = data.len;
      }
      _console$d.log("downloaded " + this._downloadFileOffset + " bytes of " + this._downloadFileLength);
      if (this._downloadFileLength > 0) {
        this._fileDownloadProgressCallback({
          percentage: Math.floor((this._downloadFileOffset / this._downloadFileLength) * 100),
        });
      }
      if (this._messageCallback) this._messageCallback({ op, group, id, data, length });
      this._downloadFileNext();
      return;
    }
    if (this._messageCallback) this._messageCallback({ op, group, id, data, length });
  }
  cmdReset() {
    return this._getMessage(constants.MGMT_OP_WRITE, constants.MGMT_GROUP_ID_OS, constants.OS_MGMT_ID_RESET);
  }
  smpEcho(message) {
    return this._getMessage(constants.MGMT_OP_WRITE, constants.MGMT_GROUP_ID_OS, constants.OS_MGMT_ID_ECHO, {
      d: message,
    });
  }
  cmdImageState() {
    return this._getMessage(constants.MGMT_OP_READ, constants.MGMT_GROUP_ID_IMAGE, constants.IMG_MGMT_ID_STATE);
  }
  cmdImageErase() {
    return this._getMessage(constants.MGMT_OP_WRITE, constants.MGMT_GROUP_ID_IMAGE, constants.IMG_MGMT_ID_ERASE, {});
  }
  cmdImageTest(hash) {
    return this._getMessage(constants.MGMT_OP_WRITE, constants.MGMT_GROUP_ID_IMAGE, constants.IMG_MGMT_ID_STATE, {
      hash,
      confirm: false,
    });
  }
  cmdImageConfirm(hash) {
    return this._getMessage(constants.MGMT_OP_WRITE, constants.MGMT_GROUP_ID_IMAGE, constants.IMG_MGMT_ID_STATE, {
      hash,
      confirm: true,
    });
  }
  _hash(image) {
    return crypto.subtle.digest("SHA-256", image);
  }
  async _uploadNext() {
    if (!this._uploadImage) {
      return;
    }
    if (this._uploadOffset >= this._uploadImage.byteLength) {
      this._uploadIsInProgress = false;
      this._imageUploadFinishedCallback();
      return;
    }
    const nmpOverhead = 8;
    const message = { data: new Uint8Array(), off: this._uploadOffset };
    if (this._uploadOffset === 0) {
      message.len = this._uploadImage.byteLength;
      message.sha = new Uint8Array(await this._hash(this._uploadImage));
    }
    this._imageUploadProgressCallback({
      percentage: Math.floor((this._uploadOffset / this._uploadImage.byteLength) * 100),
    });
    const length = this._mtu - CBOR.encode(message).byteLength - nmpOverhead - 3 - 5;
    message.data = new Uint8Array(this._uploadImage.slice(this._uploadOffset, this._uploadOffset + length));
    this._uploadOffset += length;
    const packet = this._getMessage(
      constants.MGMT_OP_WRITE,
      constants.MGMT_GROUP_ID_IMAGE,
      constants.IMG_MGMT_ID_UPLOAD,
      message
    );
    _console$d.log("mcumgr - _uploadNext: Message Length: " + packet.length);
    this._imageUploadNextCallback({ packet });
  }
  async reset() {
    this._messageCallback = null;
    this._imageUploadProgressCallback = null;
    this._imageUploadNextCallback = null;
    this._fileUploadProgressCallback = null;
    this._fileUploadNextCallback = null;
    this._uploadIsInProgress = false;
    this._downloadIsInProgress = false;
    this._buffer = new Uint8Array();
    this._seq = 0;
  }
  async cmdUpload(image, slot = 0) {
    if (this._uploadIsInProgress) {
      _console$d.error("Upload is already in progress.");
      return;
    }
    this._uploadIsInProgress = true;
    this._uploadOffset = 0;
    this._uploadImage = image;
    this._uploadSlot = slot;
    this._uploadNext();
  }
  async cmdUploadFile(filebuf, destFilename) {
    if (this._uploadIsInProgress) {
      _console$d.error("Upload is already in progress.");
      return;
    }
    this._uploadIsInProgress = true;
    this._uploadFileOffset = 0;
    this._uploadFile = filebuf;
    this._uploadFilename = destFilename;
    this._uploadFileNext();
  }
  async _uploadFileNext() {
    _console$d.log("uploadFileNext - offset: " + this._uploadFileOffset + ", length: " + this._uploadFile.byteLength);
    if (this._uploadFileOffset >= this._uploadFile.byteLength) {
      this._uploadIsInProgress = false;
      this._fileUploadFinishedCallback();
      return;
    }
    const nmpOverhead = 8;
    const message = { data: new Uint8Array(), off: this._uploadFileOffset };
    if (this._uploadFileOffset === 0) {
      message.len = this._uploadFile.byteLength;
    }
    message.name = this._uploadFilename;
    this._fileUploadProgressCallback({
      percentage: Math.floor((this._uploadFileOffset / this._uploadFile.byteLength) * 100),
    });
    const length = this._mtu - CBOR.encode(message).byteLength - nmpOverhead;
    message.data = new Uint8Array(this._uploadFile.slice(this._uploadFileOffset, this._uploadFileOffset + length));
    this._uploadFileOffset += length;
    const packet = this._getMessage(
      constants.MGMT_OP_WRITE,
      constants.MGMT_GROUP_ID_FS,
      constants.FS_MGMT_ID_FILE,
      message
    );
    _console$d.log("mcumgr - _uploadNext: Message Length: " + packet.length);
    this._fileUploadNextCallback({ packet });
  }
  async cmdDownloadFile(filename, destFilename) {
    if (this._downloadIsInProgress) {
      _console$d.error("Download is already in progress.");
      return;
    }
    this._downloadIsInProgress = true;
    this._downloadFileOffset = 0;
    this._downloadFileLength = 0;
    this._downloadRemoteFilename = filename;
    this._downloadLocalFilename = destFilename;
    this._downloadFileNext();
  }
  async _downloadFileNext() {
    if (this._downloadFileLength > 0) {
      if (this._downloadFileOffset >= this._downloadFileLength) {
        this._downloadIsInProgress = false;
        this._fileDownloadFinishedCallback();
        return;
      }
    }
    const message = { off: this._downloadFileOffset };
    if (this._downloadFileOffset === 0) {
      message.name = this._downloadRemoteFilename;
    }
    const packet = this._getMessage(
      constants.MGMT_OP_READ,
      constants.MGMT_GROUP_ID_FS,
      constants.FS_MGMT_ID_FILE,
      message
    );
    _console$d.log("mcumgr - _downloadNext: Message Length: " + packet.length);
    this._fileDownloadNextCallback({ packet });
  }
  async imageInfo(image) {
    const info = {};
    const view = new Uint8Array(image);
    if (view.length < 32) {
      throw new Error("Invalid image (too short file)");
    }
    if (view[0] !== 0x3d || view[1] !== 0xb8 || view[2] !== 0xf3 || view[3] !== 0x96) {
      throw new Error("Invalid image (wrong magic bytes)");
    }
    if (view[4] !== 0x00 || view[5] !== 0x00 || view[6] !== 0x00 || view[7] !== 0x00) {
      throw new Error("Invalid image (wrong load address)");
    }
    const headerSize = view[8] + view[9] * 2 ** 8;
    if (view[10] !== 0x00 || view[11] !== 0x00) {
      throw new Error("Invalid image (wrong protected TLV area size)");
    }
    const imageSize = view[12] + view[13] * 2 ** 8 + view[14] * 2 ** 16 + view[15] * 2 ** 24;
    info.imageSize = imageSize;
    if (view.length < imageSize + headerSize) {
      throw new Error("Invalid image (wrong image size)");
    }
    if (view[16] !== 0x00 || view[17] !== 0x00 || view[18] !== 0x00 || view[19] !== 0x00) {
      throw new Error("Invalid image (wrong flags)");
    }
    const version = `${view[20]}.${view[21]}.${view[22] + view[23] * 2 ** 8}`;
    info.version = version;
    info.hash = [...new Uint8Array(await this._hash(image.slice(0, imageSize + 32)))]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return info;
  }
}

var _FirmwareManager_instances, _FirmwareManager_dispatchEvent_get, _FirmwareManager_status, _FirmwareManager_updateStatus, _FirmwareManager_images, _FirmwareManager_assertImages, _FirmwareManager_assertValidImageIndex, _FirmwareManager_mtu, _FirmwareManager_mcuManager, _FirmwareManager_assignMcuManagerCallbacks, _FirmwareManager_onMcuMessage, _FirmwareManager_onMcuFileDownloadNext, _FirmwareManager_onMcuFileDownloadProgress, _FirmwareManager_onMcuFileDownloadFinished, _FirmwareManager_onMcuFileUploadNext, _FirmwareManager_onMcuFileUploadProgress, _FirmwareManager_onMcuFileUploadFinished, _FirmwareManager_onMcuImageUploadNext, _FirmwareManager_onMcuImageUploadProgress, _FirmwareManager_onMcuImageUploadFinished, _FirmwareManager_onMcuImageState;
const _console$c = createConsole("FirmwareManager", { log: true });
const FirmwareMessageTypes = ["smp"];
const FirmwareEventTypes = [
    ...FirmwareMessageTypes,
    "firmwareImages",
    "firmwareUploadProgress",
    "firmwareStatus",
    "firmwareUploadComplete",
];
const FirmwareStatuses = ["idle", "uploading", "uploaded", "pending", "testing", "erasing"];
class FirmwareManager {
    constructor() {
        _FirmwareManager_instances.add(this);
        _FirmwareManager_status.set(this, "idle");
        _FirmwareManager_images.set(this, void 0);
        _FirmwareManager_mtu.set(this, void 0);
        _FirmwareManager_mcuManager.set(this, new MCUManager());
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_assignMcuManagerCallbacks).call(this);
        autoBind$1(this);
    }
    get addEventListenter() {
        return this.eventDispatcher.addEventListener;
    }
    get removeEventListener() {
        return this.eventDispatcher.removeEventListener;
    }
    get waitForEvent() {
        return this.eventDispatcher.waitForEvent;
    }
    parseMessage(messageType, dataView) {
        _console$c.log({ messageType });
        switch (messageType) {
            case "smp":
                __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f")._notification(Array.from(new Uint8Array(dataView.buffer)));
                __classPrivateFieldGet(this, _FirmwareManager_instances, "a", _FirmwareManager_dispatchEvent_get).call(this, "smp", { dataView });
                break;
            default:
                throw Error(`uncaught messageType ${messageType}`);
        }
    }
    async uploadFirmware(file) {
        _console$c.log("uploadFirmware", file);
        const promise = this.waitForEvent("firmwareUploadComplete");
        await this.getImages();
        const arrayBuffer = await getFileBuffer(file);
        const imageInfo = await __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").imageInfo(arrayBuffer);
        _console$c.log({ imageInfo });
        __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").cmdUpload(arrayBuffer, 1);
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_updateStatus).call(this, "uploading");
        await promise;
    }
    get status() {
        return __classPrivateFieldGet(this, _FirmwareManager_status, "f");
    }
    get images() {
        return __classPrivateFieldGet(this, _FirmwareManager_images, "f");
    }
    async getImages() {
        const promise = this.waitForEvent("firmwareImages");
        _console$c.log("getting firmware image state...");
        this.sendMessage(Uint8Array.from(__classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").cmdImageState()).buffer);
        await promise;
    }
    async testImage(imageIndex = 1) {
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_assertValidImageIndex).call(this, imageIndex);
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_assertImages).call(this);
        if (!__classPrivateFieldGet(this, _FirmwareManager_images, "f")[imageIndex]) {
            _console$c.log(`image ${imageIndex} not found`);
            return;
        }
        if (__classPrivateFieldGet(this, _FirmwareManager_images, "f")[imageIndex].pending == true) {
            _console$c.log(`image ${imageIndex} is already pending`);
            return;
        }
        if (__classPrivateFieldGet(this, _FirmwareManager_images, "f")[imageIndex].empty) {
            _console$c.log(`image ${imageIndex} is empty`);
            return;
        }
        const promise = this.waitForEvent("smp");
        _console$c.log("testing firmware image...");
        this.sendMessage(Uint8Array.from(__classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").cmdImageTest(__classPrivateFieldGet(this, _FirmwareManager_images, "f")[imageIndex].hash)).buffer);
        await promise;
    }
    async eraseImage() {
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_assertImages).call(this);
        const promise = this.waitForEvent("smp");
        _console$c.log("erasing image...");
        this.sendMessage(Uint8Array.from(__classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").cmdImageErase()).buffer);
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_updateStatus).call(this, "erasing");
        await promise;
        await this.getImages();
    }
    async confirmImage(imageIndex = 0) {
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_assertValidImageIndex).call(this, imageIndex);
        __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_assertImages).call(this);
        if (__classPrivateFieldGet(this, _FirmwareManager_images, "f")[imageIndex].confirmed === true) {
            _console$c.log(`image ${imageIndex} is already confirmed`);
            return;
        }
        const promise = this.waitForEvent("smp");
        _console$c.log("confirming image...");
        this.sendMessage(Uint8Array.from(__classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").cmdImageConfirm(__classPrivateFieldGet(this, _FirmwareManager_images, "f")[imageIndex].hash)).buffer);
        await promise;
    }
    async echo(string) {
        _console$c.assertTypeWithError(string, "string");
        const promise = this.waitForEvent("smp");
        _console$c.log("sending echo...");
        this.sendMessage(Uint8Array.from(__classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").smpEcho(string)).buffer);
        await promise;
    }
    async reset() {
        const promise = this.waitForEvent("smp");
        _console$c.log("resetting...");
        this.sendMessage(Uint8Array.from(__classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").cmdReset()).buffer);
        await promise;
    }
    get mtu() {
        return __classPrivateFieldGet(this, _FirmwareManager_mtu, "f");
    }
    set mtu(newMtu) {
        __classPrivateFieldSet(this, _FirmwareManager_mtu, newMtu, "f");
        __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f")._mtu = newMtu;
    }
}
_FirmwareManager_status = new WeakMap(), _FirmwareManager_images = new WeakMap(), _FirmwareManager_mtu = new WeakMap(), _FirmwareManager_mcuManager = new WeakMap(), _FirmwareManager_instances = new WeakSet(), _FirmwareManager_dispatchEvent_get = function _FirmwareManager_dispatchEvent_get() {
    return this.eventDispatcher.dispatchEvent;
}, _FirmwareManager_updateStatus = function _FirmwareManager_updateStatus(newStatus) {
    _console$c.assertEnumWithError(newStatus, FirmwareStatuses);
    if (__classPrivateFieldGet(this, _FirmwareManager_status, "f") == newStatus) {
        _console$c.log(`redundant firmwareStatus assignment "${newStatus}"`);
        return;
    }
    __classPrivateFieldSet(this, _FirmwareManager_status, newStatus, "f");
    _console$c.log({ firmwareStatus: __classPrivateFieldGet(this, _FirmwareManager_status, "f") });
    __classPrivateFieldGet(this, _FirmwareManager_instances, "a", _FirmwareManager_dispatchEvent_get).call(this, "firmwareStatus", { firmwareStatus: __classPrivateFieldGet(this, _FirmwareManager_status, "f") });
}, _FirmwareManager_assertImages = function _FirmwareManager_assertImages() {
    _console$c.assertWithError(__classPrivateFieldGet(this, _FirmwareManager_images, "f"), "didn't get imageState");
}, _FirmwareManager_assertValidImageIndex = function _FirmwareManager_assertValidImageIndex(imageIndex) {
    _console$c.assertTypeWithError(imageIndex, "number");
    _console$c.assertWithError(imageIndex == 0 || imageIndex == 1, "imageIndex must be 0 or 1");
}, _FirmwareManager_assignMcuManagerCallbacks = function _FirmwareManager_assignMcuManagerCallbacks() {
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onMessage(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuMessage).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onFileDownloadNext(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuFileDownloadNext));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onFileDownloadProgress(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuFileDownloadProgress).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onFileDownloadFinished(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuFileDownloadFinished).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onFileUploadNext(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuFileUploadNext).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onFileUploadProgress(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuFileUploadProgress).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onFileUploadFinished(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuFileUploadFinished).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onImageUploadNext(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuImageUploadNext).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onImageUploadProgress(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuImageUploadProgress).bind(this));
    __classPrivateFieldGet(this, _FirmwareManager_mcuManager, "f").onImageUploadFinished(__classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuImageUploadFinished).bind(this));
}, _FirmwareManager_onMcuMessage = function _FirmwareManager_onMcuMessage({ op, group, id, data, length }) {
    _console$c.log("onMcuMessage", ...arguments);
    switch (group) {
        case constants.MGMT_GROUP_ID_OS:
            switch (id) {
                case constants.OS_MGMT_ID_ECHO:
                    _console$c.log(`echo "${data.r}"`);
                    break;
                case constants.OS_MGMT_ID_TASKSTAT:
                    _console$c.table(data.tasks);
                    break;
                case constants.OS_MGMT_ID_MPSTAT:
                    _console$c.log(data);
                    break;
            }
            break;
        case constants.MGMT_GROUP_ID_IMAGE:
            switch (id) {
                case constants.IMG_MGMT_ID_STATE:
                    __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_onMcuImageState).call(this, data);
            }
            break;
        default:
            throw Error(`uncaught mcuMessage group ${group}`);
    }
}, _FirmwareManager_onMcuFileDownloadNext = function _FirmwareManager_onMcuFileDownloadNext() {
    _console$c.log("onMcuFileDownloadNext", ...arguments);
}, _FirmwareManager_onMcuFileDownloadProgress = function _FirmwareManager_onMcuFileDownloadProgress() {
    _console$c.log("onMcuFileDownloadProgress", ...arguments);
}, _FirmwareManager_onMcuFileDownloadFinished = function _FirmwareManager_onMcuFileDownloadFinished() {
    _console$c.log("onMcuFileDownloadFinished", ...arguments);
}, _FirmwareManager_onMcuFileUploadNext = function _FirmwareManager_onMcuFileUploadNext() {
    _console$c.log("onMcuFileUploadNext");
}, _FirmwareManager_onMcuFileUploadProgress = function _FirmwareManager_onMcuFileUploadProgress() {
    _console$c.log("onMcuFileUploadProgress");
}, _FirmwareManager_onMcuFileUploadFinished = function _FirmwareManager_onMcuFileUploadFinished() {
    _console$c.log("onMcuFileUploadFinished");
}, _FirmwareManager_onMcuImageUploadNext = function _FirmwareManager_onMcuImageUploadNext({ packet }) {
    _console$c.log("onMcuImageUploadNext");
    this.sendMessage(Uint8Array.from(packet).buffer);
}, _FirmwareManager_onMcuImageUploadProgress = function _FirmwareManager_onMcuImageUploadProgress({ percentage }) {
    const progress = percentage / 100;
    _console$c.log("onMcuImageUploadProgress", ...arguments);
    __classPrivateFieldGet(this, _FirmwareManager_instances, "a", _FirmwareManager_dispatchEvent_get).call(this, "firmwareUploadProgress", { progress });
}, _FirmwareManager_onMcuImageUploadFinished = async function _FirmwareManager_onMcuImageUploadFinished() {
    _console$c.log("onMcuImageUploadFinished", ...arguments);
    await this.getImages();
    __classPrivateFieldGet(this, _FirmwareManager_instances, "a", _FirmwareManager_dispatchEvent_get).call(this, "firmwareUploadProgress", { progress: 100 });
    __classPrivateFieldGet(this, _FirmwareManager_instances, "a", _FirmwareManager_dispatchEvent_get).call(this, "firmwareUploadComplete", {});
}, _FirmwareManager_onMcuImageState = function _FirmwareManager_onMcuImageState({ images }) {
    if (images) {
        __classPrivateFieldSet(this, _FirmwareManager_images, images, "f");
        _console$c.log("images", __classPrivateFieldGet(this, _FirmwareManager_images, "f"));
    }
    else {
        _console$c.log("no images found");
        return;
    }
    let newStatus = "idle";
    if (__classPrivateFieldGet(this, _FirmwareManager_images, "f").length == 2) {
        if (!__classPrivateFieldGet(this, _FirmwareManager_images, "f")[1].bootable) {
            _console$c.warn('Slot 1 has a invalid image. Click "Erase Image" to erase it or upload a different image');
        }
        else if (!__classPrivateFieldGet(this, _FirmwareManager_images, "f")[0].confirmed) {
            _console$c.log('Slot 0 has a valid image. Click "Confirm Image" to confirm it or wait and the device will swap images back.');
            newStatus = "testing";
        }
        else {
            if (__classPrivateFieldGet(this, _FirmwareManager_images, "f")[1].pending) {
                _console$c.log("reset to upload to the new firmware image");
                newStatus = "pending";
            }
            else {
                _console$c.log("Slot 1 has a valid image. run testImage() to test it or upload a different image.");
                newStatus = "uploaded";
            }
        }
    }
    if (__classPrivateFieldGet(this, _FirmwareManager_images, "f").length == 1) {
        __classPrivateFieldGet(this, _FirmwareManager_images, "f").push({
            slot: 1,
            empty: true,
            version: "Empty",
            pending: false,
            confirmed: false,
            bootable: false,
            active: false,
            permanent: false,
        });
        _console$c.log("Select a firmware upload image to upload to slot 1.");
    }
    __classPrivateFieldGet(this, _FirmwareManager_instances, "m", _FirmwareManager_updateStatus).call(this, newStatus);
    __classPrivateFieldGet(this, _FirmwareManager_instances, "a", _FirmwareManager_dispatchEvent_get).call(this, "firmwareImages", { firmwareImages: __classPrivateFieldGet(this, _FirmwareManager_images, "f") });
};

var _DeviceManager_instances, _DeviceManager_boundDeviceEventListeners, _DeviceManager_onDeviceType, _DeviceManager_ConnectedDevices, _DeviceManager_UseLocalStorage, _DeviceManager_DefaultLocalStorageConfiguration, _DeviceManager_LocalStorageConfiguration, _DeviceManager_AssertLocalStorage, _DeviceManager_LocalStorageKey, _DeviceManager_SaveToLocalStorage, _DeviceManager_LoadFromLocalStorage, _DeviceManager_UpdateLocalStorageConfigurationForDevice, _DeviceManager_AvailableDevices, _DeviceManager_EventDispatcher, _DeviceManager_DispatchEvent_get, _DeviceManager_OnDeviceIsConnected, _DeviceManager_DispatchAvailableDevices, _DeviceManager_DispatchConnectedDevices;
const _console$b = createConsole("DeviceManager", { log: true });
const DeviceManagerEventTypes = [
    "deviceConnected",
    "deviceDisconnected",
    "deviceIsConnected",
    "availableDevices",
    "connectedDevices",
];
class DeviceManager {
    constructor() {
        _DeviceManager_instances.add(this);
        _DeviceManager_boundDeviceEventListeners.set(this, {
            getType: __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_onDeviceType).bind(this),
            isConnected: __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_OnDeviceIsConnected).bind(this),
        });
        _DeviceManager_ConnectedDevices.set(this, []);
        _DeviceManager_UseLocalStorage.set(this, false);
        _DeviceManager_DefaultLocalStorageConfiguration.set(this, {
            devices: [],
        });
        _DeviceManager_LocalStorageConfiguration.set(this, void 0);
        _DeviceManager_LocalStorageKey.set(this, "BS.Device");
        _DeviceManager_AvailableDevices.set(this, []);
        _DeviceManager_EventDispatcher.set(this, new EventDispatcher(this, DeviceManagerEventTypes));
        if (DeviceManager.shared && this != DeviceManager.shared) {
            throw Error("DeviceManager is a singleton - use DeviceManager.shared");
        }
        if (this.CanUseLocalStorage) {
            this.UseLocalStorage = true;
        }
    }
    onDevice(device) {
        addEventListeners(device, __classPrivateFieldGet(this, _DeviceManager_boundDeviceEventListeners, "f"));
    }
    OnDeviceConnectionStatusUpdated(device, connectionStatus) {
        if (connectionStatus == "notConnected" && !device.canReconnect && __classPrivateFieldGet(this, _DeviceManager_AvailableDevices, "f").includes(device)) {
            const deviceIndex = __classPrivateFieldGet(this, _DeviceManager_AvailableDevices, "f").indexOf(device);
            this.AvailableDevices.splice(deviceIndex, 1);
            __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_DispatchAvailableDevices).call(this);
        }
    }
    get ConnectedDevices() {
        return __classPrivateFieldGet(this, _DeviceManager_ConnectedDevices, "f");
    }
    get UseLocalStorage() {
        return __classPrivateFieldGet(this, _DeviceManager_UseLocalStorage, "f");
    }
    set UseLocalStorage(newUseLocalStorage) {
        __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_AssertLocalStorage).call(this);
        _console$b.assertTypeWithError(newUseLocalStorage, "boolean");
        __classPrivateFieldSet(this, _DeviceManager_UseLocalStorage, newUseLocalStorage, "f");
        if (__classPrivateFieldGet(this, _DeviceManager_UseLocalStorage, "f") && !__classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f")) {
            __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_LoadFromLocalStorage).call(this);
        }
    }
    get CanUseLocalStorage() {
        return isInBrowser && window.localStorage;
    }
    get AvailableDevices() {
        return __classPrivateFieldGet(this, _DeviceManager_AvailableDevices, "f");
    }
    get CanGetDevices() {
        _console$b.log("current firmware doesn't pair-bond");
        return false;
    }
    async GetDevices() {
        if (!isInBrowser) {
            _console$b.warn("GetDevices is only available in the browser");
            return;
        }
        if (!navigator.bluetooth) {
            _console$b.warn("bluetooth is not available in this browser");
            return;
        }
        if (isInBluefy) {
            _console$b.warn("bluefy lists too many devices...");
            return;
        }
        if (!navigator.bluetooth.getDevices) {
            _console$b.warn("bluetooth.getDevices() is not available in this browser");
            return;
        }
        if (!this.CanGetDevices) {
            _console$b.log("CanGetDevices is false");
            return;
        }
        if (!__classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f")) {
            __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_LoadFromLocalStorage).call(this);
        }
        const configuration = __classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f");
        if (!configuration.devices || configuration.devices.length == 0) {
            _console$b.log("no devices found in configuration");
            return;
        }
        const bluetoothDevices = await navigator.bluetooth.getDevices();
        _console$b.log({ bluetoothDevices });
        bluetoothDevices.forEach((bluetoothDevice) => {
            if (!bluetoothDevice.gatt) {
                return;
            }
            let deviceInformation = configuration.devices.find((deviceInformation) => bluetoothDevice.id == deviceInformation.bluetoothId);
            if (!deviceInformation) {
                return;
            }
            let existingConnectedDevice = this.ConnectedDevices.filter((device) => device.connectionType == "webBluetooth").find((device) => device.bluetoothId == bluetoothDevice.id);
            const existingAvailableDevice = this.AvailableDevices.filter((device) => device.connectionType == "webBluetooth").find((device) => device.bluetoothId == bluetoothDevice.id);
            if (existingAvailableDevice) {
                if (existingConnectedDevice &&
                    existingConnectedDevice?.bluetoothId == existingAvailableDevice.bluetoothId &&
                    existingConnectedDevice != existingAvailableDevice) {
                    this.AvailableDevices[__classPrivateFieldGet(this, _DeviceManager_AvailableDevices, "f").indexOf(existingAvailableDevice)] = existingConnectedDevice;
                }
                return;
            }
            if (existingConnectedDevice) {
                this.AvailableDevices.push(existingConnectedDevice);
                return;
            }
            const device = new Device$1();
            const connectionManager = new WebBluetoothConnectionManager();
            connectionManager.device = bluetoothDevice;
            if (bluetoothDevice.name) {
                device._informationManager.updateName(bluetoothDevice.name);
            }
            device._informationManager.updateType(deviceInformation.type);
            device.connectionManager = connectionManager;
            this.AvailableDevices.push(device);
        });
        __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_DispatchAvailableDevices).call(this);
        return this.AvailableDevices;
    }
    get AddEventListener() {
        return __classPrivateFieldGet(this, _DeviceManager_EventDispatcher, "f").addEventListener;
    }
    get RemoveEventListener() {
        return __classPrivateFieldGet(this, _DeviceManager_EventDispatcher, "f").removeEventListener;
    }
}
_DeviceManager_boundDeviceEventListeners = new WeakMap(), _DeviceManager_ConnectedDevices = new WeakMap(), _DeviceManager_UseLocalStorage = new WeakMap(), _DeviceManager_DefaultLocalStorageConfiguration = new WeakMap(), _DeviceManager_LocalStorageConfiguration = new WeakMap(), _DeviceManager_LocalStorageKey = new WeakMap(), _DeviceManager_AvailableDevices = new WeakMap(), _DeviceManager_EventDispatcher = new WeakMap(), _DeviceManager_instances = new WeakSet(), _DeviceManager_onDeviceType = function _DeviceManager_onDeviceType(event) {
    if (__classPrivateFieldGet(this, _DeviceManager_UseLocalStorage, "f")) {
        __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_UpdateLocalStorageConfigurationForDevice).call(this, event.target);
    }
}, _DeviceManager_AssertLocalStorage = function _DeviceManager_AssertLocalStorage() {
    _console$b.assertWithError(isInBrowser, "localStorage is only available in the browser");
    _console$b.assertWithError(window.localStorage, "localStorage not found");
}, _DeviceManager_SaveToLocalStorage = function _DeviceManager_SaveToLocalStorage() {
    __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_AssertLocalStorage).call(this);
    localStorage.setItem(__classPrivateFieldGet(this, _DeviceManager_LocalStorageKey, "f"), JSON.stringify(__classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f")));
}, _DeviceManager_LoadFromLocalStorage = async function _DeviceManager_LoadFromLocalStorage() {
    __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_AssertLocalStorage).call(this);
    let localStorageString = localStorage.getItem(__classPrivateFieldGet(this, _DeviceManager_LocalStorageKey, "f"));
    if (typeof localStorageString != "string") {
        _console$b.log("no info found in localStorage");
        __classPrivateFieldSet(this, _DeviceManager_LocalStorageConfiguration, Object.assign({}, __classPrivateFieldGet(this, _DeviceManager_DefaultLocalStorageConfiguration, "f")), "f");
        __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_SaveToLocalStorage).call(this);
        return;
    }
    try {
        const configuration = JSON.parse(localStorageString);
        _console$b.log({ configuration });
        __classPrivateFieldSet(this, _DeviceManager_LocalStorageConfiguration, configuration, "f");
        if (this.CanGetDevices) {
            await this.GetDevices();
        }
    }
    catch (error) {
        _console$b.error(error);
    }
}, _DeviceManager_UpdateLocalStorageConfigurationForDevice = function _DeviceManager_UpdateLocalStorageConfigurationForDevice(device) {
    if (device.connectionType != "webBluetooth") {
        _console$b.log("localStorage is only for webBluetooth devices");
        return;
    }
    __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_AssertLocalStorage).call(this);
    const deviceInformationIndex = __classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f").devices.findIndex((deviceInformation) => {
        return deviceInformation.bluetoothId == device.bluetoothId;
    });
    if (deviceInformationIndex == -1) {
        return;
    }
    __classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f").devices[deviceInformationIndex].type = device.type;
    __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_SaveToLocalStorage).call(this);
}, _DeviceManager_DispatchEvent_get = function _DeviceManager_DispatchEvent_get() {
    return __classPrivateFieldGet(this, _DeviceManager_EventDispatcher, "f").dispatchEvent;
}, _DeviceManager_OnDeviceIsConnected = function _DeviceManager_OnDeviceIsConnected(event) {
    const { target: device } = event;
    if (device.isConnected) {
        if (!__classPrivateFieldGet(this, _DeviceManager_ConnectedDevices, "f").includes(device)) {
            _console$b.log("adding device", device);
            __classPrivateFieldGet(this, _DeviceManager_ConnectedDevices, "f").push(device);
            if (this.UseLocalStorage && device.connectionType == "webBluetooth") {
                const deviceInformation = {
                    type: device.type,
                    bluetoothId: device.bluetoothId,
                };
                const deviceInformationIndex = __classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f").devices.findIndex((_deviceInformation) => _deviceInformation.bluetoothId == deviceInformation.bluetoothId);
                if (deviceInformationIndex == -1) {
                    __classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f").devices.push(deviceInformation);
                }
                else {
                    __classPrivateFieldGet(this, _DeviceManager_LocalStorageConfiguration, "f").devices[deviceInformationIndex] = deviceInformation;
                }
                __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_SaveToLocalStorage).call(this);
            }
            __classPrivateFieldGet(this, _DeviceManager_instances, "a", _DeviceManager_DispatchEvent_get).call(this, "deviceConnected", { device });
            __classPrivateFieldGet(this, _DeviceManager_instances, "a", _DeviceManager_DispatchEvent_get).call(this, "deviceIsConnected", { device });
            __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_DispatchConnectedDevices).call(this);
        }
        else {
            _console$b.log("device already included");
        }
    }
    else {
        if (__classPrivateFieldGet(this, _DeviceManager_ConnectedDevices, "f").includes(device)) {
            _console$b.log("removing device", device);
            __classPrivateFieldGet(this, _DeviceManager_ConnectedDevices, "f").splice(__classPrivateFieldGet(this, _DeviceManager_ConnectedDevices, "f").indexOf(device), 1);
            __classPrivateFieldGet(this, _DeviceManager_instances, "a", _DeviceManager_DispatchEvent_get).call(this, "deviceDisconnected", { device });
            __classPrivateFieldGet(this, _DeviceManager_instances, "a", _DeviceManager_DispatchEvent_get).call(this, "deviceIsConnected", { device });
            __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_DispatchConnectedDevices).call(this);
        }
        else {
            _console$b.log("device already not included");
        }
    }
    if (this.CanGetDevices) {
        this.GetDevices();
    }
    if (device.isConnected && !this.AvailableDevices.includes(device)) {
        const existingAvailableDevice = this.AvailableDevices.find((_device) => _device.bluetoothId == device.bluetoothId);
        _console$b.log({ existingAvailableDevice });
        if (existingAvailableDevice) {
            this.AvailableDevices[this.AvailableDevices.indexOf(existingAvailableDevice)] = device;
        }
        else {
            this.AvailableDevices.push(device);
        }
        __classPrivateFieldGet(this, _DeviceManager_instances, "m", _DeviceManager_DispatchAvailableDevices).call(this);
    }
}, _DeviceManager_DispatchAvailableDevices = function _DeviceManager_DispatchAvailableDevices() {
    _console$b.log({ AvailableDevices: this.AvailableDevices });
    __classPrivateFieldGet(this, _DeviceManager_instances, "a", _DeviceManager_DispatchEvent_get).call(this, "availableDevices", { availableDevices: this.AvailableDevices });
}, _DeviceManager_DispatchConnectedDevices = function _DeviceManager_DispatchConnectedDevices() {
    _console$b.log({ ConnectedDevices: this.ConnectedDevices });
    __classPrivateFieldGet(this, _DeviceManager_instances, "a", _DeviceManager_DispatchEvent_get).call(this, "connectedDevices", { connectedDevices: this.ConnectedDevices });
};
DeviceManager.shared = new DeviceManager();
var DeviceManager$1 = DeviceManager.shared;

var _Device_instances, _a$3, _Device_DefaultConnectionManager, _Device_eventDispatcher, _Device_dispatchEvent_get, _Device_connectionManager, _Device_sendTxMessages, _Device_isConnected, _Device_assertIsConnected, _Device_hasRequiredInformation_get, _Device_requestRequiredInformation, _Device_assertCanReconnect, _Device_ReconnectOnDisconnection, _Device_reconnectOnDisconnection, _Device_reconnectIntervalId, _Device_onConnectionStatusUpdated, _Device_dispatchConnectionEvents, _Device_checkConnection, _Device_clear, _Device_onConnectionMessageReceived, _Device_deviceInformationManager, _Device_batteryLevel, _Device_updateBatteryLevel, _Device_sensorConfigurationManager, _Device_ClearSensorConfigurationOnLeave, _Device_clearSensorConfigurationOnLeave, _Device_sensorDataManager, _Device_vibrationManager, _Device_fileTransferManager, _Device_tfliteManager, _Device_firmwareManager, _Device_sendSmpMessage;
const _console$a = createConsole("Device", { log: true });
const DeviceEventTypes = [
    "connectionMessage",
    ...ConnectionEventTypes,
    ...MetaConnectionMessageTypes,
    ...BatteryLevelMessageTypes,
    ...InformationEventTypes,
    ...DeviceInformationEventTypes,
    ...SensorConfigurationEventTypes,
    ...SensorDataEventTypes,
    ...FileTransferEventTypes,
    ...TfliteEventTypes,
    ...FirmwareEventTypes,
];
const RequiredInformationConnectionMessages = [
    "isCharging",
    "getBatteryCurrent",
    "getId",
    "getMtu",
    "getName",
    "getType",
    "getCurrentTime",
    "getSensorConfiguration",
    "getSensorScalars",
    "getPressurePositions",
    "maxFileLength",
    "getFileLength",
    "getFileChecksum",
    "getFileType",
    "fileTransferStatus",
    "getTfliteName",
    "getTfliteTask",
    "getTfliteSampleRate",
    "getTfliteSensorTypes",
    "tfliteIsReady",
    "getTfliteCaptureDelay",
    "getTfliteThreshold",
    "getTfliteInferencingEnabled",
];
class Device {
    get bluetoothId() {
        return __classPrivateFieldGet(this, _Device_connectionManager, "f")?.bluetoothId;
    }
    constructor() {
        _Device_instances.add(this);
        _Device_eventDispatcher.set(this, new EventDispatcher(this, DeviceEventTypes));
        _Device_connectionManager.set(this, void 0);
        this.sendTxMessages = __classPrivateFieldGet(this, _Device_instances, "m", _Device_sendTxMessages).bind(this);
        _Device_isConnected.set(this, false);
        _Device_reconnectOnDisconnection.set(this, _a$3.ReconnectOnDisconnection);
        _Device_reconnectIntervalId.set(this, void 0);
        this.latestConnectionMessage = new Map();
        _Device_deviceInformationManager.set(this, new DeviceInformationManager());
        _Device_batteryLevel.set(this, 0);
        this._informationManager = new InformationManager();
        _Device_sensorConfigurationManager.set(this, new SensorConfigurationManager());
        _Device_clearSensorConfigurationOnLeave.set(this, _a$3.ClearSensorConfigurationOnLeave);
        _Device_sensorDataManager.set(this, new SensorDataManager());
        _Device_vibrationManager.set(this, new VibrationManager());
        _Device_fileTransferManager.set(this, new FileTransferManager());
        _Device_tfliteManager.set(this, new TfliteManager());
        _Device_firmwareManager.set(this, new FirmwareManager());
        this.sendSmpMessage = __classPrivateFieldGet(this, _Device_instances, "m", _Device_sendSmpMessage).bind(this);
        __classPrivateFieldGet(this, _Device_deviceInformationManager, "f").eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        this._informationManager.sendMessage = this.sendTxMessages;
        this._informationManager.eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        __classPrivateFieldGet(this, _Device_sensorConfigurationManager, "f").sendMessage = this.sendTxMessages;
        __classPrivateFieldGet(this, _Device_sensorConfigurationManager, "f").eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        __classPrivateFieldGet(this, _Device_sensorDataManager, "f").eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        __classPrivateFieldGet(this, _Device_vibrationManager, "f").sendMessage = this.sendTxMessages;
        __classPrivateFieldGet(this, _Device_tfliteManager, "f").sendMessage = this.sendTxMessages;
        __classPrivateFieldGet(this, _Device_tfliteManager, "f").eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        __classPrivateFieldGet(this, _Device_fileTransferManager, "f").sendMessage = this.sendTxMessages;
        __classPrivateFieldGet(this, _Device_fileTransferManager, "f").eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        __classPrivateFieldGet(this, _Device_firmwareManager, "f").sendMessage = this.sendSmpMessage;
        __classPrivateFieldGet(this, _Device_firmwareManager, "f").eventDispatcher = __classPrivateFieldGet(this, _Device_eventDispatcher, "f");
        this.addEventListener("getMtu", () => {
            __classPrivateFieldGet(this, _Device_firmwareManager, "f").mtu = this.mtu;
            __classPrivateFieldGet(this, _Device_fileTransferManager, "f").mtu = this.mtu;
            this.connectionManager.mtu = this.mtu;
        });
        DeviceManager$1.onDevice(this);
        if (isInBrowser) {
            window.addEventListener("beforeunload", () => {
                if (this.isConnected && this.clearSensorConfigurationOnLeave) {
                    this.clearSensorConfiguration();
                }
            });
        }
        if (isInNode) {
            process.on("exit", () => {
                if (this.isConnected && this.clearSensorConfigurationOnLeave) {
                    this.clearSensorConfiguration();
                }
            });
        }
    }
    get addEventListener() {
        return __classPrivateFieldGet(this, _Device_eventDispatcher, "f").addEventListener;
    }
    get removeEventListener() {
        return __classPrivateFieldGet(this, _Device_eventDispatcher, "f").removeEventListener;
    }
    get waitForEvent() {
        return __classPrivateFieldGet(this, _Device_eventDispatcher, "f").waitForEvent;
    }
    get connectionManager() {
        return __classPrivateFieldGet(this, _Device_connectionManager, "f");
    }
    set connectionManager(newConnectionManager) {
        if (this.connectionManager == newConnectionManager) {
            _console$a.log("same connectionManager is already assigned");
            return;
        }
        if (this.connectionManager) {
            this.connectionManager.onStatusUpdated = undefined;
            this.connectionManager.onMessageReceived = undefined;
        }
        if (newConnectionManager) {
            newConnectionManager.onStatusUpdated = __classPrivateFieldGet(this, _Device_instances, "m", _Device_onConnectionStatusUpdated).bind(this);
            newConnectionManager.onMessageReceived = __classPrivateFieldGet(this, _Device_instances, "m", _Device_onConnectionMessageReceived).bind(this);
        }
        __classPrivateFieldSet(this, _Device_connectionManager, newConnectionManager, "f");
        _console$a.log("assigned new connectionManager", __classPrivateFieldGet(this, _Device_connectionManager, "f"));
    }
    async connect() {
        if (!this.connectionManager) {
            this.connectionManager = __classPrivateFieldGet(_a$3, _a$3, "m", _Device_DefaultConnectionManager).call(_a$3);
        }
        __classPrivateFieldGet(this, _Device_instances, "m", _Device_clear).call(this);
        return this.connectionManager.connect();
    }
    get isConnected() {
        return __classPrivateFieldGet(this, _Device_isConnected, "f");
    }
    get canReconnect() {
        _console$a.log("devices don't pair bond, so you can't reconnect");
        return false;
    }
    async reconnect() {
        __classPrivateFieldGet(this, _Device_instances, "m", _Device_assertCanReconnect).call(this);
        __classPrivateFieldGet(this, _Device_instances, "m", _Device_clear).call(this);
        return this.connectionManager?.reconnect();
    }
    static async Connect() {
        const device = new _a$3();
        await device.connect();
        return device;
    }
    static get ReconnectOnDisconnection() {
        return __classPrivateFieldGet(this, _a$3, "f", _Device_ReconnectOnDisconnection);
    }
    static set ReconnectOnDisconnection(newReconnectOnDisconnection) {
        _console$a.assertTypeWithError(newReconnectOnDisconnection, "boolean");
        __classPrivateFieldSet(this, _a$3, newReconnectOnDisconnection, "f", _Device_ReconnectOnDisconnection);
    }
    get reconnectOnDisconnection() {
        return __classPrivateFieldGet(this, _Device_reconnectOnDisconnection, "f");
    }
    set reconnectOnDisconnection(newReconnectOnDisconnection) {
        _console$a.assertTypeWithError(newReconnectOnDisconnection, "boolean");
        __classPrivateFieldSet(this, _Device_reconnectOnDisconnection, newReconnectOnDisconnection, "f");
    }
    get connectionType() {
        return this.connectionManager?.type;
    }
    async disconnect() {
        __classPrivateFieldGet(this, _Device_instances, "m", _Device_assertIsConnected).call(this);
        if (this.reconnectOnDisconnection) {
            this.reconnectOnDisconnection = false;
            this.addEventListener("isConnected", () => {
                this.reconnectOnDisconnection = true;
            }, { once: true });
        }
        return this.connectionManager.disconnect();
    }
    toggleConnection() {
        if (this.isConnected) {
            this.disconnect();
        }
        else if (this.canReconnect) {
            this.reconnect();
        }
        else {
            this.connect();
        }
    }
    get connectionStatus() {
        switch (__classPrivateFieldGet(this, _Device_connectionManager, "f")?.status) {
            case "connected":
                return this.isConnected ? "connected" : "connecting";
            case "notConnected":
            case "connecting":
            case "disconnecting":
                return __classPrivateFieldGet(this, _Device_connectionManager, "f").status;
            default:
                return "notConnected";
        }
    }
    get isConnectionBusy() {
        return this.connectionStatus == "connecting" || this.connectionStatus == "disconnecting";
    }
    get deviceInformation() {
        return __classPrivateFieldGet(this, _Device_deviceInformationManager, "f").information;
    }
    get batteryLevel() {
        return __classPrivateFieldGet(this, _Device_batteryLevel, "f");
    }
    get id() {
        return this._informationManager.id;
    }
    get isCharging() {
        return this._informationManager.isCharging;
    }
    get batteryCurrent() {
        return this._informationManager.batteryCurrent;
    }
    get getBatteryCurrent() {
        return this._informationManager.getBatteryCurrent;
    }
    get name() {
        return this._informationManager.name;
    }
    get setName() {
        return this._informationManager.setName;
    }
    get type() {
        return this._informationManager.type;
    }
    get setType() {
        return this._informationManager.setType;
    }
    get isInsole() {
        return this._informationManager.isInsole;
    }
    get insoleSide() {
        return this._informationManager.insoleSide;
    }
    get mtu() {
        return this._informationManager.mtu;
    }
    get sensorTypes() {
        return Object.keys(this.sensorConfiguration);
    }
    get continuousSensorTypes() {
        return ContinuousSensorTypes.filter((sensorType) => this.sensorTypes.includes(sensorType));
    }
    get sensorConfiguration() {
        return __classPrivateFieldGet(this, _Device_sensorConfigurationManager, "f").configuration;
    }
    async setSensorConfiguration(newSensorConfiguration, clearRest) {
        await __classPrivateFieldGet(this, _Device_sensorConfigurationManager, "f").setConfiguration(newSensorConfiguration, clearRest);
    }
    async clearSensorConfiguration() {
        return __classPrivateFieldGet(this, _Device_sensorConfigurationManager, "f").clearSensorConfiguration();
    }
    static get ClearSensorConfigurationOnLeave() {
        return __classPrivateFieldGet(this, _a$3, "f", _Device_ClearSensorConfigurationOnLeave);
    }
    static set ClearSensorConfigurationOnLeave(newClearSensorConfigurationOnLeave) {
        _console$a.assertTypeWithError(newClearSensorConfigurationOnLeave, "boolean");
        __classPrivateFieldSet(this, _a$3, newClearSensorConfigurationOnLeave, "f", _Device_ClearSensorConfigurationOnLeave);
    }
    get clearSensorConfigurationOnLeave() {
        return __classPrivateFieldGet(this, _Device_clearSensorConfigurationOnLeave, "f");
    }
    set clearSensorConfigurationOnLeave(newClearSensorConfigurationOnLeave) {
        _console$a.assertTypeWithError(newClearSensorConfigurationOnLeave, "boolean");
        __classPrivateFieldSet(this, _Device_clearSensorConfigurationOnLeave, newClearSensorConfigurationOnLeave, "f");
    }
    get numberOfPressureSensors() {
        return __classPrivateFieldGet(this, _Device_sensorDataManager, "f").pressureSensorDataManager.numberOfSensors;
    }
    resetPressureRange() {
        __classPrivateFieldGet(this, _Device_sensorDataManager, "f").pressureSensorDataManager.resetRange();
    }
    async triggerVibration(vibrationConfigurations, sendImmediately) {
        __classPrivateFieldGet(this, _Device_vibrationManager, "f").triggerVibration(vibrationConfigurations, sendImmediately);
    }
    get maxFileLength() {
        return __classPrivateFieldGet(this, _Device_fileTransferManager, "f").maxLength;
    }
    async sendFile(fileType, file) {
        const promise = this.waitForEvent("fileTransferComplete");
        __classPrivateFieldGet(this, _Device_fileTransferManager, "f").send(fileType, file);
        await promise;
    }
    async receiveFile(fileType) {
        const promise = this.waitForEvent("fileTransferComplete");
        __classPrivateFieldGet(this, _Device_fileTransferManager, "f").receive(fileType);
        await promise;
    }
    get fileTransferStatus() {
        return __classPrivateFieldGet(this, _Device_fileTransferManager, "f").status;
    }
    cancelFileTransfer() {
        __classPrivateFieldGet(this, _Device_fileTransferManager, "f").cancel();
    }
    get tfliteName() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").name;
    }
    get setTfliteName() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setName;
    }
    get tfliteTask() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").task;
    }
    get setTfliteTask() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setTask;
    }
    get tfliteSampleRate() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").sampleRate;
    }
    get setTfliteSampleRate() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setSampleRate;
    }
    get tfliteSensorTypes() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").sensorTypes;
    }
    get allowedTfliteSensorTypes() {
        return this.sensorTypes.filter((sensorType) => TfliteSensorTypes.includes(sensorType));
    }
    get setTfliteSensorTypes() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setSensorTypes;
    }
    get tfliteIsReady() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").isReady;
    }
    get tfliteInferencingEnabled() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").inferencingEnabled;
    }
    get setTfliteInferencingEnabled() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setInferencingEnabled;
    }
    async enableTfliteInferencing() {
        return this.setTfliteInferencingEnabled(true);
    }
    async disableTfliteInferencing() {
        return this.setTfliteInferencingEnabled(false);
    }
    get toggleTfliteInferencing() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").toggleInferencingEnabled;
    }
    get tfliteCaptureDelay() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").captureDelay;
    }
    get setTfliteCaptureDelay() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setCaptureDelay;
    }
    get tfliteThreshold() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").threshold;
    }
    get setTfliteThreshold() {
        return __classPrivateFieldGet(this, _Device_tfliteManager, "f").setThreshold;
    }
    get uploadFirmware() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").uploadFirmware;
    }
    async reset() {
        await __classPrivateFieldGet(this, _Device_firmwareManager, "f").reset();
        return __classPrivateFieldGet(this, _Device_connectionManager, "f").disconnect();
    }
    get firmwareStatus() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").status;
    }
    get getFirmwareImages() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").getImages;
    }
    get firmwareImages() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").images;
    }
    get eraseFirmwareImage() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").eraseImage;
    }
    get confirmFirmwareImage() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").confirmImage;
    }
    get testFirmwareImage() {
        return __classPrivateFieldGet(this, _Device_firmwareManager, "f").testImage;
    }
}
_a$3 = Device, _Device_eventDispatcher = new WeakMap(), _Device_connectionManager = new WeakMap(), _Device_isConnected = new WeakMap(), _Device_reconnectOnDisconnection = new WeakMap(), _Device_reconnectIntervalId = new WeakMap(), _Device_deviceInformationManager = new WeakMap(), _Device_batteryLevel = new WeakMap(), _Device_sensorConfigurationManager = new WeakMap(), _Device_clearSensorConfigurationOnLeave = new WeakMap(), _Device_sensorDataManager = new WeakMap(), _Device_vibrationManager = new WeakMap(), _Device_fileTransferManager = new WeakMap(), _Device_tfliteManager = new WeakMap(), _Device_firmwareManager = new WeakMap(), _Device_instances = new WeakSet(), _Device_DefaultConnectionManager = function _Device_DefaultConnectionManager() {
    return new WebBluetoothConnectionManager();
}, _Device_dispatchEvent_get = function _Device_dispatchEvent_get() {
    return __classPrivateFieldGet(this, _Device_eventDispatcher, "f").dispatchEvent;
}, _Device_sendTxMessages = async function _Device_sendTxMessages(messages, sendImmediately) {
    await __classPrivateFieldGet(this, _Device_connectionManager, "f")?.sendTxMessages(messages, sendImmediately);
}, _Device_assertIsConnected = function _Device_assertIsConnected() {
    _console$a.assertWithError(this.isConnected, "notConnected");
}, _Device_hasRequiredInformation_get = function _Device_hasRequiredInformation_get() {
    return RequiredInformationConnectionMessages.every((messageType) => {
        return this.latestConnectionMessage.has(messageType);
    });
}, _Device_requestRequiredInformation = function _Device_requestRequiredInformation() {
    const messages = RequiredInformationConnectionMessages.map((messageType) => ({
        type: messageType,
    }));
    __classPrivateFieldGet(this, _Device_instances, "m", _Device_sendTxMessages).call(this, messages);
}, _Device_assertCanReconnect = function _Device_assertCanReconnect() {
    _console$a.assertWithError(this.canReconnect, "cannot reconnect to device");
}, _Device_onConnectionStatusUpdated = function _Device_onConnectionStatusUpdated(connectionStatus) {
    _console$a.log({ connectionStatus });
    if (connectionStatus == "notConnected") {
        if (this.canReconnect && this.reconnectOnDisconnection) {
            _console$a.log("starting reconnect interval...");
            __classPrivateFieldSet(this, _Device_reconnectIntervalId, setInterval(() => {
                _console$a.log("attempting reconnect...");
                this.reconnect();
            }, 1000), "f");
        }
    }
    else {
        if (__classPrivateFieldGet(this, _Device_reconnectIntervalId, "f") != undefined) {
            _console$a.log("clearing reconnect interval");
            clearInterval(__classPrivateFieldGet(this, _Device_reconnectIntervalId, "f"));
            __classPrivateFieldSet(this, _Device_reconnectIntervalId, undefined, "f");
        }
    }
    __classPrivateFieldGet(this, _Device_instances, "m", _Device_checkConnection).call(this);
    if (connectionStatus == "connected" && !__classPrivateFieldGet(this, _Device_isConnected, "f")) {
        __classPrivateFieldGet(this, _Device_instances, "m", _Device_requestRequiredInformation).call(this);
    }
    DeviceManager$1.OnDeviceConnectionStatusUpdated(this, connectionStatus);
}, _Device_dispatchConnectionEvents = function _Device_dispatchConnectionEvents(includeIsConnected = false) {
    __classPrivateFieldGet(this, _Device_instances, "a", _Device_dispatchEvent_get).call(this, "connectionStatus", { connectionStatus: this.connectionStatus });
    __classPrivateFieldGet(this, _Device_instances, "a", _Device_dispatchEvent_get).call(this, this.connectionStatus, {});
    if (includeIsConnected) {
        __classPrivateFieldGet(this, _Device_instances, "a", _Device_dispatchEvent_get).call(this, "isConnected", { isConnected: this.isConnected });
    }
}, _Device_checkConnection = function _Device_checkConnection() {
    __classPrivateFieldSet(this, _Device_isConnected, Boolean(this.connectionManager?.isConnected) &&
        __classPrivateFieldGet(this, _Device_instances, "a", _Device_hasRequiredInformation_get) &&
        this._informationManager.isCurrentTimeSet, "f");
    switch (this.connectionStatus) {
        case "connected":
            if (__classPrivateFieldGet(this, _Device_isConnected, "f")) {
                __classPrivateFieldGet(this, _Device_instances, "m", _Device_dispatchConnectionEvents).call(this, true);
            }
            break;
        case "notConnected":
            __classPrivateFieldGet(this, _Device_instances, "m", _Device_dispatchConnectionEvents).call(this, true);
            break;
        default:
            __classPrivateFieldGet(this, _Device_instances, "m", _Device_dispatchConnectionEvents).call(this, false);
            break;
    }
}, _Device_clear = function _Device_clear() {
    this.latestConnectionMessage.clear();
    this._informationManager.clear();
    __classPrivateFieldGet(this, _Device_deviceInformationManager, "f").clear();
}, _Device_onConnectionMessageReceived = function _Device_onConnectionMessageReceived(messageType, dataView) {
    _console$a.log({ messageType, dataView });
    switch (messageType) {
        case "batteryLevel":
            const batteryLevel = dataView.getUint8(0);
            _console$a.log("received battery level", { batteryLevel });
            __classPrivateFieldGet(this, _Device_instances, "m", _Device_updateBatteryLevel).call(this, batteryLevel);
            break;
        default:
            if (FileTransferMessageTypes.includes(messageType)) {
                __classPrivateFieldGet(this, _Device_fileTransferManager, "f").parseMessage(messageType, dataView);
            }
            else if (TfliteMessageTypes.includes(messageType)) {
                __classPrivateFieldGet(this, _Device_tfliteManager, "f").parseMessage(messageType, dataView);
            }
            else if (SensorDataMessageTypes.includes(messageType)) {
                __classPrivateFieldGet(this, _Device_sensorDataManager, "f").parseMessage(messageType, dataView);
            }
            else if (FirmwareMessageTypes.includes(messageType)) {
                __classPrivateFieldGet(this, _Device_firmwareManager, "f").parseMessage(messageType, dataView);
            }
            else if (DeviceInformationMessageTypes.includes(messageType)) {
                __classPrivateFieldGet(this, _Device_deviceInformationManager, "f").parseMessage(messageType, dataView);
            }
            else if (InformationMessageTypes.includes(messageType)) {
                this._informationManager.parseMessage(messageType, dataView);
            }
            else if (SensorConfigurationMessageTypes.includes(messageType)) {
                __classPrivateFieldGet(this, _Device_sensorConfigurationManager, "f").parseMessage(messageType, dataView);
            }
            else {
                throw Error(`uncaught messageType ${messageType}`);
            }
    }
    this.latestConnectionMessage.set(messageType, dataView);
    __classPrivateFieldGet(this, _Device_instances, "a", _Device_dispatchEvent_get).call(this, "connectionMessage", { messageType, dataView });
    if (!this.isConnected && __classPrivateFieldGet(this, _Device_instances, "a", _Device_hasRequiredInformation_get)) {
        __classPrivateFieldGet(this, _Device_instances, "m", _Device_checkConnection).call(this);
    }
}, _Device_updateBatteryLevel = function _Device_updateBatteryLevel(updatedBatteryLevel) {
    _console$a.assertTypeWithError(updatedBatteryLevel, "number");
    if (__classPrivateFieldGet(this, _Device_batteryLevel, "f") == updatedBatteryLevel) {
        _console$a.log(`duplicate batteryLevel assignment ${updatedBatteryLevel}`);
        return;
    }
    __classPrivateFieldSet(this, _Device_batteryLevel, updatedBatteryLevel, "f");
    _console$a.log({ updatedBatteryLevel: __classPrivateFieldGet(this, _Device_batteryLevel, "f") });
    __classPrivateFieldGet(this, _Device_instances, "a", _Device_dispatchEvent_get).call(this, "batteryLevel", { batteryLevel: __classPrivateFieldGet(this, _Device_batteryLevel, "f") });
}, _Device_sendSmpMessage = function _Device_sendSmpMessage(data) {
    return __classPrivateFieldGet(this, _Device_connectionManager, "f").sendSmpMessage(data);
};
_Device_ReconnectOnDisconnection = { value: false };
_Device_ClearSensorConfigurationOnLeave = { value: true };
var Device$1 = Device;

var _DevicePairPressureSensorDataManager_instances, _DevicePairPressureSensorDataManager_rawPressure, _DevicePairPressureSensorDataManager_centerOfPressureHelper, _DevicePairPressureSensorDataManager_hasAllPressureData_get, _DevicePairPressureSensorDataManager_updatePressureData;
const _console$9 = createConsole("DevicePairPressureSensorDataManager", { log: true });
class DevicePairPressureSensorDataManager {
    constructor() {
        _DevicePairPressureSensorDataManager_instances.add(this);
        _DevicePairPressureSensorDataManager_rawPressure.set(this, {});
        _DevicePairPressureSensorDataManager_centerOfPressureHelper.set(this, new CenterOfPressureHelper());
    }
    resetPressureRange() {
        __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_centerOfPressureHelper, "f").reset();
    }
    onDevicePressureData(event) {
        const { pressure } = event.message;
        const insoleSide = event.target.insoleSide;
        _console$9.log({ pressure, insoleSide });
        __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_rawPressure, "f")[insoleSide] = pressure;
        if (__classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_instances, "a", _DevicePairPressureSensorDataManager_hasAllPressureData_get)) {
            return __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_instances, "m", _DevicePairPressureSensorDataManager_updatePressureData).call(this);
        }
        else {
            _console$9.log("doesn't have all pressure data yet...");
        }
    }
}
_DevicePairPressureSensorDataManager_rawPressure = new WeakMap(), _DevicePairPressureSensorDataManager_centerOfPressureHelper = new WeakMap(), _DevicePairPressureSensorDataManager_instances = new WeakSet(), _DevicePairPressureSensorDataManager_hasAllPressureData_get = function _DevicePairPressureSensorDataManager_hasAllPressureData_get() {
    return InsoleSides.every((side) => side in __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_rawPressure, "f"));
}, _DevicePairPressureSensorDataManager_updatePressureData = function _DevicePairPressureSensorDataManager_updatePressureData() {
    const pressure = { rawSum: 0, normalizedSum: 0 };
    InsoleSides.forEach((side) => {
        pressure.rawSum += __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_rawPressure, "f")[side].scaledSum;
        pressure.normalizedSum += __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_rawPressure, "f")[side].normalizedSum;
    });
    if (pressure.normalizedSum > 0) {
        pressure.center = { x: 0, y: 0 };
        InsoleSides.forEach((side) => {
            const sidePressure = __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_rawPressure, "f")[side];
            const normalizedPressureSumWeight = sidePressure.normalizedSum / pressure.normalizedSum;
            if (normalizedPressureSumWeight > 0) {
                pressure.center.y += sidePressure.normalizedCenter.y * normalizedPressureSumWeight;
                if (side == "right") {
                    pressure.center.x = normalizedPressureSumWeight;
                }
            }
        });
        pressure.normalizedCenter = __classPrivateFieldGet(this, _DevicePairPressureSensorDataManager_centerOfPressureHelper, "f").updateAndGetNormalization(pressure.center);
    }
    _console$9.log({ devicePairPressure: pressure });
    return pressure;
};

var _DevicePairSensorDataManager_timestamps;
const _console$8 = createConsole("DevicePairSensorDataManager", { log: true });
const DevicePairSensorTypes = ["pressure", "sensorData"];
const DevicePairSensorDataEventTypes = DevicePairSensorTypes;
class DevicePairSensorDataManager {
    constructor() {
        _DevicePairSensorDataManager_timestamps.set(this, {});
        this.pressureSensorDataManager = new DevicePairPressureSensorDataManager();
    }
    get dispatchEvent() {
        return this.eventDispatcher.dispatchEvent;
    }
    resetPressureRange() {
        this.pressureSensorDataManager.resetPressureRange();
    }
    onDeviceSensorData(event) {
        const { timestamp, sensorType } = event.message;
        _console$8.log({ sensorType, timestamp, event });
        if (!__classPrivateFieldGet(this, _DevicePairSensorDataManager_timestamps, "f")[sensorType]) {
            __classPrivateFieldGet(this, _DevicePairSensorDataManager_timestamps, "f")[sensorType] = {};
        }
        __classPrivateFieldGet(this, _DevicePairSensorDataManager_timestamps, "f")[sensorType][event.target.insoleSide] = timestamp;
        let value;
        switch (sensorType) {
            case "pressure":
                value = this.pressureSensorDataManager.onDevicePressureData(event);
                break;
            default:
                _console$8.log(`uncaught sensorType "${sensorType}"`);
                break;
        }
        if (value) {
            const timestamps = Object.assign({}, __classPrivateFieldGet(this, _DevicePairSensorDataManager_timestamps, "f")[sensorType]);
            this.dispatchEvent(sensorType, { sensorType, timestamps, [sensorType]: value });
            this.dispatchEvent("sensorData", { sensorType, timestamps, [sensorType]: value });
        }
        else {
            _console$8.log("no value received");
        }
    }
}
_DevicePairSensorDataManager_timestamps = new WeakMap();

var _DevicePair_instances, _a$2, _DevicePair_eventDispatcher, _DevicePair_dispatchEvent_get, _DevicePair_left, _DevicePair_right, _DevicePair_addDeviceEventListeners, _DevicePair_removeDeviceEventListeners, _DevicePair_removeInsole, _DevicePair_boundDeviceEventListeners, _DevicePair_redispatchDeviceEvent, _DevicePair_onDeviceIsConnected, _DevicePair_onDeviceType, _DevicePair_sensorDataManager, _DevicePair_onDeviceSensorData, _DevicePair_shared;
const _console$7 = createConsole("DevicePair", { log: true });
function getDevicePairDeviceEventType(deviceEventType) {
    return `device${capitalizeFirstCharacter(deviceEventType)}`;
}
const DevicePairDeviceEventTypes = DeviceEventTypes.map((eventType) => getDevicePairDeviceEventType(eventType));
const DevicePairConnectionEventTypes = ["isConnected"];
const DevicePairEventTypes = [
    ...DevicePairConnectionEventTypes,
    ...DevicePairSensorDataEventTypes,
    ...DevicePairDeviceEventTypes,
];
class DevicePair {
    constructor() {
        _DevicePair_instances.add(this);
        _DevicePair_eventDispatcher.set(this, new EventDispatcher(this, DevicePairEventTypes));
        _DevicePair_left.set(this, void 0);
        _DevicePair_right.set(this, void 0);
        _DevicePair_boundDeviceEventListeners.set(this, {
            isConnected: __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_onDeviceIsConnected).bind(this),
            sensorData: __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_onDeviceSensorData).bind(this),
            getType: __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_onDeviceType).bind(this),
        });
        _DevicePair_sensorDataManager.set(this, new DevicePairSensorDataManager());
        __classPrivateFieldGet(this, _DevicePair_sensorDataManager, "f").eventDispatcher = __classPrivateFieldGet(this, _DevicePair_eventDispatcher, "f");
    }
    get sides() {
        return InsoleSides;
    }
    get addEventListener() {
        return __classPrivateFieldGet(this, _DevicePair_eventDispatcher, "f").addEventListener;
    }
    get removeEventListener() {
        return __classPrivateFieldGet(this, _DevicePair_eventDispatcher, "f").removeEventListener;
    }
    get waitForEvent() {
        return __classPrivateFieldGet(this, _DevicePair_eventDispatcher, "f").waitForEvent;
    }
    get left() {
        return __classPrivateFieldGet(this, _DevicePair_left, "f");
    }
    get right() {
        return __classPrivateFieldGet(this, _DevicePair_right, "f");
    }
    get isConnected() {
        return InsoleSides.every((side) => this[side]?.isConnected);
    }
    get isPartiallyConnected() {
        return InsoleSides.some((side) => this[side]?.isConnected);
    }
    get isHalfConnected() {
        return this.isPartiallyConnected && !this.isConnected;
    }
    assignInsole(device) {
        if (!device.isInsole) {
            _console$7.warn("device is not an insole");
            return;
        }
        const side = device.insoleSide;
        const currentDevice = this[side];
        if (device == currentDevice) {
            _console$7.log("device already assigned");
            return;
        }
        if (currentDevice) {
            __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_removeDeviceEventListeners).call(this, currentDevice);
        }
        __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_addDeviceEventListeners).call(this, device);
        switch (side) {
            case "left":
                __classPrivateFieldSet(this, _DevicePair_left, device, "f");
                break;
            case "right":
                __classPrivateFieldSet(this, _DevicePair_right, device, "f");
                break;
        }
        _console$7.log(`assigned ${side} insole`, device);
        this.resetPressureRange();
        __classPrivateFieldGet(this, _DevicePair_instances, "a", _DevicePair_dispatchEvent_get).call(this, "isConnected", { isConnected: this.isConnected });
        __classPrivateFieldGet(this, _DevicePair_instances, "a", _DevicePair_dispatchEvent_get).call(this, "deviceIsConnected", { device, isConnected: device.isConnected, side });
        return currentDevice;
    }
    setSensorConfiguration(sensorConfiguration) {
        InsoleSides.forEach((side) => {
            this[side]?.setSensorConfiguration(sensorConfiguration);
        });
    }
    resetPressureRange() {
        __classPrivateFieldGet(this, _DevicePair_sensorDataManager, "f").resetPressureRange();
    }
    async triggerVibration(vibrationConfigurations, sendImmediately) {
        const promises = InsoleSides.map((side) => {
            return this[side]?.triggerVibration(vibrationConfigurations, sendImmediately);
        }).filter(Boolean);
        return Promise.allSettled(promises);
    }
    static get shared() {
        return __classPrivateFieldGet(this, _a$2, "f", _DevicePair_shared);
    }
}
_a$2 = DevicePair, _DevicePair_eventDispatcher = new WeakMap(), _DevicePair_left = new WeakMap(), _DevicePair_right = new WeakMap(), _DevicePair_boundDeviceEventListeners = new WeakMap(), _DevicePair_sensorDataManager = new WeakMap(), _DevicePair_instances = new WeakSet(), _DevicePair_dispatchEvent_get = function _DevicePair_dispatchEvent_get() {
    return __classPrivateFieldGet(this, _DevicePair_eventDispatcher, "f").dispatchEvent;
}, _DevicePair_addDeviceEventListeners = function _DevicePair_addDeviceEventListeners(device) {
    addEventListeners(device, __classPrivateFieldGet(this, _DevicePair_boundDeviceEventListeners, "f"));
    DeviceEventTypes.forEach((deviceEventType) => {
        device.addEventListener(deviceEventType, __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_redispatchDeviceEvent).bind(this));
    });
}, _DevicePair_removeDeviceEventListeners = function _DevicePair_removeDeviceEventListeners(device) {
    removeEventListeners(device, __classPrivateFieldGet(this, _DevicePair_boundDeviceEventListeners, "f"));
    DeviceEventTypes.forEach((deviceEventType) => {
        device.removeEventListener(deviceEventType, __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_redispatchDeviceEvent).bind(this));
    });
}, _DevicePair_removeInsole = function _DevicePair_removeInsole(device) {
    const foundDevice = InsoleSides.some((side) => {
        if (this[side] != device) {
            return false;
        }
        _console$7.log(`removing ${side} insole`, device);
        removeEventListeners(device, __classPrivateFieldGet(this, _DevicePair_boundDeviceEventListeners, "f"));
        delete this[side];
        return true;
    });
    if (foundDevice) {
        __classPrivateFieldGet(this, _DevicePair_instances, "a", _DevicePair_dispatchEvent_get).call(this, "isConnected", { isConnected: this.isConnected });
    }
    return foundDevice;
}, _DevicePair_redispatchDeviceEvent = function _DevicePair_redispatchDeviceEvent(deviceEvent) {
    const { type, target: device, message } = deviceEvent;
    __classPrivateFieldGet(this, _DevicePair_instances, "a", _DevicePair_dispatchEvent_get).call(this, getDevicePairDeviceEventType(type), {
        ...message,
        device,
        side: device.insoleSide,
    });
}, _DevicePair_onDeviceIsConnected = function _DevicePair_onDeviceIsConnected(deviceEvent) {
    __classPrivateFieldGet(this, _DevicePair_instances, "a", _DevicePair_dispatchEvent_get).call(this, "isConnected", { isConnected: this.isConnected });
}, _DevicePair_onDeviceType = function _DevicePair_onDeviceType(deviceEvent) {
    const { target: device } = deviceEvent;
    if (this[device.insoleSide] == device) {
        return;
    }
    const foundDevice = __classPrivateFieldGet(this, _DevicePair_instances, "m", _DevicePair_removeInsole).call(this, device);
    if (!foundDevice) {
        return;
    }
    this.assignInsole(device);
}, _DevicePair_onDeviceSensorData = function _DevicePair_onDeviceSensorData(deviceEvent) {
    if (this.isConnected) {
        __classPrivateFieldGet(this, _DevicePair_sensorDataManager, "f").onDeviceSensorData(deviceEvent);
    }
};
_DevicePair_shared = { value: new _a$2() };
(() => {
    DeviceManager$1.AddEventListener("deviceConnected", (event) => {
        const { device } = event.message;
        if (device.isInsole) {
            __classPrivateFieldGet(_a$2, _a$2, "f", _DevicePair_shared).assignInsole(device);
        }
    });
})();

var _BaseScanner_instances, _a$1, _BaseScanner_assertIsSupported, _BaseScanner_assertIsSubclass, _BaseScanner_boundEventListeners, _BaseScanner_eventDispatcher, _BaseScanner_assertIsAvailable, _BaseScanner_assertIsScanning, _BaseScanner_assertIsNotScanning, _BaseScanner_onIsScanning, _BaseScanner_discoveredDevices, _BaseScanner_onDiscoveredDevice, _BaseScanner_discoveredDeviceTimestamps, _BaseScanner_DiscoveredDeviceExpirationTimeout, _BaseScanner_discoveredDeviceExpirationTimeout_get, _BaseScanner_checkDiscoveredDevicesExpirationTimer, _BaseScanner_checkDiscoveredDevicesExpiration;
const _console$6 = createConsole("BaseScanner");
const ScannerEventTypes = [
    "isScanningAvailable",
    "isScanning",
    "discoveredDevice",
    "expiredDiscoveredDevice",
];
class BaseScanner {
    get baseConstructor() {
        return this.constructor;
    }
    static get isSupported() {
        return false;
    }
    get isSupported() {
        return this.baseConstructor.isSupported;
    }
    constructor() {
        _BaseScanner_instances.add(this);
        _BaseScanner_boundEventListeners.set(this, {
            discoveredDevice: __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_onDiscoveredDevice).bind(this),
            isScanning: __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_onIsScanning).bind(this),
        });
        _BaseScanner_eventDispatcher.set(this, new EventDispatcher(this, ScannerEventTypes));
        _BaseScanner_discoveredDevices.set(this, {});
        _BaseScanner_discoveredDeviceTimestamps.set(this, {});
        _BaseScanner_checkDiscoveredDevicesExpirationTimer.set(this, new Timer(__classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_checkDiscoveredDevicesExpiration).bind(this), 1000));
        __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_assertIsSubclass).call(this);
        __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_assertIsSupported).call(this);
        addEventListeners(this, __classPrivateFieldGet(this, _BaseScanner_boundEventListeners, "f"));
    }
    get addEventListener() {
        return __classPrivateFieldGet(this, _BaseScanner_eventDispatcher, "f").addEventListener;
    }
    get dispatchEvent() {
        return __classPrivateFieldGet(this, _BaseScanner_eventDispatcher, "f").dispatchEvent;
    }
    get removeEventListener() {
        return __classPrivateFieldGet(this, _BaseScanner_eventDispatcher, "f").removeEventListener;
    }
    get waitForEvent() {
        return __classPrivateFieldGet(this, _BaseScanner_eventDispatcher, "f").waitForEvent;
    }
    get isScanningAvailable() {
        return false;
    }
    get isScanning() {
        return false;
    }
    startScan() {
        __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_assertIsAvailable).call(this);
        __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_assertIsNotScanning).call(this);
    }
    stopScan() {
        __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_assertIsScanning).call(this);
    }
    get discoveredDevices() {
        return __classPrivateFieldGet(this, _BaseScanner_discoveredDevices, "f");
    }
    get discoveredDevicesArray() {
        return Object.values(__classPrivateFieldGet(this, _BaseScanner_discoveredDevices, "f")).sort((a, b) => {
            return __classPrivateFieldGet(this, _BaseScanner_discoveredDeviceTimestamps, "f")[a.bluetoothId] - __classPrivateFieldGet(this, _BaseScanner_discoveredDeviceTimestamps, "f")[b.bluetoothId];
        });
    }
    static get DiscoveredDeviceExpirationTimeout() {
        return __classPrivateFieldGet(this, _a$1, "f", _BaseScanner_DiscoveredDeviceExpirationTimeout);
    }
    async connectToDevice(deviceId) {
        __classPrivateFieldGet(this, _BaseScanner_instances, "m", _BaseScanner_assertIsAvailable).call(this);
    }
    get canReset() {
        return false;
    }
    reset() {
        _console$6.log("resetting...");
    }
}
_a$1 = BaseScanner, _BaseScanner_boundEventListeners = new WeakMap(), _BaseScanner_eventDispatcher = new WeakMap(), _BaseScanner_discoveredDevices = new WeakMap(), _BaseScanner_discoveredDeviceTimestamps = new WeakMap(), _BaseScanner_checkDiscoveredDevicesExpirationTimer = new WeakMap(), _BaseScanner_instances = new WeakSet(), _BaseScanner_assertIsSupported = function _BaseScanner_assertIsSupported() {
    _console$6.assertWithError(this.isSupported, `${this.constructor.name} is not supported`);
}, _BaseScanner_assertIsSubclass = function _BaseScanner_assertIsSubclass() {
    _console$6.assertWithError(this.constructor != _a$1, `${this.constructor.name} must be subclassed`);
}, _BaseScanner_assertIsAvailable = function _BaseScanner_assertIsAvailable() {
    _console$6.assertWithError(this.isScanningAvailable, "not available");
}, _BaseScanner_assertIsScanning = function _BaseScanner_assertIsScanning() {
    _console$6.assertWithError(this.isScanning, "not scanning");
}, _BaseScanner_assertIsNotScanning = function _BaseScanner_assertIsNotScanning() {
    _console$6.assertWithError(!this.isScanning, "already scanning");
}, _BaseScanner_onIsScanning = function _BaseScanner_onIsScanning(event) {
    if (this.isScanning) {
        __classPrivateFieldSet(this, _BaseScanner_discoveredDevices, {}, "f");
        __classPrivateFieldSet(this, _BaseScanner_discoveredDeviceTimestamps, {}, "f");
    }
    else {
        __classPrivateFieldGet(this, _BaseScanner_checkDiscoveredDevicesExpirationTimer, "f").stop();
    }
}, _BaseScanner_onDiscoveredDevice = function _BaseScanner_onDiscoveredDevice(event) {
    const { discoveredDevice } = event.message;
    __classPrivateFieldGet(this, _BaseScanner_discoveredDevices, "f")[discoveredDevice.bluetoothId] = discoveredDevice;
    __classPrivateFieldGet(this, _BaseScanner_discoveredDeviceTimestamps, "f")[discoveredDevice.bluetoothId] = Date.now();
    __classPrivateFieldGet(this, _BaseScanner_checkDiscoveredDevicesExpirationTimer, "f").start();
}, _BaseScanner_discoveredDeviceExpirationTimeout_get = function _BaseScanner_discoveredDeviceExpirationTimeout_get() {
    return _a$1.DiscoveredDeviceExpirationTimeout;
}, _BaseScanner_checkDiscoveredDevicesExpiration = function _BaseScanner_checkDiscoveredDevicesExpiration() {
    const entries = Object.entries(__classPrivateFieldGet(this, _BaseScanner_discoveredDevices, "f"));
    if (entries.length == 0) {
        __classPrivateFieldGet(this, _BaseScanner_checkDiscoveredDevicesExpirationTimer, "f").stop();
        return;
    }
    const now = Date.now();
    entries.forEach(([id, discoveredDevice]) => {
        const timestamp = __classPrivateFieldGet(this, _BaseScanner_discoveredDeviceTimestamps, "f")[id];
        if (now - timestamp > __classPrivateFieldGet(this, _BaseScanner_instances, "a", _BaseScanner_discoveredDeviceExpirationTimeout_get)) {
            _console$6.log("discovered device timeout");
            delete __classPrivateFieldGet(this, _BaseScanner_discoveredDevices, "f")[id];
            delete __classPrivateFieldGet(this, _BaseScanner_discoveredDeviceTimestamps, "f")[id];
            this.dispatchEvent("expiredDiscoveredDevice", { discoveredDevice });
        }
    });
};
_BaseScanner_DiscoveredDeviceExpirationTimeout = { value: 5000 };

var _NobleConnectionManager_instances, _NobleConnectionManager_noblePeripheral, _NobleConnectionManager_unboundNoblePeripheralListeners, _NobleConnectionManager_onNoblePeripheralConnect, _NobleConnectionManager_onNoblePeripheralDisconnect, _NobleConnectionManager_onNoblePeripheralState, _NobleConnectionManager_removeEventListeners, _NobleConnectionManager_onNoblePeripheralRssiUpdate, _NobleConnectionManager_onNoblePeripheralServicesDiscover, _NobleConnectionManager_services, _NobleConnectionManager_unboundNobleServiceListeners, _NobleConnectionManager_onNobleServiceCharacteristicsDiscover, _NobleConnectionManager_unboundNobleCharacteristicListeners, _NobleConnectionManager_characteristics, _NobleConnectionManager_hasAllCharacteristics_get, _NobleConnectionManager_onNobleCharacteristicData, _NobleConnectionManager_onNobleCharacteristicWrite, _NobleConnectionManager_onNobleCharacteristicNotify;
const _console$5 = createConsole("NobleConnectionManager", { log: true });
class NobleConnectionManager extends BluetoothConnectionManager {
    constructor() {
        super(...arguments);
        _NobleConnectionManager_instances.add(this);
        _NobleConnectionManager_noblePeripheral.set(this, void 0);
        _NobleConnectionManager_unboundNoblePeripheralListeners.set(this, {
            connect: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNoblePeripheralConnect),
            disconnect: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNoblePeripheralDisconnect),
            rssiUpdate: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNoblePeripheralRssiUpdate),
            servicesDiscover: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNoblePeripheralServicesDiscover),
        });
        _NobleConnectionManager_services.set(this, new Map());
        _NobleConnectionManager_unboundNobleServiceListeners.set(this, {
            characteristicsDiscover: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNobleServiceCharacteristicsDiscover),
        });
        _NobleConnectionManager_unboundNobleCharacteristicListeners.set(this, {
            data: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNobleCharacteristicData),
            write: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNobleCharacteristicWrite),
            notify: __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNobleCharacteristicNotify),
        });
        _NobleConnectionManager_characteristics.set(this, new Map());
    }
    get bluetoothId() {
        return __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").id;
    }
    static get isSupported() {
        return isInNode;
    }
    static get type() {
        return "noble";
    }
    get isConnected() {
        return __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f")?.state == "connected";
    }
    async connect() {
        await super.connect();
        await __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").connectAsync();
    }
    async disconnect() {
        await super.disconnect();
        await __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").disconnectAsync();
    }
    async writeCharacteristic(characteristicName, data) {
        const characteristic = __classPrivateFieldGet(this, _NobleConnectionManager_characteristics, "f").get(characteristicName);
        _console$5.assertWithError(characteristic, `no characteristic found with name "${characteristicName}"`);
        const buffer = Buffer.from(data);
        _console$5.log("writing data", buffer);
        const withoutResponse = true;
        await characteristic.writeAsync(buffer, withoutResponse);
        if (characteristic.properties.includes("read")) {
            await characteristic.readAsync();
        }
    }
    get canReconnect() {
        return __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").connectable;
    }
    async reconnect() {
        await super.reconnect();
        _console$5.log("attempting to reconnect...");
        this.connect();
    }
    get noblePeripheral() {
        return __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f");
    }
    set noblePeripheral(newNoblePeripheral) {
        _console$5.assertTypeWithError(newNoblePeripheral, "object");
        if (this.noblePeripheral == newNoblePeripheral) {
            _console$5.log("attempted to assign duplicate noblePeripheral");
            return;
        }
        _console$5.log("newNoblePeripheral", newNoblePeripheral.id);
        if (__classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f")) {
            removeEventListeners(__classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f"), __classPrivateFieldGet(this, _NobleConnectionManager_unboundNoblePeripheralListeners, "f"));
            delete __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").connectionManager;
        }
        if (newNoblePeripheral) {
            newNoblePeripheral.connectionManager = this;
            addEventListeners(newNoblePeripheral, __classPrivateFieldGet(this, _NobleConnectionManager_unboundNoblePeripheralListeners, "f"));
        }
        __classPrivateFieldSet(this, _NobleConnectionManager_noblePeripheral, newNoblePeripheral, "f");
    }
    async onNoblePeripheralConnect(noblePeripheral) {
        _console$5.log("onNoblePeripheralConnect", noblePeripheral.id, noblePeripheral.state);
        if (noblePeripheral.state == "connected") {
            await __classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").discoverServicesAsync(allServiceUUIDs);
        }
        await __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNoblePeripheralState).call(this);
    }
    async onNoblePeripheralDisconnect(noblePeripheral) {
        _console$5.log("onNoblePeripheralDisconnect", noblePeripheral.id);
        await __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_onNoblePeripheralState).call(this);
    }
    async onNoblePeripheralRssiUpdate(noblePeripheral, rssi) {
        _console$5.log("onNoblePeripheralRssiUpdate", noblePeripheral.id, rssi);
    }
    async onNoblePeripheralServicesDiscover(noblePeripheral, services) {
        _console$5.log("onNoblePeripheralServicesDiscover", noblePeripheral.id, services.map((service) => service.uuid));
        for (const index in services) {
            const service = services[index];
            _console$5.log("service", service.uuid);
            const serviceName = getServiceNameFromUUID(service.uuid);
            _console$5.assertWithError(serviceName, `no name found for service uuid "${service.uuid}"`);
            _console$5.log({ serviceName });
            __classPrivateFieldGet(this, _NobleConnectionManager_services, "f").set(serviceName, service);
            service.name = serviceName;
            service.connectionManager = this;
            addEventListeners(service, __classPrivateFieldGet(this, _NobleConnectionManager_unboundNobleServiceListeners, "f"));
            await service.discoverCharacteristicsAsync();
        }
    }
    async onNobleServiceCharacteristicsDiscover(service, characteristics) {
        _console$5.log("onNobleServiceCharacteristicsDiscover", service.uuid, characteristics.map((characteristic) => characteristic.uuid));
        for (const index in characteristics) {
            const characteristic = characteristics[index];
            _console$5.log("characteristic", characteristic.uuid);
            const characteristicName = getCharacteristicNameFromUUID(characteristic.uuid);
            _console$5.assertWithError(Boolean(characteristicName), `no name found for characteristic uuid "${characteristic.uuid}"`);
            _console$5.log({ characteristicName });
            __classPrivateFieldGet(this, _NobleConnectionManager_characteristics, "f").set(characteristicName, characteristic);
            characteristic.name = characteristicName;
            characteristic.connectionManager = this;
            addEventListeners(characteristic, __classPrivateFieldGet(this, _NobleConnectionManager_unboundNobleCharacteristicListeners, "f"));
            if (characteristic.properties.includes("read")) {
                await characteristic.readAsync();
            }
            if (characteristic.properties.includes("notify")) {
                await characteristic.subscribeAsync();
            }
        }
        if (__classPrivateFieldGet(this, _NobleConnectionManager_instances, "a", _NobleConnectionManager_hasAllCharacteristics_get)) {
            this.status = "connected";
        }
    }
    onNobleCharacteristicData(characteristic, data, isNotification) {
        _console$5.log("onNobleCharacteristicData", characteristic.uuid, data, isNotification);
        const dataView = new DataView(dataToArrayBuffer(data));
        const characteristicName = characteristic.name;
        _console$5.assertWithError(Boolean(characteristicName), `no name found for characteristic with uuid "${characteristic.uuid}"`);
        this.onCharacteristicValueChanged(characteristicName, dataView);
    }
    onNobleCharacteristicWrite(characteristic) {
        _console$5.log("onNobleCharacteristicWrite", characteristic.uuid);
    }
    onNobleCharacteristicNotify(characteristic, isSubscribed) {
        _console$5.log("onNobleCharacteristicNotify", characteristic.uuid, isSubscribed);
    }
}
_NobleConnectionManager_noblePeripheral = new WeakMap(), _NobleConnectionManager_unboundNoblePeripheralListeners = new WeakMap(), _NobleConnectionManager_services = new WeakMap(), _NobleConnectionManager_unboundNobleServiceListeners = new WeakMap(), _NobleConnectionManager_unboundNobleCharacteristicListeners = new WeakMap(), _NobleConnectionManager_characteristics = new WeakMap(), _NobleConnectionManager_instances = new WeakSet(), _NobleConnectionManager_onNoblePeripheralConnect = async function _NobleConnectionManager_onNoblePeripheralConnect() {
    await this.connectionManager.onNoblePeripheralConnect(this);
}, _NobleConnectionManager_onNoblePeripheralDisconnect = async function _NobleConnectionManager_onNoblePeripheralDisconnect() {
    await this.connectionManager.onNoblePeripheralConnect(this);
}, _NobleConnectionManager_onNoblePeripheralState = async function _NobleConnectionManager_onNoblePeripheralState() {
    _console$5.log(`noblePeripheral ${this.bluetoothId} state ${__classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").state}`);
    switch (__classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").state) {
        case "connected":
            break;
        case "connecting":
            break;
        case "disconnected":
            __classPrivateFieldGet(this, _NobleConnectionManager_instances, "m", _NobleConnectionManager_removeEventListeners).call(this);
            this.status = "notConnected";
            break;
        case "disconnecting":
            this.status = "disconnecting";
            break;
        case "error":
            _console$5.error("noblePeripheral error");
            break;
        default:
            _console$5.log(`uncaught noblePeripheral state ${__classPrivateFieldGet(this, _NobleConnectionManager_noblePeripheral, "f").state}`);
            break;
    }
}, _NobleConnectionManager_removeEventListeners = function _NobleConnectionManager_removeEventListeners() {
    _console$5.log("removing noblePeripheral eventListeners");
    __classPrivateFieldGet(this, _NobleConnectionManager_services, "f").forEach((service) => {
        removeEventListeners(service, __classPrivateFieldGet(this, _NobleConnectionManager_unboundNobleServiceListeners, "f"));
    });
    __classPrivateFieldGet(this, _NobleConnectionManager_services, "f").clear();
    __classPrivateFieldGet(this, _NobleConnectionManager_characteristics, "f").forEach((characteristic) => {
        removeEventListeners(characteristic, __classPrivateFieldGet(this, _NobleConnectionManager_unboundNobleCharacteristicListeners, "f"));
    });
    __classPrivateFieldGet(this, _NobleConnectionManager_characteristics, "f").clear();
}, _NobleConnectionManager_onNoblePeripheralRssiUpdate = async function _NobleConnectionManager_onNoblePeripheralRssiUpdate(rssi) {
    await this.connectionManager.onNoblePeripheralRssiUpdate(this, rssi);
}, _NobleConnectionManager_onNoblePeripheralServicesDiscover = async function _NobleConnectionManager_onNoblePeripheralServicesDiscover(services) {
    await this.connectionManager.onNoblePeripheralServicesDiscover(this, services);
}, _NobleConnectionManager_onNobleServiceCharacteristicsDiscover = async function _NobleConnectionManager_onNobleServiceCharacteristicsDiscover(characteristics) {
    await this.connectionManager.onNobleServiceCharacteristicsDiscover(this, characteristics);
}, _NobleConnectionManager_hasAllCharacteristics_get = function _NobleConnectionManager_hasAllCharacteristics_get() {
    return allCharacteristicNames.every((characteristicName) => {
        return __classPrivateFieldGet(this, _NobleConnectionManager_characteristics, "f").has(characteristicName);
    });
}, _NobleConnectionManager_onNobleCharacteristicData = function _NobleConnectionManager_onNobleCharacteristicData(data, isNotification) {
    this.connectionManager.onNobleCharacteristicData(this, data, isNotification);
}, _NobleConnectionManager_onNobleCharacteristicWrite = function _NobleConnectionManager_onNobleCharacteristicWrite() {
    this.connectionManager.onNobleCharacteristicWrite(this);
}, _NobleConnectionManager_onNobleCharacteristicNotify = function _NobleConnectionManager_onNobleCharacteristicNotify(isSubscribed) {
    this.connectionManager.onNobleCharacteristicNotify(this, isSubscribed);
};

var _NobleScanner_instances, _NobleScanner__isScanning, _NobleScanner_isScanning_get, _NobleScanner_isScanning_set, _NobleScanner__nobleState, _NobleScanner_nobleState_get, _NobleScanner_nobleState_set, _NobleScanner_boundNobleListeners, _NobleScanner_onNobleScanStart, _NobleScanner_onNobleScanStop, _NobleScanner_onNobleStateChange, _NobleScanner_onNobleDiscover, _NobleScanner_boundBaseScannerListeners, _NobleScanner_onExpiredDiscoveredDevice, _NobleScanner_noblePeripherals, _NobleScanner_assertValidNoblePeripheralId, _NobleScanner_createDevice;
const _console$4 = createConsole("NobleScanner", { log: true });
let isSupported = false;
isSupported = true;
class NobleScanner extends BaseScanner {
    static get isSupported() {
        return isSupported;
    }
    get isScanning() {
        return __classPrivateFieldGet(this, _NobleScanner_instances, "a", _NobleScanner_isScanning_get);
    }
    constructor() {
        super();
        _NobleScanner_instances.add(this);
        _NobleScanner__isScanning.set(this, false);
        _NobleScanner__nobleState.set(this, "unknown");
        _NobleScanner_boundNobleListeners.set(this, {
            scanStart: __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_onNobleScanStart).bind(this),
            scanStop: __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_onNobleScanStop).bind(this),
            stateChange: __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_onNobleStateChange).bind(this),
            discover: __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_onNobleDiscover).bind(this),
        });
        _NobleScanner_boundBaseScannerListeners.set(this, {
            expiredDiscoveredDevice: __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_onExpiredDiscoveredDevice).bind(this),
        });
        _NobleScanner_noblePeripherals.set(this, {});
        addEventListeners(noble, __classPrivateFieldGet(this, _NobleScanner_boundNobleListeners, "f"));
        addEventListeners(this, __classPrivateFieldGet(this, _NobleScanner_boundBaseScannerListeners, "f"));
    }
    get isScanningAvailable() {
        return __classPrivateFieldGet(this, _NobleScanner_instances, "a", _NobleScanner_nobleState_get) == "poweredOn";
    }
    startScan() {
        super.startScan();
        noble.startScanningAsync(serviceUUIDs, true);
    }
    stopScan() {
        super.stopScan();
        noble.stopScanningAsync();
    }
    get canReset() {
        return true;
    }
    reset() {
        super.reset();
        noble.reset();
    }
    async connectToDevice(deviceId) {
        super.connectToDevice(deviceId);
        __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_assertValidNoblePeripheralId).call(this, deviceId);
        const noblePeripheral = __classPrivateFieldGet(this, _NobleScanner_noblePeripherals, "f")[deviceId];
        _console$4.log("connecting to discoveredDevice...", deviceId);
        let device = DeviceManager$1.AvailableDevices.filter((device) => device.connectionType == "noble").find((device) => device.bluetoothId == deviceId);
        if (!device) {
            device = __classPrivateFieldGet(this, _NobleScanner_instances, "m", _NobleScanner_createDevice).call(this, noblePeripheral);
            await device.connect();
        }
        else {
            await device.reconnect();
        }
    }
}
_NobleScanner__isScanning = new WeakMap(), _NobleScanner__nobleState = new WeakMap(), _NobleScanner_boundNobleListeners = new WeakMap(), _NobleScanner_boundBaseScannerListeners = new WeakMap(), _NobleScanner_noblePeripherals = new WeakMap(), _NobleScanner_instances = new WeakSet(), _NobleScanner_isScanning_get = function _NobleScanner_isScanning_get() {
    return __classPrivateFieldGet(this, _NobleScanner__isScanning, "f");
}, _NobleScanner_isScanning_set = function _NobleScanner_isScanning_set(newIsScanning) {
    _console$4.assertTypeWithError(newIsScanning, "boolean");
    if (this.isScanning == newIsScanning) {
        _console$4.log("duplicate isScanning assignment");
        return;
    }
    __classPrivateFieldSet(this, _NobleScanner__isScanning, newIsScanning, "f");
    this.dispatchEvent("isScanning", { isScanning: this.isScanning });
}, _NobleScanner_nobleState_get = function _NobleScanner_nobleState_get() {
    return __classPrivateFieldGet(this, _NobleScanner__nobleState, "f");
}, _NobleScanner_nobleState_set = function _NobleScanner_nobleState_set(newNobleState) {
    _console$4.assertTypeWithError(newNobleState, "string");
    if (__classPrivateFieldGet(this, _NobleScanner_instances, "a", _NobleScanner_nobleState_get) == newNobleState) {
        _console$4.log("duplicate nobleState assignment");
        return;
    }
    __classPrivateFieldSet(this, _NobleScanner__nobleState, newNobleState, "f");
    _console$4.log({ newNobleState });
    this.dispatchEvent("isScanningAvailable", { isScanningAvailable: this.isScanningAvailable });
}, _NobleScanner_onNobleScanStart = function _NobleScanner_onNobleScanStart() {
    _console$4.log("OnNobleScanStart");
    __classPrivateFieldSet(this, _NobleScanner_instances, true, "a", _NobleScanner_isScanning_set);
}, _NobleScanner_onNobleScanStop = function _NobleScanner_onNobleScanStop() {
    _console$4.log("OnNobleScanStop");
    __classPrivateFieldSet(this, _NobleScanner_instances, false, "a", _NobleScanner_isScanning_set);
}, _NobleScanner_onNobleStateChange = function _NobleScanner_onNobleStateChange(state) {
    _console$4.log("onNobleStateChange", state);
    __classPrivateFieldSet(this, _NobleScanner_instances, state, "a", _NobleScanner_nobleState_set);
}, _NobleScanner_onNobleDiscover = function _NobleScanner_onNobleDiscover(noblePeripheral) {
    _console$4.log("onNobleDiscover", noblePeripheral.id);
    if (!__classPrivateFieldGet(this, _NobleScanner_noblePeripherals, "f")[noblePeripheral.id]) {
        noblePeripheral.scanner = this;
        __classPrivateFieldGet(this, _NobleScanner_noblePeripherals, "f")[noblePeripheral.id] = noblePeripheral;
    }
    let deviceType;
    const serviceData = noblePeripheral.advertisement.serviceData;
    if (serviceData) {
        const deviceTypeServiceData = serviceData.find((serviceDatum) => {
            return serviceDatum.uuid == serviceDataUUID;
        });
        if (deviceTypeServiceData) {
            const deviceTypeEnum = deviceTypeServiceData.data.readUint8(0);
            deviceType = DeviceTypes[deviceTypeEnum];
        }
    }
    const discoveredDevice = {
        name: noblePeripheral.advertisement.localName,
        bluetoothId: noblePeripheral.id,
        deviceType,
        rssi: noblePeripheral.rssi,
    };
    this.dispatchEvent("discoveredDevice", { discoveredDevice });
}, _NobleScanner_onExpiredDiscoveredDevice = function _NobleScanner_onExpiredDiscoveredDevice(event) {
    const { discoveredDevice } = event.message;
    const noblePeripheral = __classPrivateFieldGet(this, _NobleScanner_noblePeripherals, "f")[discoveredDevice.bluetoothId];
    if (noblePeripheral) {
        delete __classPrivateFieldGet(this, _NobleScanner_noblePeripherals, "f")[discoveredDevice.bluetoothId];
    }
}, _NobleScanner_assertValidNoblePeripheralId = function _NobleScanner_assertValidNoblePeripheralId(noblePeripheralId) {
    _console$4.assertTypeWithError(noblePeripheralId, "string");
    _console$4.assertWithError(__classPrivateFieldGet(this, _NobleScanner_noblePeripherals, "f")[noblePeripheralId], `no noblePeripheral found with id "${noblePeripheralId}"`);
}, _NobleScanner_createDevice = function _NobleScanner_createDevice(noblePeripheral) {
    const device = new Device$1();
    const nobleConnectionManager = new NobleConnectionManager();
    nobleConnectionManager.noblePeripheral = noblePeripheral;
    device.connectionManager = nobleConnectionManager;
    return device;
};

const _console$3 = createConsole("Scanner", { log: false });
let scanner;
if (NobleScanner.isSupported) {
    _console$3.log("using NobleScanner");
    scanner = new NobleScanner();
}
else {
    _console$3.log("Scanner not available");
}
var scanner$1 = scanner;

const _console$2 = createConsole("ServerUtils", { log: false });
const pingTimeout = 30_000_000;
const ServerMessageTypes = [
    "ping",
    "pong",
    "isScanningAvailable",
    "isScanning",
    "startScan",
    "stopScan",
    "discoveredDevice",
    "discoveredDevices",
    "expiredDiscoveredDevice",
    "connectToDevice",
    "disconnectFromDevice",
    "connectedDevices",
    "deviceMessage",
];
function createMessage(enumeration, ...messages) {
    _console$2.log("createMessage", ...messages);
    const messageBuffers = messages.map((message) => {
        if (typeof message == "string") {
            message = { type: message };
        }
        if (message.data != undefined) {
            if (!Array.isArray(message.data)) {
                message.data = [message.data];
            }
        }
        else {
            message.data = [];
        }
        const messageDataArrayBuffer = concatenateArrayBuffers(...message.data);
        const messageDataArrayBufferByteLength = messageDataArrayBuffer.byteLength;
        _console$2.assertEnumWithError(message.type, enumeration);
        const messageTypeEnum = enumeration.indexOf(message.type);
        return concatenateArrayBuffers(messageTypeEnum, Uint16Array.from([messageDataArrayBufferByteLength]), messageDataArrayBuffer);
    });
    _console$2.log("messageBuffers", ...messageBuffers);
    return concatenateArrayBuffers(...messageBuffers);
}
function createServerMessage(...messages) {
    _console$2.log("createServerMessage", ...messages);
    return createMessage(ServerMessageTypes, ...messages);
}
function createDeviceMessage(...messages) {
    _console$2.log("createDeviceMessage", ...messages);
    return createMessage(DeviceEventTypes, ...messages);
}
const pingMessage = createServerMessage("ping");
const pongMessage = createServerMessage("pong");
createServerMessage("isScanningAvailable");
createServerMessage("isScanning");
createServerMessage("startScan");
createServerMessage("stopScan");
createServerMessage("discoveredDevices");

var _BaseServer_instances, _a, _BaseServer_ClearSensorConfigurationsWhenNoClients, _BaseServer_clearSensorConfigurationsWhenNoClients, _BaseServer_boundServerListeners, _BaseServer_onClientConnected, _BaseServer_onClientDisconnected, _BaseServer_boundScannerListeners, _BaseServer_onScannerIsAvailable, _BaseServer_isScanningAvailableMessage_get, _BaseServer_onScannerIsScanning, _BaseServer_isScanningMessage_get, _BaseServer_onScannerDiscoveredDevice, _BaseServer_createDiscoveredDeviceMessage, _BaseServer_onExpiredDiscoveredDevice, _BaseServer_createExpiredDiscoveredDeviceMessage, _BaseServer_discoveredDevicesMessage_get, _BaseServer_connectedDevicesMessage_get, _BaseServer_boundDeviceListeners, _BaseServer_createDeviceMessage, _BaseServer_onDeviceConnectionMessage, _BaseServer_boundDeviceManagerListeners, _BaseServer_onDeviceConnected, _BaseServer_onDeviceDisconnected, _BaseServer_onDeviceIsConnected, _BaseServer_createDeviceIsConnectedMessage, _BaseServer_createDeviceServerMessage, _BaseServer_onClientMessage, _BaseServer_parseClientDeviceMessageCallback;
const _console$1 = createConsole("BaseServer", { log: true });
const ServerEventTypes = ["clientConnected", "clientDisconnected"];
class BaseServer {
    get addEventListener() {
        return this.eventDispatcher.addEventListener;
    }
    get dispatchEvent() {
        return this.eventDispatcher.dispatchEvent;
    }
    get removeEventListener() {
        return this.eventDispatcher.removeEventListener;
    }
    get waitForEvent() {
        return this.eventDispatcher.waitForEvent;
    }
    constructor() {
        _BaseServer_instances.add(this);
        this.eventDispatcher = new EventDispatcher(this, ServerEventTypes);
        _BaseServer_clearSensorConfigurationsWhenNoClients.set(this, __classPrivateFieldGet(_a, _a, "f", _BaseServer_ClearSensorConfigurationsWhenNoClients));
        _BaseServer_boundServerListeners.set(this, {
            clientConnected: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onClientConnected).bind(this),
            clientDisconnected: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onClientDisconnected).bind(this),
        });
        _BaseServer_boundScannerListeners.set(this, {
            isScanningAvailable: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onScannerIsAvailable).bind(this),
            isScanning: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onScannerIsScanning).bind(this),
            discoveredDevice: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onScannerDiscoveredDevice).bind(this),
            expiredDiscoveredDevice: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onExpiredDiscoveredDevice).bind(this),
        });
        _BaseServer_boundDeviceListeners.set(this, {
            connectionMessage: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onDeviceConnectionMessage).bind(this),
        });
        _BaseServer_boundDeviceManagerListeners.set(this, {
            deviceConnected: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onDeviceConnected).bind(this),
            deviceDisconnected: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onDeviceDisconnected).bind(this),
            deviceIsConnected: __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onDeviceIsConnected).bind(this),
        });
        _console$1.assertWithError(scanner$1, "no scanner defined");
        addEventListeners(scanner$1, __classPrivateFieldGet(this, _BaseServer_boundScannerListeners, "f"));
        addEventListeners(DeviceManager$1, __classPrivateFieldGet(this, _BaseServer_boundDeviceManagerListeners, "f"));
        addEventListeners(this, __classPrivateFieldGet(this, _BaseServer_boundServerListeners, "f"));
    }
    get numberOfClients() {
        return 0;
    }
    static get ClearSensorConfigurationsWhenNoClients() {
        return __classPrivateFieldGet(this, _a, "f", _BaseServer_ClearSensorConfigurationsWhenNoClients);
    }
    static set ClearSensorConfigurationsWhenNoClients(newValue) {
        _console$1.assertTypeWithError(newValue, "boolean");
        __classPrivateFieldSet(this, _a, newValue, "f", _BaseServer_ClearSensorConfigurationsWhenNoClients);
    }
    get clearSensorConfigurationsWhenNoClients() {
        return __classPrivateFieldGet(this, _BaseServer_clearSensorConfigurationsWhenNoClients, "f");
    }
    set clearSensorConfigurationsWhenNoClients(newValue) {
        _console$1.assertTypeWithError(newValue, "boolean");
        __classPrivateFieldSet(this, _BaseServer_clearSensorConfigurationsWhenNoClients, newValue, "f");
    }
    broadcastMessage(message) {
        _console$1.log("broadcasting", message);
    }
    parseClientMessage(dataView) {
        let responseMessages = [];
        parseMessage(dataView, ServerMessageTypes, __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_onClientMessage).bind(this), { responseMessages }, true);
        responseMessages = responseMessages.filter(Boolean);
        if (responseMessages.length > 0) {
            return concatenateArrayBuffers(responseMessages);
        }
    }
    parseClientDeviceMessage(device, dataView) {
        _console$1.log("onDeviceMessage", device.bluetoothId, dataView);
        let responseMessages = [];
        parseMessage(dataView, ConnectionMessageTypes, __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_parseClientDeviceMessageCallback).bind(this), { responseMessages, device }, true);
        if (responseMessages.length > 0) {
            return __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDeviceServerMessage).call(this, device, ...responseMessages);
        }
    }
}
_a = BaseServer, _BaseServer_clearSensorConfigurationsWhenNoClients = new WeakMap(), _BaseServer_boundServerListeners = new WeakMap(), _BaseServer_boundScannerListeners = new WeakMap(), _BaseServer_boundDeviceListeners = new WeakMap(), _BaseServer_boundDeviceManagerListeners = new WeakMap(), _BaseServer_instances = new WeakSet(), _BaseServer_onClientConnected = function _BaseServer_onClientConnected(event) {
    event.message.client;
    _console$1.log("onClientConnected");
}, _BaseServer_onClientDisconnected = function _BaseServer_onClientDisconnected(event) {
    event.message.client;
    _console$1.log("onClientDisconnected");
    if (this.numberOfClients == 0 && this.clearSensorConfigurationsWhenNoClients) {
        DeviceManager$1.ConnectedDevices.forEach((device) => {
            device.clearSensorConfiguration();
            device.setTfliteInferencingEnabled(false);
        });
    }
}, _BaseServer_onScannerIsAvailable = function _BaseServer_onScannerIsAvailable(event) {
    this.broadcastMessage(__classPrivateFieldGet(this, _BaseServer_instances, "a", _BaseServer_isScanningAvailableMessage_get));
}, _BaseServer_isScanningAvailableMessage_get = function _BaseServer_isScanningAvailableMessage_get() {
    return createServerMessage({ type: "isScanningAvailable", data: scanner$1.isScanningAvailable });
}, _BaseServer_onScannerIsScanning = function _BaseServer_onScannerIsScanning(event) {
    this.broadcastMessage(__classPrivateFieldGet(this, _BaseServer_instances, "a", _BaseServer_isScanningMessage_get));
}, _BaseServer_isScanningMessage_get = function _BaseServer_isScanningMessage_get() {
    return createServerMessage({ type: "isScanning", data: scanner$1.isScanning });
}, _BaseServer_onScannerDiscoveredDevice = function _BaseServer_onScannerDiscoveredDevice(event) {
    const { discoveredDevice } = event.message;
    _console$1.log(discoveredDevice);
    this.broadcastMessage(__classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDiscoveredDeviceMessage).call(this, discoveredDevice));
}, _BaseServer_createDiscoveredDeviceMessage = function _BaseServer_createDiscoveredDeviceMessage(discoveredDevice) {
    return createServerMessage({ type: "discoveredDevice", data: discoveredDevice });
}, _BaseServer_onExpiredDiscoveredDevice = function _BaseServer_onExpiredDiscoveredDevice(event) {
    const { discoveredDevice } = event.message;
    _console$1.log("expired", discoveredDevice);
    this.broadcastMessage(__classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createExpiredDiscoveredDeviceMessage).call(this, discoveredDevice));
}, _BaseServer_createExpiredDiscoveredDeviceMessage = function _BaseServer_createExpiredDiscoveredDeviceMessage(discoveredDevice) {
    return createServerMessage({ type: "expiredDiscoveredDevice", data: discoveredDevice.bluetoothId });
}, _BaseServer_discoveredDevicesMessage_get = function _BaseServer_discoveredDevicesMessage_get() {
    const serverMessages = scanner$1.discoveredDevicesArray.map((discoveredDevice) => {
        return { type: "discoveredDevice", data: discoveredDevice };
    });
    return createServerMessage(...serverMessages);
}, _BaseServer_connectedDevicesMessage_get = function _BaseServer_connectedDevicesMessage_get() {
    return createServerMessage({
        type: "connectedDevices",
        data: JSON.stringify(DeviceManager$1.ConnectedDevices.map((device) => device.bluetoothId)),
    });
}, _BaseServer_createDeviceMessage = function _BaseServer_createDeviceMessage(device, messageType, dataView) {
    return {
        type: messageType,
        data: dataView || device.latestConnectionMessage.get(messageType),
    };
}, _BaseServer_onDeviceConnectionMessage = function _BaseServer_onDeviceConnectionMessage(deviceEvent) {
    const { target: device, message } = deviceEvent;
    _console$1.log("onDeviceConnectionMessage", deviceEvent.message);
    if (!device.isConnected) {
        return;
    }
    const { messageType, dataView } = message;
    this.broadcastMessage(__classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDeviceServerMessage).call(this, device, __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDeviceMessage).call(this, device, messageType, dataView)));
}, _BaseServer_onDeviceConnected = function _BaseServer_onDeviceConnected(staticDeviceEvent) {
    const { device } = staticDeviceEvent.message;
    _console$1.log("onDeviceConnected", device.bluetoothId);
    addEventListeners(device, __classPrivateFieldGet(this, _BaseServer_boundDeviceListeners, "f"));
}, _BaseServer_onDeviceDisconnected = function _BaseServer_onDeviceDisconnected(staticDeviceEvent) {
    const { device } = staticDeviceEvent.message;
    _console$1.log("onDeviceDisconnected", device.bluetoothId);
    removeEventListeners(device, __classPrivateFieldGet(this, _BaseServer_boundDeviceListeners, "f"));
}, _BaseServer_onDeviceIsConnected = function _BaseServer_onDeviceIsConnected(staticDeviceEvent) {
    const { device } = staticDeviceEvent.message;
    _console$1.log("onDeviceIsConnected", device.bluetoothId);
    this.broadcastMessage(__classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDeviceIsConnectedMessage).call(this, device));
}, _BaseServer_createDeviceIsConnectedMessage = function _BaseServer_createDeviceIsConnectedMessage(device) {
    return __classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDeviceServerMessage).call(this, device, { type: "isConnected", data: device.isConnected });
}, _BaseServer_createDeviceServerMessage = function _BaseServer_createDeviceServerMessage(device, ...messages) {
    return createServerMessage({
        type: "deviceMessage",
        data: [device.bluetoothId, createDeviceMessage(...messages)],
    });
}, _BaseServer_onClientMessage = function _BaseServer_onClientMessage(messageType, dataView, context) {
    const { responseMessages } = context;
    switch (messageType) {
        case "ping":
            responseMessages.push(pongMessage);
            break;
        case "pong":
            break;
        case "isScanningAvailable":
            responseMessages.push(__classPrivateFieldGet(this, _BaseServer_instances, "a", _BaseServer_isScanningAvailableMessage_get));
            break;
        case "isScanning":
            responseMessages.push(__classPrivateFieldGet(this, _BaseServer_instances, "a", _BaseServer_isScanningMessage_get));
            break;
        case "startScan":
            scanner$1.startScan();
            break;
        case "stopScan":
            scanner$1.stopScan();
            break;
        case "discoveredDevices":
            responseMessages.push(__classPrivateFieldGet(this, _BaseServer_instances, "a", _BaseServer_discoveredDevicesMessage_get));
            break;
        case "connectToDevice":
            {
                const { string: deviceId } = parseStringFromDataView(dataView);
                scanner$1.connectToDevice(deviceId);
            }
            break;
        case "disconnectFromDevice":
            {
                const { string: deviceId } = parseStringFromDataView(dataView);
                const device = DeviceManager$1.ConnectedDevices.find((device) => device.bluetoothId == deviceId);
                if (!device) {
                    _console$1.error(`no device found with id ${deviceId}`);
                    break;
                }
                device.disconnect();
            }
            break;
        case "connectedDevices":
            responseMessages.push(__classPrivateFieldGet(this, _BaseServer_instances, "a", _BaseServer_connectedDevicesMessage_get));
            break;
        case "deviceMessage":
            {
                const { string: deviceId, byteOffset } = parseStringFromDataView(dataView);
                const device = DeviceManager$1.ConnectedDevices.find((device) => device.bluetoothId == deviceId);
                if (!device) {
                    _console$1.error(`no device found with id ${deviceId}`);
                    break;
                }
                const _dataView = new DataView(dataView.buffer, dataView.byteOffset + byteOffset);
                const responseMessage = this.parseClientDeviceMessage(device, _dataView);
                if (responseMessage) {
                    responseMessages.push(responseMessage);
                }
            }
            break;
        default:
            _console$1.error(`uncaught messageType "${messageType}"`);
            break;
    }
}, _BaseServer_parseClientDeviceMessageCallback = function _BaseServer_parseClientDeviceMessageCallback(messageType, dataView, context) {
    switch (messageType) {
        case "smp":
            context.device.connectionManager.sendSmpMessage(dataView.buffer);
            break;
        case "tx":
            context.device.connectionManager.sendTxData(dataView.buffer);
            break;
        default:
            context.responseMessages.push(__classPrivateFieldGet(this, _BaseServer_instances, "m", _BaseServer_createDeviceMessage).call(this, context.device, messageType));
            break;
    }
};
_BaseServer_ClearSensorConfigurationsWhenNoClients = { value: true };

var _WebSocketServer_instances, _WebSocketServer_server, _WebSocketServer_boundServerListeners, _WebSocketServer_onServerClose, _WebSocketServer_onServerConnection, _WebSocketServer_onServerError, _WebSocketServer_onServerHeaders, _WebSocketServer_onServerListening, _WebSocketServer_boundClientListeners, _WebSocketServer_onClientOpen, _WebSocketServer_onClientMessage, _WebSocketServer_onClientClose, _WebSocketServer_onClientError, _WebSocketServer_parseClientMessage, _WebSocketServer_pingClient;
const _console = createConsole("WebSocketServer", { log: true });
class WebSocketServer extends BaseServer {
    constructor() {
        super(...arguments);
        _WebSocketServer_instances.add(this);
        _WebSocketServer_server.set(this, void 0);
        _WebSocketServer_boundServerListeners.set(this, {
            close: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onServerClose).bind(this),
            connection: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onServerConnection).bind(this),
            error: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onServerError).bind(this),
            headers: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onServerHeaders).bind(this),
            listening: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onServerListening).bind(this),
        });
        _WebSocketServer_boundClientListeners.set(this, {
            open: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onClientOpen).bind(this),
            message: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onClientMessage).bind(this),
            close: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onClientClose).bind(this),
            error: __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_onClientError).bind(this),
        });
    }
    get numberOfClients() {
        return __classPrivateFieldGet(this, _WebSocketServer_server, "f")?.clients.size || 0;
    }
    get server() {
        return __classPrivateFieldGet(this, _WebSocketServer_server, "f");
    }
    set server(newServer) {
        if (__classPrivateFieldGet(this, _WebSocketServer_server, "f") == newServer) {
            _console.log("redundant WebSocket assignment");
            return;
        }
        _console.log("assigning server...");
        if (__classPrivateFieldGet(this, _WebSocketServer_server, "f")) {
            _console.log("clearing existing server...");
            removeEventListeners(__classPrivateFieldGet(this, _WebSocketServer_server, "f"), __classPrivateFieldGet(this, _WebSocketServer_boundServerListeners, "f"));
        }
        addEventListeners(newServer, __classPrivateFieldGet(this, _WebSocketServer_boundServerListeners, "f"));
        __classPrivateFieldSet(this, _WebSocketServer_server, newServer, "f");
        _console.log("assigned server");
    }
    broadcastMessage(message) {
        super.broadcastMessage(message);
        this.server.clients.forEach((client) => {
            client.send(message);
        });
    }
}
_WebSocketServer_server = new WeakMap(), _WebSocketServer_boundServerListeners = new WeakMap(), _WebSocketServer_boundClientListeners = new WeakMap(), _WebSocketServer_instances = new WeakSet(), _WebSocketServer_onServerClose = function _WebSocketServer_onServerClose() {
    _console.log("server.close");
}, _WebSocketServer_onServerConnection = function _WebSocketServer_onServerConnection(client) {
    _console.log("server.connection");
    client.isAlive = true;
    client.pingClientTimer = new Timer(() => __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_pingClient).call(this, client), pingTimeout);
    client.pingClientTimer.start();
    addEventListeners(client, __classPrivateFieldGet(this, _WebSocketServer_boundClientListeners, "f"));
    this.dispatchEvent("clientConnected", { client });
}, _WebSocketServer_onServerError = function _WebSocketServer_onServerError(error) {
    _console.error(error);
}, _WebSocketServer_onServerHeaders = function _WebSocketServer_onServerHeaders() {
}, _WebSocketServer_onServerListening = function _WebSocketServer_onServerListening() {
    _console.log("server.listening");
}, _WebSocketServer_onClientOpen = function _WebSocketServer_onClientOpen(event) {
    _console.log("client.open");
}, _WebSocketServer_onClientMessage = function _WebSocketServer_onClientMessage(event) {
    _console.log("client.message");
    const client = event.target;
    client.isAlive = true;
    client.pingClientTimer.restart();
    const dataView = new DataView(dataToArrayBuffer(event.data));
    __classPrivateFieldGet(this, _WebSocketServer_instances, "m", _WebSocketServer_parseClientMessage).call(this, client, dataView);
}, _WebSocketServer_onClientClose = function _WebSocketServer_onClientClose(event) {
    _console.log("client.close");
    const client = event.target;
    client.pingClientTimer.stop();
    removeEventListeners(client, __classPrivateFieldGet(this, _WebSocketServer_boundClientListeners, "f"));
    this.dispatchEvent("clientDisconnected", { client });
}, _WebSocketServer_onClientError = function _WebSocketServer_onClientError(event) {
    _console.error("client.error", event.message);
}, _WebSocketServer_parseClientMessage = function _WebSocketServer_parseClientMessage(client, dataView) {
    const responseMessage = this.parseClientMessage(dataView);
    if (responseMessage) {
        client.send(responseMessage);
    }
}, _WebSocketServer_pingClient = function _WebSocketServer_pingClient(client) {
    if (!client.isAlive) {
        client.terminate();
        return;
    }
    client.isAlive = false;
    client.send(pingMessage);
};

export { ContinuousSensorTypes, DefaultNumberOfPressureSensors, Device$1 as Device, DeviceManager$1 as DeviceManager, DevicePair, DeviceTypes, environment as Environment, FileTransferDirections, FileTypes, MaxNameLength, MaxNumberOfVibrationWaveformEffectSegments, MaxNumberOfVibrationWaveformSegments, MaxSensorRate, MaxVibrationWaveformEffectSegmentDelay, MaxVibrationWaveformEffectSegmentLoopCount, MaxVibrationWaveformEffectSequenceLoopCount, MaxVibrationWaveformSegmentDuration, MinNameLength, scanner$1 as Scanner, SensorRateStep, SensorTypes, TfliteSensorTypes, TfliteTasks, VibrationLocations, VibrationTypes, VibrationWaveformEffects, WebSocketServer, setAllConsoleLevelFlags, setConsoleLevelFlagsForType };
//# sourceMappingURL=brilliantsole.node.module.js.map