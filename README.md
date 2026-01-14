# Sevitech Client Dashboard

A professional Node.js web dashboard for viewing and managing client data from Airtable. Built with Express.js, EJS templates, and Tailwind CSS.

## Features

### Authentication & Security
- Secure login system with Passport.js
- Password hashing with bcrypt
- Session management with express-session
- CSRF protection
- Rate limiting on API endpoints
- Secure headers with Helmet.js
- Session timeout after 30 minutes of inactivity

### Dashboard
- Real-time statistics
- Total clients count
- New clients today
- Active conversations
- Messages sent/received today
- Status breakdown pie chart
- Recent activity timeline
- Auto-refresh every 30 seconds
- Integrated analytics charts (messages over time, platform usage, sender breakdown, status distribution)

### Client Management
- Searchable and filterable client list
- Sort by name, date, status
- Pagination (20 per page)
- Client detail view with full conversation history
- Update client status
- Export clients to CSV
- Export conversations to PDF

### Messages
- View all messages in one place
- Filter by client, date, sender, platform
- Search in message content
- Export filtered results to CSV

### Analytics
- Messages over time (line chart)
- Client status distribution (pie chart)
- Platform usage breakdown (bar chart)
- Sender breakdown (client vs agent)
- Customizable date ranges (7, 30, 90, 365 days)

### Settings
- Change password
- View Airtable configuration
- Dark mode toggle
- User preferences

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Loading states for API calls
- Toast notifications
- Professional color scheme
- Smooth animations
- Collapsible sidebar navigation
- Icon-only theme toggle button

## How It Works

### Architecture Overview

The Sevitech Client Dashboard follows a traditional **MVC (Model-View-Controller)** architecture pattern with a server-side rendering approach:

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │ ◄─────► │   Express   │ ◄─────► │  Airtable   │
│   (Client)  │         │   Server    │         │     API     │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │                        │
      │                        │                        │
   EJS Views              Routes/Logic            Data Storage
