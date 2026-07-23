export class ExampleController {
    constructor(host) {
        this.timeLeft = 20;
        this.host = host;
        this.host.addController(this);
    }
    hostConnected() {
        setInterval(() => {
            this.timeLeft = 100;
            this.host.requestUpdate();
        }, 3000);
    }
}
export class MouseController {
    constructor(host) {
        this.clicks = 0;
        this.host = host;
        this.host.addController(this);
    }
    hostConnected() {
    }
    onClickHandler(e) {
        this.clicks++;
        this.host;
    }
}
const colors = ["red", "yellow", "blue", "green"];
const log = "green";
const g = ([a, b]) => {
};
g(["fe", 2]);
//# sourceMappingURL=thing.js.map