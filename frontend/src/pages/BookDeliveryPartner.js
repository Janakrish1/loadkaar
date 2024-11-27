import React from "react";
import "../styles/BookDeliveryPartner.css";

function BookDeliveryPartner({ onClose, onFindDeliveryPartner }) {
    const handleFindDeliveryPartner = (event) => {
        event.preventDefault(); // Prevent form submission
        onClose(); // Close the popup
        onFindDeliveryPartner(); // Trigger the navigation or load another component
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Book Delivery Partner</h2>
                <form onSubmit={handleFindDeliveryPartner}>
                    <label>
                        Vehicle Requested Type:
                        <select name="vehicleType">
                            <option value="2wheeler">2 Wheeler</option>
                            <option value="3wheeler">3 Wheeler</option>
                            <option value="4wheeler">4 Wheeler</option>
                            <option value="truck">Truck</option>
                        </select>
                    </label>

                    <label>
                        Item to be Delivered:
                        <textarea 
                            name="itemDescription" 
                            maxLength="500" 
                            placeholder="Enter item description (max 500 characters)" 
                        />
                    </label>

                    <label>
                        Pickup Location:
                        <input type="text" name="pickupLocation" placeholder="Enter pickup location" />
                    </label>

                    <label>
                        Drop Location:
                        <input type="text" name="dropLocation" placeholder="Enter drop location" />
                    </label>

                    <label>
                        Receiver Contact Details:
                        <input type="text" name="contactDetails" placeholder="Enter contact details" />
                    </label>

                    <button on type="submit"> Find Delivery Partner</button>
                </form>

                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default BookDeliveryPartner;
