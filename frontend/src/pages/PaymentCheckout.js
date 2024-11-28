import React, { useEffect, useState } from 'react';
import '../styles/PaymentCheckout.css';
import { useLocation } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import logo from '../assets/logo.jpeg';

const PaymentCheckout = () => {
    const location = useLocation();
    const { userID } = useSelector((state) => state.user);
    const { selectedDriver } = location.state || {};
    console.log(selectedDriver);
    console.log("User = ", userID);
    const [userDetails, setUserDetails] = useState({ FName: "", LName: "" });
    const dispatch = useDispatch();

    const { ...deliveryFormData } = useSelector((state) => (state.deliveryPartnerView)); 

    useEffect(() => {
        if (userID) {
            console.log(userID);
            fetchDetails();
        }
    }, [userID]);

    const [paymentData, setPaymentData] = useState({
        // payment_id: '',
        user_id: userID,
        employee_name: selectedDriver.name,
        employee_id: selectedDriver.id,
        amount: '',
        // payment_date: new Date().toISOString().split('T')[0],
        // task_id: '',
        // invoice_number: '',
    });

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
        console.log(deliveryFormData.formData);
        console.log(userDetails.FName, userDetails.LName, paymentData.employee_name, paymentData.amount);
        // Validation check
        if (!userDetails.FName || !userDetails.LName || !paymentData.employee_name || !paymentData.amount) {
            alert("Please fill in all required fields!");
            return;
        }

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            alert("Failed to load Razorpay SDK. Please check your internet connection.");
            return;
        }

        // const options = {
        //     key: "rzp_test_LpesfJag0kjwF6", // Replace with your Razorpay Key ID
        //     amount: amount * 100, // Amount in paisa
        //     currency: "INR",
        //     name: "Your Company Name",
        //     description: `Invoice: ${invoice_number}`,
        //     handler: (response) => {
        //         setPaymentResponse(response);
        //         setTransactionStatus('success');
        //     },
        //     prefill: {
        //         name: 'Customer Name', // You can dynamically fetch this data
        //         email: 'customer@example.com', // You can dynamically fetch this data
        //         contact: '9999999999', // You can dynamically fetch this data
        //     },
        //     theme: {
        //         color: "#3399cc",
        //     },
        // };

        // const razorpay = new window.Razorpay(options);
        // razorpay.open();

        // razorpay.on('payment.failed', (response) => {
        //     setPaymentResponse(response.error);
        //     setTransactionStatus('failure');
        // });
    };

    const renderPaymentDetails = () => {
        return (
            <div className="payment-details">
                <h3>Form Details:</h3>
                <p><strong>Payment ID:</strong> {paymentData.payment_id}</p>
                <p><strong>Employer ID:</strong> {paymentData.user_id}</p>
                <p><strong>Employee ID:</strong> {paymentData.employee_id}</p>
                <p><strong>Amount:</strong> ₹{paymentData.amount}</p>
                <p><strong>Payment Method:</strong> {paymentData.payment_method}</p>
                <p><strong>Status:</strong> {paymentData.status}</p>
                <p><strong>Payment Date:</strong> {paymentData.payment_date}</p>
                <p><strong>Task ID:</strong> {paymentData.task_id}</p>
                <p><strong>Invoice Number:</strong> {paymentData.invoice_number}</p>
            </div>
        );
    };

    if (transactionStatus === 'success' || transactionStatus === 'failure') {
        return (
            <div className="payment-checkout">
                <h2>{transactionStatus === 'success' ? 'Payment Successful!' : 'Payment Failed!'}</h2>
                <div className="payment-response">
                    {transactionStatus === 'success' ? (
                        <>
                            <p><strong>Payment ID:</strong> {paymentResponse.razorpay_payment_id}</p>
                            <p><strong>Order ID:</strong> {paymentResponse.razorpay_order_id}</p>
                            <p><strong>Signature:</strong> {paymentResponse.razorpay_signature}</p>
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
                {renderPaymentDetails()}
                <button onClick={() => setTransactionStatus(null)}>Back to Checkout</button>
            </div>
        );
    }

    const fetchDetails = async () => {
        try {
            const response = await axios.post("http://localhost:5001/api/get-username", { userID });
            setUserDetails({
                FName: response.data.FName,
                LName: response.data.LName
            });

            setPaymentData({
                employer_name: userDetails.FName + " " + userDetails.LName,
            });
            setPaymentData({employee_name: selectedDriver.name});
            console.log(paymentData);
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
                {/* <label>
                    Status:
                    <select name="status" value={paymentData.status} onChange={handleChange}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </label> */}
                {/* <label>
                    Payment Date:
                    <input type="date" name="payment_date" value={paymentData.payment_date} onChange={handleChange} required />
                </label> */}
                {/* <label>
                    Task ID (UUID):
                    <input type="text" name="task_id" value={paymentData.task_id} onChange={handleChange} required />
                </label> */}
                {/* <label>
                    Invoice Number:
                    <input type="text" name="invoice_number" value={paymentData.invoice_number} onChange={handleChange} required />
                </label> */}
                <button type="button" onClick={handlePayment}>
                    Pay Now
                </button>
            </form>
        </div>
    );
};

export default PaymentCheckout;
