const { base, TABLES } = require('../config/airtable');
const moment = require('moment');

class AirtableService {
  // Get all clients with optional filters
  async getAllClients(filters = {}) {
    try {
      const clients = [];

      // Build filter formula by combining all filters
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
          SEARCH(LOWER('${searchTerm}'), LOWER({name})),
          SEARCH('${searchTerm}', {phone_number}),
          SEARCH('${searchTerm}', {conversation_id})
        )`);
      }

      // Build query with combined filters
      const queryOptions = {
        sort: [{ field: 'created_time', direction: 'desc' }]
      };

      if (filterConditions.length > 0) {
        queryOptions.filterByFormula = filterConditions.length === 1
          ? filterConditions[0]
          : `AND(${filterConditions.join(', ')})`;
      }

      const query = base(TABLES.CLIENTS).select(queryOptions);

      await query.eachPage((records, fetchNextPage) => {
        records.forEach(record => {
          clients.push({
            id: record.id,
            recordId: record.id,
            phone_number: record.get('phone_number'),
            name: record.get('name'),
            status: record.get('Status'),
            phone_type: record.get('phone_type'),
            conversation_id: record.get('conversation_id'),
            created_time: record.get('created_time'),
            messages: record.get('Messages') || []
          });
        });
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
      return {
        id: record.id,
        recordId: record.id,
        phone_number: record.get('phone_number'),
        name: record.get('name'),
        status: record.get('Status'),
        phone_type: record.get('phone_type'),
        conversation_id: record.get('conversation_id'),
        created_time: record.get('created_time'),
        messages: record.get('Messages') || []
      };
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

      if (records.length === 0) {
        return null;
      }

      const record = records[0];
      return {
        id: record.id,
        recordId: record.id,
        phone_number: record.get('phone_number'),
        name: record.get('name'),
        status: record.get('Status'),
        phone_type: record.get('phone_type'),
        conversation_id: record.get('conversation_id'),
        created_time: record.get('created_time'),
        messages: record.get('Messages') || []
      };
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

      // Apply filters
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
      const record = await base(TABLES.CLIENTS).update(id, {
        Status: status
      });

      return {
        id: record.id,
        status: record.get('Status')
      };
    } catch (error) {
      console.error('Error updating client status:', error);
      throw error;
    }
  }

  // Update client details
  async updateClientDetails(id, data) {
    try {
      const updateFields = {};
      if (data.name) updateFields.name = data.name;
      if (data.phone_number) updateFields.phone_number = data.phone_number;

      const record = await base(TABLES.CLIENTS).update(id, updateFields);

      return {
        id: record.id,
        name: record.get('name'),
        phone_number: record.get('phone_number')
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

      // Count new clients today
      const newClientsToday = clients.filter(client =>
        moment(client.created_time).isSameOrAfter(today)
      ).length;

      // Count messages today
      const messagesToday = messages.filter(msg =>
        moment(msg.timestamp).isSameOrAfter(today)
      ).length;

      // Count by status
      const statusBreakdown = {
        New: 0,
        Responded: 0,
        Interested: 0,
        'Was Send': 0,
        Closed: 0
      };

      clients.forEach(client => {
        if (statusBreakdown.hasOwnProperty(client.status)) {
          statusBreakdown[client.status]++;
        }
      });

      // Active conversations (clients with messages in last 24 hours)
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

      // Messages over time
      const messagesOverTime = {};
      messages
        .filter(msg => moment(msg.timestamp).isAfter(startDate))
        .forEach(msg => {
          const date = moment(msg.timestamp).format('YYYY-MM-DD');
          messagesOverTime[date] = (messagesOverTime[date] || 0) + 1;
        });

      // Platform breakdown
      const platformBreakdown = {};
      messages.forEach(msg => {
        const platform = msg.platform || 'unknown';
        platformBreakdown[platform] = (platformBreakdown[platform] || 0) + 1;
      });

      // Status breakdown
      const statusBreakdown = {};
      clients.forEach(client => {
        const status = client.status || 'unknown';
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
      });

      // Sender breakdown (client vs agent)
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

      // Group messages by conversation and get the most recent message for each
      const conversationMap = new Map();

      messages.forEach(message => {
        if (!conversationMap.has(message.conversation_id)) {
          const client = clients.find(c => c.conversation_id === message.conversation_id);
          conversationMap.set(message.conversation_id, {
            ...message,
            clientId: client ? client.id : null,
            clientName: client ? client.name : 'Unknown',
            clientPhone: client ? client.phone_number : 'N/A',
            clientStatus: client ? client.status : 'Unknown'
          });
        }
      });

      // Convert to array and sort by timestamp, then limit
      const recentConversations = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      return recentConversations;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }
}

module.exports = new AirtableService();
