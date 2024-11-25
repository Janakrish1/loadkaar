import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './redux/store'; // Adjust the import path to your store

import "./styles/styles.css"; // Import common styles
import App from "./App";


ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>
    ,
    document.getElementById("root")
);
