export class GroupNameSelector extends HTMLElement {
    static formAssociated = true;
    internals;
    root;
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("groupname-selecter");
        this.root.appendChild(template.content.cloneNode(true));
        // Adds support for forms
        this.internals = this.attachInternals();
        // Give the field form a default value
        this.internals.setFormValue("");
        const input = this.root.querySelector("input");
        const select = this.root.querySelector("select");
        input.addEventListener("change", this.onInputChange);
        select.addEventListener("change", this.onSelectChange);
    }
    connectedCallback() {
        // console.log(1231)
    }
    onInputChange = (e) => {
        const input = e.currentTarget;
        const inputValue = input.value;
        if (inputValue) {
            this.internals.setFormValue(inputValue);
        }
    };
    onSelectChange = (e) => {
        const selecter = e.currentTarget;
        if (selecter.value) {
            this.internals.setFormValue(selecter.value);
        }
    };
    setGroupName = (groupname) => {
        this.internals.setFormValue(groupname);
        const input = this.root.querySelector("input");
        input.value = groupname;
    };
}
customElements.define("groupname-selecter", GroupNameSelector);
// Sets the value to be sent to the server
// this.internals.setFormValue("something here");
//# sourceMappingURL=GroupNameSelector.js.map