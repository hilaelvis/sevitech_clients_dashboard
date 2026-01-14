// Main JavaScript for Sevitech Dashboard

// Sidebar toggle
function initMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('sidebar-toggle');

  if (!sidebar || !toggleButton) return;

  // Toggle sidebar
  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-collapsed');

    // Change width
    if (sidebar.classList.contains('sidebar-collapsed')) {
      sidebar.style.width = '0';
      sidebar.style.minWidth = '0';
      sidebar.style.overflow = 'hidden';
    } else {
      sidebar.style.width = '16rem'; // w-64
      sidebar.style.minWidth = '16rem';
      sidebar.style.overflow = 'auto';
    }
  });
}

// Dark mode functionality
function initDarkMode() {
  // Check for saved theme preference or default to light mode
  const theme = localStorage.getItem('theme') || 'light';

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  // Theme toggle buttons
  const toggleButtons = document.querySelectorAll('#theme-toggle, #settings-theme-toggle');

  toggleButtons.forEach(button => {
    button?.addEventListener('click', () => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  });
}

// Toast notification function
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Refresh button functionality
function initRefreshButton() {
  const refreshBtn = document.getElementById('refresh-btn');

  refreshBtn?.addEventListener('click', async () => {
    const icon = refreshBtn.querySelector('i');
    icon.classList.add('fa-spin');

    try {
      // Reload the current page
      window.location.reload();
    } catch (error) {
      showToast('Failed to refresh data', 'error');
    } finally {
      setTimeout(() => {
        icon.classList.remove('fa-spin');
      }, 1000);
    }
  });
}

// Auto-refresh for dashboard (every 30 seconds)
function initAutoRefresh() {
  if (window.location.pathname === '/dashboard') {
    setInterval(async () => {
      try {
        const response = await fetch('/dashboard/api/stats');
        const stats = await response.json();

        // Update stats on page
        const statElements = document.querySelectorAll('.text-3xl');
        if (statElements.length >= 4) {
          statElements[0].textContent = stats.totalClients;
          statElements[1].textContent = stats.newClientsToday;
          statElements[2].textContent = stats.activeConversations;
          statElements[3].textContent = stats.messagesToday;
        }
      } catch (error) {
        console.error('Failed to refresh stats:', error);
      }
    }, 30000);
  }
}

// Form validation
function initFormValidation() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      const requiredInputs = form.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
        } else {
          input.classList.remove('border-red-500');
        }
      });

      if (!isValid) {
        e.preventDefault();
        showToast('Please fill in all required fields', 'error');
      }
    });
  });
}

// Confirm dialogs for destructive actions
function confirmAction(message) {
  return confirm(message);
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard', 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Debounce function for search inputs
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Search functionality
function initSearch() {
  const searchInputs = document.querySelectorAll('input[name="search"]');

  searchInputs.forEach(input => {
    const form = input.closest('form');
    if (!form) return;

    const debouncedSubmit = debounce(() => {
      // Auto-submit search after typing stops
      // Commented out to avoid too many requests
      // form.submit();
    }, 500);

    input.addEventListener('input', debouncedSubmit);
  });
}

// Loading state for buttons
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

// Handle AJAX form submissions
function initAjaxForms() {
  const ajaxForms = document.querySelectorAll('[data-ajax="true"]');

  ajaxForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) setButtonLoading(submitBtn, true);

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method,
          body: formData
        });

        if (response.ok) {
          showToast('Action completed successfully', 'success');

          // Reload page after a delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          showToast('Action failed', 'error');
        }
      } catch (error) {
        showToast('An error occurred', 'error');
      } finally {
        if (submitBtn) setButtonLoading(submitBtn, false);
      }
    });
  });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('input[name="search"]');
      if (searchInput) searchInput.focus();
    }

    // Escape to close modals or clear search
    if (e.key === 'Escape') {
      const searchInput = document.querySelector('input[name="search"]');
      if (searchInput && searchInput === document.activeElement) {
        searchInput.value = '';
        searchInput.blur();
      }
    }
  });
}

// Session timeout warning
function initSessionTimeout() {
  let timeoutWarning;
  let timeoutLogout;

  function resetTimeout() {
    clearTimeout(timeoutWarning);
    clearTimeout(timeoutLogout);

    // Warn 5 minutes before timeout (25 minutes)
    timeoutWarning = setTimeout(() => {
      showToast('Your session will expire in 5 minutes', 'info');
    }, 25 * 60 * 1000);

    // Logout at 30 minutes
    timeoutLogout = setTimeout(() => {
      showToast('Session expired. Redirecting to login...', 'error');
      setTimeout(() => {
        window.location.href = '/auth/logout';
      }, 2000);
    }, 30 * 60 * 1000);
  }

  // Reset timeout on user activity
  ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetTimeout, true);
  });

  resetTimeout();
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  initMobileSidebar();
  initDarkMode();
  initRefreshButton();
  initAutoRefresh();
  initFormValidation();
  initSearch();
  initAjaxForms();
  initKeyboardShortcuts();
  initSessionTimeout();

  // Show any flash messages as toasts
  const successMsg = document.querySelector('[data-success-msg]');
  const errorMsg = document.querySelector('[data-error-msg]');

  if (successMsg) {
    showToast(successMsg.dataset.successMsg, 'success');
  }

  if (errorMsg) {
    showToast(errorMsg.dataset.errorMsg, 'error');
  }
});

// Export functions for use in inline scripts
window.showToast = showToast;
window.confirmAction = confirmAction;
window.copyToClipboard = copyToClipboard;
window.formatNumber = formatNumber;
