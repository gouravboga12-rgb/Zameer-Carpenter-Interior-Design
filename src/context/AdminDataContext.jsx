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

const DEFAULT_SERVICE_PROPERTY_TYPES = {
  'complete-home-interiors': [
    '1 BHK Apartment',
    '2 BHK Apartment',
    '3 BHK Apartment',
    '4 BHK / Penthouse',
    'Villa / Duplex House',
    'Independent House',
    'Full Home Renovation'
  ],
  'modular-kitchen-furniture': [
    '1 BHK Apartment Kitchen',
    '2 BHK / 3 BHK Apartment Kitchen',
    '4 BHK / Penthouse Kitchen',
    'Villa / Independent House Kitchen',
    'Kitchen Remodeling / Renovation',
    'Commercial / Office Pantry'
  ],
  'custom-carpentry-woodwork': [
    '1 BHK / 2 BHK Apartment',
    '3 BHK / 4 BHK Apartment',
    'Villa / Independent House',
    'Commercial Office / Shop',
    'Existing Home Woodwork Modification'
  ],
  'wardrobes-storage-solutions': [
    '1 BHK Apartment (Bedroom Wardrobe)',
    '2 BHK / 3 BHK Apartment Wardrobes',
    '4 BHK / Villa Wardrobes',
    'Master Bedroom Only',
    'Walk-in Closet / Loft Storage'
  ],
  'tv-units-wall-panels-ceilings': [
    '1 BHK / 2 BHK Hall TV Unit',
    '3 BHK / 4 BHK Living Room TV Unit & Ceiling',
    'Master Bedroom TV & Accent Wall',
    'Villa / Duplex Hall & Ceilings',
    'Office / Commercial Feature Wall'
  ],
  'commercial-interiors-renovation': [
    'Corporate Office / Workspace',
    'Retail Shop / Showroom',
    'Cafe / Restaurant',
    'Clinic / Salon / Studio',
    '1BHK / 2BHK / 3BHK Full Home Renovation'
  ]
};

export function getDefaultFormFieldsForService(serviceId, serviceTitle = 'this service', propertyTypes = []) {
  const pTypes = (propertyTypes && propertyTypes.length > 0)
    ? propertyTypes
    : (DEFAULT_SERVICE_PROPERTY_TYPES[serviceId] || [
        '1 BHK Apartment',
        '2 BHK Apartment',
        '3 BHK Apartment',
        '4 BHK / Penthouse',
        'Villa / Duplex House',
        'Independent House',
        'Full Home Renovation'
      ]);

  return [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'e.g. Mohammed Ahmed',
      required: true
    },
    {
      id: 'phone',
      label: 'Mobile Number',
      type: 'tel',
      placeholder: '98765 43210',
      required: true
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'e.g. ahmed@gmail.com',
      required: false
    },
    {
      id: 'propertyType',
      label: 'Space / Property Type',
      type: 'select',
      placeholder: 'Select Space / Property Type',
      required: true,
      options: pTypes
    },
    {
      id: 'address',
      label: 'Property Address / Location',
      type: 'text',
      placeholder: 'e.g. Flat / House No, Apartment Name, Area, City',
      required: true
    },
    {
      id: 'notes',
      label: 'Project Notes & Dimensions',
      type: 'textarea',
      placeholder: 'Tell us about room sizes, preferred finishes (Acrylic, PU, Teak, Veneer), or specific ideas...',
      required: false
    }
  ];
}

const SERVICE_CONFIG_TAG_REGEX = /<!--SERVICES_CONFIG:([\s\S]*?)-->/;

export function encodeServiceConfigInDescription(description, config) {
  const cleanDescription = (description || '').replace(SERVICE_CONFIG_TAG_REGEX, '').trim();
  const configString = JSON.stringify(config);
  return `${cleanDescription}\n\n<!--SERVICES_CONFIG:${configString}-->`;
}

