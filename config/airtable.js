const Airtable = require('airtable');

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// Table names
const TABLES = {
  CLIENTS: 'Clients',
  MESSAGES: 'Messages'
};

module.exports = {
  base,
  TABLES
};
