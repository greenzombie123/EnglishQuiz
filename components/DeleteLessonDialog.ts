import { Task } from "@lit/task";
import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";

declare global {
  interface HTMLElementTagNameMap {
    "deletelesson-dialog": DeleteLessonDialog;
  }
}

@customElement("deletelesson-dialog")
export class DeleteLessonDialog extends LitElement {

  @state()
  href = "";

  @state()
  lessonname = "";

  @query("dialog")
  dialog!: HTMLDialogElement;

  private task = new Task(this, {
    task: async () => {
      try {
        const response = await fetch(this.href, { method: "delete" });
        if (!response.ok)
          throw new Error("The error is this: " + response.status);
      } catch (error: any) {
        console.log(error.message);
      }
    }
  })

  static styles = css`   
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
  `;

  showDeleteDialog(lessonName: string, href: string) {
    this.setData(lessonName, href)
    this.dialog.showModal()
  }

  private setData(lessonName: string, href: string) {
    this.lessonname = lessonName;
    this.href = href
  }

  async onYesButtonClicked() {
    this.task.run()
  }

  onNoButtonClicked() {
    this.dialog.close()
  }

  deleteRequestTemplate() {
    return html`
       <p class="top"> Do you want to delete this lesson?</p>
       <p class="bottom">${this.lessonname}</p>
       <button @click=${this.onYesButtonClicked}>Yes</button>
       <button @click=${this.onNoButtonClicked}>No</button>`
  }

  deleteCompletedTemplate() {
    return html`
      <p class="top">The lesson was deleted.</p>
      <a href="/lessons">Return to the dashboard</a>
    `
  }

  deletePendingTemplate() {
    return html`<p>Deleting lesson....</p>`
  }

  errorTemplate() {
    return html`<p>Opps! An error occurred!</p>`
  }

  protected render() {
    console.log(this.lessonname, this.href, 12)

    return html`
      <dialog closedby="any">
        <div>
          ${this.task.render({
            initial: ()=>this.deleteRequestTemplate(),
            pending: ()=>this.deletePendingTemplate(),
            complete: ()=>this.deleteCompletedTemplate(),
            error: ()=>this.errorTemplate()
    })}
        </div>
      </dialog>
    `
  }
}
