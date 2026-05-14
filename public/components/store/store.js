export default class Store {
    state;
    events = new Map();
    constructor(initialState) {
        this.state = initialState;
        this.events.set("stateChanged", []);
    }
    getState(name) {
        return this.state[name];
    }
    setState(name, value) {
        this.state[name] = value;
        if (!this.events.has(`${String(name)}Changed`))
            this.events.set(`${String(name)}Changed`, []);
        this.events.get(`${String(name)}Changed`)?.forEach(subscriber => subscriber(this.state));
        this.events.get("stateChanged")?.forEach(subscriber => subscriber(this.state));
    }
    subscribe(eventName, subscriber) {
        const events = this.events;
        if (!events.has(eventName)) {
            events.set(eventName, [subscriber]);
        }
        else if (events.has(eventName)) {
            events.get(eventName)?.push(subscriber);
        }
    }
    publish(eventName, ...args) {
        const events = this.events;
        if (events.has(eventName)) {
            const subscribers = events.get(eventName);
            subscribers?.forEach((subscriber) => subscriber(...args));
        }
    }
}
