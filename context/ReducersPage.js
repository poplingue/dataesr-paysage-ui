import ACTIONS from './Actions';

const reducersPage = (state, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_COLOR_THEME: {
            return { ...state, pageTheme: action.payload };
        }

        case ACTIONS.UPDATE_SIDE_NAVIGATION_MODE: {
            return { ...state, sideMode: action.payload.sideMode };
        }

        case ACTIONS.UPDATE_HAS_BREADCRUMBS: {
            return { ...state, hasBreadCrumbs: !state.hasBreadCrumbs };
        }

        case ACTIONS.UPDATE_USER: {
            return {
                ...state,
                user: action.payload.user,
            };
        }

        case ACTIONS.UPDATE_USER_CONNECTION: {
            return {
                ...state,
                userConnected: action.payload.userConnected,
            };
        }

        case ACTIONS.UPDATE_ERROR: {
            return {
                ...state,
                error: action.payload.error,
            };
        }

        case ACTIONS.UPDATE_PRINT_PAGE: {
            return {
                ...state,
                printPage: action.payload.printPage,
            };
        }

        case ACTIONS.UPDATE_ACCORDION_SKELETON: {
            return {
                ...state,
                accordionSkeleton: action.payload.accordionSkeleton,
            };
        }

        case ACTIONS.UPDATE_ACCORDION_SECTIONS: {
            return {
                ...state,
                accordionSections: action.payload.accordionSections,
            };
        }

        default:
            break;
    }
};

export default reducersPage;