```

### How the Application is Built

#### 1. **Backend Server (Node.js + Express)**
The application is built on Node.js using the Express.js framework:

- **server.js**: Main entry point that initializes the Express app, configures middleware, sets up session management, and starts the HTTP server
- **Middleware Layer**: Handles authentication, error handling, security (Helmet.js), and rate limiting
- **Route Handlers**: Process HTTP requests and coordinate between services and views

#### 2. **Authentication System (Passport.js)**
User authentication is handled by Passport.js with a local strategy:

- Passwords are hashed using bcrypt before storage
- Sessions are managed using express-session with secure cookies
- Authentication middleware protects all routes except login
- Automatic session timeout after 30 minutes of inactivity

#### 3. **Data Layer (Airtable Service)**
All data operations go through a centralized service layer:

- **services/airtableService.js**: Handles all Airtable API calls
- Provides methods for fetching clients, messages, statistics, and analytics
- Implements caching and error handling
- Abstracts the Airtable API from the rest of the application

#### 4. **View Layer (EJS Templates)**
Server-side rendering using EJS (Embedded JavaScript):

- **Layouts**: Main layout template with header, sidebar, and footer partials
- **Pages**: Individual views for dashboard, clients, messages, analytics, settings
- **Dynamic Data**: Data is passed from routes to templates and rendered server-side
- **Client-side JavaScript**: Handles interactivity (theme toggle, charts, form submissions)

#### 5. **Styling (Tailwind CSS)**
Utility-first CSS framework for rapid UI development:

- Responsive design with mobile-first approach
- Dark mode support using Tailwind's dark mode utilities
- Custom color palette for brand consistency
- Minimal custom CSS required

### Data Flow

#### Example: Loading the Dashboard

1. **User Request**: User navigates to `/dashboard`
2. **Authentication**: Middleware checks if user is logged in
3. **Route Handler**: `routes/dashboard.js` processes the request
4. **Data Fetching**:
   - Calls `airtableService.getDashboardStats()` for statistics
   - Calls `airtableService.getRecentActivity()` for recent conversations
   - Calls `airtableService.getAnalytics()` for analytics data
5. **Data Processing**: Route handler formats data and prepares view context
6. **Template Rendering**: Express renders `dashboard.ejs` with data
7. **Response**: HTML is sent to browser
8. **Client-side Enhancement**: JavaScript initializes charts using Chart.js

#### Example: Updating Client Status

1. **User Action**: User changes status dropdown on client detail page
2. **AJAX Request**: Frontend JavaScript sends POST request to `/clients/:id/status`
3. **Authentication**: Middleware verifies session
4. **Route Handler**: Validates the new status value
5. **Airtable Update**: `airtableService.updateClientStatus()` updates the record
6. **Response**: Success/error message sent back to client
7. **UI Update**: Frontend shows toast notification and updates the UI

### Key Components

#### Airtable Integration
The application connects to Airtable as its database:

- **Clients Table**: Stores client information and status
- **Messages Table**: Stores all conversation messages with timestamps
- **Real-time Sync**: Data is fetched fresh on each page load
- **API Rate Limits**: Service layer handles rate limiting gracefully

#### Analytics Engine
The analytics system processes message data to generate insights:

- **Time Series Data**: Groups messages by date for trend analysis
- **Aggregations**: Calculates totals, averages, and breakdowns
- **Visualization**: Chart.js renders interactive charts
- **Date Ranges**: Supports multiple time ranges (7, 30, 90, 365 days)

#### Session Management
Secure session handling for user authentication:

- **Session Store**: Uses in-memory store (can be upgraded to Redis for production)
- **Secure Cookies**: HTTP-only cookies prevent XSS attacks
- **Session Timeout**: Automatic logout after inactivity
- **CSRF Protection**: Prevents cross-site request forgery attacks

#### Export Functionality
Multiple export formats for data portability:

- **CSV Export**: Clients and messages can be exported to CSV
- **PDF Export**: Individual client conversations can be exported to PDF
- **Formatting**: Exports include headers, timestamps, and proper formatting

### Security Features

1. **Password Security**: bcrypt hashing with salt rounds
2. **Session Security**: Secure, HTTP-only cookies
3. **CSRF Protection**: Tokens on all forms
4. **Rate Limiting**: Prevents brute force attacks
5. **Secure Headers**: Helmet.js adds security headers
6. **Input Validation**: All user inputs are validated and sanitized
7. **API Key Protection**: Environment variables for sensitive data

### Performance Optimizations

1. **Efficient Queries**: Only fetch required data from Airtable
2. **Pagination**: Large datasets are paginated (20 items per page)
3. **Client-side Caching**: Dark mode preference stored in localStorage
4. **Lazy Loading**: Charts are rendered only when data is available
5. **Compression**: Response compression for faster page loads

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templates
- **Database**: Airtable API
- **Authentication**: Passport.js with local strategy
- **Session Management**: express-session
- **Styling**: Tailwind CSS
- **Charts**: Chart.js
- **Security**: Helmet.js, bcrypt, rate limiting

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Airtable account with API access
- Airtable base with the required structure

## Airtable Structure

### Table 1: Clients
- `id` (primary, autonumber)
- `phone_number` (text)
- `name` (text)
- `status` (single select: New, Responded, Interested, Closed)
- `conversation_id` (formula: "CONV-" & YEAR(created_time) & "-" & {id})
- `created_time` (created time)
- `Messages` (linked to Messages table)

### Table 2: Messages
- `id` (primary)
- `conversation_id` (text)
- `client` (linked to Clients)
- `message_text` (long text)
- `sender` (single select: client, agent)
- `timestamp` (datetime)
- `platform` (single select: whatsapp, sms, messenger)

## Installation

### 1. Clone or Download the Project

```bash
cd "Sevitech node Web"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret (Generate a strong random string)
SESSION_SECRET=your-super-secret-session-key-change-this

