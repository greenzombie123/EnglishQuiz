import { LitElement, html, css } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ExampleController, MouseController } from './thing.ts';
import { when } from 'lit/directives/when.js';
import {Task} from "@lit/task";

@customElement("yo-yo")
export class YoYo extends LitElement {

    static styles = [css`

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
    `, css`
        p{
            font-family:cursive;
            text-transform:var(--heavy);
        }
    `]

    // private controller = new ExampleController(this)
    // private mouseController = new MouseController(this)

    @property({ type: Number })
    board = 2;

    private _myTask = new Task(this, {
        task: async ()=>{
            const p = await new Promise(resolve=>setTimeout(resolve, 2000))
            return 20
        },
        args:()=>[]
    })

    buttonTemplate() {
        return html`<button>Wow</button>
        <p>${this.board}</p>
        `
    }

    exampleTemplate() {
        return html`<p>Hello</p>`
    }

    // stuffTemplate() {
    //     return html`<p>${this.controller.timeLeft}</p>`
    // }

    taskTemplate(){
        return html`${this._myTask.render({
            pending:()=>html`<p>Please wait</p>`,
            complete:(value)=>html`<p>Finished. Here are the results ${value}</p>`,
            error:(error)=>html`<p>${error}</p>`
        })}`
    }

    //template
    render() {
        const classes = { a: true, b: true, c: false }

        // return html`${this.buttonTemplate() }`
        // return html`<p @click="${this.push}" class=${classMap(classes)}>${this.board} this is cool!</p>`
        // return this.stuffTemplate()

        // return html`<p>GOODBYE!</p>`

        return this.taskTemplate()
    }

    push() {
        this.board = this.board + 2
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "yo-yo": YoYo
    }
}
