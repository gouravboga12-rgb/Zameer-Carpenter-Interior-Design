import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, MapPin, Save, CheckCircle, Sparkles } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function AdminSettingsManager() {
  const { settings, updateSettings } = useAdminData();
  const [formData, setFormData] = useState({
    phone: settings.phone || '+91 8464930376',
    phoneRaw: settings.phoneRaw || '+918464930376',
    whatsapp: settings.whatsapp || '+91 8464930376',
    whatsappRaw: settings.whatsappRaw || '918464930376',
    email: settings.email || 'interiordesignerzameer@gmail.com',
    address: settings.address || 'Door No. 8-1-301/A, Main Road, Tolichowki, Shaikpet, Hyderabad, Telangana 500008'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-luxury-card p-5 rounded-2xl border border-luxury-gold/30 shadow-sm space-y-1">
        <h2 className="font-heading text-xl font-bold text-luxury-walnut flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-luxury-gold" />
          <span>Site Contact & Business Settings</span>
        </h2>
        <p className="text-xs text-luxury-muted">
          Update company phone number, WhatsApp number, email ID, and studio address across the entire website.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Settings saved successfully! Phone and WhatsApp numbers are updated live.</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-luxury-card p-6 sm:p-8 rounded-3xl border border-luxury-gold/30 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Phone Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Display Phone Number</span>
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 8464930376"
                className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
              />
              <span className="text-[10px] text-luxury-muted mt-1 block">Formatted text displayed on headers & cards</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Raw Phone Dialing Link</span>
              </label>
              <input
                type="text"
                required
                value={formData.phoneRaw}
                onChange={(e) => setFormData({ ...formData, phoneRaw: e.target.value })}
                placeholder="+918464930376"
                className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none font-mono"
              />
              <span className="text-[10px] text-luxury-muted mt-1 block">Used for tel: tel-link dialing</span>
            </div>
          </div>

          {/* WhatsApp Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Display WhatsApp Number</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+91 8464930376"
                className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Raw WhatsApp Number (Country Code + Digits)</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsappRaw}
                onChange={(e) => setFormData({ ...formData, whatsappRaw: e.target.value })}
                placeholder="918464930376"
                className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none font-mono"
              />
              <span className="text-[10px] text-luxury-muted mt-1 block">Used in https://wa.me/ links</span>
            </div>
          </div>

          {/* Email & Address */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Official Business Email ID</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="interiordesignerzameer@gmail.com"
                className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                <span>Studio & Workshop Full Address</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address..."
                className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-luxury-border flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Settings</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
