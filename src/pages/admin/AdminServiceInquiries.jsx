import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, Calendar, Trash2, Search, CheckCircle, Home, Send, MessageCircle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export default function AdminServiceInquiries() {
  const { serviceInquiries, updateInquiryStatus, deleteInquiry } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInquiries = serviceInquiries.filter(item => {
    const matchesSearch = 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.service_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <h2 className="font-heading text-xl font-bold text-luxury-walnut">
              Service Form Inquiries ({serviceInquiries.length} Submissions)
            </h2>
            <p className="text-xs text-luxury-muted mt-0.5">
              Service inquiries recorded specifically from customer service vertical forms.
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

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, service vertical, space type, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Inquiries Table / Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-luxury-card p-12 rounded-2xl text-center space-y-3 border border-luxury-border">
          <MessageSquare className="w-10 h-10 text-luxury-gold mx-auto opacity-50" />
          <h3 className="font-heading text-base font-bold text-luxury-walnut">No Service Form Inquiries Found</h3>
          <p className="text-xs text-luxury-muted">
            New service vertical form submissions will record here with full details.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((item) => {
            const waMsg = `Hello ${item.name || 'Customer'},\n\nWe received your inquiry for "${item.service_title}" on Zameer Interiors. We would love to discuss your ${item.property_type || 'project'} requirements and arrange a site visit.`;
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
                  {/* Top Row: Service Title Badge + Status + Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-luxury-walnut text-luxury-gold text-xs font-bold uppercase tracking-wider shadow-xs">
                        🛠 {item.service_title}
                      </span>

                      {item.property_type && (
                        <span className="px-2.5 py-1 rounded-full bg-luxury-surface border border-luxury-border text-luxury-walnut text-xs font-semibold flex items-center gap-1">
                          <Home className="w-3 h-3 text-luxury-gold" />
                          <span>{item.property_type}</span>
                        </span>
                      )}

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

                  {/* Customer Info Row */}
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
                      <span className="text-[10px] font-bold uppercase text-luxury-muted block">Location / City</span>
                      <span className="text-xs text-luxury-walnut font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-luxury-gold" />
                        {item.location || 'Hyderabad'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Notes / Project Description */}
                  {item.notes && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-luxury-charcoal block">Inquiry Notes / Project Requirements:</span>
                      <p className="text-xs text-luxury-walnut bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 leading-relaxed">
                        {item.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-luxury-border flex items-center justify-between">
                  <span className="text-[10px] font-mono text-luxury-muted">ID: {item.id}</span>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={item.status || 'New'}
                      onChange={(e) => updateInquiryStatus('service', item.id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:outline-none cursor-pointer"
                    >
                      <option value="New">Status: New</option>
                      <option value="Contacted">Status: Contacted</option>
                      <option value="Completed">Status: Completed</option>
                    </select>

                    <button
                      onClick={() => deleteInquiry('service', item.id)}
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
