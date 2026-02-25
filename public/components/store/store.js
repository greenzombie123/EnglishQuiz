export default class Store {
    constructor(initialState) {
        this.events = new Map();
        this.state = initialState;
        this.events.set("stateChanged", []);
    }
    getState(name) {
        return this.state[name];
    }
    setState(name, value) {
        var _a, _b;
        this.state[name] = value;
        if (!this.events.has(`${String(name)}Changed`))
            this.events.set(`${String(name)}Changed`, []);
        (_a = this.events.get(`${String(name)}Changed`)) === null || _a === void 0 ? void 0 : _a.forEach(subscriber => subscriber(this.state));
        (_b = this.events.get("stateChanged")) === null || _b === void 0 ? void 0 : _b.forEach(subscriber => subscriber(this.state));
    }
    subscribe(eventName, subscriber) {
        var _a;
        const events = this.events;
        if (!events.has(eventName)) {
            events.set(eventName, [subscriber]);
        }
        else if (events.has(eventName)) {
            (_a = events.get(eventName)) === null || _a === void 0 ? void 0 : _a.push(subscriber);
        }
    }
    publish(eventName, ...args) {
        const events = this.events;
        if (events.has(eventName)) {
            const subscribers = events.get(eventName);
            subscribers === null || subscribers === void 0 ? void 0 : subscribers.forEach((subscriber) => subscriber(...args));
        }
    }
}
//# sourceMappingURL=store.js.map