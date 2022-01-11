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
                user: action.payload,
            };
        }

        case ACTIONS.UPDATE_USER_CONNECTION: {
            return {
                ...state,
                userConnected: action.payload,
            };
        }

        case ACTIONS.UPDATE_ERROR: {
            return {
                ...state,
                error: action.payload,
            };
        }

        case ACTIONS.UPDATE_PRINT_PAGE: {
            return {
                ...state,
                printPage: action.payload,
            };
        }

        case ACTIONS.UPDATE_ACCORDION_SKELETON: {
            return {
                ...state,
                accordionSkeleton: action.payload,
            };
        }

        case ACTIONS.UPDATE_ACCORDION_ITEMS: {
            return {
                ...state,
                accordionItems: action.payload,
            };
        }

        case ACTIONS.UPDATE_MODAL_DETAIL: {
            const { open, content } = action.payload;

            let modalDetail = {
                title: '',
                open: false,
                content: null,
            };

            if (open || content) {
                modalDetail = { ...action.payload, open: true };
            }

            return {
                ...state,
                modalDetail,
            };
        }

        default:
            break;
    }
};

export default reducersPage;