export function decodeServiceConfigFromDescription(rawDescription) {
  if (!rawDescription) return { description: '', config: null };
  const match = rawDescription.match(SERVICE_CONFIG_TAG_REGEX);
  const cleanDescription = rawDescription.replace(SERVICE_CONFIG_TAG_REGEX, '').trim();
  if (match && match[1]) {
    try {
      const config = JSON.parse(match[1]);
      return { description: cleanDescription, config };
    } catch (e) {
      console.warn('Failed to parse service config from description:', e);
    }
  }
  return { description: cleanDescription, config: null };
}

export function safeArray(val, fallback = []) {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      if (val.startsWith('{') && val.endsWith('}')) {
        return val.slice(1, -1).split(',').map(s => s.replace(/^"|"$/g, '').trim()).filter(Boolean);
      }
    }
  }
  return fallback;
}

function mergeServicesWithDefaults(customOrDbServices, deletedIds = getDeletedServiceIds()) {
  const deletedSet = new Set(deletedIds);
  const map = new Map();

  DEFAULT_SERVICES.forEach(item => {
    if (!deletedSet.has(item.id)) {
      const pTypes = item.propertyTypes || DEFAULT_SERVICE_PROPERTY_TYPES[item.id] || [
        '1 BHK Apartment',
        '2 BHK Apartment',
        '3 BHK Apartment',
        '4 BHK / Penthouse',
        'Villa / Duplex House',
        'Independent House',
        'Commercial / Other'
      ];
      map.set(item.id, {
        ...item,
        subservices: safeArray(item.subservices, []),
        features: safeArray(item.features, []),
        propertyTypes: safeArray(pTypes, []),
        formFields: safeArray(item.formFields, getDefaultFormFieldsForService(item.id, item.shortTitle || item.title, pTypes)),
        formHeading: item.formHeading || `Get Free Quote for ${item.shortTitle || item.title}`,
        formSubtitle: item.formSubtitle || `Schedule a free laser site measurement and get a transparent itemized estimate for ${item.title}.`,
        submitButtonText: item.submitButtonText || `Request Free Quote for ${item.shortTitle || item.title}`,
        formNotesPlaceholder: item.formNotesPlaceholder || 'Describe your floor plan, dimensions, or specific design preferences...'
      });
    }
  });

  (customOrDbServices || []).forEach(item => {
    if (!deletedSet.has(item.id)) {
      const existing = map.get(item.id) || {};
      const itemSubservices = safeArray(item.subservices, existing.subservices || []);
      const itemFeatures = safeArray(item.features, existing.features || []);
      const itemPropertyTypes = safeArray(item.propertyTypes, existing.propertyTypes || []);
      const itemFormFields = safeArray(item.formFields, null);

      const pTypes = itemPropertyTypes.length > 0 ? itemPropertyTypes : (existing.propertyTypes || [
        '1 BHK Apartment',
        '2 BHK Apartment',
        '3 BHK Apartment',
        'Villa / Duplex',
        'Other'
      ]);

      const formFields = (itemFormFields && itemFormFields.length > 0)
        ? itemFormFields
        : (existing.formFields || getDefaultFormFieldsForService(item.id, item.shortTitle || item.title, pTypes));

      map.set(item.id, {
        ...existing,
        ...item,
        subservices: itemSubservices,
        features: itemFeatures,
        propertyTypes: pTypes,
        formFields: formFields,
        formHeading: item.formHeading || existing.formHeading || `Get Free Quote for ${item.shortTitle || item.title}`,
        formSubtitle: item.formSubtitle || existing.formSubtitle || `Schedule a free laser site measurement and get a transparent itemized estimate for ${item.title || 'this project'}.`,
        submitButtonText: item.submitButtonText || existing.submitButtonText || `Request Free Quote for ${item.shortTitle || item.title}`,
        formNotesPlaceholder: item.formNotesPlaceholder || existing.formNotesPlaceholder || 'Describe your floor plan, dimensions, or specific design preferences...'
      });
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
        const formatted = dbServices.map(s => {
          const { description: cleanDesc, config } = decodeServiceConfigFromDescription(s.description);
          return {
            id: s.id,
            numericId: s.numeric_id,
            title: s.title || '',
            shortTitle: s.short_title || s.title || '',
            iconName: s.icon_name || 'Home',
            highlight: s.highlight || 'Turnkey Solution',
            description: cleanDesc || s.description || '',
            image: s.image || '',
            subservices: safeArray(s.subservices, []),
            features: safeArray(s.features, []),
            propertyTypes: safeArray(config?.propertyTypes || s.property_types || s.propertyTypes, []),
            formFields: safeArray(config?.formFields || s.form_fields || s.formFields, null),
            formHeading: config?.formHeading || s.form_heading || s.formHeading || '',
            formSubtitle: config?.formSubtitle || s.form_subtitle || s.formSubtitle || '',
            submitButtonText: config?.submitButtonText || s.submit_button_text || s.submitButtonText || '',
            formNotesPlaceholder: config?.formNotesPlaceholder || s.form_notes_placeholder || s.formNotesPlaceholder || ''
          };
        });
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
      custom_fields: formData.custom_fields || {},
      status: 'New',
      created_at: new Date().toISOString()
    };

    // Update Local State & Cache Immediately with deduplication
    setServiceInquiries(prev => {
      const merged = mergeInquiries([newEntry], prev);
      localStorage.setItem('zameer_service_inquiries', JSON.stringify(merged));
      return merged;
    });

    // Try Supabase Insert
    try {
      const rowToInsert = {
        service_id: newEntry.service_id,
        service_title: newEntry.service_title,
        name: newEntry.name,
        phone: newEntry.phone,
        email: newEntry.email,
        location: newEntry.location,
        property_type: newEntry.property_type,
        notes: newEntry.notes,
        custom_fields: newEntry.custom_fields,
        status: newEntry.status
      };

      let { data, error } = await supabase.from('service_inquiries').insert([rowToInsert]).select();

      if (error && error.message && error.message.includes('custom_fields')) {
        const { custom_fields, ...fallbackRow } = rowToInsert;
        const res = await supabase.from('service_inquiries').insert([fallbackRow]).select();
        data = res.data;
        error = res.error;
      }

      if (error) {
        console.error('Supabase service_inquiries insert error (Check RLS policies):', error);
      } else if (data && data[0] && data[0].id) {
        setServiceInquiries(prev => {
          const updated = prev.map(item => item.id === tempId ? { ...item, id: data[0].id } : item);
          localStorage.setItem('zameer_service_inquiries', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error('Supabase insert exception:', e);
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
      const { data, error } = await supabase.from('contact_inquiries').insert([{
        name: newEntry.name,
        phone: newEntry.phone,
        email: newEntry.email,
        location: newEntry.location,
        property_type: newEntry.property_type,
        project_timeline: newEntry.project_timeline,
        notes: newEntry.notes,
        status: newEntry.status
      }]).select();

      if (error) {
        console.error('Supabase contact_inquiries insert error (Check RLS policies):', error);
      } else if (data && data[0] && data[0].id) {
        setContactInquiries(prev => {
          const updated = prev.map(item => item.id === tempId ? { ...item, id: data[0].id } : item);
          localStorage.setItem('zameer_contact_inquiries', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (e) {
      console.error('Saved locally, Supabase insert deferred:', e);
    }

    // Build WhatsApp URL & Open
    const waUrl = getConsultationWhatsAppUrl({
      name: newEntry.name,
      phone: newEntry.phone,
      service: formData.service || 'Complete Home Interior Design',
      spaceType: newEntry.property_type,
      notes: newEntry.notes
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
      features: newService.features || [],
      propertyTypes: newService.propertyTypes || [
        '1 BHK Apartment',
        '2 BHK Apartment',
        '3 BHK Apartment',
        'Villa / Duplex',
        'Other'
      ],
      formFields: newService.formFields || getDefaultFormFieldsForService(newService.id, newService.shortTitle || newService.title, newService.propertyTypes),
      formHeading: newService.formHeading || `Get Free Quote for ${newService.shortTitle || newService.title}`,
      formSubtitle: newService.formSubtitle || `Schedule a free laser site measurement and get a transparent itemized estimate for ${newService.title}.`,
      submitButtonText: newService.submitButtonText || `Request Free Quote for ${newService.shortTitle || newService.title}`,
      formNotesPlaceholder: newService.formNotesPlaceholder || 'Describe your floor plan, dimensions, or specific design preferences...'
    };

    const updated = [...services.filter(s => s.id !== sId), serviceObj];
    setServices(updated);
    localStorage.setItem('zameer_services_cache', JSON.stringify(updated));

    const config = {
      formFields: serviceObj.formFields,
      formHeading: serviceObj.formHeading,
      formSubtitle: serviceObj.formSubtitle,
      submitButtonText: serviceObj.submitButtonText,
      formNotesPlaceholder: serviceObj.formNotesPlaceholder,
      propertyTypes: serviceObj.propertyTypes
    };
    const encodedDescription = encodeServiceConfigInDescription(serviceObj.description, config);

    try {
      await supabase.from('services').upsert([{
        id: serviceObj.id,
        numeric_id: serviceObj.numericId,
        title: serviceObj.title,
        short_title: serviceObj.shortTitle,
        icon_name: serviceObj.iconName,
        highlight: serviceObj.highlight,
        description: encodedDescription,
        image: serviceObj.image,
        subservices: serviceObj.subservices,
        features: serviceObj.features,
        property_types: serviceObj.propertyTypes,
        form_fields: serviceObj.formFields,
        form_heading: serviceObj.formHeading,
        form_subtitle: serviceObj.formSubtitle,
        submit_button_text: serviceObj.submitButtonText,
        form_notes_placeholder: serviceObj.formNotesPlaceholder
      }]);
    } catch (e) {
      try {
        await supabase.from('services').upsert([{
          id: serviceObj.id,
          numeric_id: serviceObj.numericId,
          title: serviceObj.title,
          short_title: serviceObj.shortTitle,
          icon_name: serviceObj.iconName,
          highlight: serviceObj.highlight,
          description: encodedDescription,
          image: serviceObj.image,
          subservices: serviceObj.subservices,
          features: serviceObj.features
        }]);
      } catch (err2) {
        console.warn('Service saved in local cache:', err2);
      }
    }
  };

  const updateService = async (id, updatedFields) => {
    const updated = services.map(s => s.id === id ? { ...s, ...updatedFields } : s);
    setServices(updated);
    localStorage.setItem('zameer_services_cache', JSON.stringify(updated));

    const target = updated.find(s => s.id === id);
    if (target) {
      const config = {
        formFields: target.formFields,
        formHeading: target.formHeading,
        formSubtitle: target.formSubtitle,
        submitButtonText: target.submitButtonText,
        formNotesPlaceholder: target.formNotesPlaceholder,
        propertyTypes: target.propertyTypes
      };
      const encodedDescription = encodeServiceConfigInDescription(target.description, config);

      try {
        await supabase.from('services').upsert([{
          id: target.id,
          numeric_id: target.numericId,
          title: target.title,
          short_title: target.shortTitle,
          icon_name: target.iconName,
          highlight: target.highlight,
          description: encodedDescription,
          image: target.image,
          subservices: target.subservices,
          features: target.features,
          property_types: target.propertyTypes,
          form_fields: target.formFields,
          form_heading: target.formHeading,
          form_subtitle: target.formSubtitle,
          submit_button_text: target.submitButtonText,
          form_notes_placeholder: target.formNotesPlaceholder
        }]);
      } catch (e) {
        try {
          await supabase.from('services').upsert([{
            id: target.id,
            numeric_id: target.numericId,
            title: target.title,
            short_title: target.shortTitle,
            icon_name: target.iconName,
            highlight: target.highlight,
            description: encodedDescription,
            image: target.image,
            subservices: target.subservices,
            features: target.features
          }]);
        } catch (err2) {
          console.warn('Service update saved in local cache:', err2);
        }
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
