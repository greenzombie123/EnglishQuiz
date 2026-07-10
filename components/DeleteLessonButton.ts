import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DeleteLessonDialog } from "./DeleteLessonDialog.ts";

@customElement("deletelesson-button")
export class DeleteLessonButton extends LitElement {

  @property({ attribute: "data-lessonname" })
  lessonName = ""

  @property({ type: String })
  href = ""

  static styles = css`   
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
       `;

  buttonTemplate() {
    return html`
      <a @click="${this.onDeleteClicked}">
        <img src="/bin.png">
      </a>
    `
  }

  onDeleteClicked() {
    const dialog = document.querySelector("deletelesson-dialog") as DeleteLessonDialog
    dialog.showDeleteDialog(this.lessonName, this.href)
  }

  protected render() {
    return this.buttonTemplate()
  }
}

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

