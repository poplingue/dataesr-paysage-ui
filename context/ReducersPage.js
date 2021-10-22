import ACTIONS from './Actions';

const reducersPage = (state, action) => {
    switch (action.type) {

        case ACTIONS.UPDATE_COLOR_THEME: {
            return { ...state, pageTheme: action.payload };
        }

        default:
            break;
    }
};

export default reducersPage;
