// ===== Api.gs — tambahkan sebagai file baru di project Apps Script (ikon + di sebelah Files > Script > beri nama "Api") =====
// Backend menerima: POST {"fn":"namaFungsi","args":[...]}  ->  membalas: {"ok":true,"data":...} atau {"ok":false,"error":"pesan"}

// Hanya fungsi di daftar ini yang boleh dipanggil dari luar. Fungsi lain (mis. pushToExternalSpreadsheet) tetap tertutup.
const API_ALLOWED = [
  'getMasters', 'getStores', 'getAvailableDates', 'getPlanImpl', 'saveUploads', 'getInfoPosting', 'getHistory', 'getRiwayatHO',
  'getRiwayatImpl', 'getDashImpl', 'getImplOptions', 'getStoreTaken', 'saveImplBatch', 'findFilesImpl', 'getImageImpl'
];

function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try {
    const req = JSON.parse((e.postData && e.postData.contents) || '{}');
    const name = String(req.fn || '');
    if (API_ALLOWED.indexOf(name) < 0) throw new Error('Fungsi tidak diizinkan: ' + name);
    const f = globalThis[name];
    if (typeof f !== 'function') throw new Error('Fungsi tidak ditemukan di backend: ' + name);
    const data = f.apply(null, Array.isArray(req.args) ? req.args : []);
    return json_({ok: true, data: data === undefined ? null : data});
  } catch (err) {
    return json_({ok: false, error: String(err && err.message ? err.message : err)});
  }
}

// Opsional: untuk cek backend hidup, buka  URL_WEB_APP?api=ping  di browser.
// Caranya: tambahkan 1 baris ini di baris PERTAMA fungsi doGet(e) yang sudah ada di Code.gs:
//   if ((e.parameter||{}).api === 'ping') return json_({ok:true, pong:new Date().toISOString()});
