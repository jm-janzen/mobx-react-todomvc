import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

@observer
export default class TodoItem extends React.Component {
    @observable editText = "";

    render() {
        const {viewStore, todo, todoStore} = this.props;

        return (
            <li className={[
                todo.completed ? "completed": "",
                expr(() => todo === viewStore.todoBeingEdited ? "editing" : "")
            ].join(" ")}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={this.handleToggle}
                    />
                    <label onDoubleClick={this.handleEdit}>
                        {todo.title}
                    </label>
                    { /* Our labels (if any) */}
                    <div className="labels">
                    {
                        todo.uniqLabels.filter(label => label.active ).map((label, i) =>
                            <span key={i}>{label.caption}</span>)
                    }
                    </div>

                    { /* XXX Our button to add new labels */}
                    <button className="create" onClick={this.handleLabelPrompt}/>
                    <button className="destroy" onClick={this.handleDestroy}/>
                </div>
                <input
                    ref="editField"
                    className="edit"
                    value={this.editText}
                    onBlur={this.handleSubmit}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                />
            </li>
        );
    }

    // TODO Handle update, delete (no text in label)
    handleSubmitLabel = (event) => {
        return null
    }

    // New label alert input
    handleLabelPrompt = () => {
        var val = prompt("Enter new label");
        if (val) {
            this.props.todo.addLabel(val, true);  // XXX This does not update view
        } else {  // TODO Handle destroy label
            pass;
        }
    }

    handleSubmit = (event) => {
        const val = this.editText.trim();
        if (val) {
            this.props.todo.setTitle(val);
            this.editText = val;
        } else {
            this.handleDestroy();
        }
        this.props.viewStore.todoBeingEdited = null;
    };

    handleDestroy = () => {
        this.props.todo.destroy();
        this.props.viewStore.todoBeingEdited = null;
    };

    handleEdit = () => {
        const todo = this.props.todo;
        this.props.viewStore.todoBeingEdited = todo;
        this.editText = todo.title;
    };

    handleKeyDown = (event) => {
        if (event.which === ESCAPE_KEY) {
            this.editText = this.props.todo.title;
            this.props.viewStore.todoBeingEdited = null;
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit(event);
        }
    };

    handleChange = (event) => {
        this.editText = event.target.value;
    };

    handleToggle = () => {
        this.props.todo.toggle();
    };
}

TodoItem.propTypes = {
    todo: PropTypes.object.isRequired,
    viewStore: PropTypes.object.isRequired
};
