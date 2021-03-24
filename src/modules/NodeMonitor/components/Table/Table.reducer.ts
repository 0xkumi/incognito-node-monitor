import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { ITableReducer } from './Table.interface';
import {
    ACTION_CHANGE_LIMIT_PAGE,
    ACTION_CHANGE_ROWS_PER_PAGE,
    ACTION_CHANGE_PAGE,
    ACTION_UPDATE_TABLE_DATA,
    ACTION_FETCHING_TABLE_DATA,
} from './Table.actionsName';
import { DEFAULT_LIMIT_ROWS } from './Table.constants'; // defaults to localStorage for web

const initialState: ITableReducer = {
    currentPage: 0,
    rowsPerPage: DEFAULT_LIMIT_ROWS,
    limitPage: 0,
    data: [],
    fetching: false,
};

const tableReducer = (
    state = initialState,
    action: {
        type: string;
        payload: any;
    },
) => {
    switch (action.type) {
        case ACTION_CHANGE_PAGE: {
            const { page } = action.payload;
            return {
                ...state,
                currentPage: page,
            };
        }
        case ACTION_CHANGE_LIMIT_PAGE: {
            const { limitPage } = action.payload;
            return {
                ...state,
                limitPage,
            };
        }
        case ACTION_CHANGE_ROWS_PER_PAGE: {
            const { rowsPerPage } = action.payload;
            return {
                ...state,
                rowsPerPage,
            };
        }
        case ACTION_UPDATE_TABLE_DATA: {
            return {
                ...state,
                ...action.payload,
            };
        }
        case ACTION_FETCHING_TABLE_DATA: {
            const { fetching } = action.payload;
            return {
                ...state,
                fetching,
            };
        }
        default:
            return state;
    }
};

const persistConfig = {
    key: 'tableNodeMonitor',
    storage,
    whitelist: ['storage'],
    stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, tableReducer);
