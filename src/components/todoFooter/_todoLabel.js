import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../../utils';

@observer
export default class TodoLabel extends React.Component {
    /*
     * TODO Implement "label" buttons
     *
     * Just log and return null for now
     *
     */
    render() {

        const {viewStore, todoStore} = this.props;

        // Yeah, no reason labels need exist outside of Todos...except as strings
        // TODO Get uniq labels from Todo obj itself
        // TODO Check if we actually have any labels, too
        /*XXX*/console.log('Building global list of labels using:',todoStore.uniqLabels);

        // TODO Move this to CSS
        var divStyle = { marginTop: '30px' };

        const activeLabelWord = pluralize(todoStore.labelCount, 'label');

        return (
            <div style={divStyle}>
                <span className="todo-count">
                    <strong>
                        {todoStore.labelCount}
                    </strong>
                    <span>/</span>
                    <strong>
                        {todoStore.activeLabelCount + ' '}
                    </strong>
                    {activeLabelWord} selected
                </span>
                <ul className="filters labels">
                    {
                        todoStore.uniqLabels.map((elem, i) =>
                            <li key={i}>
                                <a href="#" className={elem.active ? "selected" : ""}>
                                    {elem.caption}
                                </a>
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}
