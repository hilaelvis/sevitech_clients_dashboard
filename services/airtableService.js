const { base, TABLES } = require('../config/airtable');
const moment = require('moment');

const mapClient = (record) => ({
  id: record.id,
  recordId: record.id,
  business_name: record.get('business_name'),
  category: record.get('category'),
  phone: record.get('phone'),
  website: record.get('website'),
  email: record.get('email'),
  address: record.get('address'),
  rating: record.get('rating'),
  facebook: record.get('facebook'),
  instagram: record.get('instagram'),
  linkedin: record.get('linkedin'),
  twitter: record.get('twitter'),
  tiktok: record.get('tiktok'),
  youtube: record.get('youtube'),
  web_phones: record.get('web_phones'),
  web_emails: record.get('web_emails'),
  scraped_at: record.get('scraped_at'),
  status: record.get('Status'),
  phone_type: record.get('phone_type'),
  conversation_id: record.get('conversation_id'),
  created_time: record.get('created_time'),
  messages: record.get('Messages') || []
});

class AirtableService {
  // Get all clients with optional filters
  async getAllClients(filters = {}) {
    try {
      const clients = [];
      const filterConditions = [];

      if (filters.status) {
        filterConditions.push(`{Status} = '${filters.status}'`);
      }

      if (filters.phone_type) {
        filterConditions.push(`{phone_type} = '${filters.phone_type}'`);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filterConditions.push(`OR(
          SEARCH(LOWER('${searchTerm}'), LOWER({business_name})),
          SEARCH('${searchTerm}', {phone}),
          SEARCH('${searchTerm}', {conversation_id})
        )`);
      }

      const queryOptions = {
        sort: [{ field: 'created_time', direction: 'desc' }]
      };

      if (filterConditions.length > 0) {
        queryOptions.filterByFormula = filterConditions.length === 1
          ? filterConditions[0]
          : `AND(${filterConditions.join(', ')})`;
      }

      await base(TABLES.CLIENTS).select(queryOptions).eachPage((records, fetchNextPage) => {
        records.forEach(record => clients.push(mapClient(record)));
        fetchNextPage();
      });

      return clients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  // Get client by ID
  async getClientById(id) {
    try {
      const record = await base(TABLES.CLIENTS).find(id);
      return mapClient(record);
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  }

  // Get client by conversation ID
  async getClientByConversationId(conversationId) {
    try {
      const records = await base(TABLES.CLIENTS).select({
        filterByFormula: `{conversation_id} = '${conversationId}'`,
        maxRecords: 1
      }).firstPage();

      if (records.length === 0) return null;
      return mapClient(records[0]);
    } catch (error) {
      console.error('Error fetching client by conversation ID:', error);
      throw error;
    }
  }

  // Get all messages
  async getAllMessages(filters = {}) {
    try {
      const messages = [];
      let query = base(TABLES.MESSAGES).select({
        sort: [{ field: 'timestamp', direction: 'desc' }]
      });

      if (filters.sender) {
        query = base(TABLES.MESSAGES).select({
          filterByFormula: `{sender} = '${filters.sender}'`,
          sort: [{ field: 'timestamp', direction: 'desc' }]
        });
      }

      if (filters.platform) {
        query = base(TABLES.MESSAGES).select({
          filterByFormula: `{platform} = '${filters.platform}'`,
          sort: [{ field: 'timestamp', direction: 'desc' }]
        });
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = base(TABLES.MESSAGES).select({
          filterByFormula: `SEARCH(LOWER('${searchTerm}'), LOWER({message_text}))`,
          sort: [{ field: 'timestamp', direction: 'desc' }]
        });
      }

      await query.eachPage((records, fetchNextPage) => {
        records.forEach(record => {
          messages.push({
            id: record.id,
            conversation_id: record.get('conversation_id'),
            client: record.get('client'),
            message_text: record.get('message_text'),
            sender: record.get('sender'),
            timestamp: record.get('timestamp'),
            platform: record.get('platform')
          });
        });
        fetchNextPage();
      });

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Get messages by conversation ID
  async getMessagesByConversationId(conversationId) {
    try {
      const messages = [];

      await base(TABLES.MESSAGES).select({
        filterByFormula: `{conversation_id} = '${conversationId}'`,
        sort: [{ field: 'timestamp', direction: 'asc' }]
      }).eachPage((records, fetchNextPage) => {
        records.forEach(record => {
          messages.push({
            id: record.id,
            conversation_id: record.get('conversation_id'),
            client: record.get('client'),
            message_text: record.get('message_text'),
            sender: record.get('sender'),
            timestamp: record.get('timestamp'),
            platform: record.get('platform')
          });
        });
        fetchNextPage();
      });

      return messages;
    } catch (error) {
      console.error('Error fetching messages by conversation ID:', error);
      throw error;
    }
  }

  // Update client status
  async updateClientStatus(id, status) {
    try {
      const record = await base(TABLES.CLIENTS).update(id, { Status: status });
      return { id: record.id, status: record.get('Status') };
    } catch (error) {
      console.error('Error updating client status:', error);
      throw error;
    }
  }

  // Update client details
  async updateClientDetails(id, data) {
    try {
      const updateFields = {};
      if (data.business_name) updateFields.business_name = data.business_name;
      if (data.phone) updateFields.phone = data.phone;

      const record = await base(TABLES.CLIENTS).update(id, updateFields);
      return {
        id: record.id,
        business_name: record.get('business_name'),
        phone: record.get('phone')
      };
    } catch (error) {
      console.error('Error updating client details:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const clients = await this.getAllClients();
      const messages = await this.getAllMessages();

      const today = moment().startOf('day');

      const newClientsToday = clients.filter(client =>
        moment(client.created_time).isSameOrAfter(today)
      ).length;

      const messagesToday = messages.filter(msg =>
        moment(msg.timestamp).isSameOrAfter(today)
      ).length;

      const statusBreakdown = {
        New: 0,
        Responded: 0,
        Interested: 0,
        'Was Sent': 0,
        Closed: 0
      };

      clients.forEach(client => {
        if (statusBreakdown.hasOwnProperty(client.status)) {
          statusBreakdown[client.status]++;
        }
      });

      const yesterday = moment().subtract(24, 'hours');
      const activeConversations = new Set(
        messages
          .filter(msg => moment(msg.timestamp).isAfter(yesterday))
          .map(msg => msg.conversation_id)
      ).size;

      return {
        totalClients: clients.length,
        newClientsToday,
        activeConversations,
        messagesToday,
        statusBreakdown
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics(dateRange = 30) {
    try {
      const clients = await this.getAllClients();
      const messages = await this.getAllMessages();

      const startDate = moment().subtract(dateRange, 'days').startOf('day');

      const messagesOverTime = {};
      messages
        .filter(msg => moment(msg.timestamp).isAfter(startDate))
        .forEach(msg => {
          const date = moment(msg.timestamp).format('YYYY-MM-DD');
          messagesOverTime[date] = (messagesOverTime[date] || 0) + 1;
        });

      const platformBreakdown = {};
      messages.forEach(msg => {
        const platform = msg.platform || 'unknown';
        platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
      });

      const statusBreakdown = {};
      clients.forEach(client => {
        const status = client.status || 'unknown';
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
      });

      const senderBreakdown = {};
      messages.forEach(msg => {
        const sender = msg.sender || 'unknown';
        senderBreakdown[sender] = (senderBreakdown[sender] || 0) + 1;
      });

      return {
        messagesOverTime,
        platformBreakdown,
        statusBreakdown,
        senderBreakdown,
        totalMessages: messages.length,
        totalClients: clients.length
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      const messages = await this.getAllMessages();
      const clients = await this.getAllClients();

      const conversationMap = new Map();

      messages.forEach(message => {
        if (!conversationMap.has(message.conversation_id)) {
          const client = clients.find(c => c.conversation_id === message.conversation_id);
          conversationMap.set(message.conversation_id, {
            ...message,
            clientId: client ? client.id : null,
            clientName: client ? client.business_name : 'Unknown',
            clientPhone: client ? client.phone : 'N/A',
            clientStatus: client ? client.status : 'Unknown'
          });
        }
      });

      return Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
}

module.exports = new AirtableService();
