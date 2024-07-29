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

class DecentScale extends EventDispatcher {
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
      uuid: "0000fff0-0000-1000-8000-00805f9b34fb",
      characteristics: {
        data: {
          uuid: "0000fff4-0000-1000-8000-00805f9b34fb",
        },
        command: {
          uuid: "000036f5-0000-1000-8000-00805f9b34fb",
        },
      },
    },
    secondary: {
      ignore: true,
      uuid: "5833ff01-9b8b-5191-6142-22a4536ef123",
      characteristics: {
        a: {
          uuid: "5833ff02-9b8b-5191-6142-22a4536ef123", // writeback?
        },
        b: {
          uuid: "5833ff03-9b8b-5191-6142-22a4536ef123",
        },
      },
    },
  };

  capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

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
      //optionalServices: [this.services.secondary.uuid],
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

        if (characteristic.properties.notify) {
          characteristic.addEventListener(
            "characteristicvaluechanged",
            this[`on${this.capitalize(characteristicName)}CharacteristicValueChanged`].bind(this)
          );
          this.log(`starting ${characteristicName} notifications...`);
          await characteristic.startNotifications();
          this.log(`started ${characteristicName} notifications!`);
        }
      }
    }

    this.setLED();

    this.log("connection complete!");
    this.dispatchEvent({ type: "connected" });
  }
  async onGattServerDisconnected() {
    this.log("disconnected");
    this.dispatchEvent({ type: "disconnected" });
  }

  hexStringToNumbers(hexString) {
    return hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
  }
  numbersToHexString(numbers) {
    return numbers.map((n) => n.toString(16).padStart(2, "0")).join(" ");
  }
  XORNumbers(numbers) {
    return numbers.slice(1).reduce((xor, number) => xor ^ number, numbers[0]);
  }

  commandsToSend = [];
  isSendingCommand = false;
  async sendCommandData(commandData, override = false) {
    if (this.isConnected) {
      if (!override && (this.isSendingCommand || this.commandsToSend.length > 0)) {
        this.log("adding command to stack", commandData);
        this.commandsToSend.push(commandData);
      } else {
        this.isSendingCommand = true;
        await this._sendCommandData(commandData);
        this.isSendingCommand = false;
        if (this.commandsToSend.length > 0) {
          const nextCommandData = this.commandsToSend.shift();
          this.log("next command", nextCommandData);
          this.sendCommandData(nextCommandData, true);
        } else {
          this.log("finished sending commands");
        }
      }
    }
  }
  async _sendCommandData(commandData) {
    commandData.unshift(0x03);
    commandData.push(this.XORNumbers(commandData));
    this.log("sending command data", commandData, this.numbersToHexString(commandData));
    commandData = Uint8Array.from(commandData);
    await this.services.main.characteristics.command.characteristic.writeValue(commandData);
  }

  async setLED(showWeight = false, showTimer = false, showGrams = true) {
    return this.sendCommandData([0x0a, Number(showWeight), Number(showTimer), Number(!showGrams), 0]);
  }
  async powerOff() {
    return this.setLED(2);
  }

  async setTimerCommand(timerCommand) {
    return this.sendCommandData([0x0b, timerCommand, 0, 0, 0]);
  }

  async stopTimer() {
    return this.setTimerCommand(0);
  }
  async resetTimer() {
    return this.setTimerCommand(2);
  }
  async startTimer() {
    return this.setTimerCommand(3);
  }

  async tare(incrementedInteger = 0) {
    return this.sendCommandData([0x0f, incrementedInteger, 0, 0, 0]);
  }

  FIRMWARE_ENUM = {
    0xfe: 1.0,
    0x02: 1.1,
    0x03: 1.2,
  };
  WEIGHT_TYPE_ENUM = {
    0: "grams",
    1: "ounces",
  };
  BUTTON_TYPE_ENUM = {
    1: "left",
    2: "right",
  };
  BUTTON_TAP_TYPE_ENUM = {
    1: "short",
    2: "long",
  };
  USB_BATTERY_ENUM = 255;

  firmwareVersion = null;
  isUSB = null;
  battery = null;
  weightType = null;

  onDataCharacteristicValueChanged(event) {
    let dataView = event.target.value;
    //this.log("onDataCharacteristicValueChanged", event, values);
    if (dataView.getUint8(0) == 0) {
      dataView = new DataView(dataView.buffer.slice(2));
    }
    const type = dataView.getUint8(1);
    switch (type) {
      case 0x0a: // LED on/off
        {
          let battery = dataView.getUint8(4);
          const isUSB = battery == this.USB_BATTERY_ENUM;
          if (isUSB) {
            battery = 100;
          }
          this.battery = battery;
          if (!isUSB) {
            this.dispatchEvent({
              type: "battery",
              message: { battery },
            });
          }

          if (this.isUSB != isUSB) {
            this.isUSB = isUSB;
            this.dispatchEvent({
              type: "isUSB",
              message: { isUSB },
            });
            if (isUSB) {
              this.dispatchEvent({
                type: "battery",
                message: { battery },
              });
            }
          }

          const firmwareVersion = this.FIRMWARE_ENUM[dataView.getUint8(5)];
          if (this.firmwareVersion != firmwareVersion) {
            this.firmwareVersion = firmwareVersion;
            this.dispatchEvent({
              type: "firmwareVersion",
              message: { firmwareVersion },
            });
          }

          const weightType = this.WEIGHT_TYPE_ENUM[dataView.getUint8(3)];
          if (this.weightType != weightType) {
            this.weightType = weightType;
            this.dispatchEvent({
              type: "weightType",
              message: { weightType },
            });
          }
        }
        break;
      case 0x0f: // TARE
        {
          const message = { counter: dataView.getUint8(2) };

          this.log("tare", message);

          this.dispatchEvent({
            type: "tare",
            message,
          });
        }
        break;
      case 0xce: // weight stable
      case 0xca: // weight changing
        {
          const isStable = type == 0xce;
          const weight = dataView.getInt16(2) / 10;
          const message = { isStable, weight };
          if (dataView.byteLength == 7) {
            message.change = dataView.getInt16(4);
          } else if (dataView.byteLength == 10) {
            const minutes = dataView.getUint8(4);
            const seconds = dataView.getUint8(5);
            const milliseconds = dataView.getUint8(6) * 100;

            message.time = {
              minutes,
              seconds,
              milliseconds,
              string: `${minutes}:${seconds}:${milliseconds.toString().padStart(3, 0)}`,
            };
          }

          //this.log("weight", message)

          this.dispatchEvent({
            type: "weight",
            message,
          });
        }
        break;
      case 0xaa: // button tap
        {
          const message = {
            button: this.BUTTON_TYPE_ENUM[dataView.getUint8(2)],
            tap: this.BUTTON_TAP_TYPE_ENUM[dataView.getUint8(3)],
          };

          this.log("buttonTap", message);

          this.dispatchEvent({
            type: "buttonTap",
            message,
          });
        }
        break;
      default:
        this.log(`uncaught message type ${type.toString(16)}`, dataView);
        break;
    }
  }
  onBCharacteristicValueChanged(event) {
    const dataView = event.target.value;
    this.log("onBCharacteristicValueChanged", event, dataView);
  }
}

export default DecentScale;
