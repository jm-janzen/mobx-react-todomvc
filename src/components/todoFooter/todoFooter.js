import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../../utils';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../../constants';
import TodoFilter from './_todoFilter';
import TodoLabel from './_todoLabel';
import TodoLabelList from './_todoLabelList';

@observer
export default class TodoFooter extends React.Component {
    render() {
        const {todoStore, viewStore} = this.props;
        if (!todoStore.activeTodoCount && !todoStore.completedCount) {
            return null;
        }

        return (
            <footer className="footer">
                <TodoFilter todoStore={todoStore} viewStore={viewStore} />
                {/* TODO Add some styled hr elem here */}
                <TodoLabelList  todoStore={todoStore} viewStore={viewStore} />
            </footer>
        )
    }
}

TodoFooter.propTypes = {
    viewStore: PropTypes.object.isRequired,
    todoStore: PropTypes.object.isRequired
}

