import React, { useEffect, useState } from 'react';
import '../styles/PaymentCheckout.css';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import logo from '../assets/logo.jpeg';

const PaymentCheckout = () => {
    const location = useLocation();
    const { userID } = useSelector((state) => state.user);
    const { selectedDriver } = location.state || {};
    console.log(selectedDriver);
    console.log("User = ", userID);
    const [userDetails, setUserDetails] = useState({ FName: "", LName: "", Email: "" });

    const { ...deliveryFormData } = useSelector((state) => (state.deliveryPartnerView));

    useEffect(() => {
        if (userID) {
            console.log(userID);
            fetchDetails();
        }
    }, [userID]);

    const [paymentData, setPaymentData] = useState({
        user_id: userID,
        employee_name: selectedDriver.name,
        employee_id: selectedDriver.id,
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
    });

    const handlePaymentSuccess = async () => {
        console.log(paymentResponse.razorpay_payment_id);
        console.log("Delivery Form Data:", deliveryFormData.formData);
        console.log("User Details: ", userDetails.FName, userDetails.LName, userDetails.Email);
        console.log("Payment Details: ", paymentData.employee_name, paymentData.amount);
    }

    const [paymentResponse, setPaymentResponse] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const handlePayment = async () => {
        // Validation check to ensure all required fields are filled
        if (!userDetails.FName || !userDetails.LName || !paymentData.employee_name || !paymentData.amount) {
            alert("Please fill in all required fields!");
            return;
        }
        

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Failed to load Razorpay SDK. Please check your internet connection.");
            return;
        }

        const options = {
            key: "rzp_test_LpesfJag0kjwF6", // Replace with your Razorpay Key ID
            amount: paymentData.amount * 100, // Amount in paisa
            currency: "INR",
            name: "LoadKaar",
            description: `Invoice: ${deliveryFormData.formData.itemDescription}`,
            handler: (response) => {
                setPaymentResponse(response);
                setTransactionStatus('success');
            },
            prefill: {
                name: paymentData.employee_name,
                contactPerson: deliveryFormData.formData.contactPerson,
                contactAddress: deliveryFormData.formData.contactAddress,
                contactPhoneNumber: deliveryFormData.formData.contactPhoneNumber
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', (response) => {
            setPaymentResponse(response.error);
            setTransactionStatus('failure');
        });
    };

    if (transactionStatus === 'success' || transactionStatus === 'failure') {
        return (
            <div className="payment-checkout">
                <h2>{transactionStatus === 'success' ? 'Payment Successful!' : 'Payment Failed!'}</h2>
                <div className="payment-response">
                    {transactionStatus === 'success' ? (
                        <>
                        {handlePaymentSuccess()}
                        </>
                    ) : (
                        <>
                            <p><strong>Error Code:</strong> {paymentResponse.code}</p>
                            <p><strong>Description:</strong> {paymentResponse.description}</p>
                            <p><strong>Source:</strong> {paymentResponse.source}</p>
                            <p><strong>Step:</strong> {paymentResponse.step}</p>
                            <p><strong>Reason:</strong> {paymentResponse.reason}</p>
                        </>
                    )}
                </div>
                <button onClick={() => setTransactionStatus(null)}>Back to Checkout</button>
            </div>
        );
    }

    const fetchDetails = async () => {
        try {
            const response = await axios.post("http://localhost:5001/api/get-username", { userID });
            setUserDetails({
                FName: response.data.FName,
                LName: response.data.LName,
                Email: response.data.Email
            });
        } catch (err) {
            console.error("Error fetching user details:", err);
        }
    };

    return (

        <div className="payment-checkout">
            <header className="header">
                <div className="logo-container">
                    <img src={logo} alt="LoadKaar Logo" className="logo" />
                </div>
                <h1 className="website-name">LoadKaar</h1>
            </header>
            <h2>Payment Checkout</h2>
            <form>
                <button type="button" onClick={handlePayment}>
                    Pay Now
                </button>
                <label>
                    Your Name:
                    <input type="text" name="employer_name" value={`${userDetails.FName} ${userDetails.LName}`} className='readonly' readOnly />
                </label>
                <label>
                    Driver Name:
                    <input type="text" name="employee_name" value={paymentData.employee_name} className='readonly' readOnly />
                </label>
                <label>
                    Vehicle Type:
                    <input type="text" name="vehicleType" value={deliveryFormData.formData.vehicleType} className='readonly' readOnly />
                </label>
                <label>
                    Item Description:
                    <input type="text" name="itemDescription" value={deliveryFormData.formData.itemDescription} className='readonly' readOnly />
                </label>
                <label>
                    Pickup Location:
                    <input type="text" name="pickupLocation" value={deliveryFormData.formData.pickupLocation} className='readonly' readOnly />
                </label>
                <label>
                    Drop Location:
                    <input type="text" name="dropLocation" value={deliveryFormData.formData.dropLocation} className='readonly' readOnly />
                </label>
                <label>
                    Contact Person:
                    <input type="text" name="contactPerson" value={deliveryFormData.formData.contactPerson} className='readonly' readOnly />
                </label>
                <label>
                    Contact Person:
                    <input type="text" name="contactAddress" value={deliveryFormData.formData.contactAddress} className='readonly' readOnly />
                </label>
                <label>
                    Contact Phone number:
                    <input type="text" name="contactPhoneNumber" value={deliveryFormData.formData.contactPhoneNumber} className='readonly' readOnly />
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={paymentData.amount} onChange={handleChange} required />
                </label>
            </form>
        </div>
    );
};

export default PaymentCheckout;
