export class ExtendableList extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        const template = document.getElementById("extendablelist");
        const templateContent = template.content;
        const clonedContent = templateContent.cloneNode(true);
        this.root.appendChild(clonedContent);
    }
    connectedCallback() {
        const groupnames = Array.from(document.querySelectorAll('p'));
        groupnames.forEach(groupname => {
            const adjacentList = groupname.nextElementSibling;
            adjacentList.style.display = "none";
            groupname.addEventListener("click", () => {
                if (adjacentList.style.display === "none")
                    adjacentList.style.display = "block";
                else
                    adjacentList.style.display = "none";
            });
        });
    }
}
customElements.define("extendable-list", ExtendableList);
//# sourceMappingURL=ExtendableList.js.map