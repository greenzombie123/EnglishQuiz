import "./DeleteLessonButton.ts";
import "./DeleteLessonDialog.ts";

export class ExtendableList extends HTMLElement {
  root;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    const template = document.getElementById(
      "extendablelist"
    ) as HTMLTemplateElement;

    const templateContent = template.content;

    const clonedContent = templateContent.cloneNode(true) as DocumentFragment;

    this.root.appendChild(clonedContent)


  }

  connectedCallback(){
    const groupnames = Array.from(document.querySelectorAll('p')) as HTMLParagraphElement[]; 

    groupnames.forEach(groupname=>{
      const adjacentList = groupname.nextElementSibling as HTMLElement

      adjacentList.style.display = "none"

      groupname.addEventListener("click", ()=>{
        if(adjacentList.style.display === "none") adjacentList.style.display = "block"
        else adjacentList.style.display = "none"
      })
    })
  }
}

customElements.define("extendable-list", ExtendableList);
