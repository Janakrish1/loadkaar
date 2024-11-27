import React, { useState } from "react";
import "../styles/BookDeliveryPartner.css";
import axios from "axios";
import { useSelector } from "react-redux";

function BookDeliveryPartner({ onClose, onFindDeliveryPartner }) {
    const { email, password } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        vehicleType: "2wheeler",
        itemDescription: "",
        pickupLocation: "",
        dropLocation: "",
        contactDetails: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (email && password && formData.vehicleType && formData.itemDescription && formData.pickupLocation && formData.dropLocation && formData.contactDetails) {
            try {
                const response = await axios.post("http://localhost:5001/api/saveTaskDetails", {
                    email: email,
                    password: password,
                    vehicleType: formData.vehicleType,
                    itemDescription: formData.itemDescription,
                    pickupLocation: formData.pickupLocation,
                    dropLocation: formData.dropLocation,
                    contactDetails: formData.contactDetails,
                });
                
            } catch (error) {
                alert(error.response?.data?.error || "An error occurred during login.");
            }
        }
        else {
            alert("Please fill all the details!");
        }


    }

    const handleFindDeliveryPartner = (event) => {
        event.preventDefault(); // Prevent form submission
        onClose(); // Close the popup
        onFindDeliveryPartner(); // Trigger the navigation or load another component
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Book Delivery Partner</h2>
                <form>
                    <label>
                        Vehicle Requested Type:
                        <select onChange={handleInputChange} name="vehicleType" required >
                            <option value="2wheeler">2 Wheeler</option>
                            <option value="3wheeler">3 Wheeler</option>
                            <option value="4wheeler">4 Wheeler</option>
                            <option value="truck">Truck</option>
                        </select>
                    </label>

                    <label>
                        Item to be Delivered:
                        <textarea onChange={handleInputChange}
                            name="itemDescription"
                            maxLength="500"
                            placeholder="Enter item description (max 500 characters)"
                            required
                        />
                    </label>

                    <label>
                        Pickup Location:
                        <input onChange={handleInputChange} type="text" name="pickupLocation" placeholder="Enter pickup location" required />
                    </label>

                    <label>
                        Drop Location:
                        <input onChange={handleInputChange} type="text" name="dropLocation" placeholder="Enter drop location" required />
                    </label>

                    <label>
                        Receiver Contact Details:
                        <input onChange={handleInputChange} type="text" name="contactDetails" placeholder="Enter contact details" required />
                    </label>

                    <button onClick={handleSubmit} type="submit"> Find Delivery Partner</button>
                </form>

                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default BookDeliveryPartner;
