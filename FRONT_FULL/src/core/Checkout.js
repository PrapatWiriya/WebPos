import React, { useState, useEffect } from 'react';
import { getProducts, getBraintreeClientToken, processPayment, createOrder } from './apiCore';
import { emptyCart } from './cartHelpers';
import Card from './Card';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
// import "braintree-web"; // not using this package
import PaypalBtn from 'react-paypal-checkout';
const Checkout = ({products, setRun = f => f, run = undefined}) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: '',
        instance: {},
        address: ''
    });
    
    
    const handleAddress = event => {
        setData({ ...data, address: event.target.value });
    };

    
    
    const getTotal = () => {
        return products.reduce( (currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price
        }, 0)
    }
    const client = {
        sandbox:    "AXA0rFhJOLCrzgBo8g1WTWQOJCYRGaAV5Qp0j36Ruw5ijyhdVttsYJ2V104GoN_7xc8TK2olJlJBPFjH",
        production: "EPHjn3HL0X3iDmFuQ9KfgUp_uS0V8ZpOi6Gm2DOv39cBGRMQqxfbj25w-lbM93W5TkS0deJSU9XYrPxZ"
    }

    let deliveryAddress = data.address;
    const showError = error => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = success => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            Thanks! Your payment was successful!
        </div>
    );

    const showLoading = loading => loading && <h2 className="text-danger">Loading...</h2>;




    return (
        <div className="card">
                        

            <h2> Total: ${getTotal()}</h2>
            {showLoading(data.loading)}
            {showSuccess(data.success)}
            {showError(data.error)}











            {isAuthenticated() ? (
                <PaypalBtn client={client} currency={'USD'} total={getTotal()} 
                onSuccess={(data) => {
 if(data.paid){
       emptyCart(() => {
           setRun(!run); // run useEffect in parent Cart
           console.log('payment success and empty cart');
           setData({
               loading: false,
               success: true
           });
       });          

 }
                }} />
                
            ) : (
                <Link to="/signin">
                    <button className = "btn btn-primary">
                        Sign in to checkout
                    </button>
                </Link>
            )}
        </div>
    )
}


export default Checkout;