# Complete Setup Guide - Sevitech Client Dashboard

## 🚀 Quick Start (5 Minutes)

### Step 1: Update Your Airtable Credentials

1. **Get your Airtable API Key:**
   - Go to https://airtable.com/account
   - Generate or copy your API key

2. **Get your Airtable Base ID:**
   - Go to https://airtable.com/api
   - Select your base
   - The Base ID appears in the URL and documentation (starts with "app...")

3. **Update the `.env` file:**
   Open the `.env` file and update these lines:
   ```env
   AIRTABLE_API_KEY=paste-your-actual-api-key-here
   AIRTABLE_BASE_ID=paste-your-actual-base-id-here
   ```

### Step 2: Create Your Airtable Tables

#### Table 1: "Clients"
Create a table named **Clients** with these fields:

| Field Name | Type | Configuration |
|------------|------|---------------|
| id | Autonumber | Primary field |
| phone_number | Single line text | - |
| name | Single line text | - |
| status | Single select | Options: New, Responded, Interested, Closed |
| conversation_id | Formula | `"CONV-" & YEAR(created_time) & "-" & {id}` |
| created_time | Created time | - |
| Messages | Link to another record | Link to Messages table |

#### Table 2: "Messages"
Create a table named **Messages** with these fields:

| Field Name | Type | Configuration |
|------------|------|---------------|
| id | Autonumber | Primary field |
| conversation_id | Single line text | - |
| client | Link to another record | Link to Clients table |
| message_text | Long text | - |
| sender | Single select | Options: client, agent |
| timestamp | Date | Include time |
| platform | Single select | Options: whatsapp, sms, messenger |

### Step 3: Start the Server

```bash
npm run dev
```

### Step 4: Login

Open your browser to http://localhost:3000

**Default credentials:**
- Username: `admin`
- Password: `sevitech2024`

**⚠️ IMPORTANT:** Change your password immediately after logging in!

---

## 📋 Detailed Setup Instructions

### Prerequisites

- **Node.js** v16 or higher
- **npm** (comes with Node.js)
- **Airtable account**

### Installation Steps

1. **Dependencies are already installed** (you ran `npm install`)

   If you need to reinstall:
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - The `.env` file already exists
   - Update it with your Airtable credentials (see Step 1 above)

3. **Generate a secure session secret (recommended):**

   Windows PowerShell:
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

   Then update in `.env`:
   ```env
   SESSION_SECRET=your-generated-secret-here
   ```

### Creating Airtable Tables (Detailed)

#### Adding Fields to Clients Table:

1. **Create the table** named "Clients"

2. **Add each field:**
   - **id**: Click "+" → Autonumber → Name it "id"
   - **phone_number**: Click "+" → Single line text
   - **name**: Click "+" → Single line text
   - **status**: Click "+" → Single select → Add options: New, Responded, Interested, Closed
   - **conversation_id**: Click "+" → Formula → Enter: `"CONV-" & YEAR(created_time) & "-" & {id}`
   - **created_time**: Click "+" → Created time
   - **Messages**: Click "+" → Link to another record → Select "Messages" table

#### Adding Fields to Messages Table:

1. **Create the table** named "Messages"

2. **Add each field:**
   - **id**: Click "+" → Autonumber
   - **conversation_id**: Click "+" → Single line text
   - **client**: Click "+" → Link to another record → Select "Clients" table
   - **message_text**: Click "+" → Long text
   - **sender**: Click "+" → Single select → Add options: client, agent
   - **timestamp**: Click "+" → Date → Enable "Include a time field"
   - **platform**: Click "+" → Single select → Add options: whatsapp, sms, messenger

### Adding Sample Data

Add test records to verify everything works:

**Sample Client:**
1. Click "+" in Clients table
2. Fill in:
   - name: John Smith
   - phone_number: +1234567890
   - status: New
   - (Other fields auto-populate)

**Sample Message:**
1. Click "+" in Messages table
2. Fill in:
   - conversation_id: Copy the conversation_id from John Smith (e.g., CONV-2024-1)
   - client: Click and select "John Smith"
   - message_text: Hi, I'm interested in your services
   - sender: client
   - timestamp: Click and set to current date/time
   - platform: whatsapp

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to Airtable"

**Solutions:**
1. Verify API key in `.env` is correct
2. Verify Base ID in `.env` is correct
3. Check tables are named exactly "Clients" and "Messages" (case-sensitive)
4. Ensure API key has correct permissions
5. Restart the server after changing `.env`

### Problem: "Port 3000 already in use"

**Solution:** Change the port in `.env`:
```env
PORT=3001
```

### Problem: "Login credentials don't work"

**Default credentials:**
- Username: admin
- Password: sevitech2024

If you changed them in `.env`, restart the server.

### Problem: "No data showing"

**Checks:**
1. Verify you added sample data to Airtable
2. Check table names are exactly "Clients" and "Messages"
3. Verify field names match exactly (case-sensitive)
4. Check browser console for errors (F12)
5. Check server terminal for errors

---

## 🎯 Next Steps

### 1. Secure Your Installation

✅ **Change default password:**
   - Go to Settings
   - Change password from sevitech2024

✅ **Update session secret:**
   - Generate random 32-character string
   - Update `SESSION_SECRET` in `.env`

### 2. Add Your Real Data

- Import your client list to Airtable
- Import message history
- Verify data appears in dashboard

### 3. Test All Features

- [ ] Login/Logout
- [ ] Dashboard statistics
- [ ] View/search clients
- [ ] View client details
- [ ] Update client status
- [ ] Export to CSV/PDF
- [ ] View messages
- [ ] Analytics charts
- [ ] Dark mode

### 4. Deploy to Production

See DEPLOYMENT.md for deployment instructions.

---

## 📖 Available Scripts

```bash
# Start in development (with auto-restart)
npm run dev

# Start in production
npm start

# Install dependencies
npm install
```

---

## 🔐 Security Checklist

- [ ] Changed default admin password
- [ ] Updated session secret
- [ ] Verified Airtable connection
- [ ] Tested all features
- [ ] Added SSL/HTTPS (production)
- [ ] Reviewed all security settings

---

## 📞 Getting Help

### Documentation

- **README.md** - Complete documentation
- **USER_GUIDE.md** - Feature walkthrough
- **SAMPLE_DATA.md** - Test data examples
- **QUICK_START.md** - 5-minute setup

### Resources

- [Airtable API Docs](https://airtable.com/api)
- [Express.js Docs](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ✅ Setup Complete!

Your Sevitech Client Dashboard is ready!

**Login:** http://localhost:3000
- Username: admin
- Password: sevitech2024

**Change your password immediately!**

Read the USER_GUIDE.md to learn all features.

Happy client managing! 🚀
