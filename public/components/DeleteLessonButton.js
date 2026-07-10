var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
let DeleteLessonButton = class DeleteLessonButton extends LitElement {
    constructor() {
        super(...arguments);
        this.lessonName = "";
        this.href = "";
    }
    static { this.styles = css `   
        img {
              width: 30px;
              height: 30px;
              margin-right: 20px;
              cursor: pointer;

              &:hover {
                background-color: rgba(247, 188, 107, 1);
              }
            }
           @media screen and (width <= 500px) {
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
       `; }
    buttonTemplate() {
        return html `
      <a @click="${this.onDeleteClicked}">
        <img src="/bin.png">
      </a>
    `;
    }
    onDeleteClicked() {
        const dialog = document.querySelector("deletelesson-dialog");
        dialog.showDeleteDialog(this.lessonName, this.href);
    }
    render() {
        return this.buttonTemplate();
    }
};
__decorate([
    property({ attribute: "data-lessonname" })
], DeleteLessonButton.prototype, "lessonName", void 0);
__decorate([
    property({ type: String })
], DeleteLessonButton.prototype, "href", void 0);
DeleteLessonButton = __decorate([
    customElement("deletelesson-button")
], DeleteLessonButton);
export { DeleteLessonButton };
// export interface DeleteLessonEvent {
//   lesssonname: string,
//   id: string
// }
// class DeleteLessonButton extends HTMLElement {
//   static observedAttributes = ["data-lessonname", "href"];
//   root;
//   href: string = "";
//   lessonName = "";
//   constructor() {
//     super();
//     this.root = this.attachShadow({ mode: "closed" });
//     const img = document.createElement("img") as HTMLImageElement;
//     img.src = "/bin.png";
//     const link = document.createElement("a") as HTMLAnchorElement;
//     link.addEventListener("click", this.onDeleteLinkClicked);
//     link.appendChild(img);
//     const style = document.createElement("style");
//     style.textContent = `
//       img {
//               width: 30px;
//               height: 30px;
//               margin-right: 20px;
//               cursor: pointer;
//               &:hover {
//                 background-color: rgba(247, 188, 107, 1);
//               }
//             }
//         @media screen and (width <=500px) {
//           img {
//                 width: 15px;
//                 height: 15px;
//                 margin-right: 20px;
//                 cursor: pointer;
//                 &:hover {
//                   background-color: rgb(255, 149, 0);
//                 }
//               }
//           }
//     `;
//     this.root.appendChild(style);
//     this.root.appendChild(link);
//   }
//   connectedCallback() { }
//   attributeChangedCallback(name: string, oldValue: string, newValue: string) {
//     if (name === "href") {
//       this.setURL(newValue);
//     }
//     if (name === "data-lessonname") {
//       this.setLessonName(newValue);
//     }
//   }
//   onDeleteLinkClicked = () => {
//     const dialog = document.querySelector("deletelesson-dialog") as DeleteLessonDialog
//     dialog.showDeleteDialog(this.lessonName, this.href)
//   };
//   setURL = (url: string) => {
//     this.href = url;
//   };
//   setLessonName = (lessonName: string) => {
//     this.lessonName = lessonName;
//   };
// }
// customElements.define("deletelesson-button", DeleteLessonButton);
