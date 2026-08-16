import React, { useState } from 'react';
import { Phone, Mail, MapPin, Calendar, Trash2, Search, Sparkles, Clock, CheckCircle, Home, MessageCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function AdminContactInquiries() {
  const { contactInquiries, updateInquiryStatus, deleteInquiry } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInquiries = contactInquiries.filter(item => {
    const matchesSearch = 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.property_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filters */}
      <div className="bg-luxury-card p-5 rounded-2xl border border-luxury-gold/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-luxury-walnut flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span>Contact Page Site Consultations ({contactInquiries.length} Inquiries)</span>
            </h2>
            <p className="text-xs text-luxury-muted mt-0.5">
              Site visit & measurement consultation inquiries submitted directly from the Contact Page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'New', 'Contacted', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-luxury-walnut text-luxury-gold border border-luxury-gold'
                    : 'bg-luxury-surface text-luxury-muted border border-luxury-border'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, space type, or neighborhood..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Contact Consultation Inquiries Grid / Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-luxury-card p-12 rounded-2xl text-center space-y-3 border border-luxury-border">
          <Phone className="w-10 h-10 text-luxury-gold mx-auto opacity-50" />
          <h3 className="font-heading text-base font-bold text-luxury-walnut">No Contact Consultation Inquiries</h3>
          <p className="text-xs text-luxury-muted">
            New consultation form submissions from the Contact Page will record here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((item) => {
            const waMsg = `Hello ${item.name || 'Customer'},\n\nThank you for contacting Zameer Interiors for site consultation. We received your request regarding ${item.property_type || 'your project'}. When would be a convenient time for a site visit?`;
            const waUrl = buildWhatsAppUrl(waMsg);

            return (
              <div
                key={item.id}
                className="bg-luxury-card rounded-2xl p-5 border-2 border-luxury-border shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                {/* Status Bar Indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  item.status === 'Completed' ? 'bg-emerald-500' :
                  item.status === 'Contacted' ? 'bg-blue-500' : 'bg-luxury-gold'
                }`} />

                <div className="space-y-3">
                  {/* Top Badges Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold-dark text-xs font-bold font-heading flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>{item.property_type || 'Residential'}</span>
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        item.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                      }`}>
                        {item.status || 'New'}
                      </span>
                    </div>

                    <span className="text-[11px] text-luxury-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-luxury-gold" />
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Customer Info Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-luxury-surface/80 p-3.5 rounded-xl border border-luxury-border">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-luxury-muted block">Customer Name</span>
                      <h3 className="font-heading text-sm font-bold text-luxury-walnut">{item.name || 'Anonymous'}</h3>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-luxury-muted block">Phone Number</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${item.phone}`}
                          className="font-sans font-bold text-xs text-luxury-gold-dark hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{item.phone}</span>
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase flex items-center gap-1"
                          title="Open Direct WhatsApp Chat"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Chat</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-luxury-muted block">Location & Timeline</span>
                      <div className="text-xs text-luxury-walnut font-medium space-y-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-luxury-gold" />
                          {item.location || 'Hyderabad'}
                        </span>
                        {item.project_timeline && (
                          <span className="text-[11px] text-luxury-muted flex items-center gap-1">
                            <Clock className="w-3 h-3 text-luxury-gold" />
                            Timeline: {item.project_timeline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes / Description */}
                  {item.notes && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-luxury-charcoal block">Consultation Message / Requirements:</span>
                      <p className="text-xs text-luxury-walnut bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 leading-relaxed">
                        {item.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Delete Controls */}
                <div className="pt-3 border-t border-luxury-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-luxury-muted">ID: {item.id}</span>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={item.status || 'New'}
                      onChange={(e) => updateInquiryStatus('contact', item.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:outline-none cursor-pointer"
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Completed">Status: Completed</option>
                    </select>

                    <button
                      onClick={() => deleteInquiry('contact', item.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
