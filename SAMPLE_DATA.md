# Sample Data for Testing

This document provides sample data you can use to populate your Airtable base for testing the dashboard.

## Sample Clients Table

Here are sample records you can add to your Airtable "Clients" table:

### Client 1
- **phone_number**: +1234567890
- **name**: John Smith
- **status**: New
- **created_time**: (today's date)

### Client 2
- **phone_number**: +1234567891
- **name**: Sarah Johnson
- **status**: Responded
- **created_time**: (yesterday's date)

### Client 3
- **phone_number**: +1234567892
- **name**: Michael Brown
- **status**: Interested
- **created_time**: (2 days ago)

### Client 4
- **phone_number**: +1234567893
- **name**: Emily Davis
- **status**: Closed
- **created_time**: (3 days ago)

### Client 5
- **phone_number**: +1234567894
- **name**: David Wilson
- **status**: New
- **created_time**: (today's date)

### Client 6
- **phone_number**: +1234567895
- **name**: Lisa Anderson
- **status**: Responded
- **created_time**: (1 day ago)

### Client 7
- **phone_number**: +1234567896
- **name**: James Martinez
- **status**: Interested
- **created_time**: (4 days ago)

### Client 8
- **phone_number**: +1234567897
- **name**: Jennifer Taylor
- **status**: Closed
- **created_time**: (5 days ago)

### Client 9
- **phone_number**: +1234567898
- **name**: Robert Thomas
- **status**: New
- **created_time**: (today's date)

### Client 10
- **phone_number**: +1234567899
- **name**: Maria Garcia
- **status**: Interested
- **created_time**: (2 days ago)

## Sample Messages Table

Here are sample messages you can add to your Airtable "Messages" table:

### Message Set 1 (John Smith - CONV-2024-1)
1. **conversation_id**: CONV-2024-1
   **client**: [Link to John Smith]
   **message_text**: Hi, I'm interested in your services
   **sender**: client
   **timestamp**: (today, 10:00 AM)
   **platform**: whatsapp

2. **conversation_id**: CONV-2024-1
   **client**: [Link to John Smith]
   **message_text**: Thank you for reaching out! How can we help you today?
   **sender**: agent
   **timestamp**: (today, 10:05 AM)
   **platform**: whatsapp

3. **conversation_id**: CONV-2024-1
   **client**: [Link to John Smith]
   **message_text**: I need more information about your pricing
   **sender**: client
   **timestamp**: (today, 10:10 AM)
   **platform**: whatsapp

### Message Set 2 (Sarah Johnson - CONV-2024-2)
1. **conversation_id**: CONV-2024-2
   **client**: [Link to Sarah Johnson]
   **message_text**: What are your business hours?
   **sender**: client
   **timestamp**: (yesterday, 2:00 PM)
   **platform**: sms

2. **conversation_id**: CONV-2024-2
   **client**: [Link to Sarah Johnson]
   **message_text**: We're open Monday-Friday, 9 AM to 6 PM
   **sender**: agent
   **timestamp**: (yesterday, 2:15 PM)
   **platform**: sms

3. **conversation_id**: CONV-2024-2
   **client**: [Link to Sarah Johnson]
   **message_text**: Perfect! Can I schedule an appointment?
   **sender**: client
   **timestamp**: (yesterday, 2:20 PM)
   **platform**: sms

4. **conversation_id**: CONV-2024-2
   **client**: [Link to Sarah Johnson]
   **message_text**: Absolutely! What day works best for you?
   **sender**: agent
   **timestamp**: (yesterday, 2:25 PM)
   **platform**: sms

### Message Set 3 (Michael Brown - CONV-2024-3)
1. **conversation_id**: CONV-2024-3
   **client**: [Link to Michael Brown]
   **message_text**: Hello, I saw your ad on Facebook
   **sender**: client
   **timestamp**: (2 days ago, 11:00 AM)
   **platform**: messenger

2. **conversation_id**: CONV-2024-3
   **client**: [Link to Michael Brown]
   **message_text**: Welcome! What caught your interest?
   **sender**: agent
   **timestamp**: (2 days ago, 11:10 AM)
   **platform**: messenger

3. **conversation_id**: CONV-2024-3
   **client**: [Link to Michael Brown]
   **message_text**: The special offer you mentioned
   **sender**: client
   **timestamp**: (2 days ago, 11:15 AM)
   **platform**: messenger

4. **conversation_id**: CONV-2024-3
   **client**: [Link to Michael Brown]
   **message_text**: Great! Let me share the details with you...
   **sender**: agent
   **timestamp**: (2 days ago, 11:20 AM)
   **platform**: messenger

5. **conversation_id**: CONV-2024-3
   **client**: [Link to Michael Brown]
   **message_text**: This looks good! How do I proceed?
   **sender**: client
   **timestamp**: (2 days ago, 11:30 AM)
   **platform**: messenger

### Message Set 4 (Emily Davis - CONV-2024-4)
1. **conversation_id**: CONV-2024-4
   **client**: [Link to Emily Davis]
   **message_text**: Is this service available in my area?
   **sender**: client
   **timestamp**: (3 days ago, 9:00 AM)
   **platform**: whatsapp

2. **conversation_id**: CONV-2024-4
   **client**: [Link to Emily Davis]
   **message_text**: Which area are you located in?
   **sender**: agent
   **timestamp**: (3 days ago, 9:05 AM)
   **platform**: whatsapp

3. **conversation_id**: CONV-2024-4
   **client**: [Link to Emily Davis]
   **message_text**: I'm in downtown
   **sender**: client
   **timestamp**: (3 days ago, 9:10 AM)
   **platform**: whatsapp

4. **conversation_id**: CONV-2024-4
   **client**: [Link to Emily Davis]
   **message_text**: Yes, we serve that area!
   **sender**: agent
   **timestamp**: (3 days ago, 9:15 AM)
   **platform**: whatsapp

5. **conversation_id**: CONV-2024-4
   **client**: [Link to Emily Davis]
   **message_text**: Thanks for the info!
   **sender**: client
   **timestamp**: (3 days ago, 9:20 AM)
   **platform**: whatsapp

### Message Set 5 (David Wilson - CONV-2024-5)
1. **conversation_id**: CONV-2024-5
   **client**: [Link to David Wilson]
   **message_text**: Do you offer payment plans?
   **sender**: client
   **timestamp**: (today, 3:00 PM)
   **platform**: sms

2. **conversation_id**: CONV-2024-5
   **client**: [Link to David Wilson]
   **message_text**: Yes, we have flexible payment options available
   **sender**: agent
   **timestamp**: (today, 3:10 PM)
   **platform**: sms

## Airtable Import Instructions

### Method 1: Manual Entry
1. Open your Airtable base
2. Go to the Clients table
3. Click the "+" button to add a new record
4. Fill in the fields with the sample data above
5. Repeat for all clients
6. Then add messages to the Messages table
7. Link messages to their respective clients

### Method 2: CSV Import

Create two CSV files:

**clients.csv:**
```csv
phone_number,name,status
+1234567890,John Smith,New
+1234567891,Sarah Johnson,Responded
+1234567892,Michael Brown,Interested
+1234567893,Emily Davis,Closed
+1234567894,David Wilson,New
+1234567895,Lisa Anderson,Responded
+1234567896,James Martinez,Interested
+1234567897,Jennifer Taylor,Closed
+1234567898,Robert Thomas,New
+1234567899,Maria Garcia,Interested
```

**messages.csv:**
```csv
conversation_id,message_text,sender,platform
CONV-2024-1,Hi I'm interested in your services,client,whatsapp
CONV-2024-1,Thank you for reaching out! How can we help you today?,agent,whatsapp
CONV-2024-2,What are your business hours?,client,sms
CONV-2024-2,We're open Monday-Friday 9 AM to 6 PM,agent,sms
CONV-2024-3,Hello I saw your ad on Facebook,client,messenger
CONV-2024-3,Welcome! What caught your interest?,agent,messenger
```

Import instructions:
1. In Airtable, click on the table name
2. Select "Import data"
3. Choose "CSV file"
4. Upload your CSV file
5. Map the columns to the correct fields
6. Click "Import"

### Method 3: Airtable API (Advanced)

Use the Airtable API to bulk import data. Here's a sample script:

```javascript
const Airtable = require('airtable');

const base = new Airtable({apiKey: 'YOUR_API_KEY'}).base('YOUR_BASE_ID');

const clients = [
  { fields: { phone_number: '+1234567890', name: 'John Smith', status: 'New' } },
  { fields: { phone_number: '+1234567891', name: 'Sarah Johnson', status: 'Responded' } },
  // Add more clients...
];

base('Clients').create(clients, function(err, records) {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach(function(record) {
    console.log('Created client:', record.getId());
  });
});
```

## Testing Scenarios

### Scenario 1: New Client Flow
1. Add a new client with status "New"
2. Add initial message from client
3. Add response from agent
4. Update client status to "Responded"
5. View the conversation in the dashboard

### Scenario 2: Complete Conversation
1. Create a client with multiple messages back and forth
2. Test filters and search
3. Export the conversation to PDF
4. Verify all messages are displayed correctly

### Scenario 3: Multiple Platforms
1. Create clients with messages from different platforms (WhatsApp, SMS, Messenger)
2. Test platform filtering in the Messages view
3. Verify platform icons display correctly
4. Check analytics platform breakdown

### Scenario 4: Status Pipeline
1. Create clients in each status (New, Responded, Interested, Closed)
2. View status breakdown on dashboard
3. Test status filtering on Clients page
4. Update statuses and verify changes

### Scenario 5: Date-based Analytics
1. Create clients and messages across different dates
2. Test different date ranges in Analytics
3. Verify "Messages over time" chart displays correctly
4. Check "New clients today" counter

## Data Validation Checklist

- [ ] All clients have phone numbers
- [ ] All clients have names
- [ ] All clients have valid status values
- [ ] Messages are linked to the correct clients
- [ ] Conversation IDs match the pattern (CONV-YYYY-ID)
- [ ] Message timestamps are in correct format
- [ ] Sender field uses correct values (client/agent)
- [ ] Platform field uses correct values (whatsapp/sms/messenger)

## Tips for Best Results

1. **Use realistic data**: Makes testing more meaningful
2. **Vary timestamps**: Helps test date filtering and analytics
3. **Include edge cases**: Empty messages, special characters, long text
4. **Test all platforms**: WhatsApp, SMS, and Messenger
5. **Create conversations**: Multiple messages per client shows flow
6. **Mix statuses**: Test filtering and status updates
7. **Add today's data**: Tests "New today" and real-time features

## Cleaning Up Test Data

When you're done testing and ready for production:

1. Delete all test records from Airtable
2. Or create a new Airtable base for production
3. Update your `.env` file with the production base ID
4. Restart the application

## Additional Resources

- [Airtable API Documentation](https://airtable.com/api)
- [Airtable Import Guide](https://support.airtable.com/hc/en-us/articles/203313915-Importing-data-into-Airtable)
- [CSV Format Guide](https://support.airtable.com/hc/en-us/articles/203313905-CSV-file-requirements)
