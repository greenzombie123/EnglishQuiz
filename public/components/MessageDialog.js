var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, query, queryAll, state } from "lit/decorators.js";
let MessageDialog = class MessageDialog extends LitElement {
    static { this.styles = [
        css `
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
    ]; }
    render() {
        if (!this.init)
            return html `<dialog></dialog>`;
        const init = this.init;
        const buttons = init.link ?
            html `<a href=${init.link}>${init.buttonText}</a>` :
            html `
                <button type="button" >Yes</button>
                <button type="button" >No</button>
            `;
        return html `
        <dialog>
            <div>
                <p>${init.text}</p>
                ${buttons}
            </div>
        </dialog>
        `;
    }
    handleUserResponse() {
        this._dialog.close();
    }
    open(init) {
        this.init = init;
    }
    close() {
        this._dialog.close();
    }
    async getUserResponse(init) {
        this.init = init;
        await this.updateComplete;
        const buttons = this._buttons;
        if (this.yesHandler)
            buttons[0]?.removeEventListener("click", this.yesHandler);
        if (this.noHandler)
            buttons[1]?.removeEventListener("click", this.noHandler);
        let userResponse = new Promise((res, rej) => {
            const yesClickedHandler = () => {
                res({ response: "Yes" });
            };
            const noClickedHandler = () => {
                res({ response: "No" });
            };
            buttons[0]?.addEventListener("click", yesClickedHandler);
            buttons[1]?.addEventListener("click", noClickedHandler);
        });
        const finalResponse = await userResponse;
        this.close();
        return finalResponse;
    }
    updated(_changedProperties) {
        if (this.init)
            this._dialog.showModal();
    }
};
__decorate([
    state()
], MessageDialog.prototype, "init", void 0);
__decorate([
    query("dialog")
], MessageDialog.prototype, "_dialog", void 0);
__decorate([
    queryAll("button")
], MessageDialog.prototype, "_buttons", void 0);
MessageDialog = __decorate([
    customElement("message-dialog")
], MessageDialog);
export { MessageDialog };
//# sourceMappingURL=MessageDialog.js.map