import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../../utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';

@observer
export default class TodoFilter extends React.Component {
    render() {
        const todoStore = this.props.todoStore;
        if (!todoStore.activeTodoCount && !todoStore.completedCount)
            return null;

        const activeTodoWord = pluralize(todoStore.activeTodoCount, 'item');

        return (
            <div>
                <span className="todo-count">
                    <strong>{todoStore.activeTodoCount}</strong> {activeTodoWord} left
                </span>
                <ul className="filters">
                    {this.renderFilterLink(ALL_TODOS, "", "All")}
                    {this.renderFilterLink(ACTIVE_TODOS, "active", "Active")}
                    {this.renderFilterLink(COMPLETED_TODOS, "completed", "Completed")}
                </ul>
                {/* FIXME The styling on this item is broken (repro: mark a todo item
                  * as "completed" */}
                { todoStore.completedCount === 0
                    ? null
                    :     <button
                            className="clear-completed"
                            onClick={this.clearCompleted}>
                            Clear completed
                        </button>
                }
            </div>
        );
    }

    renderFilterLink(filterName, url, caption) {
        return (<li>
            <a href={"#/" + url}
                className={filterName ===  this.props.viewStore.todoFilter ? "selected" : ""}>
                {caption}
            </a>
            {' '}
        </li>)
    }

    clearCompleted = () => {
        this.props.todoStore.clearCompleted();
    };
}

