import {observable, computed, reaction} from 'mobx';

export default class TodoModel {
    store;
    id;
    @observable title;
    @observable completed;
    @observable labels = [];  // XXX Any change ...?

    constructor(store, id, title, completed) {
        this.store = store;
        this.id = id;
        this.title = title;
        this.completed = completed;

        this.labels = [{caption:'baz',active:true}];  // XXX Init our observable arr with dummy val for debugging
    }

    // Dump uniq labels
    @computed get uniqLabels() {
        return this.labels.filter((label, i, a) =>
            i === a.findIndex((l) => (
                l.caption === label.caption
            ))
        )
    }

    addLabel(caption, active) {
        this.labels.push({caption: caption, active: active});
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
