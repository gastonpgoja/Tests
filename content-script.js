(async function() {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv';
  const ASIN = extractASIN();
  if (!ASIN) return;

  try {
    const data = await getData(SHEET_URL);
    const match = data.find(row => row.ASIN === ASIN);
    if (match) {
      injectInfo(match, ASIN);
    }
  } catch (err) {
    console.error('Failed to load ASIN data', err);
  }

  function extractASIN() {
    const urlMatch = location.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
    if (urlMatch) return urlMatch[1];
    const asinElement = document.getElementById('ASIN');
    return asinElement ? asinElement.value : null;
  }

  async function getData(url) {
    const cached = await chrome.storage.local.get('asinData');
    if (cached.asinData) return cached.asinData;

    const resp = await fetch(url);
    const text = await resp.text();
    const rows = text.trim().split(/\r?\n/);
    const headers = rows.shift().split(',');
    const data = rows.map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h,i)=> obj[h.trim()] = values[i].trim());
      return obj;
    });
    await chrome.storage.local.set({ asinData: data });
    return data;
  }

  function injectInfo(info, asin) {
    const container = document.createElement('div');
    container.style.border = '2px solid #f90';
    container.style.padding = '10px';
    container.style.margin = '10px 0';
    container.style.background = '#fff8e1';
    container.innerHTML = `<strong>Custom Data for ${asin}</strong><br>${JSON.stringify(info)}`;
    const target = document.querySelector('#dp');
    if (target) {
      target.prepend(container);
    } else {
      document.body.prepend(container);
    }
  }
})();
