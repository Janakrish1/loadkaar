import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from './userSlice';
import deliveryPartnerReducer from './deliveryPartnerViewSlice';

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer, // Key "user" aligns with userSlice
    deliveryPartnerView: deliveryPartnerReducer,
});

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable the serializable check
      }),
  });

export const persistor = persistStore(store);
export default store;
