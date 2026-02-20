type Subscriber = (...args: unknown[]) => void;

export default class Store <IState = Record<string, unknown>>  {
  private state: IState;
  private events = new Map<string, Subscriber[]>()

  constructor(initialState:IState) {
    this.state = initialState;
    this.events.set("stateChanged", [])
  }

  getState(name:keyof IState) {
    return this.state[name]
  }

  setState(name:keyof IState, value: IState[keyof IState]) {
    this.state[name] = value
    this.events.get("stateChanged")?.forEach(subscriber=>subscriber(this.state))
  }

  subscribe(eventName: string, subscriber: Subscriber) {
    
    const events = this.events;
    
    if (!events.has(eventName)) {
      events.set(eventName, [subscriber]);
    } else if (events.has(eventName)) {
      events.get(eventName)?.push(subscriber);
    }
  }

  publish(eventName: string, ...args: unknown[]) {
   
    const events = this.events;

    if (events.has(eventName)) {
      const subscribers = events.get(eventName);
      subscribers?.forEach((subscriber) => subscriber(...args));
    }
  }
}
