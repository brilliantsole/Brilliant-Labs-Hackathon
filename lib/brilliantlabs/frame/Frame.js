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

  services = {
    main: {
      uuid: generateUUID(1),
      characteristics: {
        rx: {
          uuid: generateUUID(2),
        },
        tx: {
          uuid: generateUUID(3),
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
    this.device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [this.services.main.uuid],
        },
      ],
    });

    this.log("got device!");
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
        this.log(`getting ${characteristicName} characteristic...`);
        const characteristic = (characteristicInfo.characteristic = await serviceInfo.service.getCharacteristic(
          characteristicInfo.uuid
        ));
        this.log(`got ${characteristicName} characteristic!`, characteristic);

        if (characteristicName == "rx") {
          characteristic.addEventListener("characteristicvaluechanged", this.onRxCharacteristicValueChanged.bind(this));
          this.log(`starting ${characteristicName} notifications...`);
          await characteristic.startNotifications();
          this.log(`started ${characteristicName} notifications!`);
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
    this.log("onRxCharacteristicValueChanged", event, values);
  }
}

export default Frame;
