import { getFieldValue, getForm } from '../helpers/utils';
import ACTIONS from './Actions';

const reducersForm = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM_FIELD: {
            const { value, formName, uid } = action.payload;
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

        case ACTIONS.UPDATE_FORM_FIELD_LIST: {
            const { formName, fields } = action.payload;
            const formIndex = state.forms.findIndex(obj => Object.keys(obj)[0] === formName);
            const newForm = getForm(state.forms, formName);

            for (let i = 0; i < fields.length; i = i + 1) {
                const currentField = fields[i];

                // case create new entry
                if (currentField.value && !getFieldValue(state.forms, formName, currentField.uid)) {
                    newForm.push(currentField);
                }

                // case uid already exists
                if (currentField.value && getFieldValue(state.forms, formName, currentField.uid)) {
                    const index = newForm.findIndex(obj => {
                            return Object.entries(obj)[1][1] === currentField.uid;
                        }
                    );

                    newForm[index] = currentField;
                }
            }

            return {
                ...state,
                forms: [
                    ...state.forms.slice(0, formIndex), // everything before current field
                    { [formName]: newForm },
                    ...state.forms.slice(formIndex + 1), // everything after current field
                ]
            };
        }

        case ACTIONS.DELETE_FORM_FIELD: {
            const { formName, uid } = action.payload;
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

        case ACTIONS.DELETE_FORM_FIELD_LIST: {
            const { formName, uids, fieldsNumber } = action.payload;
            const currentForm = getForm(state.forms, formName);
            let formIndex;
            let indexes = [];

            state.forms.find((f, i) => {
                if (Object.keys(f)[0] === formName) {
                    formIndex = i;

                    return true;
                }
            });

            for (let i = 0; i < uids.length; i = i + 1) {
                const currentFieldKey = uids[i];
                const index = currentForm.findIndex(obj => {
                        return Object.entries(obj)[1][1] === currentFieldKey;
                    }
                );
                indexes.push(index);
            }

            const newForm = currentForm.filter((field, i) => indexes.indexOf(i) === -1);

            return {
                ...state,
                forms: [
                    ...state.forms.slice(0, formIndex), // everything before current field
                    { ...state.forms[formIndex], ...{ [formName]: newForm } },
                    ...state.forms.slice(formIndex + 1), // everything after current field
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

export default reducersForm;
