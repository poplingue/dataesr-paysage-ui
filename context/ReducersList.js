import ACTIONS from './Actions';

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

        case ACTIONS.UPDATE_SIDE_NAVIGATION_MODE: {
            return { ...state, sideMode: !state.sideMode };
        }

        default:
            break;
    }
};

export default reducersList;