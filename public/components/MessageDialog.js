var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
let MessageDialog = class MessageDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.message = "";
        this.linkText = "";
        this.url = "";
    }
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
        return html `
        <dialog>
            <div>
                <p>${this.message}</p>
                <a href=${this.url}>${this.linkText}</a>
            </div>
        </dialog>
        `;
    }
    open() {
        this._dialog.showModal();
    }
    close() {
        this._dialog.close();
    }
};
__decorate([
    property()
], MessageDialog.prototype, "message", void 0);
__decorate([
    property()
], MessageDialog.prototype, "linkText", void 0);
__decorate([
    property()
], MessageDialog.prototype, "url", void 0);
__decorate([
    query("dialog")
], MessageDialog.prototype, "_dialog", void 0);
MessageDialog = __decorate([
    customElement("message-dialog")
], MessageDialog);
export { MessageDialog };
//# sourceMappingURL=MessageDialog.js.map