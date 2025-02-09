import dotenv from 'dotenv';
dotenv.config();



const PAYPAL_ID = process.env.PAYPAL_ID;
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;
const PAYPAL_API_URL = process.env.PAYPAL_API_URL ;

async function getPayPalAccessToken() {
    try {
        const auth = Buffer.from(`${PAYPAL_ID}:${PAYPAL_SECRET_KEY}`).toString('base64');
        const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
    
        const headers = {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          Authorization: `Basic ${auth}`,
        };
    
        const body = new URLSearchParams({ grant_type: 'client_credentials' });
    
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body,
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to get access token: ${errorData.error_description || 'Unknown error'}`);
        }
    
        const paypalData = await response.json();
        return paypalData.access_token;
      } catch (error) {
        console.error('Error obtaining PayPal access token:', error);
        throw error; // Re-throw error to handle it in the calling function
      }
}

/**
 * Checks if a PayPal transaction is new by comparing the transaction ID with existing orders in the database.
 *
 * @param {Mongoose.Model} orderModel - The Mongoose model for the orders in the database.
 * @param {string} paypalTransactionId - The PayPal transaction ID to be checked.
 * @returns {Promise<boolean>} Returns true if it is a new transaction (i.e., the transaction ID does not exist in the database), false otherwise.
 * @throws {Error} If there's an error in querying the database.
 *
 */
export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
  try {
    // Find all documents where Order.paymentResult.id is the same as the id passed paypalTransactionId
    const orders = await orderModel.find({
      'paymentResult.id': paypalTransactionId,
    });

    // If there are no such orders, then it's a new transaction.
    return orders.length === 0;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Verifies a PayPal payment by making a request to the PayPal API.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_get}
 *
 * @param {string} paypalTransactionId - The PayPal transaction ID to be verified.
 * @returns {Promise<Object>} An object with properties 'verified' indicating if the payment is completed and 'value' indicating the payment amount.
 * @throws {Error} If the request is not successful.
 *
 */
export async function verifyPayPalPayment(paypalTransactionId) {
  const accessToken = await getPayPalAccessToken();
  const paypalResponse = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!paypalResponse.ok) throw new Error('Failed to verify payment');

  const paypalData = await paypalResponse.json();
  return {
    verified: paypalData.status === 'COMPLETED',
    value: paypalData.purchase_units[0].amount.value,
  };
}