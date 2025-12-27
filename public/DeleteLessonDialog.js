var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DeleteLessonDialog_setData, _DeleteLessonDialog_showDialog, _DeleteLessonDialog_onYesButtonClicked, _DeleteLessonDialog_removeButtons, _DeleteLessonDialog_renderReturnButton, _DeleteLessonDialog_reset;
export class DeleteLessonDialog extends HTMLElement {
    constructor() {
        super();
        this.showDeleteDialog = (lessonname, href) => {
            __classPrivateFieldGet(this, _DeleteLessonDialog_reset, "f").call(this);
            __classPrivateFieldGet(this, _DeleteLessonDialog_setData, "f").call(this, lessonname, href);
            __classPrivateFieldGet(this, _DeleteLessonDialog_showDialog, "f").call(this);
        };
        _DeleteLessonDialog_setData.set(this, (lessonname, href) => {
            this.lessonname = lessonname;
            this.href = href;
        });
        _DeleteLessonDialog_showDialog.set(this, () => {
            this.topMessage.textContent = "Will you delete this lesson?";
            this.bottomMessage.textContent = this.lessonname;
            this.dialog.showModal();
        });
        _DeleteLessonDialog_onYesButtonClicked.set(this, async () => {
            try {
                const response = await fetch(this.href, { method: "delete" });
                if (!response.ok)
                    throw new Error("The error is this: " + response.status);
                __classPrivateFieldGet(this, _DeleteLessonDialog_removeButtons, "f").call(this);
                __classPrivateFieldGet(this, _DeleteLessonDialog_renderReturnButton, "f").call(this);
                this.topMessage.textContent = "The lesson was deleted.";
                this.bottomMessage.textContent = "";
            }
            catch (error) {
                console.log(error.message);
            }
        });
        _DeleteLessonDialog_removeButtons.set(this, () => {
            const buttons = Array.from(this.dialog.querySelectorAll("button"));
            buttons.forEach((button) => (button.style.display = "none"));
        });
        _DeleteLessonDialog_renderReturnButton.set(this, () => {
            this.returnButton.style.display = "block";
        });
        _DeleteLessonDialog_reset.set(this, () => {
            const buttons = Array.from(this.dialog.querySelectorAll("button"));
            buttons.forEach((button) => (button.style.display = "block"));
            this.returnButton.style.display = "none";
        });
        this.href = "";
        this.lessonname = "";
        this.root = this.attachShadow({ mode: "closed" });
        this.dialog = document.createElement("dialog");
        this.dialog.setAttribute("closedby", "any");
        this.root.appendChild(this.dialog);
        this.topMessage = document.createElement("p");
        this.topMessage.textContent = "Do you want to delete this lesson?";
        this.dialog.appendChild(this.topMessage);
        this.bottomMessage = document.createElement("p");
        this.dialog.appendChild(this.bottomMessage);
        this.yesButton = document.createElement("button");
        this.yesButton.textContent = "Yes";
        this.yesButton.addEventListener("click", __classPrivateFieldGet(this, _DeleteLessonDialog_onYesButtonClicked, "f"));
        this.dialog.appendChild(this.yesButton);
        this.noButton = document.createElement("button");
        this.noButton.textContent = "No";
        this.noButton.addEventListener("click", () => this.dialog.close());
        this.dialog.appendChild(this.noButton);
        this.returnButton = document.createElement("a");
        this.returnButton.textContent = "Return to the dashboard";
        this.returnButton.href = "/lessons";
        this.dialog.appendChild(this.returnButton);
    }
    connectedCallback() {
    }
}
_DeleteLessonDialog_setData = new WeakMap(), _DeleteLessonDialog_showDialog = new WeakMap(), _DeleteLessonDialog_onYesButtonClicked = new WeakMap(), _DeleteLessonDialog_removeButtons = new WeakMap(), _DeleteLessonDialog_renderReturnButton = new WeakMap(), _DeleteLessonDialog_reset = new WeakMap();
customElements.define("deletelesson-dialog", DeleteLessonDialog);
//# sourceMappingURL=DeleteLessonDialog.js.map