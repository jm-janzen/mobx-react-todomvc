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

    // This view/store coupling feels bad ...
    getVisibleTodos(view) {

        var totalActiveLabels = this.uniqLabels.filter(l => l.active);

        return this.todos.filter(todo => {

            var isVisible = true
            switch (view.todoFilter) {
                case ACTIVE_TODOS:
                    isVisible = !todo.completed;
                    break;
                case COMPLETED_TODOS:
                    isVisible = todo.completed;
                    break;
            }

            /* Is visible only if:
             *  1. no global labels defined at all
             *  2. no global labels are active
             *  3. this individual Item has a label which is active
             *
             *  FIXME Duplicate labels are not detected (only on last item added)
             */
            var activeLabels = todo.labels.filter(l => l.active);

            if ( activeLabels.length <= 0
                && this.uniqLabels.length > 0
                && totalActiveLabels.length >= 1) {
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
