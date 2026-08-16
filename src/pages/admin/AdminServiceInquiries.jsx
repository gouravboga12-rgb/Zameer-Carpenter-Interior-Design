import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, Calendar, Trash2, Search, CheckCircle, Clock } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function AdminServiceInquiries() {
  const { serviceInquiries, updateInquiryStatus, deleteInquiry } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInquiries = serviceInquiries.filter(item => {
    const matchesSearch = 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.service_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              Service inquiries recorded from customer service forms & WhatsApp triggers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'New', 'Contacted', 'Completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
            placeholder="Search by customer name, phone, service, or location..."
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
          <h3 className="font-heading text-base font-bold text-luxury-walnut">No Service Inquiries Found</h3>
          <p className="text-xs text-luxury-muted">
            New service form inquiries will automatically record here.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredInquiries.map((item) => (
            <div
              key={item.id}
              className="bg-luxury-card rounded-2xl p-5 border border-luxury-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-luxury-walnut text-luxury-gold text-xs font-bold font-heading">
                    {item.service_title}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    item.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                  }`}>
                    {item.status || 'New'}
                  </span>

                  <span className="text-[11px] text-luxury-muted flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-luxury-gold" />
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="font-heading text-base font-bold text-luxury-walnut">{item.name}</h3>
                  <a
                    href={`tel:${item.phone}`}
                    className="font-sans font-bold text-sm text-luxury-gold-dark hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{item.phone}</span>
                  </a>
                  {item.location && (
                    <span className="text-xs text-luxury-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                      {item.location}
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-xs text-luxury-muted bg-luxury-surface p-2.5 rounded-xl border border-luxury-border">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-luxury-border">
                <select
                  value={item.status || 'New'}
                  onChange={(e) => updateInquiryStatus('service', item.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs font-bold text-luxury-walnut focus:outline-none"
                >
                  <option value="New">Mark as New</option>
                  <option value="Contacted">Mark as Contacted</option>
                  <option value="Completed">Mark as Completed</option>
                </select>

                <button
                  onClick={() => deleteInquiry('service', item.id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white transition-colors"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
