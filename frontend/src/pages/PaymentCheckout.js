import React, { useEffect, useState } from 'react';
import '../styles/PaymentCheckout.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import logo from '../assets/logo.jpeg';
import { clearDeliveryFormData, clearDeliveryPartnerView } from "../redux/deliveryPartnerViewSlice";

const PaymentCheckout = () => {
    const location = useLocation();
    const { userID } = useSelector((state) => state.user);
    const { selectedDriver } = location.state || {};
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({ FName: '', LName: '', Email: '' });
    const [paymentResponse, setPaymentResponse] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState('');
    const deliveryFormData = useSelector((state) => state.deliveryPartnerView.formData || {});
    const dispatch = useDispatch();

    const [paymentData, setPaymentData] = useState({
        user_id: userID,
        employee_name: selectedDriver?.name || '',
        employee_id: selectedDriver?.id || '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
    });

    // Fetch user details when userID changes
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.post("http://localhost:5001/api/get-username", { userID });
                setUserDetails({
                    FName: response.data.FName,
                    LName: response.data.LName,
                    Email: response.data.Email,
                });
            } catch (err) {
                console.error("Error fetching user details:", err);
            }
        };

        if (userID) {
            fetchDetails();
        }
    }, [userID]);

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

    const handlePaymentSuccess = () => {
        console.log("Payment Success:", paymentResponse);
        console.log("Delivery Form Data:", deliveryFormData);
        console.log("User Details:", userDetails);
        console.log("Payment Data:", paymentData);
        

        dispatch(clearDeliveryFormData());
        dispatch(clearDeliveryPartnerView());
        setTimeout(() => {
        }, 2000); // 2000 milliseconds = 2 seconds
        navigate('/employer-home');
    };

    const handlePayment = async () => {
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
            key: "rzp_test_LpesfJag0kjwF6",
            amount: paymentData.amount * 100, // Amount in paisa
            currency: "INR",
            name: "LoadKaar",
            description: `Invoice: ${deliveryFormData.itemDescription}`,
            handler: (response) => {
                setPaymentResponse(response);
                setTransactionStatus('success');
            },
            prefill: {
                name: paymentData.employee_name,
                contact: deliveryFormData.contactPhoneNumber,
                email: userDetails.Email,
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

    useEffect(() => {
        if (transactionStatus === 'success') {
            handlePaymentSuccess();
        }
    }, [transactionStatus]);

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
                    <input type="text" value={`${userDetails.FName} ${userDetails.LName}`} className="readonly" readOnly />
                </label>
                <label>
                    Driver Name:
                    <input type="text" value={paymentData.employee_name} className="readonly" readOnly />
                </label>
                <label>
                    Vehicle Type:
                    <input type="text" value={deliveryFormData.vehicleType} className="readonly" readOnly />
                </label>
                <label>
                    Item Description:
                    <input type="text" value={deliveryFormData.itemDescription} className="readonly" readOnly />
                </label>
                <label>
                    Pickup Location:
                    <input type="text" value={deliveryFormData.pickupLocation} className="readonly" readOnly />
                </label>
                <label>
                    Drop Location:
                    <input type="text" value={deliveryFormData.dropLocation} className="readonly" readOnly />
                </label>
                <label>
                    Contact Person:
                    <input type="text" value={deliveryFormData.contactPerson} className="readonly" readOnly />
                </label>
                <label>
                    Contact Address:
                    <input type="text" value={deliveryFormData.contactAddress} className="readonly" readOnly />
                </label>
                <label>
                    Contact Phone Number:
                    <input type="text" value={deliveryFormData.contactPhoneNumber} className="readonly" readOnly />
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={paymentData.amount} onChange={handleChange} required />
                </label>
            </form>

            {transactionStatus === 'failure' && (
                <div className="payment-response">
                    <h2>Payment Failed!</h2>
                    <p><strong>Error Code:</strong> {paymentResponse?.code}</p>
                    <p><strong>Description:</strong> {paymentResponse?.description}</p>
                    <p><strong>Source:</strong> {paymentResponse?.source}</p>
                    <p><strong>Step:</strong> {paymentResponse?.step}</p>
                    <p><strong>Reason:</strong> {paymentResponse?.reason}</p>
                    <button onClick={() => setTransactionStatus('')}>Back to Checkout</button>
                </div>
            )}
        </div>
    );
};

export default PaymentCheckout;
