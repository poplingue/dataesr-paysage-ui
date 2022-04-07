import { getFieldValue, getForm, niceDate } from '../helpers/utils';

const actionMap = {
    UPDATE_FORM_FIELD: (state, action) => {
        const {
            value,
            formName,
            uid,
            unSaved = false,
            infinite = false,
            suggest = false,
        } = action.payload;

        const formIndex = state.forms.findIndex(
            (obj) => Object.keys(obj)[0] === formName
        );
        const newForm = getForm(state.forms, formName);

        if (newForm) {
            const fieldIndex = newForm.findIndex((field) => field.uid === uid);

            if (fieldIndex > -1) {
                // replace object field at fieldIndex
                newForm[fieldIndex] = {
                    value,
                    uid,
                    unSaved,
                    infinite,
                    suggest,
                };
            } else {
                newForm.push({ value, uid, unSaved, infinite, suggest });
            }
        }

        return {
            ...state,
            forms: [
                ...state.forms.slice(0, formIndex), // everything before current field
                { ...state.forms[formIndex], ...{ [formName]: newForm } },
                ...state.forms.slice(formIndex + 1), // everything after current field
            ],
        };
    },
    UPDATE_FORM_FIELD_LIST: (state, action) => {
        const { formName, fields } = action.payload;
        const formIndex = state.forms.findIndex(
            (obj) => Object.keys(obj)[0] === formName
        );
        const newForm = getForm(state.forms, formName);

        for (let i = 0; i < fields.length; i = i + 1) {
            const currentField = fields[i];
            const { value, uid } = currentField;

            // case create new entry
            if (
                (value || typeof value === 'boolean') &&
                !getFieldValue(state.forms, formName, uid)
            ) {
                newForm.push(currentField);
            }

            // case uid already exists
            if (
                currentField.value &&
                getFieldValue(state.forms, formName, currentField.uid)
            ) {
                const index = newForm.findIndex(
                    (obj) => obj.uid === currentField.uid
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
            ],
        };
    },
    DELETE_FORM_FIELD: (state, action) => {
        const { formName, uid } = action.payload;
        const currentForm = getForm(state.forms, formName) || [];
        const newForm = currentForm.filter((field) => field.uid !== uid);
        const formIndex = state.forms.findIndex(
            (obj) => Object.keys(obj)[0] === formName
        );

        return {
            ...state,
            forms: [
                ...state.forms.slice(0, formIndex), // everything before current field
                { ...state.forms[formIndex], ...{ [formName]: newForm } },
                ...state.forms.slice(formIndex + 1), // everything after current field
            ],
        };
    },
    DELETE_FORM_FIELD_LIST: (state, action) => {
        const { formName, uids } = action.payload;
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
            const currentFieldIndex = uids[i];
            const index = currentForm.findIndex(
                (obj) => obj.uid === currentFieldIndex
            );
            indexes.push(index);
        }

        const newForm = currentForm.filter(
            (field, i) => indexes.indexOf(i) === -1
        );

        return {
            ...state,
            forms: [
                ...state.forms.slice(0, formIndex), // everything before current field
                { ...state.forms[formIndex], ...{ [formName]: newForm } },
                ...state.forms.slice(formIndex + 1), // everything after current field
            ],
        };
    },
    UPDATE_CURRENT_FORMNAME: (state, action) => {
        const { formName } = action.payload;

        return {
            ...state,
            formName,
        };
    },
    UPDATE_INDB_STORE_OBJECTS: (state, action) => {
        return { ...state, storeObjects: [...action.payload.storeObjects] };
    },

    UPDATE_DEPARTMENTS: (state, action) => {
        return { ...state, departments: action.payload };
    },
    UPDATE_VALID_SECTION: (state, action) => {
        return {
            ...state,
            validSections: {
                ...state.validSections,
                ...action.payload.section,
            },
        };
    },
    UPDATE_UPDATE_OBJECT_ID: (state, action) => {
        return {
            ...state,
            updateObjectId: action.payload.updateObjectId,
        };
    },
    ADD_SAVING_SECTION: (state, action) => {
        const { section } = action.payload;
        let newSavingsSection = state.savingSections;

        if (state.savingSections.indexOf(section) < 0) {
            newSavingsSection = [...state.savingSections, section];
        }

        return {
            ...state,
            savingSections: newSavingsSection,
        };
    },
    DELETE_SAVING_SECTION: (state, action) => {
        const savingSections = state.savingSections.filter(
            (section) => section !== action.payload.section
        );

        return {
            ...state,
            savingSections,
        };
    },
    CLEAR_FORM: (state, action) => {
        const { formName } = action.payload;

        return {
            ...state,
            forms: [
                ...state.forms.map((form) => {
                    return Object.keys(form)[0] === formName
                        ? { [formName]: [] }
                        : form;
                }),
            ],
        };
    },

    UPDATE_CURRENT_FORM_OBJECT: (state, action) => {
        return {
            ...state,
            currentFormObject: {
                ...action.payload,
                updatedAt: niceDate(action.payload.updatedAt),
                createdAt: niceDate(action.payload.createdAt),
            },
        };
    },
    UPDATE_FORM_DEPENDENCIES: (state, action) => {
        return {
            ...state,
            dependencies: { ...state.dependencies, ...action.payload },
        };
    },

    UPDATE_FIELDS_MODE: (state, action) => {
        return {
            ...state,
            fieldsMode: { ...state.fieldsMode, ...action.payload },
        };
    },

    DELETE_FIELDS_MODE: (state, action) => {
        const fieldsMode = Object.keys(state.fieldsMode).filter(
            (uid) => action.payload.indexOf(uid) < 0
        );

        return {
            ...state,
            fieldsMode,
        };
    },
};

const reducerForm = (state = {}, action) => {
    const handler = actionMap[action.type];

    return handler ? handler(state, action) : state;
};

export default reducerForm;
