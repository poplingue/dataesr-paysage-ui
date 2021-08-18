import { getForm } from '../helpers/utils';
import DBService from '../services/DBService';
import ACTIONS from './Actions';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM_FIELD: {
            const { value, formName, uid, dbUpdate = true } = action.payload;

            // TODO DBService outside from Reducer
            if (dbUpdate && state.storeObjects.length > 0) {
                DBService.set({
                    value: action.payload.value,
                    uid
                }, formName, state.storeObjects.indexOf(formName) > -1);
            }

            let formsInd;
            let f = state.forms.find((f, i) => {
                if (Object.keys(f)[0] === formName) {
                    formsInd = i;

                    return true;
                }
            });

            if (f[formName].length) {
                const exist = f[formName].findIndex(item => item.uid === uid);

                if (exist >= 0) {
                    // replace object value at uid OR do it with index
                    f[formName].forEach((ob) => {
                        if (ob.uid === uid) {
                            ob.value = value;
                        }
                    });
                } else {
                    f[formName].push({ value, uid });
                }

            } else {
                f[formName].push({ value, uid });
            }

            const x = {
                ...state.forms.map((form) => {
                    if (Object.keys(form)[0] === formName) {
                        if (!form[formName].length) {
                            form[formName].push({ value, uid });
                        } else {

                            form[formName].map((field) => {

                                if (field.uid === uid) {
                                    return { value, uid };
                                }

                                return field;
                            });
                        }
                    }

                    return form;
                })
            };

            return {
                ...state,
                forms: [
                    ...state.forms.slice(0, formsInd), // everything before current post
                    { ...state.forms[formsInd], ...f },
                    ...state.forms.slice(formsInd + 1), // everything after current post
                ]
            };
        }

        case ACTIONS.DELETE_FORM_FIELD: {
            const { formName, uid } = action.payload;
            // TODO DBService outside from Reducer
            DBService.delete(uid, formName, state.storeObjects.indexOf(formName) > -1);
            const currentForm = getForm(state.forms, formName);
            const newForm = currentForm.filter((field) => {
                return field.uid !== uid;
            });

            return {
                ...state,
                forms: {
                    ...state.forms.map((form) => {
                        if (Object.keys(form)[0] === formName) {
                            return { [formName]: newForm };
                        }

                        return form;
                    })
                },
            };
        }

        case ACTIONS.DELETE_FORM_SECTION: {
            const { formName, section, fieldsNumber } = action.payload;
            const currentForm = getForm(state.forms, formName);
            let newForm = [];
            let formsInd;
            state.forms.find((f, i) => {
                if (Object.keys(f)[0] === formName) {
                    formsInd = i;

                    return true;
                }
            });
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
                    ...state.forms.slice(0, formsInd), // everything before current post
                    { ...state.forms[formsInd], ...{ [formName]: newForm } },
                    ...state.forms.slice(formsInd + 1), // everything after current post
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
