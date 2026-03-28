# SMS Order Notification Setup Guide

## Overview
Your Angarakha website is now configured to send SMS notifications to **+91 98285 41068** whenever a new order is placed.

## What's Included in the SMS

Every order notification includes complete details:

### Customer Information
- Customer name
- Phone number

### Order Items
For each product ordered:
- Product name
- Size
- Quantity
- Price per item

### Payment Details
- Subtotal amount
- Tax (18% GST)
- Shipping charges
- **Total amount**
- Payment method (UPI/Card/etc.)

### Delivery Information
- Complete shipping address
- Order status
- Payment status

## Setup Instructions

### Step 1: Get Twilio Credentials

1. Sign up for a Twilio account at https://www.twilio.com/
2. Get a Twilio phone number (with SMS capability)
3. From your Twilio Console Dashboard, note down:
   - **Account SID** (starts with "AC...")
   - **Auth Token**
   - **Twilio Phone Number** (with country code, e.g., +1234567890)

### Step 2: Configure Environment Variables

Edit the file `/app/backend/.env` and replace the placeholder values:

```env
# Replace these values with your actual Twilio credentials
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
NOTIFICATION_PHONE="+919828541068"
```

### Step 3: Restart the Backend

After updating the .env file, restart the backend service:

```bash
sudo supervisorctl restart backend
```

### Step 4: Test

1. Place a test order on your website
2. You should receive an SMS on +91 98285 41068 with all order details

## Current Status

✅ SMS notification code is implemented and active
⚠️  Currently in MOCK mode (SMS messages are logged but not sent)
📋 To enable real SMS: Add your Twilio credentials to `.env` file

## SMS Format Example

```
🛍️ NEW ORDER - VY-260328-A1B2C3

👤 Customer: Rajesh Kumar
📞 Phone: +91 98765 43210

📦 ITEMS:
1. Royal Ivory Sherwani
   Size: L, Qty: 1, Price: ₹45000
2. Chanderi Silk Kurta
   Size: M, Qty: 2, Price: ₹12500

💰 PAYMENT:
Subtotal: ₹70000
Tax: ₹12600
Shipping: ₹0
TOTAL: ₹82600
Method: UPI

📍 DELIVERY ADDRESS:
123 MG Road, Jaipur, Rajasthan - 302001

Status: CONFIRMED
Payment: PAID
```

## Important Notes

1. **Twilio Costs**: Twilio charges per SMS sent. Check their pricing at https://www.twilio.com/sms/pricing
2. **International SMS**: Make sure your Twilio account supports SMS to India (+91)
3. **Phone Number Format**: Always use E.164 format (+[country code][number])
4. **Testing**: Use Twilio's test credentials during development to avoid charges

## Troubleshooting

### SMS Not Received?

1. Check backend logs: `tail -f /var/log/supervisor/backend.err.log`
2. Look for Twilio error messages
3. Verify your Twilio phone number has SMS capability
4. Ensure notification phone number is in E.164 format

### "Mock SMS" in Logs?

This means Twilio credentials are not configured. The system will log the SMS content but won't actually send it.

To enable real SMS:
1. Add valid Twilio credentials to `.env`
2. Restart backend: `sudo supervisorctl restart backend`

## Support

If you need help setting up Twilio or configuring SMS notifications, refer to:
- Twilio Documentation: https://www.twilio.com/docs/sms
- Twilio Console: https://console.twilio.com/
