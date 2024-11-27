import { createSlice } from "@reduxjs/toolkit";

const deliveryPartnerViewSlice = createSlice({
    name: 'deliveryPartnerView',
    initialState: {
        currentView: "default",
    },
    reducers: {
        setDeliveryPartnerView: (state, action) => {
            state.currentView = action.payload.currentView;
        },

        clearDeliveryPartnerView: (state) => {
            state.currentView = "default";
        },
    },
});

export const { setDeliveryPartnerView, clearDeliveryPartnerView } = deliveryPartnerViewSlice.actions;
export default deliveryPartnerViewSlice.reducer;