import React from 'react';
import { 
  Wrench, MessageSquare, PhoneCall, FolderGit2, Settings, 
  TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Phone, ShieldCheck
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export default function AdminDashboardOverview({ onNavigate }) {
  const { services, projects, serviceInquiries, contactInquiries, settings } = useAdminData();

  const newServiceInquiries = serviceInquiries.filter(i => !i.status || i.status === 'New').length;
  const newContactInquiries = contactInquiries.filter(i => !i.status || i.status === 'New').length;
  const totalInquiries = serviceInquiries.length + contactInquiries.length;

  const recentServiceInquiries = serviceInquiries.slice(0, 4);
  const recentContactInquiries = contactInquiries.slice(0, 4);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-luxury-walnut text-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-luxury-gold/40 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25)_0%,transparent_60%)] pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Dashboard</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Welcome, <span className="text-luxury-gold">Zameer Interior Admin</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
            Manage service verticals, process client inquiries, upload high-res project media, and update live contact details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={() => onNavigate('service-inquiries')}
            className="px-4 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-400 text-luxury-walnut font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Inquiries ({serviceInquiries.length})</span>
          </button>
          
          <button
            onClick={() => onNavigate('projects')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4 text-luxury-gold" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Service Verticals */}
        <div
          onClick={() => onNavigate('services')}
          className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm hover:border-luxury-gold hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted">
              Service Verticals
            </span>
            <div className="w-10 h-10 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-luxury-walnut">{services.length}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Active CRUD
            </span>
          </div>
          <span className="text-[11px] text-luxury-muted mt-1 block">Full execution scope & catalog</span>
        </div>

        {/* Service Form Inquiries */}
        <div
          onClick={() => onNavigate('service-inquiries')}
          className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm hover:border-luxury-gold hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted">
              Service Form Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 text-luxury-gold-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-luxury-walnut">{serviceInquiries.length}</span>
            {newServiceInquiries > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 animate-pulse">
                {newServiceInquiries} New
              </span>
            )}
          </div>
          <span className="text-[11px] text-luxury-muted mt-1 block">Recorded & WhatsApp dual action</span>
        </div>

        {/* Contact Site Consultations */}
        <div
          onClick={() => onNavigate('contact-inquiries')}
          className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm hover:border-luxury-gold hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted">
              Contact Site Visits
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-luxury-walnut">{contactInquiries.length}</span>
            {newContactInquiries > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 animate-pulse">
                {newContactInquiries} New
              </span>
            )}
          </div>
          <span className="text-[11px] text-luxury-muted mt-1 block">Tolichowki / Shaikpet consultations</span>
        </div>

        {/* Portfolio Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm hover:border-luxury-gold hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted">
              Projects & Video Tours
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold text-luxury-walnut">{projects.length}</span>
            <span className="text-xs text-luxury-muted font-medium">Media Gallery</span>
          </div>
          <span className="text-[11px] text-luxury-muted mt-1 block">Photos, walkthroughs & 3D renders</span>
        </div>

      </div>

      {/* Live Contact Settings Strip */}
      <div className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal">
              Live Phone & WhatsApp Settings
            </h4>
            <p className="text-xs font-bold text-luxury-walnut mt-0.5">
              Phone: {settings.phone} | WhatsApp: {settings.whatsapp}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('settings')}
          className="px-4 py-2 rounded-xl bg-luxury-surface border border-luxury-border hover:bg-luxury-border text-luxury-walnut font-bold text-xs uppercase transition-colors shrink-0 cursor-pointer"
        >
          Edit Phone/WhatsApp Settings ›
        </button>
      </div>

      {/* Recent Inquiries Feeds (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Service Form Inquiries Feed */}
        <div className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-luxury-gold" />
              <h3 className="font-heading font-bold text-base text-luxury-walnut">Recent Service Inquiries</h3>
            </div>
            <button
              onClick={() => onNavigate('service-inquiries')}
              className="text-xs font-bold text-luxury-gold-dark hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All ({serviceInquiries.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentServiceInquiries.length === 0 ? (
            <p className="text-xs text-luxury-muted py-6 text-center">No service inquiries recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentServiceInquiries.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-luxury-surface border border-luxury-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-luxury-walnut">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-walnut text-luxury-gold font-bold">
                      {item.service_title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-luxury-gold-dark font-bold">{item.phone}</span>
                    <span className="text-[10px] text-luxury-muted">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Page Inquiries Feed */}
        <div className="bg-luxury-card p-5 rounded-2xl border border-luxury-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border pb-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <h3 className="font-heading font-bold text-base text-luxury-walnut">Recent Contact Consultations</h3>
            </div>
            <button
              onClick={() => onNavigate('contact-inquiries')}
              className="text-xs font-bold text-luxury-gold-dark hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All ({contactInquiries.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentContactInquiries.length === 0 ? (
            <p className="text-xs text-luxury-muted py-6 text-center">No contact consultations recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentContactInquiries.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-luxury-surface border border-luxury-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xs font-bold text-luxury-walnut">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                      {item.property_type || 'Residential'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold">{item.phone}</span>
                    <span className="text-[10px] text-luxury-muted">{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
