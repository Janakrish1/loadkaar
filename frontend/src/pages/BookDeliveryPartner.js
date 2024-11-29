/* global google */

import React, { useEffect, useRef, useState } from "react";
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

    const [errors, setErrors] = useState({
        itemDescription: "",
        pickupLocation: "",
        dropLocation: "",
        contactPerson: "",
        contactAddress: "",
        contactPhoneNumber: ""
    });

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  
    const originInputRef = useRef(null);
    const destinationInputRef = useRef(null);


    useEffect(() => {
        if (window.google) {
            const options = { types: ["address"] };
            const autocompleteFromInstance = new window.google.maps.places.Autocomplete(originInputRef.current, options);
            autocompleteFromInstance.addListener("place_changed", () => {
                const place = autocompleteFromInstance.getPlace();
                if (place.geometry) {
                    setOrigin(place.formatted_address);
                }
            });

            const autocompleteToInstance = new window.google.maps.places.Autocomplete(destinationInputRef.current, options);
            autocompleteToInstance.addListener("place_changed", () => {
                const place = autocompleteToInstance.getPlace();
                if (place.geometry) {
                    setDestination(place.formatted_address);
                }
            });
        }
    }, []);


    const validateInput = (name, value) => {
        let errorMessage = "";
        switch (name) {
            case "itemDescription":
                if (value.trim().length === 0) {
                    errorMessage = "Item description is required.";
                } else if (value.length > 500) {
                    errorMessage = "Item description cannot exceed 500 characters.";
                }
                break;
            case "pickupLocation":
                if (value.trim().length === 0) {
                    errorMessage = "Pickup location is required.";
                }
                break;
            case "dropLocation":
                if (value.trim().length === 0) {
                    errorMessage = "Drop location is required.";
                }
                break;
            case "contactPerson":
                if (value.trim().length === 0) {
                    errorMessage = "Contact person's name is required.";
                }
                break;
            case "contactAddress":
                if (value.trim().length === 0) {
                    errorMessage = "Contact address is required.";
                }
                break;
            case "contactPhoneNumber":
                if (!/^[\d+\-\s]*$/.test(value)) {
                    errorMessage = "Phone number can only contain digits, '+', '-' and spaces.";
                } else {
                    errorMessage = ""; // No error if input matches the allowed characters
                }
                break;
            default:
                break;
        }
        return errorMessage;
    };

    const handleInputChange = (event) => {
        console.log(formData);
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        const error = validateInput(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

        console.log(formData);
    };

    const isFormValid = () => {
        return Object.values(errors).every((error) => error === "") &&
            Object.values(formData).every((value) => value.trim() !== "");
    };

    // Function to handle changes and fetch suggestions
    const handleOriginChange = async (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setOrigin(value);

        if (window.google && value) {
            const autocompleteService = new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(
                { input: value, types: ["address"] },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setOriginSuggestions(predictions);
                    }
                }
            );
        } else {
            setOriginSuggestions([]);
        }
    };

    const handleDestinationChange = async (e) => {
        const value = e.target.value;
        setDestination(value);
        const name = e.target.name;
        // setFormData((prevData) => ({...prevData, [name]: value}));

        if (window.google && value) {
            const autocompleteService = new window.google.maps.places.AutocompleteService();
            autocompleteService.getPlacePredictions(
                { input: value, types: ["address"] },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        setDestinationSuggestions(predictions);
                    }
                }
            );
        } else {
            setDestinationSuggestions([]);
        }
    };

    // Handle selecting a suggestion
    const handleSuggestionSelect = (place, field) => {
        setFormData((prevData) => ({ ...prevData, [field]: place.description}));
        if (field === "pickupLocation") {
            setOrigin(place.description);
            setOriginSuggestions([]);
        } else if (field === "dropLocation") {
            setDestination(place.description);
            setDestinationSuggestions([]);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isFormValid()) {
            dispatch(setDeliveryFormData({ ...formData }));
            onClose();
            onFindDeliveryPartner();
        } else {
            if(formData.pickupLocation.length === 0)
                alert("Please select the pickup location.");
            else if(formData.dropLocation.length === 0) 
                alert("Please select the drop location.");
            else 
            alert("Please fill the details!");
        }
    };

    return (
            <div className="popup-overlay">
                <div className="popup-content">
                    <h2>Book Delivery Partner</h2>
                    <form>
                        <label>
                            Vehicle Requested Type:
                            <select
                                onChange={handleInputChange}
                                name="vehicleType"
                                value={formData.vehicleType}
                                required
                            >
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
                                value={formData.itemDescription}
                                required
                            />
                            {errors.itemDescription && <p className="error">{errors.itemDescription}</p>}
                        </label>

                        <label>Pickup Location:</label>
                        <input
                            type="text"
                            ref={originInputRef}
                            value={origin}
                            onChange={handleOriginChange}
                            name="pickupLocation"
                            placeholder="Enter pickup location"
                        />
                        <div className="suggestions">
                            {originSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion.place_id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionSelect(suggestion, "pickupLocation")}
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>

                        <label>Drop Location:</label>
                        <input
                            type="text"
                            ref={destinationInputRef}
                            value={destination}
                            onChange={handleDestinationChange}
                            name="dropLocation"
                            placeholder="Enter drop location"
                        />
                        <div className="suggestions">
                            {destinationSuggestions.map((suggestion) => (
                                <div
                                    key={suggestion.place_id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionSelect(suggestion, "dropLocation")}
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>

                        <h3>Receiver Contact Details</h3>
                        <label>
                            Contact Person:
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="contactPerson"
                                placeholder="Enter contact person's name"
                                value={formData.contactPerson}
                                required
                            />
                            {errors.contactPerson && <p className="error">{errors.contactPerson}</p>}
                        </label>

                        <label>
                            Contact Address:
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="contactAddress"
                                placeholder="Enter contact address"
                                value={formData.contactAddress}
                                required
                            />
                            {errors.contactAddress && <p className="error">{errors.contactAddress}</p>}
                        </label>

                        <label>
                            Contact Phone Number:
                            <input
                                onChange={handleInputChange}
                                onInput={(e) => {
                                    // Allow only digits, `+`, and `-` during input
                                    e.target.value = e.target.value.replace(/[^+\-\d]/g, "");
                                }}
                                type="text"
                                name="contactPhoneNumber"
                                placeholder="Enter contact phone number"
                                value={formData.contactPhoneNumber}
                                required
                            />
                            {errors.contactPhoneNumber && <p className="error">{errors.contactPhoneNumber}</p>}
                        </label>

                        <button onClick={handleSubmit} type="submit">
                            Find Delivery Partner
                        </button>
                    </form>

                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
    );
}

export default BookDeliveryPartner;
