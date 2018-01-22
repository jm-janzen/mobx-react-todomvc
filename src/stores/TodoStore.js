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

    // Just drill down to individual getters on our todos
    // XXX Is dereferencing here breaking our store on refresh ?
    @computed get uniqLabels () {
        console.log("TodoStore::get uniqLabels");
        var seen = [];
        var uniqLabels = [];

        // XXX There's got to be a more semantic way to do this ...
        this.todos.filter(todo => {
            todo.uniqLabels.filter(label => {
                if (seen.includes(label.caption)) return false

                seen.push(label.caption)
                uniqLabels.push(label)
            })
        });

        console.log("\tret",uniqLabels)
        return uniqLabels;
    }

    // This view/store coupling feels bad ...
    getVisibleTodos(view) {
        console.log("getVisibleTodos()");

        return this.todos.filter(todo => {

            /*
             * TODO
             *      1. [GENERAL]  if no labels active,
             *         show all
             *
             *      2. [SPECIFIC] if individual todo does not
             *         have any active labels, do not
             *         show it.
             *
             * XXX This may not be the best place to do this,
             *     maybe check out individual todoItems
             */

            var isVisible = true
            switch (view.todoFilter) {
                case ACTIVE_TODOS:
                    isVisible = !todo.completed;
                    break;
                case COMPLETED_TODOS:
                    isVisible = todo.completed;
                    break;
            }

            var hasActiveLabel = todo.labels.filter((l) =>
                this.uniqLabels.filter((ul) =>
                    l.caption === ul.caption
                )
            ).length;
            var totalActiveLabels = this.uniqLabels.filter((ul) => ul.active).length;
            console.log("totalUniqLabels:", totalActiveLabels);
            console.log("activeLabels:", hasActiveLabel)
            hasActiveLabel = hasActiveLabel > 0;
            console.log("hasActiveLabel:", hasActiveLabel)

            console.log( !hasActiveLabel, '&&', this.uniqLabels.length, '> 0 &&', totalActiveLabels, '>= 1');
            if ( !hasActiveLabel && this.uniqLabels.length > 0 && totalActiveLabels >= 1) isVisible = false;

            console.log('\t',todo.title, "is"+(isVisible ? "" : "n't"), "visible");
            return isVisible;
        });
    }

    subscribeServerToStore() {
        reaction(
            () => this.toJS(),
            todos => window.fetch && fetch('/api/todos', {
                method: 'post',
                body: JSON.stringify({ todos }),
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );
    }

    subscribeLocalstorageToStore() {
        reaction(
            () => this.toJS(),
            todos => localStorage.setItem('mobx-react-todomvc-todos', JSON.stringify({ todos }))
        );
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
