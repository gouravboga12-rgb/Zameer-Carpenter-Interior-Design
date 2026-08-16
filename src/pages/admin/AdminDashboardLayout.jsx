import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Wrench, MessageSquare, PhoneCall, 
  FolderGit2, Settings, LogOut, ExternalLink, ShieldCheck, Sparkles, Menu, X
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import AdminDashboardOverview from './AdminDashboardOverview';
import AdminServicesManager from './AdminServicesManager';
import AdminServiceInquiries from './AdminServiceInquiries';
import AdminContactInquiries from './AdminContactInquiries';
import AdminProjectsManager from './AdminProjectsManager';
import AdminSettingsManager from './AdminSettingsManager';

export default function AdminDashboardLayout() {
  const { logoutAdmin, services, projects, serviceInquiries, contactInquiries } = useAdminData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  const totalInquiries = serviceInquiries.length + contactInquiries.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Service Verticals (CRUD)', icon: Wrench, count: services.length },
    { id: 'service-inquiries', label: 'Service Form Inquiries', icon: MessageSquare, count: serviceInquiries.length },
    { id: 'contact-inquiries', label: 'Contact Page Inquiries', icon: PhoneCall, count: contactInquiries.length },
    { id: 'projects', label: 'Projects & Video Upload', icon: FolderGit2, count: projects.length },
    { id: 'settings', label: 'Phone & WhatsApp Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-luxury-bg text-luxury-charcoal flex flex-col md:flex-row">
      
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-luxury-walnut text-[#FDFBF7] p-4 flex items-center justify-between border-b border-luxury-gold/30 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-luxury-gold" />
          <span className="font-heading font-bold text-sm text-luxury-gold">Zameer Admin</span>
        </div>

        <button
          onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
          className="p-2 rounded-lg bg-white/10 text-white"
        >
          {sidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-72 bg-luxury-walnut text-[#FDFBF7] p-6 border-r border-luxury-gold/30 flex flex-col justify-between transition-transform duration-300 shadow-2xl shrink-0
        ${sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          
          {/* Logo & Pedigree */}
          <div className="pb-6 border-b border-luxury-gold/20">
            <Link to="/" className="inline-block mb-2">
              <img
                src="/logo.png"
                alt="Zameer Interiors"
                className="h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]"
              />
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Admin Portal Active</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-luxury-gold text-luxury-walnut shadow-md scale-102'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-luxury-walnut text-luxury-gold' : 'bg-white/10 text-gray-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-luxury-gold/20 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold transition-colors border border-red-500/30 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        
        {/* Active Tab Header Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-luxury-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
              Dashboard Control Panel
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut mt-1">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-luxury-muted">Logged in as:</span>
            <span className="text-xs font-bold text-luxury-walnut bg-luxury-surface px-3 py-1.5 rounded-lg border border-luxury-border">
              interiordesignerzameer@gmail.com
            </span>
          </div>
        </div>

        {/* Tab Content Renderer */}
        {activeTab === 'dashboard' && <AdminDashboardOverview onNavigate={(tabId) => setActiveTab(tabId)} />}
        {activeTab === 'services' && <AdminServicesManager />}
        {activeTab === 'service-inquiries' && <AdminServiceInquiries />}
        {activeTab === 'contact-inquiries' && <AdminContactInquiries />}
        {activeTab === 'projects' && <AdminProjectsManager />}
        {activeTab === 'settings' && <AdminSettingsManager />}

      </main>

    </div>
  );
}
