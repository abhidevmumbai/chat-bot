export class Data {
    store: Record<string, any>;

    constructor() {
        this.store = new Map();
    }
}

export const DataService = new Data().store;
