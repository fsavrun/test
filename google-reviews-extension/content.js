// Google Reviews Extractor - Content Script
// This script runs on Google Maps and Google Search pages

(function() {
  'use strict';

  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractReviews') {
      const reviews = extractAllReviews();
      sendResponse({ reviews: reviews });
    } else if (request.action === 'scrollLoadMore') {
      scrollToLoadMore().then(count => {
        sendResponse({ scrolled: true, message: `Scrolled to load more reviews` });
      });
      return true; // Required for async response
    } else if (request.action === 'checkPage') {
      const isReviewPage = checkIfReviewPage();
      sendResponse({ isReviewPage: isReviewPage });
    }
    return true;
  });

  // Check if current page has Google reviews
  function checkIfReviewPage() {
    const url = window.location.href;
    const isGoogleMaps = url.includes('google.com/maps') || url.includes('maps.google.com');
    const isGoogleSearch = url.includes('google.com/search');

    // Look for review-related elements
    const hasReviewElements = document.querySelector('[data-review-id]') !== null ||
                              document.querySelector('.jftiEf') !== null ||
                              document.querySelector('[jsaction*="review"]') !== null ||
                              document.querySelectorAll('.wiI7pd').length > 0;

    return isGoogleMaps || (isGoogleSearch && hasReviewElements);
  }

  // Main function to extract all reviews
  function extractAllReviews() {
    const reviews = [];

    // Try Google Maps reviews (main format)
    const mapsReviews = extractGoogleMapsReviews();
    reviews.push(...mapsReviews);

    // Try Google Search sidebar reviews
    if (reviews.length === 0) {
      const searchReviews = extractGoogleSearchReviews();
      reviews.push(...searchReviews);
    }

    // Try alternative selectors
    if (reviews.length === 0) {
      const altReviews = extractAlternativeReviews();
      reviews.push(...altReviews);
    }

    return reviews;
  }

  // Extract reviews from Google Maps
  function extractGoogleMapsReviews() {
    const reviews = [];

    // Primary selector for Google Maps reviews
    const reviewElements = document.querySelectorAll('[data-review-id], .jftiEf, .WMbnJf');

    reviewElements.forEach((element, index) => {
      try {
        const review = extractReviewData(element, index);
        if (review && (review.name || review.text)) {
          reviews.push(review);
        }
      } catch (e) {
        console.error('Error extracting review:', e);
      }
    });

    return reviews;
  }

  // Extract data from a single review element
  function extractReviewData(element, index) {
    // Try multiple selectors for each piece of data

    // Reviewer name selectors
    const nameSelectors = [
      '.d4r55',
      '.WNxzHc [class*="fontBodyMedium"]',
      '.TSUbDb a',
      '[class*="reviewer"]',
      '.review-author',
      'button[data-review-id] > div > div:first-child',
      '.MyEned .Vpc5Fe > button > div',
      '.al6Kxe .Vpc5Fe > button > div'
    ];

    // Review text selectors
    const textSelectors = [
      '.wiI7pd',
      '.MyEned .wiI7pd',
      '.review-full-text',
      '[data-expandable-section] span',
      '.Jtu6Td span',
      '.review-snippet'
    ];

    // Date selectors
    const dateSelectors = [
      '.rsqaWe',
      '.dehysf',
      '.review-date',
      '[class*="date"]',
      '.DU9Pgb'
    ];

    // Rating selectors
    const ratingSelectors = [
      '.kvMYJc',
      '[aria-label*="star"]',
      '[role="img"][aria-label]',
      '.review-rating'
    ];

    const name = findTextBySelectors(element, nameSelectors) || `Reviewer ${index + 1}`;
    const text = findTextBySelectors(element, textSelectors) || '';
    const date = findTextBySelectors(element, dateSelectors) || '';
    const rating = extractRating(element, ratingSelectors);

    return {
      name: cleanText(name),
      text: cleanText(text),
      date: cleanText(date),
      rating: rating,
      extractedAt: new Date().toISOString()
    };
  }

  // Find text using multiple selectors
  function findTextBySelectors(element, selectors) {
    for (const selector of selectors) {
      const found = element.querySelector(selector);
      if (found) {
        const text = found.textContent || found.innerText;
        if (text && text.trim()) {
          return text.trim();
        }
      }
    }
    return null;
  }

  // Extract star rating
  function extractRating(element, selectors) {
    for (const selector of selectors) {
      const found = element.querySelector(selector);
      if (found) {
        // Try aria-label
        const ariaLabel = found.getAttribute('aria-label');
        if (ariaLabel) {
          const match = ariaLabel.match(/(\d+)/);
          if (match) {
            return parseInt(match[1]);
          }
        }

        // Count star elements
        const stars = found.querySelectorAll('[class*="star"], .hCCjke');
        if (stars.length > 0) {
          return stars.length;
        }
      }
    }

    // Try to find rating from filled stars
    const filledStars = element.querySelectorAll('.hCCjke.google-symbols.NhBTye, .hCCjke.google-symbols.elGi1d');
    if (filledStars.length > 0) {
      return filledStars.length;
    }

    return null;
  }

  // Extract reviews from Google Search results
  function extractGoogleSearchReviews() {
    const reviews = [];

    // Google Search sidebar reviews
    const searchReviewElements = document.querySelectorAll('.gws-localreviews__google-review, [data-attrid*="review"]');

    searchReviewElements.forEach((element, index) => {
      const name = element.querySelector('.TSUbDb a, .reviewer-name')?.textContent || `Reviewer ${index + 1}`;
      const text = element.querySelector('.review-snippet, .Jtu6Td')?.textContent || '';
      const date = element.querySelector('.dehysf, .review-date')?.textContent || '';

      if (name || text) {
        reviews.push({
          name: cleanText(name),
          text: cleanText(text),
          date: cleanText(date),
          rating: null,
          extractedAt: new Date().toISOString()
        });
      }
    });

    return reviews;
  }

  // Alternative extraction method
  function extractAlternativeReviews() {
    const reviews = [];

    // Look for any elements that might contain reviews
    const possibleContainers = document.querySelectorAll('[class*="review"], [data-review], .m6QErb');

    possibleContainers.forEach((container, index) => {
      // Skip if it's a container with many child reviews (to avoid duplicates)
      const childReviews = container.querySelectorAll('[class*="review"]');
      if (childReviews.length > 3) return;

      const textContent = container.textContent || '';
      if (textContent.length > 20 && textContent.length < 5000) {
        // Try to parse as a review
        const hasRating = container.querySelector('[aria-label*="star"], [class*="rating"]');

        if (hasRating || textContent.includes('ago') || textContent.includes('review')) {
          reviews.push({
            name: `Review ${index + 1}`,
            text: cleanText(textContent.substring(0, 500)),
            date: '',
            rating: null,
            extractedAt: new Date().toISOString()
          });
        }
      }
    });

    return reviews;
  }

  // Clean text by removing extra whitespace
  function cleanText(text) {
    if (!text) return '';
    return text.replace(/\s+/g, ' ').trim();
  }

  // Scroll to load more reviews
  async function scrollToLoadMore() {
    return new Promise((resolve) => {
      // Find the scrollable reviews container
      const scrollableContainers = [
        document.querySelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf'),
        document.querySelector('.m6QErb.DxyBCb'),
        document.querySelector('[role="main"] .m6QErb'),
        document.querySelector('.section-scrollbox'),
        document.querySelector('[class*="review"] [class*="scroll"]')
      ].filter(Boolean);

      const container = scrollableContainers[0];

      if (container) {
        const scrollAmount = container.scrollHeight;
        container.scrollBy({ top: scrollAmount, behavior: 'smooth' });

        // Wait for new content to load
        setTimeout(() => {
          resolve(true);
        }, 2000);
      } else {
        // Try scrolling the window
        window.scrollBy({ top: 500, behavior: 'smooth' });
        setTimeout(() => {
          resolve(true);
        }, 1000);
      }
    });
  }

  // Log that content script is loaded
  console.log('Google Reviews Extractor: Content script loaded');
})();
