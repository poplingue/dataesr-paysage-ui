import ACTIONS from './Actions';
import DBService from '../services/DBService';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM:
            const { value, dataAtt, name, uid } = action.payload;
            DBService.set({ value: action.payload.value, uid }, name);
            // TODO install Immutable.js ??
            return {
                ...state,
                forms: {
                    ...state.forms,
                    person: { ...state.forms.person, [dataAtt]: value }
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