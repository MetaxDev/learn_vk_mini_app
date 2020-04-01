import {
    SET_PAGE,
    GO_BACK,
    SET_STORY
} from './actionTypes';

import * as VK from "../../services/VK";
import {smoothScrollToTop} from "../../services/_functions";

const initialState = {
    activeStory: null,
    activeView: null,
    activePanel: null,

    content: null,

    storiesHistory: [],
    viewsHistory: [],
    panelsHistory: [],

    scrollPosition: []
};

export const routerReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_PAGE: {
            let View = action.payload.view;
            let Panel = action.payload.panel;
            let content = action.payload.content;

            window.history.pushState(null, null);

            let panelsHistory = state.panelsHistory[View] || [];
            let viewsHistory = state.viewsHistory[state.activeStory] || [];

            const viewIndexInHistory = viewsHistory.indexOf(View);

            if (viewIndexInHistory !== -1) {
                viewsHistory.splice(viewIndexInHistory, 1);
            }

            if (panelsHistory.indexOf(Panel) === -1) {
                panelsHistory = [...panelsHistory, Panel];
            }

            if (panelsHistory.length > 1) {
                VK.swipeBackOn();
            }

            return {
                ...state,
                content: content,
                activeView: View,
                activePanel: Panel,


                panelsHistory: {
                    ...state.panelsHistory,
                    [View]: panelsHistory,
                },
                viewsHistory: {
                    ...state.viewsHistory,
                    [state.activeStory]: [...viewsHistory, View]
                },
                scrollPosition: {
                    ...state.scrollPosition,
                    [state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
                }
            };
        }

        case SET_STORY: {
            window.history.pushState(null, null);

            let viewsHistory = state.viewsHistory[action.payload.story] || [action.payload.story];

            let storiesHistory = state.storiesHistory;
            let activeView = viewsHistory[viewsHistory.length - 1];
            let panelsHistory = state.panelsHistory[activeView] || [action.payload.initial_panel];
            let activePanel = panelsHistory[panelsHistory.length - 1];

            if (action.payload.story === state.activeStory) {
                if (panelsHistory.length > 1) {
                    let firstPanel = panelsHistory.shift();
                    panelsHistory = [firstPanel];

                    activePanel = panelsHistory[panelsHistory.length - 1];
                } else if (viewsHistory.length > 1) {
                    let firstView = viewsHistory.shift();
                    viewsHistory = [firstView];

                    activeView = viewsHistory[viewsHistory.length - 1];
                    panelsHistory = state.panelsHistory[activeView];
                    activePanel = panelsHistory[panelsHistory.length - 1];
                }
            }

            if (action.payload.story === state.activeStory && panelsHistory.length === 1 && window.pageYOffset > 0) {
                window.scrollTo(0, 30);

                smoothScrollToTop();
            }

            const storiesIndexInHistory = storiesHistory.indexOf(action.payload.story);

            if (storiesIndexInHistory === -1 || (storiesHistory[0] === action.payload.story && storiesHistory[storiesHistory.length - 1] !== action.payload.story)) {
                storiesHistory = [...storiesHistory, action.payload.story];
            }

            return {
                ...state,
                activeStory: action.payload.story,
                activeView: activeView,
                activePanel: activePanel,

                storiesHistory: storiesHistory,
                viewsHistory: {
                    ...state.viewsHistory,
                    [activeView]: viewsHistory
                },
                panelsHistory: {
                    ...state.panelsHistory,
                    [activeView]: panelsHistory
                },

                scrollPosition: {
                    ...state.scrollPosition,
                    [state.activeStory + "_" + state.activeView + "_" + state.activePanel]: window.pageYOffset
                }
            };
        }

        case GO_BACK: {
            let setView = state.activeView;
            let setPanel = state.activePanel;
            let setStory = state.activeStory;
            let content = action.payload.content;

            let panelsHistory = state.panelsHistory[setView] || [];
            let viewsHistory = state.viewsHistory[state.activeStory] || [];
            let storiesHistory = state.storiesHistory;

            if (panelsHistory.length > 1) {
                panelsHistory.pop();

                setPanel = panelsHistory[panelsHistory.length - 1];
            } else if (viewsHistory.length > 1) {
                viewsHistory.pop();

                setView = viewsHistory[viewsHistory.length - 1];
                let panelsHistoryNew = state.panelsHistory[setView];

                setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
            } else if (storiesHistory.length > 1) {
                storiesHistory.pop();

                setStory = storiesHistory[storiesHistory.length - 1];
                setView = state.viewsHistory[setStory][state.viewsHistory[setStory].length - 1];

                let panelsHistoryNew = state.panelsHistory[setView];

                if (panelsHistoryNew.length > 1) {
                    setPanel = panelsHistoryNew[panelsHistoryNew.length - 1];
                } else {
                    setPanel = panelsHistoryNew[0];
                }
            } else {
                VK.closeApp();
            }

            if (panelsHistory.length === 1) {
                VK.swipeBackOff();
            }

            return {
                ...state,
                content: content,
                activeView: setView,
                activePanel: setPanel,
                activeStory: setStory,

                viewsHistory: {
                    ...state.viewsHistory,
                    [state.activeView]: viewsHistory
                },
                panelsHistory: {
                    ...state.panelsHistory,
                    [state.activeView]: panelsHistory
                }
            };
        }


        default: {
            return state;
        }
    }
};
