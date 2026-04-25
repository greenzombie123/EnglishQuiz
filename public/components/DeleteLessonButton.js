"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeleteLessonButton extends HTMLElement {
    static observedAttributes = ["data-lessonname", "href"];
    root;
    href = "";
    lessonName = "";
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "closed" });
        const img = document.createElement("img");
        img.src = "/bin.png";
        const link = document.createElement("a");
        link.addEventListener("click", this.onDeleteLinkClicked);
        link.appendChild(img);
        const style = document.createElement("style");
        style.textContent = `
      img {
              width: 30px;
              height: 30px;
              margin-right: 20px;
              cursor: pointer;

              &:hover {
                background-color: rgba(247, 188, 107, 1);
              }
            }
        @media screen and (width <=500px) {
          img {
                width: 15px;
                height: 15px;
                margin-right: 20px;
                cursor: pointer;

                &:hover {
                  background-color: rgb(255, 149, 0);
                }
              }
          }
    `;
        this.root.appendChild(style);
        this.root.appendChild(link);
    }
    connectedCallback() { }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "href") {
            this.setURL(newValue);
        }
        if (name === "data-lessonname") {
            this.setLessonName(newValue);
        }
    }
    onDeleteLinkClicked = () => {
        const dialog = document.querySelector("deletelesson-dialog");
        dialog.showDeleteDialog(this.lessonName, this.href);
    };
    setURL = (url) => {
        this.href = url;
    };
    setLessonName = (lessonName) => {
        this.lessonName = lessonName;
    };
}
customElements.define("deletelesson-button", DeleteLessonButton);
//# sourceMappingURL=DeleteLessonButton.js.map