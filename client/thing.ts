import { ReactiveController, ReactiveControllerHost } from "lit";

export class ExampleController implements ReactiveController {
    host: ReactiveControllerHost

    timeLeft = 20

    constructor(host: ReactiveControllerHost) {
        this.host = host
        this.host.addController(this)
    }

    hostConnected() {

        setInterval(() => {
            this.timeLeft = 100
            this.host.requestUpdate()
        }, 3000);
    }
}

export class MouseController implements ReactiveController {
    host: ReactiveControllerHost

    clicks = 0

    constructor(host: ReactiveControllerHost) {
        this.host = host
        this.host.addController(this)
    }

    hostConnected() {
        
    }

    onClickHandler(e:MouseEvent){
        this.clicks++
        this.host
    }
}

const colors = ["red", "yellow", "blue", "green"] as const
type Things = typeof colors[number]
const log:Things = "green"

const g = ([a, b]:[a:string, b:number])=>{

}

g(["fe", 2])
