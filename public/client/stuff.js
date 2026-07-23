var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { Task } from "@lit/task";
let YoYo = class YoYo extends LitElement {
    constructor() {
        super(...arguments);
        // private controller = new ExampleController(this)
        // private mouseController = new MouseController(this)
        this.board = 2;
        this._myTask = new Task(this, {
            task: async () => {
                const p = await new Promise(resolve => setTimeout(resolve, 2000));
                return 20;
            },
            args: () => []
        });
    }
    static { this.styles = [css `

        .a{
            color:yellow;
        }

        .b{
            background-color:green;
        }

        .c{
            text-decoration:underline;
        }

        button{
            background-color:blue;
            color:red;
        }
    `, css `
        p{
            font-family:cursive;
            text-transform:var(--heavy);
        }
    `]; }
    buttonTemplate() {
        return html `<button>Wow</button>
        <p>${this.board}</p>
        `;
    }
    exampleTemplate() {
        return html `<p>Hello</p>`;
    }
    // stuffTemplate() {
    //     return html`<p>${this.controller.timeLeft}</p>`
    // }
    taskTemplate() {
        return html `${this._myTask.render({
            pending: () => html `<p>Please wait</p>`,
            complete: (value) => html `<p>Finished. Here are the results ${value}</p>`,
            error: (error) => html `<p>${error}</p>`
        })}`;
    }
    //template
    render() {
        const classes = { a: true, b: true, c: false };
        // return html`${this.buttonTemplate() }`
        // return html`<p @click="${this.push}" class=${classMap(classes)}>${this.board} this is cool!</p>`
        // return this.stuffTemplate()
        // return html`<p>GOODBYE!</p>`
        return this.taskTemplate();
    }
    push() {
        this.board = this.board + 2;
    }
};
__decorate([
    property({ type: Number })
], YoYo.prototype, "board", void 0);
YoYo = __decorate([
    customElement("yo-yo")
], YoYo);
export { YoYo };
//# sourceMappingURL=stuff.js.map