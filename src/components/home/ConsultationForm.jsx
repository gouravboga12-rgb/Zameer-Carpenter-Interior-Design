import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, Phone } from 'lucide-react';
import { getConsultationWhatsAppUrl } from '../../utils/whatsapp';
import { SERVICES_DATA } from '../../data/servicesData';
import { PROPERTY_TYPES } from '../../data/pricingConfig';
import { useAdminData } from '../../context/AdminDataContext';

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Complete Home Interior Design',
    spaceType: '2BHK Apartment',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your full name (at least 2 characters).';
    }

    const cleanPhone = formData.phone.replace(/[^\d]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.service) {
      errs.service = 'Please select a service vertical.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const { submitContactInquiry } = useAdminData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Record inquiry in Supabase & Admin Panel, and trigger WhatsApp redirection
      await submitContactInquiry({
        name: formData.name,
        phone: formData.phone,
        serviceTitle: formData.service,
        propertyType: formData.spaceType,
        notes: formData.message
      });

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage('Unable to process your request at this moment. Please reach us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      service: 'Complete Home Interior Design',
      spaceType: '2BHK Apartment',
      message: ''
    });
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    const directWhatsApp = getConsultationWhatsAppUrl({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      spaceType: formData.spaceType,
      message: formData.message
    });

    return (
      <div className="bg-luxury-card rounded-3xl p-8 sm:p-10 border border-luxury-gold/50 shadow-luxury text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h3 className="font-heading text-2xl font-bold text-luxury-walnut">
            Consultation Request Received!
          </h3>
          <p className="text-sm text-luxury-muted mt-2 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-luxury-walnut">{formData.name}</strong>. Our design lead will call you at <strong className="text-luxury-walnut">{formData.phone}</strong> shortly to schedule your free site visit in Hyderabad.
          </p>
        </div>

        <div className="pt-4 border-t border-luxury-border flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={directWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Fast-Track on WhatsApp</span>
          </a>

          <button
            onClick={handleReset}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-luxury-surface hover:bg-luxury-border text-luxury-charcoal font-semibold text-xs uppercase tracking-wider transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-luxury-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-luxury-gold/30 shadow-luxury space-y-5"
    >
      <div className="pb-3 border-b border-luxury-border">
        <h3 className="font-heading text-2xl font-bold text-luxury-walnut">
          Book Free Site Consultation
        </h3>
        <p className="text-xs text-luxury-muted mt-1">
          Complimentary measurement & design briefing in Tolichowki, Shaikpet & Hyderabad.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel mb-1.5">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Mohammed Ahmed"
          className={`w-full px-4 py-3 rounded-xl bg-luxury-surface/70 border text-sm text-luxury-charcoal focus:outline-none transition-colors ${
            errors.name ? 'border-red-400 bg-red-50/50' : 'border-luxury-border focus:border-luxury-gold'
          }`}
        />
        {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Mobile Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel mb-1.5">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-luxury-muted">
            +91
          </span>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="98765 43210"
            className={`w-full pl-12 pr-4 py-3 rounded-xl bg-luxury-surface/70 border text-sm text-luxury-charcoal focus:outline-none transition-colors ${
              errors.phone ? 'border-red-400 bg-red-50/50' : 'border-luxury-border focus:border-luxury-gold'
            }`}
          />
        </div>
        {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
      </div>

      {/* Service Needed Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel mb-1.5">
            Service Needed
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-3.5 py-3 rounded-xl bg-luxury-surface/70 border border-luxury-border text-xs sm:text-sm text-luxury-charcoal focus:outline-none focus:border-luxury-gold"
          >
            {SERVICES_DATA.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Space Type Dropdown */}
        <div>
          <label htmlFor="spaceType" className="block text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel mb-1.5">
            Space Type
          </label>
          <select
            id="spaceType"
            name="spaceType"
            value={formData.spaceType}
            onChange={handleChange}
            className="w-full px-3.5 py-3 rounded-xl bg-luxury-surface/70 border border-luxury-border text-xs sm:text-sm text-luxury-charcoal focus:outline-none focus:border-luxury-gold"
          >
            <option value="1BHK Apartment">1 BHK Apartment</option>
            <option value="2BHK Apartment">2 BHK Apartment</option>
            <option value="3BHK Apartment">3 BHK Apartment</option>
            <option value="4BHK Apartment">4 BHK Apartment</option>
            <option value="Luxury Villa / Duplex">Luxury Villa / Duplex</option>
            <option value="Commercial Office / Workspace">Commercial Office / Workspace</option>
            <option value="Retail Shop / Showroom">Retail Shop / Showroom</option>
            <option value="Cafe / Restaurant">Cafe / Restaurant</option>
            <option value="Complete Home Renovation">Complete Home Renovation</option>
          </select>
        </div>
      </div>

      {/* Message / Project Details Field */}
      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel mb-1.5">
          Project Notes / Specific Needs (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your property location in Hyderabad, preferred timeline, or specific woodwork requirements..."
          className="w-full px-4 py-3 rounded-xl bg-luxury-surface/70 border border-luxury-border text-sm text-luxury-charcoal focus:outline-none focus:border-luxury-gold resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-luxury-gold via-yellow-500 to-luxury-gold-warm text-luxury-walnut font-bold text-xs sm:text-sm uppercase tracking-wider shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Request...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Request Free Site Consultation</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-luxury-muted">
        🔒 Your contact information is kept confidential. We will only contact you regarding your interior design inquiry.
      </p>
    </form>
  );
}