# Airtable Configuration
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-airtable-base-id

# Default Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sevitech2024

# Session Configuration
SESSION_TIMEOUT=1800000
```

### 4. Get Airtable Credentials

1. Go to [Airtable Account](https://airtable.com/account)
2. Generate an API key
3. Find your Base ID from the API documentation of your base
4. Update the `.env` file with these credentials

### 5. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 6. Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

Default login credentials:
- **Username**: admin
- **Password**: sevitech2024

## Project Structure

```
airtable-dashboard/
├── config/
│   ├── airtable.js          # Airtable configuration
│   └── passport.js          # Passport authentication setup
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── rateLimiter.js       # Rate limiting configuration
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard routes
│   ├── clients.js           # Client management routes
│   ├── messages.js          # Messages routes
│   ├── analytics.js         # Analytics routes
│   └── settings.js          # Settings routes
├── views/
│   ├── layouts/
│   │   └── main.ejs         # Main layout template
│   ├── partials/
│   │   ├── header.ejs       # Header component
│   │   ├── sidebar.ejs      # Sidebar navigation
│   │   └── footer.ejs       # Footer component
│   ├── login.ejs            # Login page
│   ├── dashboard.ejs        # Dashboard home
│   ├── clients.ejs          # Clients list
│   ├── client-detail.ejs    # Client detail view
│   ├── messages.ejs         # Messages view
│   ├── analytics.ejs        # Analytics page
│   ├── settings.ejs         # Settings page
│   └── error.ejs            # Error page
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       └── main.js          # Frontend JavaScript
├── services/
│   └── airtableService.js   # Airtable API service
├── utils/
│   ├── validators.js        # Input validation
│   └── helpers.js           # Helper functions
├── .env                     # Environment variables (create this)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## Usage Guide

### Logging In

1. Navigate to `http://localhost:3000`
2. Enter your credentials (default: admin/sevitech2024)
3. Click "Sign In"

### Dashboard

The dashboard provides an overview of your client data:
- View total clients, new clients today, active conversations, and messages today
- See a pie chart of client status distribution
- Monitor recent activity in real-time

### Managing Clients

1. Click "Clients" in the sidebar
2. Use the search bar to find specific clients
3. Filter by status using the dropdown
4. Click on any client row to view full details
5. Export all clients to CSV using the download button

### Viewing Client Details

1. From the clients list, click on a client
2. View client information and conversation history
3. Update client status using the dropdown
4. Export the conversation as PDF

### Viewing Messages

1. Click "Messages" in the sidebar
2. Filter by sender (client/agent) or platform
3. Search within message content
4. Export filtered messages to CSV

### Analytics

1. Click "Analytics" in the sidebar
2. Select a date range (7, 30, 90, or 365 days)
3. View charts showing:
   - Messages over time
   - Platform usage
   - Client status distribution
   - Sender breakdown

### Settings

1. Click "Settings" in the sidebar
2. Change your password
3. View Airtable configuration
4. Toggle dark mode

### Dark Mode

Toggle dark mode using the moon/sun icon in the header or in Settings.

## API Documentation

### Authentication Endpoints

