import { COMPANY_INFO } from '../data/companyInfo';
import { formatCurrencyINR } from './formatters';

function getActiveWhatsAppNumber() {
  try {
    const saved = localStorage.getItem('zameer_settings_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.whatsappRaw) {
        return parsed.whatsappRaw.replace(/[^\d]/g, '');
      }
    }
  } catch (e) {}
  return COMPANY_INFO.whatsappRaw.replace(/[^\d]/g, '');
}

/**
 * Helper to build standard whatsapp click-to-chat URL
 */
export function buildWhatsAppUrl(messageText) {
  const number = getActiveWhatsAppNumber();
  const encoded = encodeURIComponent(messageText.trim());
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * 1. Default / Floating WhatsApp Message
 */
export function getGeneralWhatsAppUrl() {
  const text = `Hello Zameer Interiors,

I am looking for interior design & bespoke carpentry services in Hyderabad. I would like to schedule a site consultation and discuss my project requirements.

Thank you!`;
  return buildWhatsAppUrl(text);
}

/**
 * 2. Hero 3D Quote WhatsApp Message
 */
export function getHeroQuoteWhatsAppUrl() {
  const text = `Hello Zameer Interiors,

I saw your portfolio and would like to get a Free 3D Design & Turnkey Quote for my home/commercial space in Hyderabad.

Please let me know when we can arrange a site measurement visit.`;
  return buildWhatsAppUrl(text);
}

/**
 * 3. Cost Estimator WhatsApp Message
 */
export function getEstimatorWhatsAppUrl({ property, scope, tier, min, max }) {
  const minFormatted = formatCurrencyINR(min);
  const maxFormatted = formatCurrencyINR(max);

  const text = `Hello Zameer Interiors,

I generated an indicative estimate on your website calculator:

🏠 Property Type: ${property.label} (${property.approxArea})
🔨 Project Scope: ${scope.label}
✨ Finish Tier: ${tier.label} (${tier.badge})
💰 Estimated Indicative Range: ${minFormatted} - ${maxFormatted}

I would like to discuss this scope and schedule a free site visit in Hyderabad for detailed measurement and exact quotation.`;

  return buildWhatsAppUrl(text);
}

/**
 * 4. Specific Service Inquiry WhatsApp Message
 */
export function getServiceInquiryWhatsAppUrl(serviceTitle) {
  const text = `Hello Zameer Interiors,

I am specifically interested in your "${serviceTitle}" services in Hyderabad. 

Could you share more details, material options, and arrange a consultation?`;
  return buildWhatsAppUrl(text);
}

/**
 * 5. Portfolio Project Inquiry WhatsApp Message
 */
export function getPortfolioInquiryWhatsAppUrl(project) {
  const text = `Hello Zameer Interiors,

I really loved this project in your portfolio:
✨ Project: "${project.title}" (${project.category})
📍 Location Reference: ${project.location}

I would like to create a similar design for my space. Could we discuss the possibilities and pricing?`;
  return buildWhatsAppUrl(text);
}

/**
 * 6. Consultation Form Submission WhatsApp Message
 */
export function getConsultationWhatsAppUrl({ name, phone, service, spaceType, message }) {
  const text = `Hello Zameer Interiors,

New Site Consultation Request:
👤 Name: ${name || 'Customer'}
📱 Phone: ${phone}
🛠 Service Needed: ${service || 'Complete Home Interior Design'}
🏢 Space Type: ${spaceType || '2BHK / 3BHK Residential'}
📝 Notes / Message: ${message || 'Site measurement & 3D consultation'}

Please get in touch with me to schedule our site visit.`;

  return buildWhatsAppUrl(text);
}

/**
 * 7. Dedicated Service Specific Inquiry WhatsApp Message
 */
export function getDedicatedServiceInquiryWhatsAppUrl({ name, phone, email, serviceTitle, address, spaceType, notes }) {
  const text = `Hello Zameer Interiors,

🌟 Direct Service Inquiry for "${serviceTitle}":
👤 Name: ${name || 'Customer'}
📱 Phone: ${phone}${email ? `\n✉️ Email: ${email}` : ''}
📍 Property Address: ${address || 'Hyderabad'}
🏢 Space / Property: ${spaceType || 'Residential Space'}
${notes ? `📝 Project Notes / Dimensions: ${notes}\n` : ''}
Please let me know when we can schedule our free site visit & estimate.`;

  return buildWhatsAppUrl(text);
}


