import React, { useState } from 'react';
import { 
  MessageSquare, Phone, MapPin, Calendar, Trash2, Search, 
  CheckCircle, Home, Send, MessageCircle, Mail, Sparkles,
  ExternalLink, UserCheck, Clock, FileText, CheckCircle2
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function AdminServiceInquiries() {
  const { serviceInquiries, updateInquiryStatus, deleteInquiry } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInquiries = serviceInquiries.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (item.name || '').toLowerCase().includes(term) ||
      (item.phone || '').includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.service_title || '').toLowerCase().includes(term) ||
      (item.property_type || '').toLowerCase().includes(term) ||
      (item.location || '').toLowerCase().includes(term) ||
      (item.notes || '').toLowerCase().includes(term);
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="bg-luxury-card p-5 sm:p-6 rounded-3xl border border-luxury-gold/30 shadow-luxury space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-luxury-gold-dark font-cinzel text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span>Service Vertical Lead Engine</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-luxury-walnut mt-0.5">
              Service Form Inquiries ({serviceInquiries.filter(i => (i.status || 'New') !== 'Completed').length} Pending · {serviceInquiries.length} Total)
            </h2>
            <p className="text-xs text-luxury-muted mt-0.5">
              Inquiries recorded specifically from individual service booking forms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'New', 'Contacted', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-luxury-walnut text-luxury-gold border border-luxury-gold shadow-xs'
                    : 'bg-luxury-surface text-luxury-muted hover:text-luxury-charcoal border border-luxury-border'
                }`}
              >
                {st} ({st === 'All' ? serviceInquiries.length : serviceInquiries.filter(i => (i.status || 'New') === st).length})
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, email, service vertical, space type, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs sm:text-sm text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Inquiries Grid / Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-luxury-card p-12 sm:p-16 rounded-3xl text-center space-y-3 border border-luxury-border shadow-luxury">
          <div className="w-14 h-14 rounded-2xl bg-luxury-gold/10 text-luxury-gold flex items-center justify-center mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-heading text-lg font-bold text-luxury-walnut">No Service Form Inquiries Found</h3>
          <p className="text-xs sm:text-sm text-luxury-muted max-w-md mx-auto">
            {searchTerm || statusFilter !== 'All' 
              ? 'No inquiries match your filter criteria. Try resetting your search.' 
              : 'Inquiries submitted from individual service pages will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((item) => {
            const cleanPhone = (item.phone || '').replace(/[^\d]/g, '');
            const waMsg = `Hello ${item.name || 'Customer'},\n\nThis is Zameer Interiors regarding your inquiry for "${item.service_title}".\n\nWe would like to schedule a site visit for your ${item.property_type || 'space'}.\n\nPlease let us know your convenient time.`;
            const waUrl = buildWhatsAppUrl(waMsg);

            return (
              <div
                key={item.id}
                className="bg-luxury-card rounded-3xl p-5 sm:p-6 border-2 border-luxury-border/80 hover:border-luxury-gold/50 shadow-luxury transition-all space-y-4 relative overflow-hidden"
              >
                {/* Top Status Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.status === 'Completed' ? 'bg-emerald-500' :
                  item.status === 'Contacted' ? 'bg-blue-500' : 'bg-gradient-to-r from-luxury-gold to-yellow-500'
                }`} />

                {/* Top Row: Service Title + Status + Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-luxury-border/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-luxury-walnut text-luxury-gold text-xs font-bold font-heading uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                      <span>🛠</span>
                      <span>{item.service_title}</span>
                    </span>

                    {item.property_type && (
                      <span className="px-3 py-1 rounded-full bg-luxury-surface border border-luxury-border text-luxury-charcoal text-xs font-bold flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-luxury-gold" />
                        <span>{item.property_type}</span>
                      </span>
                    )}

                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      item.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        item.status === 'Completed' ? 'bg-emerald-500' :
                        item.status === 'Contacted' ? 'bg-blue-500' : 'bg-amber-500'
                      }`} />
                      <span>{item.status || 'New'}</span>
                    </span>
                  </div>

                  <span className="text-xs text-luxury-muted font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </span>
                </div>

                {/* Customer Details Grid (4 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-luxury-surface/70 p-4 rounded-2xl border border-luxury-border">
                  
                  {/* Customer Name */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-luxury-muted tracking-wider block">
                      Customer Name
                    </span>
                    <h3 className="font-heading text-sm font-bold text-luxury-walnut truncate">
                      {item.name || 'Anonymous'}
                    </h3>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-luxury-muted tracking-wider block">
                      Mobile Number
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="font-mono font-bold text-xs sm:text-sm text-luxury-gold-dark hover:underline flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                      <span>{item.phone}</span>
                    </a>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-luxury-muted tracking-wider block">
                      Email Address
                    </span>
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        className="text-xs text-luxury-charcoal hover:underline flex items-center gap-1.5 truncate"
                        title={item.email}
                      >
                        <Mail className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-luxury-muted italic">Not provided</span>
                    )}
                  </div>

                  {/* Property Address */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-luxury-muted tracking-wider block">
                      Property Address / Location
                    </span>
                    <span className="text-xs text-luxury-walnut font-medium flex items-start gap-1.5 line-clamp-2" title={item.location}>
                      <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                      <span>{item.location || 'Direct Inquiry'}</span>
                    </span>
                  </div>

                </div>

                {/* Project Notes / Dimensions */}
                {item.notes && (
                  <div className="bg-amber-500/5 p-3.5 rounded-2xl border border-amber-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-luxury-gold-dark">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Project Notes & Dimensions:</span>
                    </div>
                    <p className="text-xs text-luxury-walnut leading-relaxed">
                      {item.notes}
                    </p>
                  </div>
                )}

                {/* Direct Action Buttons: Call, WhatsApp, Status Selector, Delete */}
                <div className="pt-2 border-t border-luxury-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* Quick Action Badges */}
                  <div className="flex items-center gap-2">
                    {/* Direct Call Button */}
                    <a
                      href={`tel:${cleanPhone}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-luxury-walnut hover:bg-luxury-charcoal text-luxury-gold text-xs font-bold shadow-xs transition-colors"
                      title="Call Customer Directly"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call {item.phone}</span>
                    </a>

                    {/* Direct WhatsApp Button */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                      title="Open WhatsApp Chat with Pre-filled Service Message"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>

                  {/* Status & Delete */}
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[10px] font-mono text-luxury-muted mr-1 hidden md:inline">ID: {item.id}</span>

                    <select
                      value={item.status || 'New'}
                      onChange={(e) => updateInquiryStatus('service', item.id, e.target.value)}
                      className="px-3 py-2 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:outline-none focus:border-luxury-gold cursor-pointer"
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Completed">Status: Completed</option>
                    </select>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete inquiry from ${item.name}?`)) {
                          deleteInquiry('service', item.id);
                        }
                      }}
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
