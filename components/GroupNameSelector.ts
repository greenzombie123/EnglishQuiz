export class GroupNameSelector extends HTMLElement {
  static formAssociated = true;

  internals;
  root;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });

    const template = document.getElementById(
      "groupname-selecter"
    ) as HTMLTemplateElement;

    this.root.appendChild(template.content.cloneNode(true));

    // Adds support for forms
    this.internals = this.attachInternals();

    // Give the field form a default value
    this.internals.setFormValue("");

    const input = this.root.querySelector("input") as HTMLInputElement
    const select = this.root.querySelector("select") as HTMLSelectElement

    input.addEventListener("change", this.onInputChange)
    select.addEventListener("change", this.onSelectChange)
  }

  connectedCallback() {
    // console.log(1231)
  }

  onInputChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const inputValue = input.value;

    if (inputValue) {
      this.internals.setFormValue(inputValue);
    }
  };

  onSelectChange = (e:Event)=>{
    const selecter = e.currentTarget as HTMLInputElement
    if(selecter.value){
      this.internals.setFormValue(selecter.value)
    }
  }

  setGroupName = (groupname:string)=>{
    this.internals.setFormValue(groupname);
    const input = this.root.querySelector("input") as HTMLInputElement
    input.value = groupname
  }
}

customElements.define("groupname-selecter", GroupNameSelector);

// Sets the value to be sent to the server
// this.internals.setFormValue("something here");
