module.exports = {
    savePayment: async (req, res) => {
        const { 
            paymentResponse: paymentResponse, 
            deliveryFormData: deliveryFormData, 
            userDetails: userDetails, 
            paymentData: paymentData
        } = req.body;

        console.log("here");
        console.log("Payment Success:", paymentResponse);
        console.log("Delivery Form Data:", deliveryFormData);
        console.log("User Details:", userDetails);
        console.log("Payment Data:", paymentData);
        
    }
};