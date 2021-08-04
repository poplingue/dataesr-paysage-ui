import ACTIONS from './Actions';
import DBService from '../services/DBService';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM:
            const { value, dataAtt, name, uid } = action.payload;
            // const db = window.indexedDB.open('SERVICE_FORMS', 2);
            // const db = DBService.getDB().then(() => {
            //     db.onsuccess = (event) => {
                    DBService.set( { value: action.payload.value, uid }, name);
                // };
            // });
            // TODO install Immutable.js ??
            return {
                ...state,
                forms: {
                    ...state.forms,
                    person: { ...state.forms.person, [dataAtt]: value }
                },
            };
        default:
            break;
    }
};
export default reducers;