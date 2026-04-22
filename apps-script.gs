// ═══════════════════════════════════════════════════════════════════
// GHAR KA SWAAD — Google Apps Script for order logging
// ═══════════════════════════════════════════════════════════════════
// Paste this entire file into the Apps Script editor bound to your
// Google Sheet. Then deploy as a Web App (instructions in README.md).
// ═══════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Reviews are handled separately
    if (data.type === 'review') {
      return saveReview(ss, data);
    }

    // Otherwise treat as an order
    return saveOrder(ss, data);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveOrder(ss, data) {
  let sheet = ss.getSheetByName('Orders');
  if (!sheet) {
    sheet = ss.insertSheet('Orders');
    sheet.appendRow([
      'OrderID', 'Timestamp', 'Name', 'Phone', 'Address',
      'Items', 'Total', 'Status', 'Notes'
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }

  sheet.appendRow([
    data.orderId || '',
    new Date(data.timestamp || Date.now()),
    data.name || '',
    data.phone || '',
    data.address || '',
    data.items || '',
    data.total || 0,
    data.status || 'Order Received',
    data.note || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, orderId: data.orderId }))
    .setMimeType(ContentService.MimeType.JSON);
}

function saveReview(ss, data) {
  let sheet = ss.getSheetByName('Reviews');
  if (!sheet) {
    sheet = ss.insertSheet('Reviews');
    sheet.appendRow(['Name', 'Area', 'Text', 'Stars', 'Show', 'Date']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }

  sheet.appendRow([
    data.name || 'Anonymous',
    data.area || '',
    data.text || '',
    Number(data.stars) || 5,
    data.show === true,
    data.date || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ───────────────────────────────────────────────────────────────────
// Run this ONCE from the Apps Script editor to set up all the tabs
// your site needs. Menu: Run → setupSheet.
// ───────────────────────────────────────────────────────────────────
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Orders tab
  if (!ss.getSheetByName('Orders')) {
    const orders = ss.insertSheet('Orders');
    orders.appendRow(['OrderID', 'Timestamp', 'Name', 'Phone', 'Address', 'Items', 'Total', 'Status', 'Notes']);
    orders.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#efe7d5');
    orders.setFrozenRows(1);
  }

  // Products tab (optional — lets you edit products in the sheet)
  if (!ss.getSheetByName('Products')) {
    const products = ss.insertSheet('Products');
    products.appendRow(['ID', 'Name', 'Subtitle', 'Description', 'Category', 'Price', 'Unit', 'ShelfLife', 'Ingredients', 'Allergens', 'Available', 'Featured', 'ImageURL', 'SortOrder']);
    products.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#efe7d5');
    products.setFrozenRows(1);
  }

  // Inventory tab — control stock by product ID
  if (!ss.getSheetByName('Inventory')) {
    const inv = ss.insertSheet('Inventory');
    inv.appendRow(['ProductID', 'StockLeft', 'Notes']);
    inv.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#efe7d5');
    inv.setFrozenRows(1);
  }

  // Settings tab — shop open/closed, festive banner
  if (!ss.getSheetByName('Settings')) {
    const settings = ss.insertSheet('Settings');
    settings.appendRow(['Key', 'Value']);
    settings.appendRow(['shop_open', true]);
    settings.appendRow(['closed_message', 'We are taking a short break. Check back soon.']);
    settings.appendRow(['festive_message', '']);
    settings.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#efe7d5');
    settings.setFrozenRows(1);
  }

  // Reviews tab
  if (!ss.getSheetByName('Reviews')) {
    const reviews = ss.insertSheet('Reviews');
    reviews.appendRow(['Name', 'Area', 'Text', 'Stars', 'Show', 'Date']);
    reviews.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#efe7d5');
    reviews.setFrozenRows(1);
  }

  SpreadsheetApp.getUi().alert('Ghar Ka Swaad sheets are ready. You can close this and deploy the web app.');
}
