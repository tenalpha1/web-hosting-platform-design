// Same handler as /api/paypal/webhook — PayPal won't accept webhook URLs that contain the word "paypal".
export { POST } from '../../paypal/webhook/route'

export const dynamic = 'force-dynamic'
