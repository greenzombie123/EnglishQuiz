import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { customElement, property, query, queryAll, state } from "lit/decorators.js"

type MessageDialogInit = {
    link: string | undefined
    buttonText?: string,
    text: string,
}

type ResponseResult = {
    response: "Yes" | "No"
}

@customElement("message-dialog")
export class MessageDialog extends LitElement {
    static styles = [
        css`
            dialog{

                div{
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-size: 20px;

                    p{

                    }

                    a{}
                }
            }
        `
    ];

    @state()
    init?: MessageDialogInit

    @query("dialog")
    _dialog!: HTMLDialogElement

    @queryAll("button")
    _buttons?: HTMLButtonElement[]

    yesHandler: EventListener | undefined
    noHandler: EventListener | undefined

    render() {

        if (!this.init) return html`<dialog></dialog>`

        const init = this.init

        const buttons = init.link ?
            html`<a href=${init.link}>${init.buttonText}</a>` :
            html`
                <button type="button" >Yes</button>
                <button type="button" >No</button>
            `

        return html`
        <dialog>
            <div>
                <p>${init.text}</p>
                ${buttons}
            </div>
        </dialog>
        `;
    }


    private handleUserResponse() {
        this._dialog.close()

    }

    public open(init: MessageDialogInit) {
        this.init = init
    }

    public close() {
        this._dialog.close()
    }

    public async getUserResponse(init: MessageDialogInit): Promise<ResponseResult> {

        this.init = init
        await this.updateComplete

        const buttons = this._buttons!

        if (this.yesHandler) buttons[0]?.removeEventListener("click", this.yesHandler)
        if (this.noHandler) buttons[1]?.removeEventListener("click", this.noHandler)

        let userResponse = new Promise<ResponseResult>((res, rej) => {
            const yesClickedHandler = () => {
                res({ response: "Yes" })
            }

            const noClickedHandler = () => {
                res({ response: "No" })
            }

            buttons[0]?.addEventListener("click", yesClickedHandler)
            buttons[1]?.addEventListener("click", noClickedHandler)
        })

        const finalResponse = await userResponse

        this.close()

        return finalResponse
    }

    protected updated(_changedProperties: PropertyValues): void {
        if (this.init) this._dialog.showModal()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "message-dialog": MessageDialog;
    }
}
