import ACTIONS from './Actions';
import DBService from '../services/DBService';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM:
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
        case ACTIONS.UPDATE_CURRENT_OBJECT_STORE:
            return {
                ...state,
                objectStoreName: action.payload.objectStoreName
            };
        case ACTIONS.UPDATE_INDB_STORE_OBJECTS:
            return { ...state, storeObjects: [...action.payload.storeObjects] };
        default:
            break;
    }
};
export default reducers;