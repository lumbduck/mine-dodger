import { createStore, combineReducers, applyMiddleware } from 'redux';

// 3 imports for persistence storage
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// reducer
import { game } from './game/reducers';

const reducers = {
    game,
};

/*
The remainder of this file is configured for persistent local storage.
It will merge the redux store 2 levels deep (based on autoMergeLevel2)
*/
const persistConfig = {
    key: 'root',
    storage,  // defaults to local storage
    stateReconciler: autoMergeLevel2,
}

const rootReducer = combineReducers(reducers);
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = () => createStore(
    persistedReducer,
    // run the Redux Devtools extension in the browser, if available
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
);
