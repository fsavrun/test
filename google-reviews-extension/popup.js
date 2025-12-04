// Google Reviews Extractor - Popup Script

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const extractBtn = document.getElementById('extractBtn');
  const scrollLoadBtn = document.getElementById('scrollLoadBtn');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const copyCsvBtn = document.getElementById('copyCsvBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const statusEl = document.getElementById('status');
  const statsEl = document.getElementById('stats');
  const reviewCountEl = document.getElementById('reviewCount');
  const reviewsContainerEl = document.getElementById('reviewsContainer');
  const reviewsListEl = document.getElementById('reviewsList');
  const noReviewsEl = document.getElementById('noReviews');

  // Store extracted reviews
  let extractedReviews = [];

  // Initialize
  init();

  function init() {
    // Check if we're on a valid page
    checkCurrentPage();

    // Add event listeners
    extractBtn.addEventListener('click', handleExtract);
    scrollLoadBtn.addEventListener('click', handleScrollLoad);
    copyJsonBtn.addEventListener('click', () => copyToClipboard('json'));
    copyCsvBtn.addEventListener('click', () => copyToClipboard('csv'));
    downloadBtn.addEventListener('click', handleDownload);
  }

  // Check if current page is a Google reviews page
  async function checkCurrentPage() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab.url) {
        showStatus('Cannot access this page', 'error');
        disableButtons();
        return;
      }

      const isGooglePage = tab.url.includes('google.com/maps') ||
                           tab.url.includes('maps.google.com') ||
                           tab.url.includes('google.com/search');

      if (!isGooglePage) {
        showStatus('Please navigate to Google Maps or Google Search', 'error');
        disableButtons();
      } else {
        showStatus('Ready to extract reviews!', 'success');
      }
    } catch (error) {
      showStatus('Error checking page', 'error');
      console.error(error);
    }
  }

  // Handle extract button click
  async function handleExtract() {
    try {
      extractBtn.disabled = true;
      extractBtn.classList.add('loading');
      showStatus('Extracting reviews...', '');

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // First, ensure content script is injected
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
      } catch (e) {
        // Script might already be injected, continue
        console.log('Script injection note:', e.message);
      }

      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractReviews' });

      if (response && response.reviews) {
        extractedReviews = response.reviews;
        displayResults(extractedReviews);
      } else {
        showNoReviews();
      }
    } catch (error) {
      console.error('Extraction error:', error);
      showStatus('Error extracting reviews. Try refreshing the page.', 'error');
      showNoReviews();
    } finally {
      extractBtn.disabled = false;
      extractBtn.classList.remove('loading');
    }
  }

  // Handle scroll to load more
  async function handleScrollLoad() {
    try {
      scrollLoadBtn.disabled = true;
      scrollLoadBtn.classList.add('loading');
      showStatus('Scrolling to load more reviews...', '');

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      await chrome.tabs.sendMessage(tab.id, { action: 'scrollLoadMore' });

      showStatus('Scrolled! Click Extract to get new reviews.', 'success');
    } catch (error) {
      console.error('Scroll error:', error);
      showStatus('Error scrolling. Try manually scrolling the page.', 'error');
    } finally {
      scrollLoadBtn.disabled = false;
      scrollLoadBtn.classList.remove('loading');
    }
  }

  // Display extraction results
  function displayResults(reviews) {
    if (!reviews || reviews.length === 0) {
      showNoReviews();
      return;
    }

    // Update stats
    reviewCountEl.textContent = reviews.length;
    statsEl.classList.remove('hidden');

    // Build reviews HTML
    reviewsListEl.innerHTML = '';
    reviews.forEach((review, index) => {
      const reviewEl = createReviewElement(review, index);
      reviewsListEl.appendChild(reviewEl);
    });

    // Show container
    reviewsContainerEl.classList.remove('hidden');
    noReviewsEl.classList.add('hidden');

    showStatus(`Found ${reviews.length} reviews!`, 'success');
  }

  // Create a single review element
  function createReviewElement(review, index) {
    const div = document.createElement('div');
    div.className = 'review-item';

    const ratingStars = review.rating ?
      '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating) :
      'No rating';

    div.innerHTML = `
      <div class="review-header">
        <span class="reviewer-name">${escapeHtml(review.name)}</span>
        <span class="review-date">${escapeHtml(review.date)}</span>
      </div>
      <div class="review-rating">${ratingStars}</div>
      <div class="review-text">${escapeHtml(review.text) || '<em>No review text</em>'}</div>
    `;

    return div;
  }

  // Show no reviews message
  function showNoReviews() {
    noReviewsEl.classList.remove('hidden');
    reviewsContainerEl.classList.add('hidden');
    statsEl.classList.add('hidden');
  }

  // Copy to clipboard
  async function copyToClipboard(format) {
    if (extractedReviews.length === 0) {
      showStatus('No reviews to copy!', 'error');
      return;
    }

    let text;
    if (format === 'json') {
      text = JSON.stringify(extractedReviews, null, 2);
    } else if (format === 'csv') {
      text = convertToCSV(extractedReviews);
    }

    try {
      await navigator.clipboard.writeText(text);
      showStatus(`Copied ${format.toUpperCase()} to clipboard!`, 'success');
    } catch (error) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showStatus(`Copied ${format.toUpperCase()} to clipboard!`, 'success');
    }
  }

  // Convert reviews to CSV
  function convertToCSV(reviews) {
    const headers = ['Name', 'Date', 'Rating', 'Review Text', 'Extracted At'];
    const rows = reviews.map(r => [
      escapeCSV(r.name),
      escapeCSV(r.date),
      r.rating || '',
      escapeCSV(r.text),
      r.extractedAt || ''
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  // Escape CSV special characters
  function escapeCSV(text) {
    if (!text) return '';
    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    const escaped = text.replace(/"/g, '""');
    if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
      return `"${escaped}"`;
    }
    return escaped;
  }

  // Handle download
  function handleDownload() {
    if (extractedReviews.length === 0) {
      showStatus('No reviews to download!', 'error');
      return;
    }

    const data = JSON.stringify(extractedReviews, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `google-reviews-${timestamp}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showStatus('Downloaded reviews file!', 'success');
  }

  // Show status message
  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'status show';
    if (type) {
      statusEl.classList.add(type);
    }
  }

  // Disable buttons
  function disableButtons() {
    extractBtn.disabled = true;
    scrollLoadBtn.disabled = true;
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
