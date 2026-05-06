// ============================================================
// MTG Sbírka – Google Apps Script backend
// ============================================================
// NÁVOD NA NASAZENÍ:
// 1. Jdi na script.google.com → Nový projekt
// 2. Zkopíruj celý tento kód do editoru
// 3. Klikni na "Nasadit" → "Nové nasazení"
// 4. Typ: Webová aplikace
// 5. Spustit jako: Já (váš Google účet)
// 6. Kdo má přístup: Kdokoli
// 7. Klikni "Nasadit" a zkopíruj URL webové aplikace
// 8. Tuto URL vlož do nastavení MTG Sbírky
// ============================================================

const FILE_COLLECTION = 'mtg_sbirka_collection.json';
const FILE_DECKS      = 'mtg_sbirka_decks.json';

function doGet(e) {
  const action = e.parameter.action || 'collection';
  try {
    if (action === 'collection') {
      return jsonResponse(readFile(FILE_COLLECTION, '[]'));
    }
    if (action === 'decks') {
      return jsonResponse(readFile(FILE_DECKS, '[]'));
    }
    if (action === 'ping') {
      return jsonResponse(JSON.stringify({ ok: true, ts: Date.now() }));
    }
  } catch (err) {
    return jsonError(err.message);
  }
  return jsonError('Unknown action');
}

function doPost(e) {
  const action = e.parameter.action || 'collection';
  try {
    const body = e.postData.contents;
    if (action === 'collection') {
      writeFile(FILE_COLLECTION, body);
      return jsonResponse(JSON.stringify({ ok: true }));
    }
    if (action === 'decks') {
      writeFile(FILE_DECKS, body);
      return jsonResponse(JSON.stringify({ ok: true }));
    }
  } catch (err) {
    return jsonError(err.message);
  }
  return jsonError('Unknown action');
}

function readFile(name, fallback) {
  const files = DriveApp.getFilesByName(name);
  if (files.hasNext()) return files.next().getBlob().getDataAsString();
  return fallback;
}

function writeFile(name, content) {
  const files = DriveApp.getFilesByName(name);
  if (files.hasNext()) {
    files.next().setContent(content);
  } else {
    DriveApp.createFile(name, content, MimeType.PLAIN_TEXT);
  }
}

function jsonResponse(text) {
  return ContentService.createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(msg) {
  return ContentService.createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
