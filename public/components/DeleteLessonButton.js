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
           @media screen and (max-width:500px) {
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
//# sourceMappingURL=DeleteLessonButton.js.map