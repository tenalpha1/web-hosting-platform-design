// Same handler as /api/paypal/webhook — PayPal won't accept webhook URLs that contain the word "paypal".
export { POST, dynamic } from '../../paypal/webhook/route'
