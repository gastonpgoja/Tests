# Test of a chrome extension

## Usage
1. Publish your Google Sheet as CSV or provide a SharePoint Excel link. Update `SHEET_URL` in `content-script.js` with that URL.
2. Load the extension in Chrome:
   - Open `chrome://extensions` and enable Developer mode.
   - Click **Load unpacked** and select this folder.
3. Navigate to an Amazon product page. If the ASIN exists in your sheet, the custom data block will appear at the top of the page.

The sheet should have a header row with at least an `ASIN` column.
