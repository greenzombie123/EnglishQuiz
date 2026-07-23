import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js"

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

    @property()
    message = ""

    @property()
    linkText = ""

    @property()
    url = ""

    @query("dialog")
    _dialog!: HTMLDialogElement

    render() {

        return html`
        <dialog>
            <div>
                <p>${this.message}</p>
                <a href=${this.url}>${this.linkText}</a>
            </div>
        </dialog>
        `;
    }

    public open() {
        this._dialog.showModal()
    }

    public close() {
        this._dialog.close()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "message-dialog": MessageDialog;
    }
}
