import ACTIONS from './Actions';
import DBService from '../services/DBService';
import { removeKey } from '../helpers/utils';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM_FIELD: {
            const { value, dataAtt, name, uid } = action.payload;
            DBService.set({ value: action.payload.value, uid }, name, state.storeObjects.indexOf(name) > -1);
            // TODO install Immutable.js ??
            return {
                ...state,
                forms: {
                    ...state.forms,
                    [name]: { ...state.forms[name], [dataAtt]: value }
                },
            };
        }
        case ACTIONS.DELETE_FORM_FIELD: {
            const { name, uid } = action.payload;
            DBService.delete(uid, name, state.storeObjects.indexOf(name) > -1);
           
            return {
                ...state,
                forms: { ...state.forms, [name]: removeKey(state.forms[name], uid) },
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
        default:
            break;
    }
};
export default reducers;