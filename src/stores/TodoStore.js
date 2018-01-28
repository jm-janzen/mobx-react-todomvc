import {observable, computed, reaction} from 'mobx';
import TodoModel from '../models/TodoModel'
import * as Utils from '../utils';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';


export default class TodoStore {
    @observable todos = [];

    @computed get activeTodoCount() {
        return this.todos.reduce(
            (sum, todo) => sum + (todo.completed ? 0 : 1),
            0
        )
    }

    @computed get completedCount() {
        return this.todos.length - this.activeTodoCount;
    }

    @computed get labelCount() {
        return this.uniqLabels.length;
    }

    @computed get activeLabelCount() {
        return this.uniqLabels.filter(l=> l.active).length;
    }

    @computed get labels () {
        return this.todos.filter(todo => todo.getLabels)
    }

    @computed get uniqLabels () {
        var seen = [];
        var uniqLabels = [];

        // Just drill down to individual getters on our todos
        // FIXME This could be much more semantic, with fewer
        //       unnecessary intermediate variables.
        this.todos.filter(todo => {
            todo.uniqLabels.filter(label => {
                if (seen.includes(label.caption)) return false

                seen.push(label.caption)
                uniqLabels.push(label)
            })
        });

        return uniqLabels;
    }

    /*
     * Assumes item is visible - performs tests using filters, labels
     * to determine if it is not.
     */
    getVisibleTodos(filterSelected) {

        var totalActiveLabels = this.uniqLabels.filter(l => l.active);

        return this.todos.filter(todo => {

            var isVisible = true

            // Check if we have selected "all", "active", or "completed" items
            switch (filterSelected) {
                case ACTIVE_TODOS:
                    isVisible = !todo.completed;
                    break;
                case COMPLETED_TODOS:
                    isVisible = todo.completed;
                    break;
            }

            // Check if this item has any matching labels (which are active)
            var hasMatchingCaptions = todo.labels.filter(l =>
                totalActiveLabels.map(al => al.caption ).includes(l.caption)
            ).length > 0;

            /* Is visible only if:
             *  1. no global labels are active at all
             *  2. this individual item has a label which is active
             */
            if ( totalActiveLabels.length > 0 && ! hasMatchingCaptions) {
                isVisible = false;
            }

            console.log(todo.title, "is"+(isVisible ? "" : "n't"), "visible");
            return isVisible;
        });
    }

    addTodo (title) {
        this.todos.push(new TodoModel(this, Utils.uuid(), title, false));
    }

    toggleAll (checked) {
        this.todos.forEach(
            todo => todo.completed = checked
        );
    }

    clearCompleted () {
        this.todos = this.todos.filter(
            todo => !todo.completed
        );
    }

    toJS() {
        return this.todos.map(todo => todo.toJS());
    }

    static fromJS(array) {
        const todoStore = new TodoStore();
        todoStore.todos = array.map(item => TodoModel.fromJS(todoStore, item));
        return todoStore;
    }
}
