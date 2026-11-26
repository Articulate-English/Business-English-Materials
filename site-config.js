/* Teaching site payment details — public-by-design values only. */
window.BE_STUDENT = {
  contactEmail: "hello@articulate.ee",
  paypalUrl: "https://paypal.me/ArticulateEnglish",
  bankDetails: {"name": "William Thomason", "iban": "BE69 9673 0036 2078", "swift": "TRWIBEB1XXX", "reference": "Your name and lesson title"},
  prices: { USD: { single: 24, collection: 75 }, EUR: { single: 22, collection: 70 } }
};
window.BE_STUDENT.paypalLink = function (amount, cur) {
  var url = this.paypalUrl || '';
  if (!url) return '';
  if (/paypal\.me/i.test(url) && amount && !/\d([A-Z]{3})?\/?$/.test(url)) {
    return url.replace(/\/?$/, '/') + amount + (cur || 'USD');
  }
  return url;
};
