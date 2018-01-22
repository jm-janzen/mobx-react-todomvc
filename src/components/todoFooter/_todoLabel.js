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
        // @observable tabelsActive=[];
        console.log(this.props.viewStore.labelsActive);
        if (!this.props.viewStore.labelsActive.includes(this.props.label)) {

            console.log("Adding to view:", this.props.label);
            this.props.viewStore.labelsActive.push(this.props.label);
        }
        this.props.label.toggle();
    };
}
