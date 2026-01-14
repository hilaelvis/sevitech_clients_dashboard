# Quick Start - Get Running in 5 Minutes! ⚡

## Step 1: Install Dependencies (2 minutes)

Open terminal in this directory and run:

```bash
npm install
```

## Step 2: Set Up Airtable (2 minutes)

### Create Tables in Airtable:

**Clients Table:**
```
- id (autonumber)
- phone_number (text)
- name (text)
- status (single select: New, Responded, Interested, Closed)
- conversation_id (formula: "CONV-" & YEAR(created_time) & "-" & {id})
- created_time (created time)
- Messages (link to Messages table)
```

**Messages Table:**
```
- id (autonumber)
- conversation_id (text)
- client (link to Clients table)
- message_text (long text)
- sender (single select: client, agent)
- timestamp (datetime)
- platform (single select: whatsapp, sms, messenger)
```

### Get Your Credentials:

1. API Key: [airtable.com/account](https://airtable.com/account)
2. Base ID: [airtable.com/api](https://airtable.com/api) → Select your base

## Step 3: Configure Environment (1 minute)

Edit the `.env` file in this directory:

```env
AIRTABLE_API_KEY=paste-your-api-key-here
AIRTABLE_BASE_ID=paste-your-base-id-here
SESSION_SECRET=change-this-to-random-string
```

**Generate random secret:**
- Windows: Use any random 32-character string
- Mac/Linux: Run `openssl rand -base64 32`

## Step 4: Start the Server (30 seconds)

```bash
npm run dev
```

## Step 5: Login (30 seconds)

Open browser: [http://localhost:3000](http://localhost:3000)

**Login:**
- Username: `admin`
- Password: `sevitech2024`

**IMPORTANT:** Change password immediately in Settings!

## That's It! 🎉

You now have a fully functional dashboard!

## Add Sample Data (Optional)

Add a test client in Airtable:
- **name:** John Smith
- **phone_number:** +1234567890
- **status:** New

Add a test message:
- **conversation_id:** CONV-2024-1
- **client:** [Link to John Smith]
- **message_text:** Hi, I'm interested in your services
- **sender:** client
- **timestamp:** (now)
- **platform:** whatsapp

Refresh the dashboard to see your data!

## Need Help?

1. **Can't connect to Airtable?**
   - Double-check API key and Base ID in `.env`
   - Make sure tables are named exactly "Clients" and "Messages"

2. **Port 3000 already in use?**
   - Change PORT=3001 in `.env` file

3. **Module not found?**
   - Delete `node_modules` folder
   - Run `npm install` again

4. **More detailed help:**
   - See [SETUP_GUIDE.md](SETUP_GUIDE.md)
   - See [README.md](README.md)

## What's Included?

✅ Authentication & Security
✅ Dashboard with real-time stats
✅ Client management
✅ Message viewing
✅ Analytics with charts
✅ Dark mode
✅ Export to CSV/PDF
✅ Responsive design
✅ And much more!

## Next Steps

1. ✅ Change your password (Settings)
2. ✅ Add your real client data
3. ✅ Explore all features
4. ✅ Read [USER_GUIDE.md](USER_GUIDE.md)
5. ✅ Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

---

**Happy client managing!** 🚀
