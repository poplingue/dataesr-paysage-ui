const actionMap = {
    UPDATE_SELECTION: (state, action) => {
        return { ...state, selectionToExport: action.payload };
    },
    UPDATE_EXPORT_MODE: (state) => {
        return { ...state, exportMode: !state.exportMode };
    },
};

const reducerList = (state, action) => {
    const handler = actionMap[action.type];

    return handler ? handler(state, action) : state;
};

export default reducerList;
