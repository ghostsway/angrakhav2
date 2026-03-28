# Telegram Bot Setup Guide for Order Notifications

## Step 1: Create Your Telegram Bot

1. Open Telegram app on your phone
2. Search for **@BotFather** (official Telegram bot)
3. Start a chat and send: `/newbot`
4. BotFather will ask for a name - enter: `Angarakha Orders`
5. Then it asks for a username - enter: `angarakha_orders_bot` (must end with 'bot')
6. BotFather will give you a **Bot Token** - it looks like:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
   **SAVE THIS TOKEN!**

## Step 2: Get Your Chat ID

1. Search for your new bot in Telegram (`angarakha_orders_bot`)
2. Click **START** to begin a chat with your bot
3. Send any message to your bot (e.g., "Hi")
4. Now open this URL in your browser (replace YOUR_BOT_TOKEN with the token from Step 1):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
5. You'll see a JSON response. Look for `"chat":{"id":123456789`
6. **SAVE THIS CHAT ID!**

Example:
```json
{
  "ok": true,
  "result": [{
    "message": {
      "chat": {
        "id": 987654321,    <-- THIS IS YOUR CHAT ID
        "first_name": "Your Name"
      }
    }
  }]
}
```

## Step 3: Configure the Backend

Once you have your **Bot Token** and **Chat ID**, I'll update the backend to use them.

Just provide me with:
1. Bot Token: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
2. Chat ID: `987654321`

## How It Works

When a customer places an order:
1. Backend automatically sends a message to your Telegram bot
2. You receive instant notification on your phone
3. Message includes all order details (customer, items, payment, address)

## Benefits

✅ 100% FREE - No costs ever
✅ Instant notifications
✅ Works on phone and desktop
✅ Can send rich formatted messages
✅ Very reliable
✅ No message limits
