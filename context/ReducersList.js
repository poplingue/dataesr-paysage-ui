import ACTIONS from './Actions';

// TODO Use object instead of switch inside the reducer
const reducersList = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_SELECTION: {
            // exists => remove element from state.selectionToExport
            // does not exists => add to state.selectionToExport
            return { ...state, selectionToExport: action.payload };
        }

        case ACTIONS.UPDATE_EXPORT_MODE: {
            return { ...state, exportMode: !state.exportMode };
        }

        default:
            break;
    }
};

export default reducersList;
