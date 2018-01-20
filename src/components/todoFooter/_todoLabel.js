import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

export default class TodoLabel extends React.Component {
    /*
     * TODO Implement "label" buttons
     *
     * Just log and return null for now
     *
     */
    render() {

        console.log("TodoLabel::render() /* [ UNIMPLEMENTED ] */");

        // TODO Get uniq labels from Todo obj itself
        // Yeah, no reason labels need exist outside of Todos...except as strings
        var labelMock = [
            { caption: 'foo', active: false },
            { caption: 'bar', active: false },
            { caption: 'baz', active: true },
        ];

        var divStyle = { marginTop: '20px' };
        return (
            <div>
                <ul style={divStyle} className="filters">
                    {
                        /* TODO Replace with actual label names */
                        /* TODO Include key prop */
                        labelMock.map((elem) =>
                            <li>
                                <a href="#" className={elem.active ? "selected" : ""}>{elem.caption}</a>
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}
