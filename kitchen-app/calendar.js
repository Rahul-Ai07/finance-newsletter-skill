/* ChefMyDeal calendar engine. Works out the lunar day (tithi) for any date, offline.
   Low-precision lunar/solar position (accurate to about 0.2 degrees). Day is read at 06:00 IST (00:30 UTC),
   the same way almanacs read the tithi at sunrise. Fast-day dates may differ by one day from a local panchang. */
window.CAL = (function () {
  const RAD = Math.PI / 180;
  function tithi(y, m, d, utcHour) { // m is 0-based; default reads at 06:00 IST
    const n = (Date.UTC(y, m, d, utcHour === undefined ? 0 : utcHour, utcHour === undefined ? 30 : 0) / 86400000 + 2440587.5) - 2451545.0;
    const Ls = 280.460 + 0.9856474 * n, gs = (357.528 + 0.9856003 * n) * RAD;
    const sun = Ls + 1.915 * Math.sin(gs) + 0.020 * Math.sin(2 * gs);
    const Lm = 218.316 + 13.176396 * n, Mm = (134.963 + 13.064993 * n) * RAD;
    const D = (Lm - Ls) * RAD;
    const moon = Lm + 6.289 * Math.sin(Mm) + 1.274 * Math.sin(2 * D - Mm) + 0.658 * Math.sin(2 * D);
    const e = (((moon - sun) % 360) + 360) % 360;
    return Math.floor(e / 12) + 1; // 1..30; 1-15 Shukla (waxing), 16-30 Krishna (waning)
  }
  const key = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  // Fast days for adults (family rule) and auspicious lunar days, computed from the tithi
  function lunar(y, m, d) {
    const t = tithi(y, m, d), out = [];
    if (t === 11) out.push({ k: 'fast', n: 'Ekadashi (Shukla)' });
    if (t === 26) out.push({ k: 'fast', n: 'Ekadashi (Krishna)' });
    if (tithi(y, m, d, 12.5) === 19) out.push({ k: 'fast', n: 'Sankashti Chaturthi' }); // moonrise-based, read at 18:00 IST
    if (t === 15) out.push({ k: 'auspicious', n: 'Purnima' });
    if (t === 30) out.push({ k: 'auspicious', n: 'Amavasya' });
    if (t === 13 || t === 28) out.push({ k: 'auspicious', n: 'Pradosh' });
    return out;
  }
  // Fixed festival dates taken from the search results (2027 dates to be confirmed in a local panchang)
  const FESTS = {
    '2027-01-15': { k: 'festival', n: 'Makar Sankranti', food: 'Tilgul, gulpoli, bajra bhakri' },
    '2027-03-06': { k: 'fast', n: 'Maha Shivratri', food: 'Upvas: bhagar, rajgira, fruit; kids eat normal meals' },
    '2027-03-21': { k: 'festival', n: 'Holika Dahan', food: 'Puran poli with katachi amti and koshimbir' },
    '2027-03-22': { k: 'festival', n: 'Holi / Rangpanchami', food: 'Puran poli, shrikhand; keep the day light' },
    '2027-04-07': { k: 'auspicious', n: 'Gudi Padwa', food: 'Shrikhand-puri, puran poli, kadunimb chutney' },
    '2027-05-08': { k: 'auspicious', n: 'Akshaya Tritiya', food: 'Aamras-poli, kairi panha; a new start' },
    '2026-11-27': { k: 'fast', n: 'Sankashti Chaturthi', food: 'Upvas: sabudana, bhagar, modak' },
    '2026-12-04': { k: 'fast', n: 'Utpanna Ekadashi', food: 'Upvas: bhagar, rajgira thalipeeth' },
    '2026-12-20': { k: 'fast', n: 'Mokshada Ekadashi / Gita Jayanti', food: 'Upvas: bhagar, rajgira thalipeeth' }
  };
  // Day info for any date: festival, lunar day and fast flag
  function info(y, m, d) {
    const k = key(y, m, d), out = [];
    if (FESTS[k]) out.push(FESTS[k]);
    if (!out.some(o => o.k === 'fast')) lunar(y, m, d).forEach(x => { if (!out.some(o => o.k === x.k && x.k !== 'auspicious')) out.push(Object.assign({ food: '' }, x)); });
    return out;
  }
  return { tithi, info, key, FESTS };
})();
