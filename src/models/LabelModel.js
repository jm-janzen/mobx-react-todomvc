import {observable, computed, action, reaction} from 'mobx';
import util from 'util';

export default class LabelModel {

    store;
    id;
    @observable caption;
    @observable active;

    constructor(store, id, caption, active) {
        this.store = store;
        this.id = id;
        this.caption = caption;
        this.active = active || false;
    }

    @action toggle() {
        console.log("Toggling Label '%s' %s",
            this.caption,
            (this.active ? "OFF" : "ON"));

        this.active = !this.active
    }

    destroy() {
        this.store.labels.remove(this);
    }

    toJS() {
        return {
            id: this.id,
            caption: this.caption,
            active: this.active,
        };
    }


}
