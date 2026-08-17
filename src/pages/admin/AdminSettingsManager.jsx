import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Mail, MapPin, Save, CheckCircle, Sparkles, Clock, Calendar, Compass } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function AdminSettingsManager() {
  const { settings, updateSettings } = useAdminData();
  
  const [formData, setFormData] = useState({
    phone: settings.phone || '+91 8464930376',
    phoneRaw: settings.phoneRaw || '+918464930376',
    whatsapp: settings.whatsapp || '+91 8464930376',
    whatsappRaw: settings.whatsappRaw || '918464930376',
    floatingPhone: settings.floatingPhone || settings.phoneRaw || '+918464930376',
    floatingWhatsapp: settings.floatingWhatsapp || settings.whatsappRaw || '918464930376',
    email: settings.email || 'interiordesignerzameer@gmail.com',
    address: settings.address || 'Door No. 8-1-301/A, Main Road, Tolichowki, Shaikpet, Hyderabad, Telangana 500008',
    workingDays: settings.workingDays || 'Monday – Sunday',
    workingHours: settings.workingHours || '9:00 AM – 9:00 PM'
  });

  // Synchronize whenever settings load or change in context
  useEffect(() => {
    if (settings) {
      setFormData({
        phone: settings.phone || '+91 8464930376',
        phoneRaw: settings.phoneRaw || '+918464930376',
        whatsapp: settings.whatsapp || '+91 8464930376',
        whatsappRaw: settings.whatsappRaw || '918464930376',
        floatingPhone: settings.floatingPhone || settings.phoneRaw || '+918464930376',
        floatingWhatsapp: settings.floatingWhatsapp || settings.whatsappRaw || '918464930376',
        email: settings.email || 'interiordesignerzameer@gmail.com',
        address: settings.address || 'Door No. 8-1-301/A, Main Road, Tolichowki, Shaikpet, Hyderabad, Telangana 500008',
        workingDays: settings.workingDays || 'Monday – Sunday',
        workingHours: settings.workingHours || '9:00 AM – 9:00 PM'
      });
    }
  }, [settings]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-luxury-card p-5 sm:p-6 rounded-2xl border border-luxury-gold/30 shadow-sm space-y-1">
        <h2 className="font-heading text-xl font-bold text-luxury-walnut flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-luxury-gold" />
          <span>Site Contact & Business Settings</span>
        </h2>
        <p className="text-xs text-luxury-muted">
          Update company phone number, WhatsApp number, floating icons, working hours, email ID, and studio address across the entire website.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Settings saved successfully! Phone numbers, WhatsApp, floating icons, and working hours are now updated live across all pages.</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-luxury-card p-6 sm:p-8 rounded-3xl border border-luxury-gold/30 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: Main Display & Raw Phone Numbers */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-luxury-gold-dark flex items-center gap-2 pb-2 border-b border-luxury-border">
              <Phone className="w-4 h-4 text-luxury-gold" />
              <span>1. Header & Card Phone Numbers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5">
                  Display Phone Number
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
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5">
                  Raw Phone Dialing Link
                </label>
                <input
                  type="text"
                  required
                  value={formData.phoneRaw}
                  onChange={(e) => setFormData({ ...formData, phoneRaw: e.target.value })}
                  placeholder="+918464930376"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none font-mono"
                />
                <span className="text-[10px] text-luxury-muted mt-1 block">Used for direct tel: one-click dialing</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: WhatsApp Settings */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 flex items-center gap-2 pb-2 border-b border-luxury-border">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>2. WhatsApp Numbers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5">
                  Display WhatsApp Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+91 8464930376"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
                />
                <span className="text-[10px] text-luxury-muted mt-1 block">Text displayed on WhatsApp cards</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5">
                  Raw WhatsApp Number (Country Code + Digits)
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
          </div>

          {/* SECTION 3: Floating Call & WhatsApp Buttons */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-luxury-gold-dark flex items-center gap-2 pb-2 border-b border-luxury-border">
              <Compass className="w-4 h-4 text-luxury-gold" />
              <span>3. Floating Call & WhatsApp Action Buttons</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5">
                  Floating Call Button Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.floatingPhone}
                  onChange={(e) => setFormData({ ...formData, floatingPhone: e.target.value })}
                  placeholder="+918464930376"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none font-mono"
                />
                <span className="text-[10px] text-luxury-muted mt-1 block">Number triggered when clicking floating Call icon</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5">
                  Floating WhatsApp Button Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.floatingWhatsapp}
                  onChange={(e) => setFormData({ ...formData, floatingWhatsapp: e.target.value })}
                  placeholder="918464930376"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none font-mono"
                />
                <span className="text-[10px] text-luxury-muted mt-1 block">Number opened when clicking floating green WhatsApp icon</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Contact Page Timings & Days */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-luxury-gold-dark flex items-center gap-2 pb-2 border-b border-luxury-border">
              <Clock className="w-4 h-4 text-luxury-gold" />
              <span>4. Visiting & Consultation Hours (Contact Page & Footer)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Working Days</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.workingDays}
                  onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                  placeholder="Monday – Sunday"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
                />
                <span className="text-[10px] text-luxury-muted mt-1 block">e.g. Monday – Sunday (All 7 Days)</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Working Timings / Hours</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  placeholder="9:00 AM – 9:00 PM"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
                />
                <span className="text-[10px] text-luxury-muted mt-1 block">e.g. 9:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Official Email & Studio Address */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-luxury-gold-dark flex items-center gap-2 pb-2 border-b border-luxury-border">
              <Mail className="w-4 h-4 text-luxury-gold" />
              <span>5. Official Business Email & Workshop Address</span>
            </h3>

            <div className="space-y-4">
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
                  placeholder="Door No. 8-1-301/A, Main Road, Tolichowki, Shaikpet, Hyderabad, Telangana 500008"
                  className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:border-luxury-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-luxury-border flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Settings...' : 'Save Contact Settings'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
