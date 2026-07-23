var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Task } from "@lit/task";
import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
let DeleteLessonDialog = class DeleteLessonDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.href = "";
        this.lessonname = "";
        this.task = new Task(this, {
            task: async () => {
                try {
                    const response = await fetch(this.href, { method: "delete" });
                    if (!response.ok)
                        throw new Error("The error is this: " + response.status);
                }
                catch (error) {
                    console.log(error.message);
                }
            }
        });
    }
    static { this.styles = css `   
    div{
                font-size: 1.1rem;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                width: min-content;
                justify-content: center;

                p.top{
                    width:max-content;
                }

                p.bottom{
                    width:100%;
                }

                button{
                    font-size:1rem;
                    margin:0 20px;
                    padding: 3px 6px;
                }
        }
  `; }
    showDeleteDialog(lessonName, href) {
        this.setData(lessonName, href);
        this.dialog.showModal();
    }
    setData(lessonName, href) {
        this.lessonname = lessonName;
        this.href = href;
    }
    async onYesButtonClicked() {
        this.task.run();
    }
    onNoButtonClicked() {
        this.dialog.close();
    }
    deleteRequestTemplate() {
        return html `
       <p class="top"> Do you want to delete this lesson?</p>
       <p class="bottom">${this.lessonname}</p>
       <button @click=${this.onYesButtonClicked}>Yes</button>
       <button @click=${this.onNoButtonClicked}>No</button>`;
    }
    deleteCompletedTemplate() {
        return html `
      <p class="top">The lesson was deleted.</p>
      <a href="/lessons">Return to the dashboard</a>
    `;
    }
    deletePendingTemplate() {
        return html `<p>Deleting lesson....</p>`;
    }
    errorTemplate() {
        return html `<p>Opps! An error occurred!</p>`;
    }
    render() {
        return html `
      <dialog closedby="any">
        <div>
          ${this.task.render({
            initial: () => this.deleteRequestTemplate(),
            pending: () => this.deletePendingTemplate(),
            complete: () => this.deleteCompletedTemplate(),
            error: () => this.errorTemplate()
        })}
        </div>
      </dialog>
    `;
    }
};
__decorate([
    state()
], DeleteLessonDialog.prototype, "href", void 0);
__decorate([
    state()
], DeleteLessonDialog.prototype, "lessonname", void 0);
__decorate([
    query("dialog")
], DeleteLessonDialog.prototype, "dialog", void 0);
DeleteLessonDialog = __decorate([
    customElement("deletelesson-dialog")
], DeleteLessonDialog);
export { DeleteLessonDialog };
//# sourceMappingURL=DeleteLessonDialog.js.map