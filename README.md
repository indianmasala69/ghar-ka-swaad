# Ghar Ka Swaad — deployment guide

A small premium home-brand site for Maa's kitchen, ready to deploy.

This folder contains two files you need to set up:

1. **`index.html`** — the whole website (React single-page app)
2. **`apps-script.gs`** — the Google Apps Script that saves orders to your Sheet

Once deployed, customers visit your GitHub Pages URL, browse products, tap "Send on WhatsApp", and their order is logged in your Google Sheet AND sent to you on WhatsApp — no database, no server, no hosting fees.

---

## Part 1 — Set up the Google Sheet (do this first)

1. Open Gmail signed in as **yatharth0710@gmail.com**.
2. Go to [sheets.google.com](https://sheets.google.com) and click **Blank** to create a new sheet.
3. Rename it: **"Ghar Ka Swaad — Orders"**.
4. Look at the URL. It looks like:
   ```
   https://docs.google.com/spreadsheets/d/1AbCdEfGhIjK.../edit
   ```
   **Copy the long ID** between `/d/` and `/edit`. This is your `SHEET_ID`.

## Part 2 — Set up Apps Script

1. In your new Google Sheet, go to **Extensions → Apps Script**.
2. Delete whatever starter code is there.
3. Open `apps-script.gs` from this folder and **paste the entire contents** into the Apps Script editor.
4. Click the **disk icon** to save. Name the project "Ghar Ka Swaad Script".
5. In the function dropdown at the top of the editor, select **`setupSheet`** and click **Run**.
   - It will ask for permission. Click Review permissions → pick yatharth0710@gmail.com → Advanced → Go to project → Allow.
   - You'll see a popup: *"Ghar Ka Swaad sheets are ready..."* Good.
6. Click **Deploy → New deployment**.
7. Click the **gear icon** next to "Select type" and pick **Web app**.
8. Fill in:
   - Description: `Ghar Ka Swaad order logger`
   - Execute as: **Me (yatharth0710@gmail.com)**
   - Who has access: **Anyone**
9. Click **Deploy**. Authorize again if asked.
10. **Copy the Web app URL** it shows you. This is your `SCRIPT_URL`. Keep it safe.

## Part 3 — Configure the website

Open `index.html` in any text editor (TextEdit on Mac is fine). Near the top you'll see:

```js
const WHATSAPP = '919999999999';
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
const SCRIPT_URL = 'REPLACE_WITH_YOUR_APPS_SCRIPT_URL';
```

Replace all three:

- `WHATSAPP` — your WhatsApp number with country code, digits only. E.g. `919876543210`
- `SHEET_ID` — from Part 1 step 4
- `SCRIPT_URL` — from Part 2 step 10

Save the file.

## Part 4 — Push to GitHub

1. Go to [github.com](https://github.com), sign in as **yatharth0710**.
2. Click **+ → New repository**.
3. Repository name: **`ghar-ka-swaad`** (or whatever you prefer).
4. Set to **Public** (required for free GitHub Pages).
5. Don't tick "Add a README" — we have our own.
6. Click **Create repository**.
7. You'll see a page with setup commands. Ignore them — come back here and run:

```bash
cd /Users/indianmasala/Claude/Ghar_Ka_Swaad
git init
git add index.html apps-script.gs README.md
git commit -m "Initial Ghar Ka Swaad site"
git branch -M main
git remote add origin https://github.com/yatharth0710/ghar-ka-swaad.git
git push -u origin main
```

GitHub will ask for authentication. Use a **Personal Access Token** (not password):
- In GitHub: click your profile photo → **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**.
- Name: `ghar-ka-swaad-push`, Expiration: 90 days, Scope: tick **`repo`** only.
- Generate and **copy the token**.
- Paste it when git asks for a password.

## Part 5 — Enable GitHub Pages

1. In the GitHub repo page, click **Settings → Pages**.
2. Under **Source**, pick **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Click **Save**.
4. Wait 1–2 minutes. Refresh the page.
5. You'll see: *"Your site is live at `https://yatharth0710.github.io/ghar-ka-swaad/`"*

That's your live site. Share it with anyone.

---

## What happens when someone orders

1. Customer adds items → clicks **Send on WhatsApp**.
2. Apps Script logs the order to the **Orders** tab of your Sheet (OrderID, timestamp, name, phone, address, items, total, status = "Order Received").
3. WhatsApp opens on their phone with a pre-filled message to your number.
4. You reply, confirm payment, prepare the order.
5. To update status, just edit the **Status** column in the Sheet. Options:
   - `Order Received`
   - `Confirmed`
   - `Being Prepared`
   - `Ready for Pickup`
   - `Delivered`
6. Customer uses the **Track** tab on the site to see live status — it reads directly from your Sheet.

## Day-to-day controls in the Sheet

| Tab | What it does |
|-----|--------------|
| **Orders** | All orders land here. Update the Status column as you progress. |
| **Inventory** | Add product IDs (e.g. `besan-ladoo-plain-250`) and stock counts. Site auto-hides sold-out items. |
| **Settings** | Toggle `shop_open` to FALSE to pause new orders. Set `festive_message` to show a banner (e.g. *"Diwali orders — book by Oct 10"*). |
| **Products** | Optional. Fill this in to override the product list in the site without editing code. |
| **Reviews** | Not wired up yet — reserved for future. |

Changes in the Sheet show up on the site within 5 minutes (cached).

## Images

You mentioned you'll generate product images later. When ready:

- Option A — easiest: upload each image to the repo in a folder called `images/`, then add its URL to the `IMG` object near the top of `index.html`. Example:
  ```js
  const IMG = {
    "besan-ladoo-plain-250": "https://yatharth0710.github.io/ghar-ka-swaad/images/besan-plain.jpg",
    "mathri-jeera-200":      "https://yatharth0710.github.io/ghar-ka-swaad/images/mathri.jpg",
  };
  ```
- Option B — via the Sheet: drop image URLs in column M of the **Products** tab. The site will pick them up automatically.

Until you add images, the site shows clean hand-drawn SVG placeholders.

## Troubleshooting

**"The site is live but products show 'Sold out' everywhere."**
You might have an Inventory row with `0` for every product. Delete those rows OR leave the Inventory tab empty — empty means "unlimited".

**"Clicking Send on WhatsApp doesn't save to the sheet."**
Likely the Apps Script URL is wrong. Re-check step 2.10. If you redeployed, you must update `SCRIPT_URL` in index.html and push again.

**"WhatsApp opens but shows the wrong number."**
Check `WHATSAPP` in index.html. Must be digits only, with country code. `+91 98765 43210` → `919876543210`.

**"I want to change a product price."**
Edit the `products` array in `index.html`, commit, push. The change is live in ~1 minute.

---

Made for Maa's kitchen. Keep it small, keep it proud.
