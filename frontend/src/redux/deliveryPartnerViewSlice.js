import { createSlice } from "@reduxjs/toolkit";

const deliveryPartnerViewSlice = createSlice({
    name: 'deliveryPartnerView',
    initialState: {
        currentView: "default",
        activeMenu: "Current Orders",
        deliveryForm: {
            vehicleType: "2wheeler",
            itemDescription: "",
            pickupLocation: "",
            dropLocation: "",
            contactPerson: "",
            contactAddress: "",
            contactPhoneNumber: "",
            distance: null,
            duration: null,
        },
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
        setDeliveryFormData: (state, action) => {
            const {
                vehicleType,
                itemDescription,
                pickupLocation,
                dropLocation,
                contactPerson,
                contactAddress,
                contactPhoneNumber,
                distance,
                duration
            } = action.payload;

            if (vehicleType && itemDescription && pickupLocation && dropLocation && contactPerson && contactAddress && contactPhoneNumber && distance && duration) {
                state.deliveryForm = {
                    vehicleType,
                    itemDescription,
                    pickupLocation,
                    dropLocation,
                    contactPerson,
                    contactAddress,
                    contactPhoneNumber,
                    distance,
                    duration
                };
            }
        },
        clearDeliveryFormData: (state) => {
            state.deliveryForm = {
                vehicleType: "2wheeler",
                itemDescription: "",
                pickupLocation: "",
                dropLocation: "",
                contactPerson: "",
                contactAddress: "",
                contactPhoneNumber: "",
                distance: null,
                duration: null,
            };
        },
    },
});



export const { 
    setDeliveryPartnerView, 
    clearDeliveryPartnerView, 
    getCurrentView,
    setDeliveryFormData,
    clearDeliveryFormData
} = deliveryPartnerViewSlice.actions;

export default deliveryPartnerViewSlice.reducer;
