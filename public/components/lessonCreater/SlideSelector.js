var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
let SlideSelector = class SlideSelector extends LitElement {
    static { this.styles = [
        css `
            :host {
                --itemWidth: 33vw;
                --fontSize: 1.1rem;
                --inputPadding: 5px;
            }

            .slideSelecter {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: fit-content;
                    border: 1px black solid;
                    margin: 25px 0;
                    padding: 10px;

                    label {
                        font-size: var(--fontSize)
                    }

                    select {
                        font-size: var(--fontSize)
                    }

                    button {}
            }

            
        `
    ]; }
    render() {
        return html `
            <div class="slideSelecter">
                <label for="select">Choose what type of slide to make.</label>
                <select name="" id="slideSelecter">
                    <option value="" selected>--Choose a slide</option>
                    <option value="intro">Introduce grammar or vocabulary</option>
                    <option value="question">Make a question</option>
                </select>
                <button type="button" @click=${this.onSlideSelectorButtonClicked} id="slide-selecterButton">Add New Slide</button>
            </div>
        `;
    }
    //TODO Maybe get rid of "as"
    onSlideSelectorButtonClicked() {
        const value = this._select?.value;
        if (value) {
            const options = {
                detail: { action: "slideAdded", value },
                bubbles: true,
                composed: true
            };
            this.dispatchEvent(new CustomEvent('stateChanged', options));
        }
    }
};
__decorate([
    query("select")
], SlideSelector.prototype, "_select", void 0);
SlideSelector = __decorate([
    customElement("slide-selector")
], SlideSelector);
export { SlideSelector };
//# sourceMappingURL=SlideSelector.js.map