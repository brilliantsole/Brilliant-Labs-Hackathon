import { io } from "../socket.io/socket.io.esm.min.js";

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

class HueClient extends EventDispatcher {
  enableLogging = true;
  log() {
    if (this.enableLogging) {
      console.groupCollapsed(`[${this.constructor.name}]`, ...arguments);
      console.trace(); // hidden in collapsed group
      console.groupEnd();
    }
  }

  connect(url) {
    if (this.isConnected) {
      this.disconnect();
    }
    this.log(`connecting to url "${url}"...`);

    this.#socket = io(url);
    this.#setupSocket();
  }
  disconnect() {
    this.log("disconnecting...");
    if (!this.isConnected) {
      this.log("not connected");
      return;
    }
  }

  #isConnected = false;
  get isConnected() {
    return this.#isConnected;
  }
  #setIsConnected(newIsConnected) {
    if (this.isConnected == newIsConnected) {
      this.log("redundant isConnected");
      return;
    }
    this.#isConnected = newIsConnected;
    this.dispatchEvent({ type: "isConnected" });
    if (this.isConnected) {
      this.dispatchEvent({ type: "connected" });
    } else {
      this.dispatchEvent({ type: "disconnected" });
    }
  }

  #bridges;
  get bridges() {
    return this.#bridges;
  }
  #setBridges(bridges) {
    this.#bridges = bridges;
    this.dispatchEvent({ type: "bridges" });
  }

  #socket;
  #setupSocket() {
    this.#socket.on("connect", () => {
      this.#setIsConnected(true);
      this.log("connection opened");
    });
    this.#socket.on("disconnect", () => {
      this.log("connection closed");
      this.#setIsConnected(false);
    });
    this.#socket.on("bridges", (bridges) => {
      this.log("bridges", bridges);
      this.#setBridges(bridges);
    });
  }

  /** @param {{bridgeId: number, lightId: number, color: string}[]} lights */
  setLights(lights) {
    this.#socket.emit("setLights", {
      lights,
    });
  }

  // thanks ChatGPT
  htmlColorToRgbArray(htmlColor) {
    // Remove the '#' symbol if present
    htmlColor = htmlColor.replace("#", "");

    // Parse the hexadecimal color values
    const red = parseInt(htmlColor.substring(0, 2), 16);
    const green = parseInt(htmlColor.substring(2, 4), 16);
    const blue = parseInt(htmlColor.substring(4, 6), 16);

    // Create and return the RGB array
    return [red, green, blue];
  }
}

export default HueClient;