#### POST /auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "sevitech2024"
}
```

#### GET /auth/logout
Logout the current user.

### Dashboard Endpoints

#### GET /dashboard
Display the main dashboard.

#### GET /dashboard/api/stats
Get current statistics (for auto-refresh).

**Response:**
```json
{
  "totalClients": 150,
  "newClientsToday": 5,
  "activeConversations": 23,
  "messagesToday": 47,
  "statusBreakdown": {
    "New": 20,
    "Responded": 45,
    "Interested": 60,
    "Closed": 25
  }
}
```

### Client Endpoints

#### GET /clients
Display clients list with optional filters.

**Query Parameters:**
- `search` - Search term
- `status` - Filter by status
- `page` - Page number (default: 1)

#### GET /clients/:id
Display client detail view.

#### POST /clients/:id/status
Update client status.

**Request Body:**
```json
{
  "status": "Interested"
}
```

#### GET /clients/export/csv
Export all clients to CSV.

#### GET /clients/:id/export/pdf
Export client conversation to PDF.

### Message Endpoints

#### GET /messages
Display messages list with optional filters.

**Query Parameters:**
- `search` - Search term
- `sender` - Filter by sender
- `platform` - Filter by platform
- `page` - Page number (default: 1)

#### GET /messages/export/csv
Export filtered messages to CSV.

### Analytics Endpoints

#### GET /analytics
Display analytics dashboard.

**Query Parameters:**
- `range` - Date range in days (default: 30)

#### GET /analytics/api/data
Get analytics data.

**Query Parameters:**
- `range` - Date range in days

**Response:**
```json
{
  "messagesOverTime": {
    "2024-01-01": 15,
    "2024-01-02": 23
  },
  "platformBreakdown": {
    "whatsapp": 120,
    "sms": 45,
    "messenger": 35
  },
  "statusBreakdown": {
    "New": 20,
    "Responded": 45,
    "Interested": 60,
    "Closed": 25
  },
  "senderBreakdown": {
    "client": 150,
    "agent": 50
  },
  "totalMessages": 200,
  "totalClients": 150
}
```

### Settings Endpoints

#### GET /settings
Display settings page.

#### POST /settings/password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

## Deployment

### Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Login to Heroku:
   ```bash
   heroku login
   ```
4. Create a new app:
   ```bash
   heroku create your-app-name
   ```
5. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-secret
   heroku config:set AIRTABLE_API_KEY=your-key
   heroku config:set AIRTABLE_BASE_ID=your-base-id
   ```
6. Deploy:
   ```bash
   git push heroku main
   ```

### DigitalOcean

1. Create a Droplet (Ubuntu 20.04)
2. SSH into your server
3. Install Node.js and npm
4. Clone your repository
5. Install dependencies: `npm install`
6. Create `.env` file with production values
7. Install PM2: `npm install -g pm2`
8. Start the app: `pm2 start server.js --name sevitech-dashboard`
9. Set up PM2 to start on boot: `pm2 startup && pm2 save`

### Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard

## Security Best Practices

1. **Change default credentials** immediately after first login
2. **Use strong session secret** - generate with `openssl rand -base64 32`
3. **Keep dependencies updated** - run `npm audit` regularly
4. **Use HTTPS in production** - enable SSL/TLS certificates
5. **Secure Airtable API key** - never commit to version control
6. **Enable firewall** - restrict access to necessary ports only
7. **Regular backups** - backup Airtable data regularly
8. **Monitor logs** - check for suspicious activity

## Troubleshooting

### Cannot connect to Airtable
- Verify your API key and Base ID in `.env`
- Check that your Airtable base has the correct table structure
- Ensure your API key has read/write permissions

### Session expires too quickly
- Increase `SESSION_TIMEOUT` in `.env` (value in milliseconds)

### Charts not displaying
- Ensure Chart.js is loading (check browser console)
- Verify data is being fetched from Airtable

### Dark mode not persisting
- Check browser localStorage is enabled
- Clear browser cache and try again

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@sevitech.com

## Credits

Developed by Sevitech Team

Built with:
- [Express.js](https://expressjs.com/)
- [Airtable API](https://airtable.com/api)
- [Passport.js](http://www.passportjs.org/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Changelog

### Version 1.1.0 (2026-01-14)
- Enhanced dashboard with integrated analytics section
- Simplified theme toggle button (icon-only design)
- Improved mobile responsiveness across all pages
- Updated sidebar with collapsible navigation
- Fixed WhatsApp message styling in dark mode
- Added comprehensive "How It Works" documentation
- Performance optimizations and bug fixes

### Version 1.0.0 (2024-01-13)
- Initial release
- Complete authentication system
- Dashboard with real-time stats
- Client management
- Message viewing
- Analytics with charts
- Export to CSV/PDF
- Dark mode support
- Responsive design
