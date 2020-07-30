import React from 'react';
import ReactDOM from 'react-dom';

// 2 imports for persistent storage (omit if not using redux-persist)
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { Provider } from 'react-redux';
import { configureStore } from './store.js';
import App from './App.js';

/*
The remainder of this file is configured for persistent local storage.
Omit (and see below) if not using redux-persist.
*/
const store = configureStore();
const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate
            loading={<div>Loading...</div>}
            persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);
