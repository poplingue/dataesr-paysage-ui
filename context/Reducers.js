import { getForm } from '../helpers/utils';
import DBService from '../services/DBService';
import ACTIONS from './Actions';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM_FIELD: {
            const { value, formName, uid, dbUpdate = true } = action.payload;
            const checkStoreObject = state.storeObjects.indexOf(formName) > -1;

            // TODO DBService outside from Reducer
            if (dbUpdate && checkStoreObject) {
                DBService.set({
                    value,
                    uid
                }, formName, checkStoreObject);
            }

            const formIndex = state.forms.findIndex(obj => Object.keys(obj)[0] === formName);
            const newForm = getForm(state.forms, formName);

            if (newForm) {
                const fieldIndex = newForm.findIndex(field => field.uid === uid);

                if (fieldIndex > -1) {
                    // replace object field at fieldIndex
                    newForm[fieldIndex] = { value, uid };
                } else {
                    newForm.push({ value, uid });
                }
            }

            return {
                ...state,
                forms: [
                    ...state.forms.slice(0, formIndex), // everything before current field
                    { ...state.forms[formIndex], ...{ [formName]: newForm } },
                    ...state.forms.slice(formIndex + 1), // everything after current field
                ]
            };
        }

        case ACTIONS.DELETE_FORM_FIELD: {
            const { formName, uid } = action.payload;

            // TODO DBService outside from Reducer
            DBService.delete(uid, formName, state.storeObjects.indexOf(formName) > -1);

            const currentForm = getForm(state.forms, formName) || [];
            const newForm = currentForm.filter((field) => field.uid !== uid);
            const formIndex = state.forms.findIndex(obj => Object.keys(obj)[0] === formName);

            return {
                ...state,
                forms: [
                    ...state.forms.slice(0, formIndex), // everything before current field
                    { ...state.forms[formIndex], ...{ [formName]: newForm } },
                    ...state.forms.slice(formIndex + 1), // everything after current field
                ]
            };
        }

        case ACTIONS.DELETE_FORM_SECTION: {
            const { formName, section, fieldsNumber } = action.payload;
            const currentForm = getForm(state.forms, formName);
            let newForm = [];
            let formsInd;
            // TODO refacto
            state.forms.find((f, i) => {
                if (Object.keys(f)[0] === formName) {
                    formsInd = i;

                    return true;
                }
            });
            debugger; // eslint-disable-line
            // Through right number of fields
            Array.apply(null, { length: fieldsNumber || 1 }).map((v, i) => {

                // Retrieve fields key of the section
                const filteredFields = currentForm.filter((field) => {

                    return field.uid.startsWith(section);
                }).map((fieldObj) => {
                    return fieldObj.uid;
                });

                for (let i = 0; i < filteredFields.length; i = i + 1) {
                    const currentFieldKey = filteredFields[i];
                    // Delete in indexDB
                    DBService.delete(currentFieldKey, formName, state.storeObjects.indexOf(formName) > -1);
                    // Delete in global state
                    newForm = currentForm.filter((field) => {
                        return field.uid !== currentFieldKey;
                    });
                }
            });

            return {
                ...state,
                forms: [
                    ...state.forms.slice(0, formsInd), // everything before current field
                    { ...state.forms[formsInd], ...{ [formName]: newForm } },
                    ...state.forms.slice(formsInd + 1), // everything after current field
                ]
            };

        }

        case ACTIONS.UPDATE_CURRENT_FORMNAME: {
            const { formName } = action.payload;

            return {
                ...state,
                formName
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
