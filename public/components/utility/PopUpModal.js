export class PopUpModal extends HTMLElement {
    root;
    dialog;
    topMessage;
    bottomMessage;
    yesButton;
    noButton;
    constructor() {
        super();
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
        this.noButton.addEventListener("click", this.#onNoButtonClickedHandler);
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
    showPopUpModal = (topMessage, bottomMessage, onYesClickHandler) => {
        this.#setData(topMessage, bottomMessage, onYesClickHandler);
        this.#showDialog();
    };
    #setData = (topMessage, bottomMessage, onYesClickHandler) => {
        this.topMessage.textContent = topMessage;
        if (bottomMessage)
            this.bottomMessage.textContent = bottomMessage;
        if (onYesClickHandler)
            this.yesButton.addEventListener("click", () => {
                onYesClickHandler();
                // Close the dialog right after 
                this.#onNoButtonClickedHandler();
            });
    };
    #showDialog = () => {
        this.dialog.showModal();
    };
    #onNoButtonClickedHandler = () => {
        this.dialog.close();
        this.remove();
    };
}
customElements.define("pop-up-modal", PopUpModal);
//# sourceMappingURL=PopUpModal.js.map