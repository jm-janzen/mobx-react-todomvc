import {observable, computed, action, reaction} from 'mobx';
import LabelModel from '../models/LabelModel'
import * as Utils from '../utils';
import util from 'util';

export default class TodoModel {
    store;
    id;
    @observable title;
    @observable completed;
    @observable labels = [];

    constructor(store, id, title, completed) {
        this.store = store;
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    @computed get getLabels() {
        return this.labels;
    }

    @computed get uniqLabels() {
        return this.labels.filter((label, i, a) =>
            i === a.findIndex((l) => (
                l.caption === label.caption
            ))
        )
    }

    @computed get activeLabels() {
        return this.labels.filter(label => label.active);
    }

    addLabel(caption, active) {

        // Safely default to false if no 'active' bool parameter specified
        active = typeof(active) == 'undefined' ? false : active;

        this.labels.push(new LabelModel(this, Utils.uuid(), caption, active));
    }

    toggle() {
        this.completed = !this.completed;
    }

    destroy() {
        this.store.todos.remove(this);
    }

    setTitle(title) {
        this.title = title;
    }

    toJS() {
        return {
            id: this.id,
            title: this.title,
            completed: this.completed,
            labels: this.labels,
        };
    }

    static fromJS(store, object) {
        return new TodoModel(store, object.id, object.title, object.completed, object.labels);
    }
}
