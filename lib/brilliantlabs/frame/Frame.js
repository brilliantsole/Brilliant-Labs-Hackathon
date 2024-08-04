// https://github.com/mrdoob/eventdispatcher.js/
class EventDispatcher {
  addEventListener(type, listener) {
    if (this._listeners === undefined) this._listeners = {};

    const listeners = this._listeners;

    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
  }

  hasEventListener(type, listener) {
    if (this._listeners === undefined) return false;

    const listeners = this._listeners;

    return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
  }

  removeEventListener(type, listener) {
    if (this._listeners === undefined) return;

    const listeners = this._listeners;
    const listenerArray = listeners[type];

    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    if (this._listeners === undefined) return;

    const listeners = this._listeners;
    const listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      event.target = this;

      // Make a copy, in case listeners are removed while iterating.
      const array = listenerArray.slice(0);

      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event);
      }
    }
  }
}

{
  const eventDispatcherAddEventListener = EventDispatcher.prototype.addEventListener;
  EventDispatcher.prototype.addEventListener = function (type, listener, options) {
    if (options) {
      if (options.once) {
        function onceCallback(event) {
          listener.apply(this, arguments);
          this.removeEventListener(type, onceCallback);
        }
        eventDispatcherAddEventListener.call(this, type, onceCallback);
      }
    } else {
      eventDispatcherAddEventListener.apply(this, arguments);
    }
  };
}

function generateUUID(value) {
  // https://github.com/brilliantlabsAR/frame-utilities-for-python/blob/main/src/frameutils/bluetooth.py#L13
  return `7a23000${value}-5475-a6a4-654c-8431f6ad49c4`.toLowerCase();
}

class Frame extends EventDispatcher {
  enableLogging = true;
  log() {
    if (this.enableLogging) {
      console.groupCollapsed(`[${this.constructor.name}]`, ...arguments);
      console.trace(); // hidden in collapsed group
      console.groupEnd();
    }
  }

  /** @type {BluetoothRemoteGATTCharacteristic} */
  txCharacteristic;

  services = {
    main: {
      uuid: generateUUID(1),
      characteristics: {
        rx: {
          uuid: generateUUID(3),
        },
        tx: {
          uuid: generateUUID(2),
        },
      },
    },
  };

  get isConnected() {
    return this.device && this.device.gatt.connected;
  }

