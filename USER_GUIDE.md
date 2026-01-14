# User Guide

Complete guide for using the Sevitech Client Dashboard.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Clients](#managing-clients)
4. [Viewing Messages](#viewing-messages)
5. [Analytics](#analytics)
6. [Settings](#settings)
7. [Tips & Tricks](#tips--tricks)

## Getting Started

### Logging In

1. Navigate to the dashboard URL (e.g., `http://localhost:3000`)
2. Enter your username and password
3. Click "Sign In"

**First-time login:**
- Default username: `admin`
- Default password: `sevitech2024`
- **Important:** Change these immediately after first login!

### Dashboard Layout

The dashboard consists of:

- **Sidebar** (left): Navigation menu
- **Header** (top): Page title, user info, and controls
- **Main area**: Page content
- **Dark mode toggle**: Moon/sun icon in header

### Navigation Menu

- **Dashboard**: Overview and statistics
- **Clients**: View and manage all clients
- **Messages**: View all messages across clients
- **Analytics**: Charts and data insights
- **Settings**: Account and preferences
- **Logout**: Sign out of the dashboard

## Dashboard Overview

### Statistics Cards

The dashboard displays four key metrics:

1. **Total Clients**: All clients in your database
2. **New Today**: Clients added today
3. **Active Conversations**: Conversations with activity in last 24 hours
4. **Messages Today**: Total messages sent/received today

These metrics auto-refresh every 30 seconds.

### Status Breakdown Chart

Pie chart showing distribution of clients by status:
- **New** (Blue): Newly added clients
- **Responded** (Yellow): Clients you've responded to
- **Interested** (Green): Clients showing interest
- **Closed** (Gray): Completed interactions

### Recent Activity

Timeline showing the latest 10 messages across all conversations, including:
- Sender (client or agent)
- Message preview
- Conversation ID
- Time (relative, e.g., "2 hours ago")

### Refresh Button

Click the refresh icon (🔄) in the header to manually reload current data.

## Managing Clients

### Viewing Clients List

Navigate to **Clients** from the sidebar to see all clients.

**The clients table shows:**
- Name with avatar initial
- Phone number
- Status badge (color-coded)
- Conversation ID
- Created date (relative time)
- View action button

### Searching Clients

Use the search bar at the top to find clients by:
- Name
- Phone number
- Conversation ID

**Example:** Type "John" to find all clients named John.

### Filtering by Status

Use the status dropdown to filter:
- **All Statuses**: Show everyone
- **New**: Only new clients
- **Responded**: Clients you've responded to
- **Interested**: Interested clients
- **Closed**: Closed conversations

### Viewing Client Details

Click on any client row or the "View" button to see:

1. **Client Information Card**
   - Name and avatar
   - Phone number
   - Status (editable dropdown)
   - Conversation ID
   - Created date
   - Total message count

2. **Conversation History**
   - All messages in chronological order
   - Message bubbles (client messages on left, agent on right)
   - Platform icons (📱 WhatsApp, 💬 SMS, 💌 Messenger)
   - Timestamps for each message

### Updating Client Status

1. Go to client detail page
2. Click the status dropdown
3. Select new status
4. Status updates automatically

**Status meanings:**
- **New**: Initial contact, not yet responded
- **Responded**: You've sent at least one response
- **Interested**: Client shows buying intent
- **Closed**: Conversation completed (sale made or declined)

### Exporting Data

**Export all clients to CSV:**
1. Go to Clients page
2. Click the download icon (⬇️) next to Search button
3. CSV file downloads automatically

**Export conversation to PDF:**
1. Go to client detail page
2. Click "Export as PDF" button
3. PDF file downloads with formatted conversation

### Pagination

Clients list shows 20 per page:
- Use "Previous" and "Next" buttons to navigate
- Current page and total shown at bottom

## Viewing Messages

### Messages Overview

Navigate to **Messages** to view all messages across all conversations.

**The messages table shows:**
- Conversation ID
- Message text (truncated if long)
- Sender badge (client or agent)
- Platform icon and name
- Timestamp

### Filtering Messages

Use the filters at the top:

1. **Search**: Find messages containing specific text
2. **Sender**: Filter by client or agent messages
3. **Platform**: Filter by WhatsApp, SMS, or Messenger

**Example filters:**
- Show only client messages: Select "Client" in sender filter
- Find WhatsApp messages: Select "WhatsApp" in platform filter
- Search for specific text: Type keywords in search box

### Exporting Messages

1. Apply desired filters (or show all)
2. Click download icon (⬇️)
3. CSV file downloads with filtered messages

**CSV includes:**
- Conversation ID
- Message text
- Sender
- Platform
- Timestamp

### Pagination

Messages list shows 50 per page.

## Analytics

Navigate to **Analytics** for data insights and visualizations.

### Date Range Selector

Choose the time period to analyze:
- **Last 7 Days**
- **Last 30 Days** (default)
- **Last 90 Days**
- **Last Year**

### Summary Cards

Two key metrics:
1. **Total Messages**: All messages in selected period
2. **Total Clients**: All clients in selected period

### Charts

#### 1. Messages Over Time (Line Chart)

Shows daily message volume over selected period.

**Use cases:**
- Identify busy days
- Spot trends
- Compare activity levels

#### 2. Platform Usage (Bar Chart)

Compares message volume across platforms:
- WhatsApp (green)
- SMS (orange)
- Messenger (purple)

**Use cases:**
- Understand preferred communication channels
- Allocate resources accordingly
- Focus marketing efforts

#### 3. Client Status Distribution (Doughnut Chart)

Shows breakdown of clients by status.

**Use cases:**
- Track conversion funnel
- Identify bottlenecks
- Monitor pipeline health

#### 4. Messages by Sender (Pie Chart)

Compares client messages vs agent messages.

**Use cases:**
- Measure response rate
- Evaluate engagement
- Balance workload

### Interpreting Data

**Healthy metrics:**
- Balanced platform usage
- Steady message flow
- Good agent-to-client message ratio (aim for 1:1 or better)
- Progression through status pipeline

**Warning signs:**
- Too many "New" status clients (need attention)
- Declining message volume
- Low agent response rate

## Settings

Navigate to **Settings** to manage your account.

### Changing Password

1. Enter current password
2. Enter new password (minimum 6 characters)
3. Confirm new password
4. Click "Update Password"

**Password tips:**
- Use at least 8 characters
- Mix uppercase, lowercase, numbers, symbols
- Don't reuse passwords
- Change regularly

### Airtable Configuration

View (but not edit) your Airtable settings:
- API Key (hidden for security)
- Base ID (hidden for security)

**To update these:**
1. Edit `.env` file
2. Restart the server

### User Preferences

**Dark Mode:**
- Toggle using moon/sun icon
- Preference saved automatically
- Applies across all pages

**Session Timeout:**
- View current timeout setting (30 minutes by default)
- Session expires after inactivity
- You'll be redirected to login when expired

## Tips & Tricks

### Keyboard Shortcuts

- **Ctrl/Cmd + K**: Focus search box (any page with search)
- **Escape**: Clear search and unfocus

### Auto-Refresh

Dashboard statistics automatically refresh every 30 seconds. You'll always see current data without manual refresh.

### Mobile Usage

Dashboard is fully responsive:
- Use on phone or tablet
- Touch-friendly buttons
- Readable on small screens
- All features available

### Best Practices

1. **Update statuses regularly**
   - Keep pipeline current
   - Helps with analytics
   - Better team coordination

2. **Use search effectively**
   - Find clients quickly
   - Search partial names/numbers
   - Case-insensitive

3. **Export data regularly**
   - Keep local backups
   - Share with team
   - Create reports

4. **Monitor analytics weekly**
   - Spot trends early
   - Adjust strategy
   - Track performance

5. **Change password monthly**
   - Maintain security
   - Use strong passwords
   - Never share credentials

### Common Tasks

**Find a specific client:**
1. Go to Clients
2. Use search bar
3. Click to view details

**Check today's activity:**
1. Go to Dashboard
2. View "New Today" and "Messages Today" cards
3. Check Recent Activity timeline

**See response rate:**
1. Go to Analytics
2. View "Messages by Sender" chart
3. Compare client vs agent volumes

**Export client list:**
1. Go to Clients
2. Apply any filters
3. Click download icon

**View conversation history:**
1. Find client in Clients page
2. Click to open details
3. Scroll through messages

### Troubleshooting

**Can't find a client:**
- Check spelling
- Try partial name
- Search by phone number
- Remove status filter

**Charts not showing:**
- Check date range
- Verify you have data in that period
- Try different time range
- Refresh page

**Export not working:**
- Check browser pop-up blocker
- Verify you have data to export
- Try different browser
- Check internet connection

**Session expired:**
- Simply log in again
- Activity timeout is 30 minutes
- Security feature

**Dark mode flickering:**
- Clear browser cache
- Check localStorage enabled
- Try different browser

### Security Reminders

- ✅ Log out when finished
- ✅ Don't share login credentials
- ✅ Use strong passwords
- ✅ Change password regularly
- ✅ Report suspicious activity
- ✅ Close browser when done on shared computers

### Getting Help

If you need assistance:

1. Check this user guide
2. Review setup guide (SETUP_GUIDE.md)
3. Check main documentation (README.md)
4. Contact administrator
5. Email support@sevitech.com

## Feature Reference

### Dashboard
- ✅ Real-time statistics
- ✅ Status breakdown chart
- ✅ Recent activity timeline
- ✅ Auto-refresh (30s)

### Clients
- ✅ Search by name/phone/ID
- ✅ Filter by status
- ✅ Sort by multiple fields
- ✅ Pagination
- ✅ Detail view with full conversation
- ✅ Update status
- ✅ Export to CSV
- ✅ Export conversation to PDF

### Messages
- ✅ View all messages
- ✅ Search message content
- ✅ Filter by sender
- ✅ Filter by platform
- ✅ Export to CSV
- ✅ Pagination

### Analytics
- ✅ Customizable date ranges
- ✅ Messages over time chart
- ✅ Platform usage chart
- ✅ Status distribution chart
- ✅ Sender breakdown chart
- ✅ Summary statistics

### Settings
- ✅ Change password
- ✅ View Airtable config
- ✅ Dark mode toggle
- ✅ Session info

### UI Features
- ✅ Responsive design
- ✅ Dark mode
- ✅ Loading states
- ✅ Toast notifications
- ✅ Professional design
- ✅ Smooth animations

---

**Happy client management!** 🎉

For technical documentation, see [README.md](README.md)
