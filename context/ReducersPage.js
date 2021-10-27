import ACTIONS from './Actions';

const reducersPage = (state, action) => {
    switch (action.type) {

        case ACTIONS.UPDATE_COLOR_THEME: {
            return { ...state, pageTheme: action.payload };
        }

        case ACTIONS.UPDATE_SIDE_NAVIGATION_MODE: {
            return { ...state, sideMode: state.sideMode === 'on' ? 'off' : 'on' };
        }

        case ACTIONS.UPDATE_HAS_BREADCRUMBS: {
            return { ...state, hasBreadCrumbs: !state.hasBreadCrumbs };
        }

        default:
            break;
    }
};

export default reducersPage;
