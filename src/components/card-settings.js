import { customElement, bindable } from "aurelia-framework";

@customElement('card-settings')
export class CardSettings {
    @bindable theme;
    @bindable cardCount;
    @bindable heading;
}