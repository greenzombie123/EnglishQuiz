export class DeleteLessonDialog extends HTMLElement {
  root;
  dialog;
  topMessage;
  bottomMessage;
  yesButton;
  noButton;
  returnButton;
  href;
  lessonname;

  constructor() {
    super();

    this.href = "";
    this.lessonname = "";

    this.root = this.attachShadow({ mode: "closed" });

    this.dialog = document.createElement("dialog") as HTMLDialogElement;
    this.dialog.setAttribute("closedby", "any")
    this.root.appendChild(this.dialog);

    this.topMessage = document.createElement("p") as HTMLParagraphElement;
    this.topMessage.textContent = "Do you want to delete this lesson?";
    this.dialog.appendChild(this.topMessage);

    this.bottomMessage = document.createElement("p") as HTMLParagraphElement;
    this.dialog.appendChild(this.bottomMessage);

    this.yesButton = document.createElement("button") as HTMLButtonElement;
    this.yesButton.textContent = "Yes";
    this.yesButton.addEventListener("click", this.#onYesButtonClicked);
    this.dialog.appendChild(this.yesButton);

    this.noButton = document.createElement("button") as HTMLButtonElement;
    this.noButton.textContent = "No";
    this.noButton.addEventListener("click", () => this.dialog.close());
    this.dialog.appendChild(this.noButton);

    this.returnButton = document.createElement("a") as HTMLAnchorElement;
    this.returnButton.textContent = "Return to the dashboard";
    this.returnButton.href = "/lessons"
    this.dialog.appendChild(this.returnButton);
  }

  connectedCallback() {

  }

  showDeleteDialog = (lessonname: string, href: string) => {
    this.#reset();
    this.#setData(lessonname, href);
    this.#showDialog();
  };

  #setData = (lessonname: string, href: string) => {
    this.lessonname = lessonname;
    this.href = href;
  };

  #showDialog = () => {
    this.topMessage.textContent = "Will you delete this lesson?";
    this.bottomMessage.textContent = this.lessonname;

    this.dialog.showModal();
  };

  #onYesButtonClicked = async () => {
    try {
      const response = await fetch(this.href, { method: "delete" });
      if (!response.ok)
        throw new Error("The error is this: " + response.status);
      this.#removeButtons();
      this.#renderReturnButton();
      this.topMessage.textContent = "The lesson was deleted.";
      this.bottomMessage.textContent = "";
    } catch (error: any) {
      console.log(error.message);
    }
  };

  #removeButtons = () => {
    const buttons = Array.from(
      this.dialog.querySelectorAll("button")
    ) as HTMLButtonElement[];
    buttons.forEach((button) => (button.style.display = "none"));
  };

  #renderReturnButton = () => {
    this.returnButton.style.display = "block";
  };

  #reset = () => {
    const buttons = Array.from(
      this.dialog.querySelectorAll("button")
    ) as HTMLButtonElement[];
    buttons.forEach((button) => (button.style.display = "block"));

    this.returnButton.style.display = "none";
  };
}

customElements.define("deletelesson-dialog", DeleteLessonDialog);
