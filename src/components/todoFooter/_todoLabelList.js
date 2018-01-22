import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../../utils';
import TodoLabel from './_todoLabel';

@observer
export default class TodoLabelList extends React.Component {
    render() {

        const {viewStore, todoStore} = this.props;

        console.log("Rendering TodoLabelList",todoStore.uniqLabels)

        if (todoStore.uniqLabels.length < 1) return null

        // TODO Move this to CSS
        var divStyle = { marginTop: '30px' };

        return (
            <div style={divStyle}>
                <span className="todo-count">
                    <strong>
                        {todoStore.activeLabelCount}
                    </strong>
                    <span>/</span>
                    <strong>
                        {todoStore.labelCount + ' '}
                    </strong>
                    {pluralize(todoStore.labelCount, 'label')} selected
                </span>
                <ul className="filters labels">
                    {todoStore.uniqLabels.map(label =>
                        (<TodoLabel
                            key={label.id}
                            label={label}
                            viewStore={viewStore}
                            todoStore={todoStore}
                        />)
                    )}

                </ul>
            </div>
        );
    }
}
