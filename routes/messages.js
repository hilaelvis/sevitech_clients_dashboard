const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const airtableService = require('../services/airtableService');
const {
  formatDate,
  formatRelativeTime,
  paginate,
  exportMessagesToCSV,
  getPlatformIcon
} = require('../utils/helpers');

// Messages page - showing conversations
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const { search, sender, platform, page = 1 } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (sender) filters.sender = sender;
    if (platform) filters.platform = platform;

    // Get all messages and clients
    const messages = await airtableService.getAllMessages(filters);
    const clients = await airtableService.getAllClients();

    // Group messages by conversation_id
    const conversationMap = new Map();

    messages.forEach(message => {
      if (!conversationMap.has(message.conversation_id)) {
        const client = clients.find(c => c.conversation_id === message.conversation_id);
        conversationMap.set(message.conversation_id, {
          conversation_id: message.conversation_id,
          lastMessage: message.message_text,
          lastMessageTime: message.timestamp,
          platform: message.platform,
          clientId: client ? client.id : null,
          clientName: client ? client.name : 'Unknown',
          clientPhone: client ? client.phone_number : 'N/A',
          clientStatus: client ? client.status : 'Unknown',
          messageCount: 1
        });
      } else {
        // Update message count
        const conv = conversationMap.get(message.conversation_id);
        conv.messageCount++;
      }
    });

    // Convert to array and sort by last message time
    let conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    // Paginate conversations
    const paginatedConversations = paginate(conversations, parseInt(page), 20);

    res.render('messages', {
      title: 'Messages',
      conversations: paginatedConversations.data,
      pagination: {
        currentPage: paginatedConversations.currentPage,
        totalPages: paginatedConversations.totalPages,
        totalItems: paginatedConversations.totalItems,
        hasNext: paginatedConversations.hasNext,
        hasPrev: paginatedConversations.hasPrev
      },
      filters: { search, sender, platform },
      formatDate,
      formatRelativeTime,
      getPlatformIcon
    });
  } catch (error) {
    next(error);
  }
});

// Export messages to CSV
router.get('/export/csv', ensureAuthenticated, async (req, res, next) => {
  try {
    const { search, sender, platform } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (sender) filters.sender = sender;
    if (platform) filters.platform = platform;

    const messages = await airtableService.getAllMessages(filters);
    const csv = exportMessagesToCSV(messages);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=messages.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
