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
                contactPhoneNumber
            } = action.payload;

            if (vehicleType && itemDescription && pickupLocation && dropLocation && contactPerson && contactAddress && contactPhoneNumber) {
                state.formData = {
                    vehicleType,
                    itemDescription,
                    pickupLocation,
                    dropLocation,
                    contactPerson,
                    contactAddress,
                    contactPhoneNumber,
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
