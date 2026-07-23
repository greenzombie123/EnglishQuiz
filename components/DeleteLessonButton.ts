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

