const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const airtableService = require('../services/airtableService');
const {
  formatDate,
  formatRelativeTime,
  paginate,
  exportClientsToCSV,
  generateConversationPDF,
  getStatusColor,
  getPlatformIcon
} = require('../utils/helpers');

// Export clients to CSV (must be before /:id route)
router.get('/export/csv', ensureAuthenticated, async (req, res, next) => {
  try {
    const clients = await airtableService.getAllClients();
    const csv = exportClientsToCSV(clients);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=clients.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

// Clients list page
router.get('/', ensureAuthenticated, async (req, res, next) => {
  try {
    const { search, status, category, date_range, page = 1 } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (date_range) filters.date_range = date_range;

    const clients = await airtableService.getAllClients(filters);
    const paginatedClients = paginate(clients, parseInt(page), 20);

    res.render('clients', {
      title: 'Clients',
      clients: paginatedClients.data,
      pagination: {
        currentPage: paginatedClients.currentPage,
        totalPages: paginatedClients.totalPages,
        totalItems: paginatedClients.totalItems,
        hasNext: paginatedClients.hasNext,
        hasPrev: paginatedClients.hasPrev
      },
      filters: { search, status, category, date_range },
      formatDate,
      formatRelativeTime,
      getStatusColor
    });
  } catch (error) {
    next(error);
  }
});

// Client detail page
router.get('/:id', ensureAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await airtableService.getClientById(id);
    let messages = [];
    try {
      messages = await airtableService.getMessagesByConversationId(client.conversation_id);
    } catch (msgError) {
      console.error('Failed to load messages:', msgError);
    }

    res.render('client-detail', {
      title: `Client: ${client.business_name}`,
      client,
      messages,
      formatDate,
      formatRelativeTime,
      getStatusColor,
      getPlatformIcon
    });
  } catch (error) {
    next(error);
  }
});

// Update client status
router.post('/:id/status', ensureAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await airtableService.updateClientStatus(id, status);

    if (req.accepts('json') === 'json') {
      return res.json({ ok: true });
    }
    req.flash('success_msg', 'Status updated');
    res.redirect(`/clients/${id}`);
  } catch (error) {
    if (req.accepts('json') === 'json') {
      return res.status(500).json({ ok: false });
    }
    next(error);
  }
});

// Update client details
router.post('/:id/update', ensureAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { business_name, phone } = req.body;

    await airtableService.updateClientDetails(id, { business_name, phone });

    req.flash('success_msg', 'Client details updated successfully');
    res.redirect(`/clients/${id}`);
  } catch (error) {
    next(error);
  }
});

// Export conversation to PDF
router.get('/:id/export/pdf', ensureAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const client = await airtableService.getClientById(id);
    const messages = await airtableService.getMessagesByConversationId(client.conversation_id);

    const pdfBuffer = await generateConversationPDF(client, messages);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=conversation-${client.conversation_id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
