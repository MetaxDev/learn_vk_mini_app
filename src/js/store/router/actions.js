import {SET_PAGE, SET_STORY, GO_BACK} from './actionTypes';

export const setStory = (story, initial_panel) => (
    {
        type: SET_STORY,
        payload: {
            story: story,
            initial_panel: initial_panel,
        }
    }
);

export const setPage = (view, panel, content) => (
    {
        type: SET_PAGE,
        payload: {
            view: view,
            panel: panel,
            content: content
        }
    }
);

export const goBack = (content) => (
    {
        type: GO_BACK,
        payload: {
            content: content
        }
    }
);