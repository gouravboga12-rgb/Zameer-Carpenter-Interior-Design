import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SERVICES_DATA } from '../data/servicesData';
import { PORTFOLIO_PROJECTS, REAL_PROJECT_VIDEOS } from '../data/portfolioData';
import { COMPANY_INFO } from '../data/companyInfo';
import { getServiceInquiryWhatsAppUrl, getGeneralWhatsAppUrl, getConsultationWhatsAppUrl } from '../utils/whatsapp';

const AdminDataContext = createContext(null);

export const ADMIN_CREDENTIALS = {
  email: 'interiordesignerzameer@gmail.com',
  password: 'Zameer@9390'
};

export function AdminDataProvider({ children }) {
  // 1. Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('zameer_admin_auth') === 'true';
  });

  // 2. Dynamic Services State
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('zameer_services_cache');
    return saved ? JSON.parse(saved) : SERVICES_DATA;
  });

  // 3. Dynamic Projects & Videos State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('zameer_projects_cache');
    return saved ? JSON.parse(saved) : [...PORTFOLIO_PROJECTS, ...REAL_PROJECT_VIDEOS];
  });

  // 4. Inquiries State
  const [serviceInquiries, setServiceInquiries] = useState(() => {
    const saved = localStorage.getItem('zameer_service_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [contactInquiries, setContactInquiries] = useState(() => {
    const saved = localStorage.getItem('zameer_contact_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Company Contact Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('zameer_settings_cache');
    return saved ? JSON.parse(saved) : {
      phone: COMPANY_INFO.phone,
      phoneRaw: COMPANY_INFO.phoneRaw,
      whatsapp: COMPANY_INFO.whatsapp,
      whatsappRaw: COMPANY_INFO.whatsappRaw,
      email: COMPANY_INFO.email,
      address: COMPANY_INFO.address.full
    };
  });

  // Load / Sync initial data from Supabase
  useEffect(() => {
    fetchSupabaseData();
  }, []);

  async function fetchSupabaseData() {
    try {
      // Sync Services
      const { data: dbServices, error: sErr } = await supabase.from('services').select('*').order('numeric_id', { ascending: true });
      if (!sErr && dbServices && dbServices.length > 0) {
        const formatted = dbServices.map(s => ({
          id: s.id,
          numericId: s.numeric_id,
          title: s.title,
          shortTitle: s.short_title,
          iconName: s.icon_name,
          highlight: s.highlight,
          description: s.description,
          image: s.image,
          subservices: s.subservices || [],
          features: s.features || []
        }));
        setServices(formatted);
        localStorage.setItem('zameer_services_cache', JSON.stringify(formatted));
      }

      // Sync Projects
      const { data: dbProjects, error: pErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!pErr && dbProjects && dbProjects.length > 0) {
        const formattedP = dbProjects.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          description: p.description,
          materials: p.materials,
          scope: p.scope,
          image: p.image,
          type: p.type || 'image',
          videoUrl: p.video_url,
          poster: p.poster,
          duration: p.duration
        }));
        setProjects(formattedP);
        localStorage.setItem('zameer_projects_cache', JSON.stringify(formattedP));
      }

      // Sync Service Inquiries
      const { data: dbSInquiries } = await supabase.from('service_inquiries').select('*').order('created_at', { ascending: false });
      if (dbSInquiries) {
        setServiceInquiries(dbSInquiries);
        localStorage.setItem('zameer_service_inquiries', JSON.stringify(dbSInquiries));
      }

      // Sync Contact Inquiries
      const { data: dbCInquiries } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });
      if (dbCInquiries) {
        setContactInquiries(dbCInquiries);
        localStorage.setItem('zameer_contact_inquiries', JSON.stringify(dbCInquiries));
      }

      // Sync Settings
      const { data: dbSettings } = await supabase.from('company_settings').select('*').eq('id', 1).single();
      if (dbSettings) {
        const setObj = {
          phone: dbSettings.phone,
          phoneRaw: dbSettings.phone_raw,
          whatsapp: dbSettings.whatsapp,
          whatsappRaw: dbSettings.whatsapp_raw,
          email: dbSettings.email,
          address: dbSettings.address
        };
        setSettings(setObj);
        localStorage.setItem('zameer_settings_cache', JSON.stringify(setObj));
      }
    } catch (err) {
      console.warn('Supabase sync notice (using cached/fallback state):', err);
    }
  }

  // Auth Methods
  const loginAdmin = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('zameer_admin_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'Invalid admin email or password' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('zameer_admin_auth');
  };

  // Service Form Submission (Saves to Admin + Triggers WhatsApp)
  const submitServiceInquiry = async (formData) => {
    const newEntry = {
      id: 'sinq_' + Date.now(),
      service_id: formData.serviceId || 'general',
      service_title: formData.serviceTitle || 'Complete Interiors',
      name: formData.name || 'Anonymous',
      phone: formData.phone || '',
      location: formData.location || 'Hyderabad',
      property_type: formData.propertyType || 'Residential',
      notes: formData.notes || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Update Local State & Cache
    const updated = [newEntry, ...serviceInquiries];
    setServiceInquiries(updated);
    localStorage.setItem('zameer_service_inquiries', JSON.stringify(updated));

    // Try Supabase Insert
    try {
      await supabase.from('service_inquiries').insert([{
        service_id: newEntry.service_id,
        service_title: newEntry.service_title,
        name: newEntry.name,
        phone: newEntry.phone,
        location: newEntry.location,
        property_type: newEntry.property_type,
        notes: newEntry.notes,
        status: newEntry.status
      }]);
    } catch (e) {
      console.warn('Saved locally, Supabase insert deferred:', e);
    }

    // Build WhatsApp URL with full details & Open
    const waUrl = getConsultationWhatsAppUrl({
      name: newEntry.name,
      phone: newEntry.phone,
      service: newEntry.service_title,
      spaceType: newEntry.property_type,
      message: newEntry.notes
    });
    window.open(waUrl, '_blank');
    return newEntry;
  };

  // Contact Page Consultation Submission (Saves to Admin + Triggers WhatsApp)
  const submitContactInquiry = async (formData) => {
    const newEntry = {
      id: 'cinq_' + Date.now(),
      name: formData.name || 'Anonymous',
      phone: formData.phone || '',
      email: formData.email || '',
      location: formData.location || 'Hyderabad',
      property_type: formData.propertyType || '3BHK Villa / Apartment',
      project_timeline: formData.timeline || 'Immediate',
      notes: formData.notes || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Update Local State & Cache
    const updated = [newEntry, ...contactInquiries];
    setContactInquiries(updated);
    localStorage.setItem('zameer_contact_inquiries', JSON.stringify(updated));

    // Try Supabase Insert
    try {
      await supabase.from('contact_inquiries').insert([{
        name: newEntry.name,
        phone: newEntry.phone,
        email: newEntry.email,
        location: newEntry.location,
        property_type: newEntry.property_type,
        project_timeline: newEntry.project_timeline,
        notes: newEntry.notes,
        status: newEntry.status
      }]);
    } catch (e) {
      console.warn('Saved locally, Supabase insert deferred:', e);
    }

    // Build WhatsApp URL with full details & Open
    const waUrl = getConsultationWhatsAppUrl({
      name: newEntry.name,
      phone: newEntry.phone,
      service: formData.serviceTitle || formData.service || 'Complete Home Interior Design',
      spaceType: newEntry.property_type,
      message: newEntry.notes
    });
    window.open(waUrl, '_blank');
    return newEntry;
  };

  // Services CRUD
  const addService = async (newService) => {
    const sId = newService.id || 'service_' + Date.now();
    const serviceObj = {
      id: sId,
      numericId: services.length + 1,
      title: newService.title,
      shortTitle: newService.shortTitle || newService.title,
      iconName: newService.iconName || 'Home',
      highlight: newService.highlight || 'Custom Fit-Out',
      description: newService.description,
      image: newService.image,
      subservices: newService.subservices || [],
      features: newService.features || []
    };

    const updated = [...services, serviceObj];
    setServices(updated);
    localStorage.setItem('zameer_services_cache', JSON.stringify(updated));

    try {
      await supabase.from('services').upsert([{
        id: serviceObj.id,
        numeric_id: serviceObj.numericId,
        title: serviceObj.title,
        short_title: serviceObj.shortTitle,
        icon_name: serviceObj.iconName,
        highlight: serviceObj.highlight,
        description: serviceObj.description,
        image: serviceObj.image,
        subservices: serviceObj.subservices,
        features: serviceObj.features
      }]);
    } catch (e) {
      console.warn('Service saved locally:', e);
    }
  };

  const updateService = async (id, updatedFields) => {
    const updated = services.map(s => s.id === id ? { ...s, ...updatedFields } : s);
    setServices(updated);
    localStorage.setItem('zameer_services_cache', JSON.stringify(updated));

    const target = updated.find(s => s.id === id);
    if (target) {
      try {
        await supabase.from('services').upsert([{
          id: target.id,
          numeric_id: target.numericId,
          title: target.title,
          short_title: target.shortTitle,
          icon_name: target.iconName,
          highlight: target.highlight,
          description: target.description,
          image: target.image,
          subservices: target.subservices,
          features: target.features
        }]);
      } catch (e) {
        console.warn('Service update saved locally:', e);
      }
    }
  };

  const deleteService = async (id) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('zameer_services_cache', JSON.stringify(updated));

    try {
      await supabase.from('services').delete().eq('id', id);
    } catch (e) {
      console.warn('Service deleted locally:', e);
    }
  };

  // Projects CRUD
  const addProject = async (newProject) => {
    const pId = newProject.id || 'proj_' + Date.now();
    const projObj = {
      id: pId,
      title: newProject.title,
      category: newProject.category || 'Complete Interiors',
      location: newProject.location || 'Tolichowki, Hyderabad',
      description: newProject.description,
      materials: newProject.materials || 'IS:710 Marine Plywood & German Hardware',
      scope: newProject.scope || 'Full Turnkey Execution',
      image: newProject.image,
      type: newProject.type || 'image',
      videoUrl: newProject.videoUrl || '',
      poster: newProject.poster || newProject.image,
      duration: newProject.duration || '0:45'
    };

    const updated = [projObj, ...projects];
    setProjects(updated);
    localStorage.setItem('zameer_projects_cache', JSON.stringify(updated));

    try {
      await supabase.from('projects').upsert([{
        id: projObj.id,
        title: projObj.title,
        category: projObj.category,
        location: projObj.location,
        description: projObj.description,
        materials: projObj.materials,
        scope: projObj.scope,
        image: projObj.image,
        type: projObj.type,
        video_url: projObj.videoUrl,
        poster: projObj.poster,
        duration: projObj.duration
      }]);
    } catch (e) {
      console.warn('Project saved locally:', e);
    }
  };

  const updateProject = async (id, updatedFields) => {
    const updated = projects.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    setProjects(updated);
    localStorage.setItem('zameer_projects_cache', JSON.stringify(updated));

    const target = updated.find(p => p.id === id);
    if (target) {
      try {
        await supabase.from('projects').upsert([{
          id: target.id,
          title: target.title,
          category: target.category,
          location: target.location,
          description: target.description,
          materials: target.materials,
          scope: target.scope,
          image: target.image,
          type: target.type,
          video_url: target.videoUrl,
          poster: target.poster,
          duration: target.duration
        }]);
      } catch (e) {
        console.warn('Project update saved locally:', e);
      }
    }
  };

  const deleteProject = async (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('zameer_projects_cache', JSON.stringify(updated));

    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Project deleted locally:', e);
    }
  };

  // Inquiry Status Management
  const updateInquiryStatus = async (type, id, status) => {
    if (type === 'service') {
      const updated = serviceInquiries.map(item => item.id === id ? { ...item, status } : item);
      setServiceInquiries(updated);
      localStorage.setItem('zameer_service_inquiries', JSON.stringify(updated));
      try {
        await supabase.from('service_inquiries').update({ status }).eq('id', id);
      } catch (e) {}
    } else {
      const updated = contactInquiries.map(item => item.id === id ? { ...item, status } : item);
      setContactInquiries(updated);
      localStorage.setItem('zameer_contact_inquiries', JSON.stringify(updated));
      try {
        await supabase.from('contact_inquiries').update({ status }).eq('id', id);
      } catch (e) {}
    }
  };

  const deleteInquiry = async (type, id) => {
    if (type === 'service') {
      const updated = serviceInquiries.filter(item => item.id !== id);
      setServiceInquiries(updated);
      localStorage.setItem('zameer_service_inquiries', JSON.stringify(updated));
      try {
        await supabase.from('service_inquiries').delete().eq('id', id);
      } catch (e) {}
    } else {
      const updated = contactInquiries.filter(item => item.id !== id);
      setContactInquiries(updated);
      localStorage.setItem('zameer_contact_inquiries', JSON.stringify(updated));
      try {
        await supabase.from('contact_inquiries').delete().eq('id', id);
      } catch (e) {}
    }
  };

  // Settings Management
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem('zameer_settings_cache', JSON.stringify(merged));

    try {
      await supabase.from('company_settings').upsert([{
        id: 1,
        phone: merged.phone,
        phone_raw: merged.phoneRaw,
        whatsapp: merged.whatsapp,
        whatsapp_raw: merged.whatsappRaw,
        email: merged.email,
        address: merged.address
      }]);
    } catch (e) {
      console.warn('Settings updated locally:', e);
    }
  };

  return (
    <AdminDataContext.Provider value={{
      isAdminAuthenticated,
      loginAdmin,
      logoutAdmin,
      services,
      addService,
      updateService,
      deleteService,
      projects,
      addProject,
      updateProject,
      deleteProject,
      serviceInquiries,
      submitServiceInquiry,
      contactInquiries,
      submitContactInquiry,
      updateInquiryStatus,
      deleteInquiry,
      settings,
      updateSettings
    }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
