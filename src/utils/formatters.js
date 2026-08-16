/**
 * Format Indian currency with Lakhs and Crores notations
 */
export function formatCurrencyINR(amount) {
  if (!amount || isNaN(amount)) return "₹0";
  
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr.replace(/\.00$/, '')} Cr`;
  }
  
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2);
    return `₹${lk.replace(/\.00$/, '')} Lakhs`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Clean phone number for tel: links
 */
export function cleanPhoneNumber(phone) {
  return phone.replace(/[^\d+]/g, '');
}
