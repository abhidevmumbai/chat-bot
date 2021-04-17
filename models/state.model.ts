import { StateTypes } from "../enums";

export interface State {
    type: StateTypes
    text: Function
    before?: Function
    after?: Function
    choices?: string[]
    next?: string
    answer?: string
}