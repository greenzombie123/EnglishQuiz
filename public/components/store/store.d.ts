type Subscriber = (...args: unknown[]) => void;
export default class Store<IState = Record<string, unknown>> {
    private state;
    private events;
    constructor(initialState: IState);
    getState(name: keyof IState): IState[keyof IState];
    setState(name: keyof IState, value: IState[keyof IState]): void;
    subscribe(eventName: string, subscriber: Subscriber): void;
    publish(eventName: string, ...args: unknown[]): void;
}
export {};
//# sourceMappingURL=store.d.ts.map