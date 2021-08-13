import ACTIONS from './Actions';
import DBService from '../services/DBService';
import { removeKey } from '../helpers/utils';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM_FIELD: {
            const { value, formName, uid, dbUpdate = true } = action.payload;
            // TODO DBService outside from Reducer
            if (dbUpdate) {
                DBService.set({
                    value: action.payload.value,
                    uid
                }, formName, state.storeObjects.indexOf(formName) > -1);
            }
            // TODO install Immutable.js ??
            return {
                ...state,
                forms: {
                    ...state.forms,
                    [formName]: { ...state.forms[formName], [uid]: value }
                },
            };
        }
        case ACTIONS.DELETE_FORM_FIELD: {
            const { formName, uid } = action.payload;
            // TODO DBService outside from Reducer
            DBService.delete(uid, formName, state.storeObjects.indexOf(formName) > -1);

            return {
                ...state,
                forms: { ...state.forms, [formName]: removeKey(state.forms[formName], uid) },
            };
        }
        case ACTIONS.DELETE_FORM_SECTION: {
            const { formName, section, fieldsNumber } = action.payload;
            const currentForm = state.forms[formName];
            let newForm = Object.assign({}, state.forms);

            // Through right number of fields
            Array.apply(null, { length: fieldsNumber || 1 }).map((v, i) => {

                // Retrieve fields key of the section
                const filteredFields = Object.entries(currentForm).filter((field) => {
                    const fieldKey = field[0];
                    return fieldKey.startsWith(section);
                });
                for (let i = 0; i < filteredFields.length; i = i + 1) {
                    const currentFieldKey = filteredFields[i][0];
                    // Delete in indexDB
                    DBService.delete(currentFieldKey, formName, state.storeObjects.indexOf(formName) > -1);
                    // Delete in global state
                    newForm = { ...newForm, [formName]: removeKey(newForm[formName], currentFieldKey) };
                }
            });
            return {
                ...state,
                forms: newForm
            };

        }
        case ACTIONS.UPDATE_CURRENT_OBJECT_STORE: {
            return {
                ...state,
                objectStoreName: action.payload.objectStoreName
            };
        }
        case ACTIONS.UPDATE_INDB_STORE_OBJECTS:
            return { ...state, storeObjects: [...action.payload.storeObjects] };

        case ACTIONS.UPDATE_DEPARTMENTS: {
            return { ...state, departments: action.payload };
        }

        default:
            break;
    }
};
export default reducers;
