const moment = require('moment');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// Format date helper
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return 'N/A';
  return moment(date).format(format);
};

// Format relative time
const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  return moment(date).fromNow();
};

// Paginate array
const paginate = (array, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  return {
    data: array.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(array.length / limit),
    totalItems: array.length,
    hasNext: endIndex < array.length,
    hasPrev: startIndex > 0
  };
};

// Export clients to CSV
const exportClientsToCSV = (clients) => {
  try {
    const fields = [
      { label: 'Name', value: 'name' },
      { label: 'Phone Number', value: 'phone_number' },
      { label: 'Status', value: 'status' },
      { label: 'Conversation ID', value: 'conversation_id' },
      { label: 'Created Date', value: 'created_time' }
    ];

    const parser = new Parser({ fields });
    return parser.parse(clients);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

// Export messages to CSV
const exportMessagesToCSV = (messages) => {
  try {
    const fields = [
      { label: 'Conversation ID', value: 'conversation_id' },
      { label: 'Message', value: 'message_text' },
      { label: 'Sender', value: 'sender' },
      { label: 'Platform', value: 'platform' },
      { label: 'Timestamp', value: 'timestamp' }
    ];

    const parser = new Parser({ fields });
    return parser.parse(messages);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

// Generate conversation PDF
const generateConversationPDF = (client, messages) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Conversation Export', { align: 'center' });
      doc.moveDown();

      // Client details
      doc.fontSize(12).text(`Client: ${client.name}`, { continued: false });
      doc.text(`Phone: ${client.phone_number}`);
      doc.text(`Conversation ID: ${client.conversation_id}`);
      doc.text(`Status: ${client.status}`);
      doc.text(`Created: ${formatDate(client.created_time)}`);
      doc.moveDown();

      // Messages
      doc.fontSize(14).text('Messages:', { underline: true });
      doc.moveDown();

      messages.forEach((msg, index) => {
        const sender = msg.sender === 'client' ? client.name : 'Agent';
        const time = formatDate(msg.timestamp, 'MMM DD, YYYY HH:mm');

        doc.fontSize(10)
          .fillColor('#666')
          .text(`${sender} - ${time} - ${msg.platform}`, { continued: false });

        doc.fontSize(11)
          .fillColor('#000')
          .text(msg.message_text, { indent: 20 });

        doc.moveDown(0.5);

        // Add page break if needed
        if (doc.y > 700) {
          doc.addPage();
        }
      });

      // Footer
      doc.fontSize(8)
        .fillColor('#999')
        .text(
          `Generated on ${formatDate(new Date())}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Truncate text
const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Get status badge color
const getStatusColor = (status) => {
  const colors = {
    'New': 'bg-blue-100 text-blue-800',
    'Responded': 'bg-yellow-100 text-yellow-800',
    'Interested': 'bg-green-100 text-green-800',
    'Closed': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get platform icon
const getPlatformIcon = (platform) => {
  const icons = {
    'whatsapp': '<i class="fab fa-whatsapp text-green-500"></i>',
    'sms': '<i class="fas fa-sms text-blue-500"></i>',
    'messenger': '<i class="fab fa-facebook-messenger text-blue-600"></i>'
  };
  return icons[platform] || '<i class="fas fa-envelope text-gray-500"></i>';
};

module.exports = {
  formatDate,
  formatRelativeTime,
  paginate,
  exportClientsToCSV,
  exportMessagesToCSV,
  generateConversationPDF,
  truncate,
  getStatusColor,
  getPlatformIcon
};
