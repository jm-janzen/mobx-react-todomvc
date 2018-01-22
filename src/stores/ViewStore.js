import {observable} from 'mobx';
import { ALL_TODOS, ALL_LABELS, ACTIVE_LABELS } from '../constants';

export default class ViewStore {
    @observable todoBeingEdited = null;
    @observable todoFilter= ALL_TODOS;
    @observable labelsActive=[];
}
