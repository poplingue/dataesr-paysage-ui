import ObjectService from '../services/Object.service';

const actionMap = {
    UPDATE_COLOR_THEME: (state, action) => {
        return { ...state, pageTheme: action.payload };
    },
    UPDATE_SIDE_NAVIGATION_MODE: (state, action) => {
        return { ...state, sideMode: action.payload.sideMode };
    },
    UPDATE_HAS_BREADCRUMBS: (state) => {
        return { ...state, hasBreadCrumbs: !state.hasBreadCrumbs };
    },
    UPDATE_USER: (state, action) => {
        const proxy = new Proxy(action.payload, ObjectService.handlerUser());

        return {
            ...state,
            user: proxy,
        };
    },
    UPDATE_ERROR: (state, action) => {
        return {
            ...state,
            error: action.payload,
        };
    },
    UPDATE_PRINT_PAGE: (state, action) => {
        return {
            ...state,
            printPage: action.payload,
        };
    },

    UPDATE_ACCORDION_SKELETON: (state, action) => {
        return {
            ...state,
            accordionSkeleton: action.payload,
        };
    },
    UPDATE_ACCORDION_ITEMS: (state, action) => {
        return {
            ...state,
            accordionItems: action.payload,
        };
    },

    UPDATE_MODAL_DETAIL: (state, action) => {
        const { open, content } = action.payload;

        let modalDetail = {
            title: '',
            open: false,
            footer: null,
            content: null,
        };

        if (open || content) {
            modalDetail = { ...action.payload, open: true };
        }

        return {
            ...state,
            modalDetail,
        };
    },

    UPDATE_TABLE_DATA: (state, action) => {
        const tableData = action.payload.map((d, index) => {
            return { ...d, index };
        });

        return {
            ...state,
            tableData,
        };
    },

    UPDATE_CURRENT_PAGE_OBJECT: (state, action) => {
        return {
            ...state,
            currentPageObject: action.payload,
        };
    },

    UPDATE_IDENTIFIERS_OBJECT: (state, action) => {
        return {
            ...state,
            identifiers: action.payload,
        };
    },

    UPDATE_WEBLINKS_OBJECT: (state, action) => {
        return {
            ...state,
            weblinks: action.payload,
        };
    },
};

const reducerPage = (state, action) => {
    const handler = actionMap[action.type];

    return handler ? handler(state, action) : state;
};

export default reducerPage;
