export interface MultiChoiceButtonBase{
  
};

export class MultiChoiceButton extends HTMLElement implements MultiChoiceButtonBase{
      constructor(){
        super()
    }

    connectedCallback() {
        // const template = document.getElementById("lesson-slider") as HTMLTemplateElement
        // const templateContent = template.content
        // const clonedContent = templateContent.cloneNode(true)
        // const shadowRoot = this.attachShadow({mode:"closed"})
        // shadowRoot.appendChild(clonedContent)
    }

    disconnectedCallback() {

    }
}

customElements.define("multichoice-button", MultiChoiceButton)