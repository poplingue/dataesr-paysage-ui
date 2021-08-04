import ACTIONS from './Actions';

const reducers = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_FORM:
            const { value, dataAtt } = action.payload;
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