var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PopUpModal_setData, _PopUpModal_showDialog, _PopUpModal_onNoButtonClickedHandler;
export class PopUpModal extends HTMLElement {
    constructor() {
        super();
        this.showPopUpModal = (topMessage, bottomMessage, onYesClickHandler) => {
            __classPrivateFieldGet(this, _PopUpModal_setData, "f").call(this, topMessage, bottomMessage, onYesClickHandler);
            __classPrivateFieldGet(this, _PopUpModal_showDialog, "f").call(this);
        };
        _PopUpModal_setData.set(this, (topMessage, bottomMessage, onYesClickHandler) => {
            this.topMessage.textContent = topMessage;
            if (bottomMessage)
                this.bottomMessage.textContent = bottomMessage;
            if (onYesClickHandler)
                this.yesButton.addEventListener("click", () => {
                    onYesClickHandler();
                    // Close the dialog right after 
                    __classPrivateFieldGet(this, _PopUpModal_onNoButtonClickedHandler, "f").call(this);
                });
        });
        _PopUpModal_showDialog.set(this, () => {
            this.dialog.showModal();
        });
        _PopUpModal_onNoButtonClickedHandler.set(this, () => {
            this.dialog.close();
            this.remove();
        });
        this.root = this.attachShadow({ mode: "closed" });
        this.dialog = document.createElement("dialog");
        this.dialog.setAttribute("closedby", "any");
        this.root.appendChild(this.dialog);
        const wrapper = document.createElement("div");
        this.dialog.appendChild(wrapper);
        this.topMessage = document.createElement("p");
        // this.topMessage.textContent = "Do you want to delete this lesson?";
        this.topMessage.className = "top";
        wrapper.appendChild(this.topMessage);
        this.bottomMessage = document.createElement("p");
        this.bottomMessage.className = "bottom";
        wrapper.appendChild(this.bottomMessage);
        this.yesButton = document.createElement("button");
        this.yesButton.textContent = "Yes";
        wrapper.appendChild(this.yesButton);
        this.noButton = document.createElement("button");
        this.noButton.textContent = "No";
        this.noButton.addEventListener("click", __classPrivateFieldGet(this, _PopUpModal_onNoButtonClickedHandler, "f"));
        wrapper.appendChild(this.noButton);
        const style = document.createElement("style");
        style.textContent = `
        div{
                font-size: 1.1rem;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                width: min-content;
                justify-content: center;
                gap:15px;

                p.top{
                    width:max-content;
                }

                p.bottom{
                    width:100%;
                    text-align:center;
                }

                button{
                    font-size:1rem;
                    margin:0;
                    padding: 3px 6px;
                }
        }
    `;
        this.root.appendChild(style);
    }
    connectedCallback() {
    }
}
_PopUpModal_setData = new WeakMap(), _PopUpModal_showDialog = new WeakMap(), _PopUpModal_onNoButtonClickedHandler = new WeakMap();
customElements.define("pop-up-modal", PopUpModal);
//# sourceMappingURL=PopUpModal.js.map