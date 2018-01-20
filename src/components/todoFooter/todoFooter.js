import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../../utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import TodoItem from './_todoItem';
import TodoLabel from './_todoLabel';

@observer
export default class TodoFooter extends React.Component {
    render() {
        const {todoStore, viewStore} = this.props;
        if (!todoStore.activeTodoCount && !todoStore.completedCount) {
            return null;
        }

        /*
         * TODO: Investigate best-practice:
         *  - Pass entire store (rename class, gross)
         *  - Loop over stores objects
         */
        return (
            <div>
                <TodoItem  todoStore={todoStore} viewStore={viewStore} />
                <TodoLabel todoStore={todoStore} viewStore={viewStore} />
            </div>
        )
    }
}

TodoFooter.propTypes = {
    viewStore: PropTypes.object.isRequired,
    todoStore: PropTypes.object.isRequired
}

