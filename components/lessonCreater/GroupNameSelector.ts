import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js"
import { ifDefined } from "lit/directives/if-defined.js";
import { map } from "lit/directives/map.js";
import { LessonDataChanged } from "./types.ts";

@customElement("groupname-selector")
export class GroupNameSelector extends LitElement {

    @property()
    public groupName = ""

    @property({ type: Array })
    public groupNameList: string[] = []

    @query('#newGroupName')
    groupNameInput?: HTMLInputElement;

    @query('#groupNames')
    groupNameSelect?: HTMLSelectElement;

    static styles = [
        css`
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
    ];

    render() {
        return html`
            <label for="newGroupName">Create a group to put your lesson in</label>
            <input type="text" id="newGroupName" name="newgroupname" value=${this.groupName} @input=${this.onGroupNameChanged}>
            <label for="groupNames">Or choose a preexisting group</label>
            <select name="oldgroupname" id="groupNames" @input=${this.onGroupNameChanged}>
                <option value="" selected>Choose a group name</option>
                ${map(this.groupNameList, listItem => html`<option value=${listItem}>${listItem}</option>`)}
            </select>
        `;
    }

    onGroupNameChanged(e: InputEvent) {

        const value =
            e.target === this.groupNameInput ? this.groupNameInput.value.trim() :
                e.target === this.groupNameSelect ? this.groupNameSelect.value.trim() : ""

        const options: CustomEventInit<LessonDataChanged> = {
            detail: { action: "lessonDataChanged", field: "groupName", value },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('stateChanged', options))

    }
}

declare global {
    interface HTMLElementTagNameMap {
        "groupname-selector": GroupNameSelector;
    }
}
