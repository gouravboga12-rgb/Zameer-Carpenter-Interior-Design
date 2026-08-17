import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SERVICES_DATA } from '../data/servicesData';
import { PORTFOLIO_PROJECTS, REAL_PROJECT_VIDEOS } from '../data/portfolioData';
import { COMPANY_INFO } from '../data/companyInfo';
import { getServiceInquiryWhatsAppUrl, getGeneralWhatsAppUrl, getConsultationWhatsAppUrl, getDedicatedServiceInquiryWhatsAppUrl } from '../utils/whatsapp';

const AdminDataContext = createContext(null);

export const ADMIN_CREDENTIALS = {
  email: 'interiordesignerzameer@gmail.com',
  password: 'Zameer@9390'
};

const DEFAULT_PROJECTS = [...PORTFOLIO_PROJECTS, ...REAL_PROJECT_VIDEOS];
const DEFAULT_SERVICES = SERVICES_DATA;

function getDeletedProjectIds() {
  try {
    return JSON.parse(localStorage.getItem('zameer_deleted_project_ids') || '[]');
  } catch (e) {
    return [];
  }
}

function getDeletedServiceIds() {
  try {
    return JSON.parse(localStorage.getItem('zameer_deleted_service_ids') || '[]');
  } catch (e) {
    return [];
  }
}

