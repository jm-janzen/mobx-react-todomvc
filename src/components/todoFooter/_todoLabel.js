import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {pluralize} from '../../utils';

@observer
export default class TodoLabel extends React.Component {
    render() {


        const {label, viewStore} = this.props;

        return (
            <li>
                <a
                    href="#"
                    className={label.active ? "selected" : ""}
                    onClick={this.handleToggle}
                >
                    {label.caption}
                </a>
            </li>
        );

    }
    handleToggle = () => {
        /*
         * NOTE: This exists only to get MobX to track these deeply nested updates
         */
        if (!this.props.viewStore.labelsActive.includes(this.props.label)) {
            this.props.viewStore.labelsActive.push(this.props.label);
        }

        this.props.label.toggle();
    };
}
