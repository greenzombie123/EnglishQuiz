var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
let NameContainer = class NameContainer extends LitElement {
    static { this.styles = css `
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
        `; }
    render() {
        return html `
            <label for="lessonName" class="lessonNameLabel">
                Write the name of your lesson.
                <input @input=${this.onNameInputChanged} type="text" id="lessonName" placeholder="Lesson Name" name="lessonName" value=${this.lessonName || ""} required>
            </label>
        `;
    }
    onNameInputChanged() {
        const value = this.nameInput?.value.trim() || "";
        const options = {
            detail: { action: "lessonDataChanged", field: "lessonName", value },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
};
__decorate([
    property()
], NameContainer.prototype, "lessonName", void 0);
__decorate([
    query('#lessonName')
], NameContainer.prototype, "nameInput", void 0);
NameContainer = __decorate([
    customElement("name-container")
], NameContainer);
export { NameContainer };
//# sourceMappingURL=NameContainer.js.map