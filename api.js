// Pengganti google.script.run untuk GitHub Pages: setiap pemanggilan dikirim ke Web App Apps Script (backend) lewat fetch.
// Cara pakainya sama persis seperti sebelumnya:
//   google.script.run.withSuccessHandler(ok).withFailureHandler(gagal).namaFungsi(arg1, arg2)
(function () {
  async function call(fn, args) {
    if (!window.APP_URL || /PASTE_/.test(window.APP_URL)) throw new Error('URL backend belum diisi di config.js');
    let res;
    try {
      // PENTING: Content-Type text/plain agar browser tidak mengirim preflight (Apps Script tidak melayani OPTIONS)
      res = await fetch(window.APP_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({fn: fn, args: args})});
    } catch (e) { throw new Error('Tidak bisa terhubung ke server. Cek koneksi internet Anda.'); }
    let j;
    try { j = await res.json(); }
    catch (e) { throw new Error('Server tidak mengembalikan data yang valid. Pastikan deployment Apps Script: Who has access = Anyone, dan sudah deploy versi terbaru.'); }
    if (!j.ok) throw new Error(j.error || 'Terjadi kesalahan di server');
    return j.data;
  }
  function runner(ok, fail) {
    return new Proxy({}, {get: function (_, name) {
      if (name === 'withSuccessHandler') return function (h) { return runner(h, fail); };
      if (name === 'withFailureHandler') return function (h) { return runner(ok, h); };
      if (typeof name !== 'string' || name === 'then') return undefined;
      return function () {
        const args = Array.prototype.slice.call(arguments);
        call(name, args).then(function (r) { if (ok) ok(r); }, function (e) { if (fail) fail(e); else console.error(e); });
      };
    }});
  }
  window.google = {script: {run: runner(null, null)}};
})();
