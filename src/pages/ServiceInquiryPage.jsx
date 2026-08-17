import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, CookingPot, Hammer, DoorOpen, Tv, Building2, 
  CheckCircle2, ArrowRight, ArrowLeft, MessageSquare, Phone, 
  MapPin, Clock, Sparkles, ShieldCheck, Send, Loader2, 
  AlertCircle, Check, Wrench, Mail, Upload, Image as ImageIcon,
  Trash2, FileText
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { COMPANY_INFO } from '../data/companyInfo';
import { useAdminData } from '../context/AdminDataContext';
import { getDedicatedServiceInquiryWhatsAppUrl, getGeneralWhatsAppUrl } from '../utils/whatsapp';
import { uploadToCloudinary } from '../utils/cloudinary';
import { getServiceIcon } from '../utils/serviceIcons';

// Clean tailored property types per service (with 1 BHK included)
const SERVICE_PROPERTY_TYPES = {
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

export default function ServiceInquiryPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { services, submitServiceInquiry } = useAdminData();
  
  const servicesList = services && services.length > 0 ? services : SERVICES_DATA;
  
  // Find current service or fallback
  const currentService = servicesList.find((s) => s.id === serviceId) || servicesList[0];
  const ServiceIcon = getServiceIcon(currentService?.iconName);

  const formFields = (currentService?.formFields && currentService.formFields.length > 0)
    ? currentService.formFields
    : (SERVICE_PROPERTY_TYPES[currentService?.id] ? [
        { id: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Mohammed Ahmed', required: true },
        { id: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '98765 43210', required: true },
        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. ahmed@gmail.com', required: false },
        { id: 'propertyType', label: 'Space / Property Type', type: 'select', placeholder: 'Select Space', required: true, options: SERVICE_PROPERTY_TYPES[currentService.id] },
        { id: 'address', label: 'Property Address / Location', type: 'text', placeholder: 'e.g. Flat / House No, Area, City', required: true },
        { id: 'notes', label: 'Project Notes & Dimensions', type: 'textarea', placeholder: 'Tell us about room sizes, preferred finishes...', required: false }
      ] : [
        { id: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Mohammed Ahmed', required: true },
        { id: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '98765 43210', required: true },
        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. ahmed@gmail.com', required: false },
        { id: 'propertyType', label: 'Space / Property Type', type: 'select', placeholder: 'Select Space', required: true, options: ['1 BHK Apartment', '2 BHK Apartment', '3 BHK Apartment', 'Villa / Duplex', 'Other'] },
        { id: 'address', label: 'Property Address / Location', type: 'text', placeholder: 'e.g. Flat / House No, Area, City', required: true },
        { id: 'notes', label: 'Project Notes & Dimensions', type: 'textarea', placeholder: 'Tell us about room sizes, preferred finishes...', required: false }
      ]);

  // Dynamic Form State
  const [formData, setFormData] = useState(() => {
    const init = {};
    formFields.forEach(f => {
      init[f.id] = f.type === 'select' ? (f.options?.[0] || '') : '';
    });
    return init;
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadingFieldId, setUploadingFieldId] = useState(null);
  const [fieldUploadError, setFieldUploadError] = useState({});

  const handleFileUpload = async (fieldId, file) => {
    if (!file) return;

    // 5MB Limit
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFieldUploadError(prev => ({ ...prev, [fieldId]: 'File size exceeds 5MB limit. Please choose a smaller file.' }));
      return;
    }

    setUploadingFieldId(fieldId);
    setFieldUploadError(prev => ({ ...prev, [fieldId]: '' }));

    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, [fieldId]: url }));
      if (errors[fieldId]) {
        setErrors(prev => ({ ...prev, [fieldId]: '' }));
      }
    } catch (err) {
      setFieldUploadError(prev => ({ ...prev, [fieldId]: 'Upload failed. Please try again.' }));
    } finally {
      setUploadingFieldId(null);
    }
  };

  const prevServiceIdRef = React.useRef(serviceId);

  // Reset form ONLY when user navigates to a DIFFERENT service URL
  useEffect(() => {
    if (prevServiceIdRef.current !== serviceId) {
      prevServiceIdRef.current = serviceId;
      const init = {};
      formFields.forEach(f => {
        init[f.id] = f.type === 'select' ? (f.options?.[0] || '') : '';
      });
      setFormData(init);
      setErrors({});
      setIsSuccess(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If same service but dynamic formFields definition was updated, merge new fields without wiping user inputs
      setFormData(prev => {
        let changed = false;
        const updated = { ...prev };
        formFields.forEach(f => {
          if (updated[f.id] === undefined) {
            updated[f.id] = f.type === 'select' ? (f.options?.[0] || '') : '';
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    }
  }, [serviceId, formFields]);

  const handleChange = (fieldOrEvent, explicitValue) => {
    let fieldId, value;
    if (typeof fieldOrEvent === 'string') {
      fieldId = fieldOrEvent;
      value = explicitValue;
    } else if (fieldOrEvent && fieldOrEvent.target) {
      fieldId = fieldOrEvent.target.name || fieldOrEvent.target.id;
      value = fieldOrEvent.target.value;
    }
    if (fieldId) {
      setFormData(prev => ({ ...prev, [fieldId]: value }));
      if (errors[fieldId]) {
        setErrors(prev => ({ ...prev, [fieldId]: '' }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    formFields.forEach(field => {
      const val = (formData[field.id] || '').toString().trim();
      if (field.required && !val) {
        errs[field.id] = `Please enter ${field.label.toLowerCase()}.`;
      } else if (field.type === 'tel' && val) {
        const clean = val.replace(/\D/g, '');
        if (clean.length < 10) {
          errs[field.id] = 'Please enter a valid 10-digit mobile number.';
        }
      } else if (field.type === 'email' && val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          errs[field.id] = 'Please enter a valid email address.';
        }
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const standardKeys = new Set(['name', 'phone', 'email', 'address', 'location', 'propertyType', 'notes']);
      const customFields = {};
      Object.entries(formData).forEach(([k, v]) => {
        if (!standardKeys.has(k) && v) {
          const fieldDef = formFields.find(f => f.id === k);
          const fieldLabel = fieldDef ? fieldDef.label : k;
          customFields[fieldLabel] = v;
        }
      });

      await submitServiceInquiry({
        serviceId: currentService.id,
        serviceTitle: currentService.title,
        name: formData.name || 'Anonymous',
        phone: formData.phone || '',
        email: formData.email || '',
        address: formData.address || formData.location || 'Direct Inquiry',
        location: formData.address || formData.location || 'Direct Inquiry',
        propertyType: formData.propertyType || formData.spaceType || 'Residential Space',
        notes: formData.notes || '',
        custom_fields: customFields
      });

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage('Unable to process your request at this moment. Please reach us directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    const init = {};
    formFields.forEach(f => {
      init[f.id] = f.type === 'select' ? (f.options?.[0] || '') : '';
    });
    setFormData(init);
    setErrors({});
    setIsSuccess(false);
  };

  const directWhatsAppUrl = getDedicatedServiceInquiryWhatsAppUrl({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    serviceTitle: currentService.title,
    address: formData.address,
    spaceType: formData.propertyType,
    notes: formData.notes
  });

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-luxury-bg min-h-screen">
      
      {/* Main 2-Column Section: Service Information + Dedicated Contact Form */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-luxury-muted mb-6">
          <Link to="/" className="hover:text-luxury-gold-dark transition-colors font-medium">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-luxury-gold-dark transition-colors font-medium">Services</Link>
          <span>/</span>
          <span className="text-luxury-walnut font-bold">{currentService.shortTitle}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Inquiry Form Column (Order 1 on Mobile so form appears right at the top) */}
          <div className="lg:col-span-7 order-1 lg:order-1">
            {isSuccess ? (
              /* Success Screen */
              <div className="bg-luxury-card rounded-3xl p-8 sm:p-12 border-2 border-luxury-gold shadow-2xl text-center space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                    Inquiry Successfully Logged
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut">
                    Thank You, {formData.name}!
                  </h2>
                  <p className="text-sm text-luxury-muted max-w-lg mx-auto leading-relaxed">
                    Your direct inquiry for <strong className="text-luxury-walnut">{currentService.title}</strong> has been registered. Our design lead Zameer will review your requirements and call you at <strong className="text-luxury-walnut">{formData.phone}</strong> for your free site consultation.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-luxury-surface p-4 rounded-2xl border border-luxury-border text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between py-1 border-b border-luxury-border">
                    <span className="text-luxury-muted font-medium">Service:</span>
                    <span className="font-bold text-luxury-walnut">{currentService.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-luxury-border">
                    <span className="text-luxury-muted font-medium">Property Address:</span>
                    <span className="font-bold text-luxury-walnut">{formData.address}</span>
                  </div>
                  {formData.email && (
                    <div className="flex justify-between py-1 border-b border-luxury-border">
                      <span className="text-luxury-muted font-medium">Email:</span>
                      <span className="font-bold text-luxury-walnut">{formData.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-luxury-muted font-medium">Space / Property:</span>
                    <span className="font-bold text-luxury-walnut">{formData.propertyType}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-luxury-border flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Fast-Track on WhatsApp</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-luxury-surface hover:bg-luxury-border text-luxury-charcoal font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              /* Dedicated Form */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-luxury-card rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-luxury-gold/40 shadow-2xl space-y-6"
              >
                {/* Form Header */}
                <div className="pb-4 border-b border-luxury-border">
                  <div className="flex items-center gap-2 text-luxury-gold-dark font-cinzel text-xs font-bold uppercase tracking-wider mb-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Direct Service Consultation</span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut">
                    {currentService.formHeading || `Get Free Quote for ${currentService.shortTitle || currentService.title}`}
                  </h2>
                  <p className="text-xs text-luxury-muted mt-1 leading-relaxed">
                    {currentService.formSubtitle || `Fill out your requirements below and our master craftsman will contact you with transparent pricing & site visit scheduling.`}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Dynamic Form Fields Grid */}
                <div className="space-y-4">
                  {formFields.map((field) => {
                    const isFullWidth = field.type === 'textarea' || field.type === 'file' || field.id === 'address' || field.id === 'notes';

                    return (
                      <div key={field.id} className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center justify-between">
                          <span>
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </span>
                        </label>

                        {field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder || 'Describe your project requirements, room measurements, or preferred finishes...'}
                            className={`w-full p-3 rounded-xl bg-luxury-surface border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none transition-colors ${
                              errors[field.id] ? 'border-red-500' : 'border-luxury-border'
                            }`}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className={`w-full p-3 rounded-xl bg-luxury-surface border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none transition-colors cursor-pointer ${
                              errors[field.id] ? 'border-red-500' : 'border-luxury-border'
                            }`}
                          >
                            <option value="">{field.placeholder || 'Select Option'}</option>
                            {(field.options || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'file' || field.type === 'image' ? (
                          <div className="space-y-1.5">
                            {formData[field.id] ? (
                              <div className="p-3.5 rounded-2xl bg-luxury-surface/80 border border-luxury-gold/40 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  {formData[field.id].startsWith('http') || formData[field.id].startsWith('data:') ? (
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-luxury-walnut shrink-0 border border-luxury-gold/40 shadow-xs">
                                      <img src={formData[field.id]} alt="Attachment Preview" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-luxury-walnut flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>Attachment Attached</span>
                                    </span>
                                    <span className="text-[10px] text-luxury-muted block truncate max-w-xs font-mono mt-0.5">
                                      {formData[field.id].startsWith('http') ? 'Cloudinary File Uploaded' : 'Uploaded file'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <label className="px-3 py-1.5 rounded-xl bg-luxury-gold/20 hover:bg-luxury-gold/30 text-luxury-gold-dark text-xs font-bold cursor-pointer transition-colors">
                                    <span>Change</span>
                                    <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(field.id, e.target.files?.[0])} className="hidden" />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, [field.id]: '' }))}
                                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-colors cursor-pointer"
                                    title="Remove File"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-2xl bg-luxury-surface/70 border-2 border-dashed border-luxury-gold/40 hover:border-luxury-gold flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-colors">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                                    <Upload className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-luxury-walnut block">
                                      {field.placeholder || 'Upload Floor Plan, Photos or Design PDF'}
                                    </span>
                                    <span className="text-[10px] text-luxury-muted block">
                                      Supports JPG, PNG, WEBP, PDF (Max 5MB)
                                    </span>
                                  </div>
                                </div>

                                <label className="px-4 py-2 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs transition-transform active:scale-95 shrink-0 flex items-center gap-1.5 mx-auto sm:mx-0">
                                  {uploadingFieldId === field.id ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      <span>Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Select File</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleFileUpload(field.id, e.target.files?.[0])}
                                    className="hidden"
                                    disabled={uploadingFieldId === field.id}
                                  />
                                </label>
                              </div>
                            )}

                            {fieldUploadError[field.id] && (
                              <span className="text-[11px] text-red-500 font-medium block">
                                {fieldUploadError[field.id]}
                              </span>
                            )}
                          </div>
                        ) : (
                          <input
                            type={field.type || 'text'}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder || ''}
                            className={`w-full p-3 rounded-xl bg-luxury-surface border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none transition-colors ${
                              errors[field.id] ? 'border-red-500' : 'border-luxury-border'
                            }`}
                          />
                        )}

                        {errors[field.id] && (
                          <span className="text-[11px] text-red-500 font-medium block">
                            {errors[field.id]}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-2xl bg-luxury-walnut hover:bg-black text-luxury-gold border border-luxury-gold font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer font-cinzel"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Registering Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{currentService.submitButtonText || `Request Free Quote & Site Visit`}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-luxury-muted text-center mt-2">
                    🔒 Zero spam guarantee. Direct connection with master interior designer Zameer.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Visual Showcase, Scope Highlights & Assurances Column (Order 2 on Mobile, Order 2 on Desktop) */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-2">
            
            {/* Service Visual Card */}
            <div className="luxury-card rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/30">
              <div className="relative aspect-[16/11] overflow-hidden bg-luxury-walnut">
                <img
                  src={currentService.image}
                  alt={currentService.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-luxury-walnut/20 to-transparent" />
                
                {/* Highlight Tag */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-walnut/90 backdrop-blur-md border border-luxury-gold/50 text-luxury-gold text-xs font-bold shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentService.highlight}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-[#FDFBF7]">
                  <p className="text-xs font-light text-gray-300">Hyderabad Precision Workshop</p>
                  <p className="text-sm font-bold font-heading text-luxury-gold">{currentService.title}</p>
                </div>
              </div>

              {/* Service Description Box */}
              <div className="p-6 space-y-4">
                <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                  {currentService.description}
                </p>

                {/* Craftsmanship Assurances */}
                <div className="pt-3 border-t border-luxury-border space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5 font-cinzel">
                    <ShieldCheck className="w-4 h-4 text-luxury-gold" />
                    Quality & Execution Assurances:
                  </h4>
                  
                  <div className="space-y-1.5">
                    {((currentService.features && currentService.features.length > 0) ? currentService.features : [
                      'IS:710 Marine-Grade 100% Boiling-Water-Proof Plywood',
                      'Authentic German Soft-Close Fittings (Blum / Hettich / Hafele)',
                      'In-house master carpenters with zero middleman markups',
                      'Millimeter laser site measurement and 3D preview before fabrication'
                    ]).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-luxury-charcoal">
                        <Check className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Direct Workshop & Studio Info Card */}
            <div className="bg-luxury-card rounded-2xl p-5 border border-luxury-gold/30 shadow-luxury space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                    Service Area Coverage
                  </h4>
                  <p className="text-xs text-luxury-muted mt-0.5">
                    Direct on-site consultation, precision laser measurement & turnkey execution for all residential and commercial projects.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2.5 border-t border-luxury-border">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                    Site Visit Availability
                  </h4>
                  <p className="text-xs text-luxury-muted mt-0.5">
                    Monday to Sunday (9:00 AM – 9:00 PM)
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Switcher to Explore Other Service Form Pages */}
      <section className="py-12 bg-luxury-surface/50 border-t border-luxury-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
              Explore More Verticals
            </span>
            <h3 className="font-heading text-2xl font-bold text-luxury-walnut mt-1">
              Need Inquiries for Other Services?
            </h3>
            <p className="text-xs text-luxury-muted mt-1">
              Switch directly to any service form below to request tailored site measurements.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {servicesList.map((service) => {
              const Icon = getServiceIcon(service.iconName);
              const isCurrent = service.id === currentService.id;

              return (
                <Link
                  key={service.id}
                  to={`/services/${service.id}/inquiry`}
                  className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2 transition-all border ${
                    isCurrent
                      ? 'bg-luxury-walnut text-luxury-gold border-luxury-gold shadow-md pointer-events-none'
                      : 'bg-luxury-card text-luxury-charcoal hover:text-luxury-walnut hover:border-luxury-gold/50 border-luxury-border shadow-xs hover:scale-102'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCurrent ? 'bg-luxury-gold text-luxury-walnut' : 'bg-luxury-surface text-luxury-charcoal'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold leading-tight font-heading">
                    {service.shortTitle}
                  </span>
                  <span className="text-[10px] text-luxury-gold-dark font-semibold mt-0.5">
                    {isCurrent ? 'Current' : 'Get Quote →'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