function mergeProjectsWithDefaults(customOrDbProjects, deletedIds = getDeletedProjectIds()) {
  const deletedSet = new Set(deletedIds);
  const map = new Map();

  // 1. Add all baseline default 19 projects & videos
  DEFAULT_PROJECTS.forEach(item => {
    if (!deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  });

  // 2. Overlay custom or Supabase projects
  (customOrDbProjects || []).forEach(item => {
    if (!deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  });

  // Sort: custom projects (starting with 'proj_') appear first, followed by baseline projects
  return Array.from(map.values()).sort((a, b) => {
    const isACustom = String(a.id).startsWith('proj_');
    const isBCustom = String(b.id).startsWith('proj_');
    if (isACustom && !isBCustom) return -1;
    if (!isACustom && isBCustom) return 1;
    return 0;
  });
}

function mergeServicesWithDefaults(customOrDbServices, deletedIds = getDeletedServiceIds()) {
  const deletedSet = new Set(deletedIds);
  const map = new Map();

  DEFAULT_SERVICES.forEach(item => {
    if (!deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  });

  (customOrDbServices || []).forEach(item => {
    if (!deletedSet.has(item.id)) {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values()).sort((a, b) => (a.numericId || 99) - (b.numericId || 99));
}

function mergeInquiries(localList, remoteList) {
  const dedupMap = new Map();

  const getDedupKey = (item) => {
    if (!item) return '';
    const phone = (item.phone || '').replace(/[^\d]/g, '').slice(-10);
    const name = (item.name || '').trim().toLowerCase();
    const service = (item.service_title || item.service_id || item.property_type || '').trim().toLowerCase();
    const dateStr = item.created_at ? new Date(item.created_at).toISOString().slice(0, 10) : 'today';
    return `${phone}_${name}_${service}_${dateStr}`;
  };

  // 1. Add remote items
  (remoteList || []).forEach(remoteItem => {
    const key = getDedupKey(remoteItem) || remoteItem.id;
    dedupMap.set(key, remoteItem);
  });

  // 2. Merge local items without duplication
  (localList || []).forEach(localItem => {
    const key = getDedupKey(localItem) || localItem.id;
    if (dedupMap.has(key)) {
      const existing = dedupMap.get(key);
      dedupMap.set(key, {
        ...existing,
        email: existing.email || localItem.email || '',
        notes: existing.notes || localItem.notes || '',
        location: existing.location || localItem.location || '',
        property_type: existing.property_type || localItem.property_type || ''
      });
    } else {
      dedupMap.set(key, localItem);
    }
  });

  return Array.from(dedupMap.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export function AdminDataProvider({ children }) {
  // 1. Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('zameer_admin_auth') === 'true';
  });

  // 2. Dynamic Services State
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('zameer_services_cache');
    const parsed = saved ? JSON.parse(saved) : [];
    return mergeServicesWithDefaults(parsed);
  });

  // 3. Dynamic Projects & Videos State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('zameer_projects_cache');
    const parsed = saved ? JSON.parse(saved) : [];
    return mergeProjectsWithDefaults(parsed);
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
    const parsed = saved ? JSON.parse(saved) : null;
    return {
      phone: parsed?.phone || COMPANY_INFO.phone,
      phoneRaw: parsed?.phoneRaw || COMPANY_INFO.phoneRaw,
      whatsapp: parsed?.whatsapp || COMPANY_INFO.whatsapp,
      whatsappRaw: parsed?.whatsappRaw || COMPANY_INFO.whatsappRaw,
      floatingPhone: parsed?.floatingPhone || parsed?.phoneRaw || COMPANY_INFO.phoneRaw,
      floatingWhatsapp: parsed?.floatingWhatsapp || parsed?.whatsappRaw || COMPANY_INFO.whatsappRaw,
      email: parsed?.email || COMPANY_INFO.email,
      address: parsed?.address || COMPANY_INFO.address.full,
      workingDays: parsed?.workingDays || 'Monday – Sunday',
      workingHours: parsed?.workingHours || '9:00 AM – 9:00 PM'
    };
  });

  // Load / Sync initial data from Supabase & keep sync alive in realtime across all devices
  useEffect(() => {
    fetchSupabaseData();

    // 1. Setup realtime database subscription across mobile & laptop
    const channel = supabase
      .channel('zameer_realtime_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'service_inquiries' }, () => {
        fetchSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_inquiries' }, () => {
        fetchSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'company_settings' }, () => {
        fetchSupabaseData();
      })
      .subscribe();

    // 2. Fallback periodic sync every 15s to guarantee multi-device parity
    const interval = setInterval(fetchSupabaseData, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  async function fetchSupabaseData() {
    try {
      // Sync Services
      const { data: dbServices, error: sErr } = await supabase.from('services').select('*').order('numeric_id', { ascending: true });
      if (!sErr && dbServices) {
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
        const mergedServices = mergeServicesWithDefaults(formatted);
        setServices(mergedServices);
        localStorage.setItem('zameer_services_cache', JSON.stringify(mergedServices));
      }

      // Sync Projects
      const { data: dbProjects, error: pErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!pErr && dbProjects) {
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
        const mergedProjects = mergeProjectsWithDefaults(formattedP);
        setProjects(mergedProjects);
        localStorage.setItem('zameer_projects_cache', JSON.stringify(mergedProjects));
      }

      // Sync Service Inquiries directly from database as single source of truth across all devices
      const { data: dbSInquiries, error: sinqErr } = await supabase.from('service_inquiries').select('*').order('created_at', { ascending: false });
      if (!sinqErr && dbSInquiries) {
        setServiceInquiries(dbSInquiries);
        localStorage.setItem('zameer_service_inquiries', JSON.stringify(dbSInquiries));
      }

      // Sync Contact Inquiries directly from database as single source of truth across all devices
      const { data: dbCInquiries, error: cinqErr } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false });
      if (!cinqErr && dbCInquiries) {
        setContactInquiries(dbCInquiries);
        localStorage.setItem('zameer_contact_inquiries', JSON.stringify(dbCInquiries));
      }

      // Sync Settings
      const { data: dbSettings } = await supabase.from('company_settings').select('*').eq('id', 1).single();
      if (dbSettings) {
        const setObj = {
          phone: dbSettings.phone || COMPANY_INFO.phone,
          phoneRaw: dbSettings.phone_raw || COMPANY_INFO.phoneRaw,
          whatsapp: dbSettings.whatsapp || COMPANY_INFO.whatsapp,
          whatsappRaw: dbSettings.whatsapp_raw || COMPANY_INFO.whatsappRaw,
          floatingPhone: dbSettings.floating_phone || dbSettings.phone_raw || COMPANY_INFO.phoneRaw,
          floatingWhatsapp: dbSettings.floating_whatsapp || dbSettings.whatsapp_raw || COMPANY_INFO.whatsappRaw,
          email: dbSettings.email || COMPANY_INFO.email,
          address: dbSettings.address || COMPANY_INFO.address.full,
          workingDays: dbSettings.working_days || 'Monday – Sunday',
          workingHours: dbSettings.working_hours || '9:00 AM – 9:00 PM'
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

  // Service Form Submission (Saves to Admin + Supabase + Triggers WhatsApp)
  const submitServiceInquiry = async (formData) => {
    const tempId = 'sinq_' + Date.now();
    const newEntry = {
      id: tempId,
      service_id: formData.serviceId || 'general',
      service_title: formData.serviceTitle || formData.service || 'Complete Interiors',
      name: formData.name || 'Anonymous',
      phone: formData.phone || '',
      email: formData.email || '',
      location: formData.location || formData.address || 'Direct Inquiry',
      property_type: formData.propertyType || formData.spaceType || 'Residential Space',
      notes: formData.notes || formData.message || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Update Local State & Cache Immediately with deduplication
    setServiceInquiries(prev => {
      const merged = mergeInquiries([newEntry], prev);
      localStorage.setItem('zameer_service_inquiries', JSON.stringify(merged));
      return merged;
    });

    // Try Supabase Insert (with email included)
    try {
      const { data } = await supabase.from('service_inquiries').insert([{
        service_id: newEntry.service_id,
        service_title: newEntry.service_title,
        name: newEntry.name,
        phone: newEntry.phone,
        email: newEntry.email,
        location: newEntry.location,
        property_type: newEntry.property_type,
        notes: newEntry.notes,
        status: newEntry.status
      }]).select();

      if (data && data[0] && data[0].id) {
        setServiceInquiries(prev => {
          const updated = prev.map(item => item.id === tempId ? { ...item, id: data[0].id } : item);
          localStorage.setItem('zameer_service_inquiries', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.warn('Saved locally, Supabase insert deferred:', e);
    }

    // Build WhatsApp URL with full details & Open
    const waUrl = getDedicatedServiceInquiryWhatsAppUrl({
      name: newEntry.name,
      phone: newEntry.phone,
      email: newEntry.email,
      serviceTitle: newEntry.service_title,
      address: newEntry.location,
      spaceType: newEntry.property_type,
      notes: newEntry.notes
    });
    window.open(waUrl, '_blank');
    return newEntry;
  };

  // Contact Page Consultation Submission (Saves to Admin + Supabase + Triggers WhatsApp)
  const submitContactInquiry = async (formData) => {
    const tempId = 'cinq_' + Date.now();
    const newEntry = {
      id: tempId,
      name: formData.name || 'Anonymous',
      phone: formData.phone || '',
      email: formData.email || '',
      location: formData.location || 'Hyderabad',
      property_type: formData.propertyType || formData.spaceType || '3BHK Villa / Apartment',
      project_timeline: formData.timeline || 'Immediate',
      notes: formData.notes || formData.message || '',
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Update Local State & Cache Immediately with deduplication
    setContactInquiries(prev => {
      const merged = mergeInquiries([newEntry], prev);
      localStorage.setItem('zameer_contact_inquiries', JSON.stringify(merged));
      return merged;
    });

    // Try Supabase Insert
    try {
      const { data } = await supabase.from('contact_inquiries').insert([{
        name: newEntry.name,
        phone: newEntry.phone,
        email: newEntry.email,
        location: newEntry.location,
        property_type: newEntry.property_type,
        project_timeline: newEntry.project_timeline,
        notes: newEntry.notes,
        status: newEntry.status
      }]).select();

      if (data && data[0] && data[0].id) {
        setContactInquiries(prev => {
          const updated = prev.map(item => item.id === tempId ? { ...item, id: data[0].id } : item);
          localStorage.setItem('zameer_contact_inquiries', JSON.stringify(updated));
          return updated;
        });
      }
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
    const deletedIds = getDeletedServiceIds();
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('zameer_deleted_service_ids', JSON.stringify(deletedIds));
    }
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

    setProjects(prev => {
      const updated = [projObj, ...prev.filter(p => p.id !== pId)];
      localStorage.setItem('zameer_projects_cache', JSON.stringify(updated));
      return updated;
    });

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
    const deletedIds = getDeletedProjectIds();
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('zameer_deleted_project_ids', JSON.stringify(deletedIds));
    }
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('zameer_projects_cache', JSON.stringify(updated));
      return updated;
    });

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
        floating_phone: merged.floatingPhone,
        floating_whatsapp: merged.floatingWhatsapp,
        email: merged.email,
        address: merged.address,
        working_days: merged.workingDays,
        working_hours: merged.workingHours
      }]);
    } catch (e) {
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
      } catch (err2) {
        console.warn('Settings saved to local cache:', err2);
      }
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
