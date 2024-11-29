import React, { useState } from "react";
import "../styles/BookDeliveryPartner.css";
import { useDispatch } from "react-redux";
import { setDeliveryFormData } from "../redux/deliveryPartnerViewSlice";

function BookDeliveryPartner({ onClose, onFindDeliveryPartner }) {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        vehicleType: "2wheeler",
        itemDescription: "",
        pickupLocation: "",
        dropLocation: "",
        contactPerson: "",
        contactAddress: "",
        contactPhoneNumber: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.vehicleType && formData.itemDescription && formData.pickupLocation && formData.dropLocation && formData.contactPerson && formData.contactAddress && formData.contactPhoneNumber) {
            dispatch(setDeliveryFormData({...formData}));
            onClose();
            onFindDeliveryPartner();
        }
        else {
            alert("Please fill all the details!");
        }


    }

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Book Delivery Partner</h2>
                <form>
                    <label>
                        Vehicle Requested Type:
                        <select onChange={handleInputChange} name="vehicleType" required>
                            <option value="2wheeler">2 Wheeler</option>
                            <option value="3wheeler">3 Wheeler</option>
                            <option value="4wheeler">4 Wheeler</option>
                            <option value="truck">Truck</option>
                        </select>
                    </label>
    
                    <label>
                        Item to be Delivered:
                        <textarea
                            onChange={handleInputChange}
                            name="itemDescription"
                            maxLength="500"
                            placeholder="Enter item description (max 500 characters)"
                            required
                        />
                    </label>
    
                    <label>
                        Pickup Location:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="pickupLocation"
                            placeholder="Enter pickup location"
                            required
                        />
                    </label>
    
                    <label>
                        Drop Location:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="dropLocation"
                            placeholder="Enter drop location"
                            required
                        />
                    </label>
    
                    <h3>Receiver Contact Details</h3>
                    <label>
                        Contact Person:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="contactPerson"
                            placeholder="Enter contact person's name"
                            required
                        />
                    </label>
    
                    <label>
                        Contact Address:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="contactAddress"
                            placeholder="Enter contact address"
                            required
                        />
                    </label>
    
                    <label>
                        Contact Phone Number:
                        <input
                            onChange={handleInputChange}
                            type="text"
                            name="contactPhoneNumber"
                            placeholder="Enter contact phone number"
                            required
                        />
                    </label>
    
                    <button onClick={handleSubmit} type="submit">Find Delivery Partner</button>
                </form>
    
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}
export default BookDeliveryPartner;
