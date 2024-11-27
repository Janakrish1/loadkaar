import React, { useState } from 'react';
import '../styles/PaymentCheckout.css';

const PaymentCheckout = () => {
    const [paymentData, setPaymentData] = useState({
        payment_id: '',
        employer_id: '',
        employee_id: '',
        amount: '',
        payment_method: '',
        status: 'pending',
        payment_date: new Date().toISOString().split('T')[0],
        task_id: '',
        invoice_number: '',
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
        const { payment_id, employer_id, employee_id, amount, invoice_number } = paymentData;
        
        // Validation check
        if (!payment_id || !employer_id || !employee_id || !amount || !invoice_number) {
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
            amount: amount * 100, // Amount in paisa
            currency: "INR",
            name: "Your Company Name",
            description: `Invoice: ${invoice_number}`,
            handler: (response) => {
                setPaymentResponse(response);
                setTransactionStatus('success');
            },
            prefill: {
                name: 'Customer Name', // You can dynamically fetch this data
                email: 'customer@example.com', // You can dynamically fetch this data
                contact: '9999999999', // You can dynamically fetch this data
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

    const renderPaymentDetails = () => {
        return (
            <div className="payment-details">
                <h3>Form Details:</h3>
                <p><strong>Payment ID:</strong> {paymentData.payment_id}</p>
                <p><strong>Employer ID:</strong> {paymentData.employer_id}</p>
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

    return (
        <div className="payment-checkout">
            <h2>Payment Checkout</h2>
            <form>
                <label>
                    Payment ID (UUID):
                    <input type="text" name="payment_id" value={paymentData.payment_id} onChange={handleChange} required />
                </label>
                <label>
                    Employer ID (UUID):
                    <input type="text" name="employer_id" value={paymentData.employer_id} onChange={handleChange} required />
                </label>
                <label>
                    Employee ID (UUID):
                    <input type="text" name="employee_id" value={paymentData.employee_id} onChange={handleChange} required />
                </label>
                <label>
                    Amount:
                    <input type="number" name="amount" value={paymentData.amount} onChange={handleChange} required />
                </label>
                <label>
                    Payment Method:
                    <select name="payment_method" value={paymentData.payment_method} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="upi">UPI</option>
                    </select>
                </label>
                <label>
                    Status:
                    <select name="status" value={paymentData.status} onChange={handleChange}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                    </select>
                </label>
                <label>
                    Payment Date:
                    <input type="date" name="payment_date" value={paymentData.payment_date} onChange={handleChange} required />
                </label>
                <label>
                    Task ID (UUID):
                    <input type="text" name="task_id" value={paymentData.task_id} onChange={handleChange} required />
                </label>
                <label>
                    Invoice Number:
                    <input type="text" name="invoice_number" value={paymentData.invoice_number} onChange={handleChange} required />
                </label>
                <button type="button" onClick={handlePayment}>
                    Pay Now
                </button>
            </form>
        </div>
    );
};

export default PaymentCheckout;
