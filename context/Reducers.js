import { getForm } from '../helpers/utils';
import ACTIONS from './Actions';

const reducers = (state, action) => {
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
            let newForm = [];
            let formIndex;

            state.forms.find((f, i) => {
                if (Object.keys(f)[0] === formName) {
                    formIndex = i;

                    return true;
                }
            });

            // Through right number of fields
            Array.apply(null, { length: fieldsNumber || 1 }).map((v, i) => {
                for (let i = 0; i < uids.length; i = i + 1) {
                    const currentFieldKey = uids[i];

                    newForm = currentForm.filter((field) => {
                        return field.uid !== currentFieldKey;
                    });
                }
            });

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

export default reducers;