  async connect() {
    this.log("attempting to connect...");
    if (this.isConnected) {
      this.log("already connected");
      return;
    }

    this.log("getting device...");
    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [this.services.main.uuid],
        },
      ],
    });

    if (device) {
      this.connectToDevice(device);
    }
  }
  async connectToDevice(device) {
    this.log("connecting to device", device);
    this.device = device;
    this.device.addEventListener("gattserverdisconnected", this.onGattServerDisconnected.bind(this));

    this.log("getting server");
    this.server = await this.device.gatt.connect();
    this.log("got server!");
    await this.onGattServerConnected();
  }
  async disconnect() {
    this.log("attempting to disconnect...");
    if (!this.isConnected) {
      this.log("already disconnected");
      return;
    }

    this.device.gatt.disconnect();
  }

  async onGattServerConnected() {
    if (!this.isConnected) {
      return;
    }

    for (const serviceName in this.services) {
      const serviceInfo = this.services[serviceName];
      if (serviceInfo.ignore) {
        continue;
      }
      this.log(`getting "${serviceName}" service...`);
      const service = (serviceInfo.service = await this.server.getPrimaryService(serviceInfo.uuid));
      this.log(`got "${serviceName}" service!`, service);

      for (const characteristicName in serviceInfo.characteristics) {
        const characteristicInfo = serviceInfo.characteristics[characteristicName];
        this.log(`getting ${characteristicName} characteristic (${characteristicInfo.uuid})`);
        const characteristic = (characteristicInfo.characteristic = await serviceInfo.service.getCharacteristic(
          characteristicInfo.uuid
        ));
        this.log(`got ${characteristicName} characteristic!`, characteristic);
        console.log(characteristic);
        if (characteristicName == "rx") {
          characteristic.addEventListener("characteristicvaluechanged", this.onRxCharacteristicValueChanged.bind(this));
          this.log(`starting ${characteristicName} notifications...`);
          await characteristic.startNotifications();
          this.log(`started ${characteristicName} notifications!`);
        }
        if (characteristicName == "tx") {
          this.txCharacteristic = characteristic;
        }
      }
    }

    this.log("connection complete!");
    this.dispatchEvent({ type: "connected" });
  }
  async onGattServerDisconnected() {
    this.log("disconnected");
    this.dispatchEvent({ type: "disconnected" });
  }

  onRxCharacteristicValueChanged(event) {
    let dataView = event.target.value;
    this.log("onRxCharacteristicValueChanged", event, dataView);
    const response = this.textDecoder.decode(dataView);
    this.log({ response });
    this.dispatchEvent({ type: "response", message: { response } });

    const [type, value] = response.split(":");
    switch (type) {
      case "batteryLevel":
        const batteryLevel = Number(value);
        this.dispatchEvent({ type: "batteryLevel", message: { batteryLevel } });
        break;
    }
  }

  /** @param {ArrayBuffer} arrayBuffer */
  writeValue(arrayBuffer) {
    this.txCharacteristic.writeValue(arrayBuffer);
  }

  textEncoder = new TextEncoder();
  textDecoder = new TextDecoder();
  /** @param {string} string */
  sendString(string) {
    this.log("sending string", string);
    this.writeValue(this.textEncoder.encode(string));
  }
  /** @param {ArrayBuffer} arrayBuffer */
  sendData(arrayBuffer) {
    const arrayBufferWith1 = this.prepend1ToArrayBuffer(arrayBuffer);
    this.writeValue(arrayBufferWith1);
  }

  sendSingleByte(number) {
    const dataView = new DataView(new ArrayBuffer(1));
    dataView.setUint8(0, number);
    this.writeValue(dataView.buffer);
  }

  cancel() {
    this.sendSingleByte(3);
  }
  reset() {
    this.sendSingleByte(4);
  }

  concatenateArrayBuffers(...arrayBuffers) {
    arrayBuffers = arrayBuffers.filter((arrayBuffer) => arrayBuffer != undefined || arrayBuffer != null);
    arrayBuffers = arrayBuffers.map((arrayBuffer) => {
      if (typeof arrayBuffer == "number") {
        const number = arrayBuffer;
        return Uint8Array.from([Math.floor(number)]);
      } else if (typeof arrayBuffer == "boolean") {
        const boolean = arrayBuffer;
        return Uint8Array.from([boolean ? 1 : 0]);
      } else if (typeof arrayBuffer == "string") {
        const string = arrayBuffer;
        return stringToArrayBuffer(string);
      } else if (arrayBuffer instanceof Array) {
        const array = arrayBuffer;
        return concatenateArrayBuffers(...array);
      } else if (arrayBuffer instanceof ArrayBuffer) {
        return arrayBuffer;
      } else if ("buffer" in arrayBuffer && arrayBuffer.buffer instanceof ArrayBuffer) {
        const bufferContainer = arrayBuffer;
        return bufferContainer.buffer;
      } else if (arrayBuffer instanceof DataView) {
        const dataView = arrayBuffer;
        return dataView.buffer;
      } else if (typeof arrayBuffer == "object") {
        const object = arrayBuffer;
        return objectToArrayBuffer(object);
      } else {
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

  prepend1ToArrayBuffer(arrayBuffer) {
    return this.concatenateArrayBuffers(1, arrayBuffer);
  }

  async getDevices() {
    let devices = await navigator.bluetooth.getDevices();
    devices = devices.filter((device) => device.name == "Frame");
    this.dispatchEvent({ type: "devices", message: { devices } });
  }

  getBatteryLevel() {
    this.sendString(`print("batteryLevel:" .. frame.battery_level())`);
  }

  clear() {
    this.sendString("frame.display.text(' ', 0, 0);frame.display.show()");
  }

  colors = [
    "VOID",
    "WHITE",
    "GREY",
    "RED",
    "PINK",
    "DARKBROWN",
    "BROWN",
    "ORANGE",
    "YELLOW",
    "DARKGREEN",
    "GREEN",
    "LIGHTGREEN",
    "NIGHTBLUE",
    "SEABLUE",
    "SKYBLUE",
    "CLOUDBLUE",
  ];
}

export default Frame;
