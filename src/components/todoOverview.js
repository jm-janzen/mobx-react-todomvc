import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import { ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

import TodoItem from './todoItem';

@observer
export default class TodoOverview extends React.Component {
    render() {
        const {todoStore, viewStore} = this.props;

        if (todoStore.todos.length === 0)
            return null;
        return <section className="main">
            <input
                className="toggle-all"
                type="checkbox"
                onChange={this.toggleAll}
                checked={todoStore.activeTodoCount === 0}
            />
            <ul className="todo-list">
                {this.getVisibleTodos().map(todo =>
                    (<TodoItem
                        key={todo.id}
                        todo={todo}
                        viewStore={viewStore}
                    />)
                )}
            </ul>
        </section>
    }

    getVisibleTodos() {
        return this.props.todoStore.getVisibleTodos(this.props.viewStore.todoFilter);
    }

    toggleAll = (event) => {
        var checked = event.target.checked;
        this.props.todoStore.toggleAll(checked);
    };
}


TodoOverview.propTypes = {
    viewStore: PropTypes.object.isRequired,
    todoStore: PropTypes.object.isRequired
}
