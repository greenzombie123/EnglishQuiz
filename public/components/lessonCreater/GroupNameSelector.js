var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
let GroupNameSelector = class GroupNameSelector extends LitElement {
    constructor() {
        super(...arguments);
        this.groupName = "";
        this.groupNameList = [];
    }
    static { this.styles = [
        css `
           :host {

                font-size: 1.1rem;

                display: flex;
                flex-direction: column;
                width: 450px;
                gap: 10px;

                label {
                    display: flex;
                    flex-direction: column;
                    font-size: inherit;
                    gap: 10px;
                }

                input,
                select {
                    font-size: inherit;
                    padding: 5px;
                }
            }

            @media screen and (max-width:600px){
                :host{
                    font-size:1rem;
                    width:100%
                }
            }
        `
    ]; }
    render() {
        return html `
            <label for="newGroupName">Create a group to put your lesson in</label>
            <input type="text" id="newGroupName" name="newgroupname" value=${this.groupName} @input=${this.onGroupNameChanged}>
            <label for="groupNames">Or choose a preexisting group</label>
            <select name="oldgroupname" id="groupNames" @input=${this.onGroupNameChanged}>
                <option value="" selected>Choose a group name</option>
                ${map(this.groupNameList, listItem => html `<option value=${listItem}>${listItem}</option>`)}
            </select>
        `;
    }
    onGroupNameChanged(e) {
        const value = e.target === this.groupNameInput ? this.groupNameInput.value.trim() :
            e.target === this.groupNameSelect ? this.groupNameSelect.value.trim() : "";
        const options = {
            detail: { action: "lessonDataChanged", field: "groupName", value },
            bubbles: true,
            composed: true
        };
        this.dispatchEvent(new CustomEvent('stateChanged', options));
    }
};
__decorate([
    property()
], GroupNameSelector.prototype, "groupName", void 0);
__decorate([
    property({ type: Array })
], GroupNameSelector.prototype, "groupNameList", void 0);
__decorate([
    query('#newGroupName')
], GroupNameSelector.prototype, "groupNameInput", void 0);
__decorate([
    query('#groupNames')
], GroupNameSelector.prototype, "groupNameSelect", void 0);
GroupNameSelector = __decorate([
    customElement("groupname-selector")
], GroupNameSelector);
export { GroupNameSelector };
//# sourceMappingURL=GroupNameSelector.js.map