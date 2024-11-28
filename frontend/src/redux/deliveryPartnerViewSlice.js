import { createSlice } from "@reduxjs/toolkit";

const deliveryPartnerViewSlice = createSlice({
    name: 'deliveryPartnerView',
    initialState: {
        currentView: "default",
        activeMenu: "Current Orders",
    },
    reducers: {
        setDeliveryPartnerView: (state, action) => {
            state.currentView = typeof action.payload === "string" ? action.payload : action.payload.currentView;
            state.activeMenu = typeof action.payload === "string" ? action.payload : action.payload.activeMenu;
        },

        clearDeliveryPartnerView: (state) => {
            state.currentView = "default";
            state.activeMenu = "Current Orders";
        },
        getCurrentView: (state) => {
            return state.currentView;
        },
    },
});

export const { setDeliveryPartnerView, clearDeliveryPartnerView, getCurrentView } = deliveryPartnerViewSlice.actions;
export default deliveryPartnerViewSlice.reducer;
