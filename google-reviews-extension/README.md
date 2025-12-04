# Google Reviews Extractor

A Chrome extension to easily extract reviews, dates, and reviewer names from Google Maps and Google Search.

## Features

- **Extract Reviews**: One-click extraction of all visible reviews
- **Get Review Details**: Captures reviewer name, date, rating, and review text
- **Load More Reviews**: Scroll button to load additional reviews
- **Export Options**:
  - Copy as JSON
  - Copy as CSV
  - Download as JSON file

## Installation

### Load as Unpacked Extension (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `google-reviews-extension` folder
5. The extension icon will appear in your toolbar

## Usage

1. Navigate to a Google Maps location page or Google Search results with reviews
2. Click the extension icon in your Chrome toolbar
3. Click **Extract Reviews** to capture all visible reviews
4. Use **Load More Reviews** to scroll and load additional reviews
5. Export your data:
   - **Copy JSON**: Copy review data as JSON to clipboard
   - **Copy CSV**: Copy review data as CSV to clipboard
   - **Download**: Download review data as a JSON file

## Supported Pages

- Google Maps business/location pages
- Google Search results with review panels

## Data Extracted

For each review, the extension captures:

| Field | Description |
|-------|-------------|
| `name` | Reviewer's display name |
| `date` | Date of the review (relative, e.g., "2 weeks ago") |
| `rating` | Star rating (1-5) |
| `text` | Review text content |
| `extractedAt` | Timestamp when the review was extracted |

## Example Output (JSON)

```json
[
  {
    "name": "John Doe",
    "text": "Great service and friendly staff!",
    "date": "2 weeks ago",
    "rating": 5,
    "extractedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Example Output (CSV)

```csv
Name,Date,Rating,Review Text,Extracted At
John Doe,2 weeks ago,5,Great service and friendly staff!,2024-01-15T10:30:00.000Z
```

## Tips

- **Load More Reviews**: Google Maps loads reviews dynamically. Use the "Load More Reviews" button to scroll down and load additional reviews, then click "Extract Reviews" again
- **Best Results**: Open the full reviews panel on Google Maps for the most comprehensive extraction
- **Rate Limiting**: Allow time between extractions if working with many locations

## Permissions

The extension requires the following permissions:

- `activeTab`: Access the current tab to extract reviews
- `scripting`: Inject the extraction script into Google pages
- `clipboardWrite`: Copy data to clipboard

## Files Structure

```
google-reviews-extension/
├── manifest.json        # Extension configuration
├── popup.html          # Extension popup UI
├── popup.css           # Popup styles
├── popup.js            # Popup logic
├── content.js          # Review extraction script
├── content.css         # Content script styles
├── icons/
│   ├── icon16.png      # 16x16 icon
│   ├── icon48.png      # 48x48 icon
│   └── icon128.png     # 128x128 icon
└── README.md           # This file
```

## Development

### Regenerate Icons

If you need to regenerate the icons:

1. Open `generate-icons.html` in a browser
2. Click "Download All Icons"
3. Move the downloaded PNG files to the `icons/` folder

Or run the Node.js script:

```bash
node generate-icons.js
```

## Troubleshooting

**No reviews found:**
- Make sure you're on a Google Maps page with reviews visible
- Try scrolling down to load reviews first
- Refresh the page and try again

**Extension not working:**
- Check that the extension is enabled in `chrome://extensions/`
- Verify you're on a supported Google page
- Check the browser console for errors

## License

MIT License - Free to use and modify
