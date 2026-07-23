import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js"
import { LessonDataChanged } from "./types.ts";

@customElement("name-container")
export class NameContainer extends LitElement {

    @property()
    public lessonName?: string

    @query('#lessonName')
    nameInput?: HTMLInputElement;

    static styles =
        css`
            :host{
              --itemWidth: 33vw;
              --fontSize: 1.1rem;
              --inputPadding: 5px;  
            }

           .lessonNameLabel {
                            display: flex;
                            flex-direction: column;
                            width: 450px;
                            font-size: 1.1rem;
                            gap: 10px;
                            margin-bottom: 10px;

                            input {
                                font-size: var(--fontSize);
                                padding: var(--inputPadding);
                            }

                            @media screen and (max-width:600px){
                                --fontSize: 1rem;
                                --inputPadding: 5px;
                                --inputWidth: 100%;

                                label,
                                input {
                                    font-size: var(--fontSize);
                                    }
                            }
                        }
        `;

    render() {
        return html`
            <label for="lessonName" class="lessonNameLabel">
                Write the name of your lesson.
                <input @input=${this.onNameInputChanged} type="text" id="lessonName" placeholder="Lesson Name" name="lessonName" value=${this.lessonName || ""} required>
            </label>
        `;
    }

    onNameInputChanged() {

        const value = this.nameInput?.value.trim() || ""

        const options: CustomEventInit<LessonDataChanged> = {
            detail: { action: "lessonDataChanged", field: "lessonName", value },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('stateChanged', options))

    }
}

declare global {
    interface HTMLElementTagNameMap {
        "name-container": NameContainer;
    }
}
