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

class Treeboard extends EventDispatcher {
  enableLogging = true;
  log() {
    if (this.enableLogging) {
      console.groupCollapsed(`[${this.constructor.name}]`, ...arguments);
      console.trace(); // hidden in collapsed group
      console.groupEnd();
    }
  }

  constructor(tree) {
    super();
    this.tree = tree;
    this.#path = [];
    window.addEventListener("keydown", this.#onKeyPress.bind(this));
  }

  /** @param {KeyboardEvent} event */
  #onKeyPress(event) {
    console.log(this, event.key);
    if (event.key == "Backspace" || event.key == "0") {
      this.goBack();
      return;
    }
    if (isNaN(event.key)) {
      return;
    }
    const index = Number(event.key) - 1;
    const option = this.options[index];
    if (option) {
      this.selectOption(option);
    }
  }

  /** @type {string[]} */
  #path;
  get path() {
    return this.#path.slice();
  }
  set path(newPath) {
    if (!this.#isPathValid(newPath)) {
      console.error("invalid path", newPath);
      return;
    }
    this.#path = newPath;
    this.log("new path", this.path);
    this.dispatchEvent({ type: "path" });

    const { subtree } = this;
    if (typeof subtree == "function") {
      this.log("calling function");
      subtree();
      this.goBack();
    }
  }

  /** @param {string[]} path */
  #isPathValid(path) {
    let subtree = this.tree;
    return path.every((segment) => {
      if (subtree && subtree[segment]) {
        subtree = subtree[segment];
        return true;
      }
      console.error("invalid segment", segment, subtree);
    });
  }

  resetPath() {
    this.log("resetting path...");
    this.path = [];
  }

  get subtree() {
    let subtree = this.tree;
    const path = this.path;
    while (path.length && subtree) {
      subtree = subtree[path.shift()];
    }
    return subtree;
  }

  get options() {
    return Object.keys(this.subtree);
  }
  /** @param {string} option */
  selectOption(option) {
    this.log(`selecting option "${option}"...`);
    if (!this.options.includes(option)) {
      console.error(`invalid option "${option}"`);
      return;
    }
    this.path = this.path.concat(option);
  }
  goBack() {
    this.log("going back...");
    if (this.#path.length == 0) {
      this.log("can't go back - already at root");
      return;
    }
    this.path = this.path.slice(0, -1);
  }
}

export default Treeboard;
