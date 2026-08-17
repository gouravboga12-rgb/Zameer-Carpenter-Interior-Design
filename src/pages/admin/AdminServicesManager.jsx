import React, { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle2, Image as ImageIcon, Sparkles, 
  X, Save, Upload, AlertTriangle, ListFilter, Sliders, FileText, Check 
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function AdminServicesManager() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('catalog'); // 'catalog' | 'inquiry-form'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    iconName: 'Home',
    highlight: 'Turnkey Solution',
    description: '',
    image: '',
    subservicesText: '',
    featuresText: '',
    propertyTypesText: '',
    formHeading: '',
    formNotesPlaceholder: ''
  });

  const handleOpenCreate = () => {
    setUploadError('');
    setActiveFormTab('catalog');
    setFormData({
      title: '',
      shortTitle: '',
      iconName: 'Home',
      highlight: 'Turnkey Solution',
      description: '',
      image: '',
      subservicesText: 'Complete Interior Design\nCustom Carpentry\nLighting & False Ceilings\n3D Render Visualization\nTurnkey Handover',
      featuresText: 'Custom 3D walkthroughs before woodwork begins\nPrecision laser site measurements & structural planning\nSeamless integration of furniture, electricals & lighting\nSingle-point turnkey accountability with on-time handover',
      propertyTypesText: '1 BHK Apartment\n2 BHK Apartment\n3 BHK Apartment\n4 BHK / Penthouse\nVilla / Duplex House\nIndependent House\nCommercial / Other',
      formHeading: 'Request On-Site Measurement & 3D Consultation',
      formNotesPlaceholder: 'Describe your floor plan, dimensions, or specific design preferences...'
    });
    setEditingService(null);
    setIsCreating(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
  };

  const handleOpenEdit = (srv) => {
    setUploadError('');
    setActiveFormTab('catalog');
    setEditingService(srv);
    setFormData({
      title: srv.title || '',
      shortTitle: srv.shortTitle || srv.title || '',
      iconName: srv.iconName || 'Home',
      highlight: srv.highlight || 'Turnkey Solution',
      description: srv.description || '',
      image: srv.image || '',
      subservicesText: (srv.subservices || []).join('\n'),
      featuresText: (srv.features || []).join('\n'),
      propertyTypesText: (srv.propertyTypes || [
        '1 BHK Apartment',
        '2 BHK Apartment',
        '3 BHK Apartment',
        '4 BHK / Penthouse',
        'Villa / Duplex House',
        'Independent House',
        'Commercial / Other'
      ]).join('\n'),
      formHeading: srv.formHeading || `Book Free Site Visit for ${srv.shortTitle || srv.title}`,
      formNotesPlaceholder: srv.formNotesPlaceholder || 'Describe your floor plan, dimensions, or specific design preferences...'
    });
    setIsCreating(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // 5MB Size Validation
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      const actualMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`Image file size (${actualMb}MB) exceeds the maximum limit of 5MB. Please choose a smaller image.`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      setUploadError('Image upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setUploadError('Please select or upload a cover image for this service vertical.');
      return;
    }

    const subs = formData.subservicesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const feats = formData.featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const pTypes = formData.propertyTypesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      shortTitle: formData.shortTitle || formData.title,
      iconName: formData.iconName,
      highlight: formData.highlight,
      description: formData.description,
      image: formData.image,
      subservices: subs,
      features: feats,
      propertyTypes: pTypes.length > 0 ? pTypes : [
        '1 BHK Apartment',
        '2 BHK Apartment',
        '3 BHK Apartment',
        'Villa / Duplex',
        'Other'
      ],
      formHeading: formData.formHeading || `Book Free Site Visit for ${formData.shortTitle || formData.title}`,
      formNotesPlaceholder: formData.formNotesPlaceholder || 'Describe your floor plan, dimensions, or specific design preferences...'
    };

    if (editingService) {
      await updateService(editingService.id, payload);
    } else {
      await addService(payload);
    }

    setIsCreating(false);
    setEditingService(null);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the service "${title}"?`)) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-luxury-card p-5 rounded-2xl border border-luxury-gold/30 shadow-sm">
        <div>
          <h2 className="font-heading text-xl font-bold text-luxury-walnut">
            Manage Services ({services.length} Verticals)
          </h2>
          <p className="text-xs text-luxury-muted mt-0.5">
            Add or edit service catalog details, execution scopes, and tailored customer inquiry form fields.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Vertical</span>
        </button>
      </div>

      {/* Service Create / Edit Modal Form */}
      {(isCreating || editingService) && (
        <div
          ref={formRef}
          id="service-form-section"
          className="bg-luxury-card p-6 sm:p-8 rounded-3xl border-2 border-luxury-gold shadow-2xl space-y-5 relative scroll-mt-24 ring-4 ring-luxury-gold/30 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-luxury-border pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                {editingService ? 'Edit Existing Service' : 'New Service Creator'}
              </span>
              <h3 className="font-heading text-xl font-bold text-luxury-walnut flex items-center gap-2 mt-0.5">
                <Sparkles className="w-5 h-5 text-luxury-gold" />
                <span>{editingService ? editingService.title : 'Create New Service Vertical'}</span>
              </h3>
            </div>

            <button
              onClick={() => { setIsCreating(false); setEditingService(null); }}
              className="p-2 rounded-full bg-luxury-surface hover:bg-luxury-border text-luxury-walnut cursor-pointer transition-colors"
              title="Close form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector: 1. Service Catalog Info vs 2. Dedicated Inquiry Form Config */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-luxury-surface border border-luxury-border">
            <button
              type="button"
              onClick={() => setActiveFormTab('catalog')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormTab === 'catalog'
                  ? 'bg-luxury-walnut text-luxury-gold shadow-md'
                  : 'text-luxury-muted hover:text-luxury-walnut'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>1. Service Details & Scope</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('inquiry-form')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormTab === 'inquiry-form'
                  ? 'bg-luxury-walnut text-luxury-gold shadow-md'
                  : 'text-luxury-muted hover:text-luxury-walnut'
              }`}
            >
              <ListFilter className="w-4 h-4 text-emerald-600" />
              <span>2. Dedicated Inquiry Form Fields & Options</span>
            </button>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* TAB 1: SERVICE DETAILS & SCOPE */}
            {activeFormTab === 'catalog' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Full Service Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Complete Home Interior Design"
                      className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Short Display Title (Tab Label)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.shortTitle}
                      onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                      placeholder="e.g. Complete Interiors"
                      className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                    Highlight Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    placeholder="e.g. Turnkey Design to Execution"
                    className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                  />
                </div>

                {/* Direct Image File Upload Option */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-luxury-gold" />
                      <span>Service Cover Image</span>
                    </label>
                    <span className="text-[11px] font-bold text-luxury-gold-dark bg-luxury-gold/15 px-2.5 py-0.5 rounded-full border border-luxury-gold/30">
                      Max File Size: Under 5MB
                    </span>
                  </div>

                  {formData.image ? (
                    <div className="p-4 rounded-2xl bg-luxury-surface border-2 border-luxury-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-luxury-walnut shrink-0 border border-luxury-gold/40 shadow-sm relative group">
                          <img
                            src={formData.image}
                            alt="Service Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-luxury-walnut flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Image Uploaded Successfully</span>
                          </p>
                          <span className="text-[11px] text-luxury-muted block truncate max-w-xs sm:max-w-md mt-0.5 font-mono">
                            {formData.image.startsWith('data:') ? 'Local file uploaded' : formData.image}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="px-4 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-400 text-luxury-walnut font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-transform active:scale-95">
                          <span>{uploading ? 'Uploading...' : 'Change Image'}</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-colors cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-luxury-surface border-2 border-dashed border-luxury-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-luxury-walnut">
                            Choose a high-resolution cover image from your device
                          </p>
                          <span className="text-[11px] text-luxury-muted block">
                            Supports JPG, PNG, WEBP (Max 5MB)
                          </span>
                        </div>
                      </div>

                      <label className="px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-400 text-luxury-walnut font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shrink-0 transition-transform active:scale-95">
                        <span>{uploading ? 'Uploading...' : 'Browse Image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive overview of this service vertical..."
                    className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Execution Scope Items */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Execution Scope Items (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.subservicesText}
                      onChange={(e) => setFormData({ ...formData, subservicesText: e.target.value })}
                      placeholder="Complete Home Interior Design&#10;Bedroom Interior Design&#10;Living Room Interior Design&#10;Apartment & Villa Interiors"
                      className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-luxury-muted block mt-0.5">
                      Appears on service cards as execution scopes
                    </span>
                  </div>

                  {/* Features & Deliverables */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Deliverables & Guarantees (1 per line)
                    </label>
                    <textarea
                      rows={5}
                      value={formData.featuresText}
                      onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                      placeholder="Custom 3D walkthroughs before woodwork begins&#10;Precision site measurements & structural planning&#10;IS:710 Marine-Grade 100% Boiling-Water-Proof Plywood&#10;Single-point turnkey accountability with on-time handover"
                      className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-luxury-muted block mt-0.5">
                      Checklist displayed on the service inquiry page
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DEDICATED INQUIRY FORM CONFIGURATION */}
            {activeFormTab === 'inquiry-form' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30 text-emerald-900 text-xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-800 mb-1">
                    <ListFilter className="w-4 h-4" />
                    <span>Tailored Customer Inquiry Form Customization</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Configure the specific booking form that opens when customers click on this service. You can customize the property dropdown choices, form title, and notes prompt.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>Inquiry Form Header Title</span>
                  </label>
                  <input
                    type="text"
                    value={formData.formHeading}
                    onChange={(e) => setFormData({ ...formData, formHeading: e.target.value })}
                    placeholder={`e.g. Get Free Quote for ${formData.shortTitle || formData.title || 'this service'}`}
                    className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                  />
                  <span className="text-[10px] text-luxury-muted mt-1 block">
                    Header displayed directly above the service inquiry form
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ListFilter className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Property / Space Type Dropdown Options (1 per line)</span>
                    </span>
                    <span className="text-[10px] text-luxury-gold-dark font-bold">
                      {formData.propertyTypesText.split('\n').filter(Boolean).length} Options Configured
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.propertyTypesText}
                    onChange={(e) => setFormData({ ...formData, propertyTypesText: e.target.value })}
                    placeholder="1 BHK Apartment&#10;2 BHK Apartment&#10;3 BHK Apartment&#10;4 BHK / Penthouse&#10;Villa / Duplex House&#10;Independent House&#10;Commercial / Other"
                    className="w-full p-3.5 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-mono focus:border-luxury-gold focus:outline-none leading-relaxed"
                  />
                  <span className="text-[10px] text-luxury-muted block mt-1">
                    Each line becomes a selectable choice in the "Space / Property Type" dropdown on this service's inquiry page.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                    Notes / Requirements Box Placeholder
                  </label>
                  <input
                    type="text"
                    value={formData.formNotesPlaceholder}
                    onChange={(e) => setFormData({ ...formData, formNotesPlaceholder: e.target.value })}
                    placeholder="e.g. Describe your floor plan, dimensions, or specific design preferences..."
                    className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-luxury-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingService(null); }}
                className="py-3 px-5 rounded-xl bg-luxury-surface hover:bg-luxury-border text-luxury-charcoal font-bold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{editingService ? 'Update Service & Form' : 'Save New Service'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => {
          const propertyOptionsCount = (srv.propertyTypes || []).length || 6;
          const scopeItemsCount = (srv.subservices || []).length || 5;

          return (
            <div
              key={srv.id}
              className="bg-luxury-card rounded-3xl border border-luxury-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-luxury-gold/60"
            >
              <div>
                {/* Image Cover Preview */}
                <div className="h-48 w-full bg-luxury-walnut relative overflow-hidden">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/images/service_complete_interiors.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-luxury-gold/90 text-luxury-walnut text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {srv.highlight || 'Turnkey Service'}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-heading text-lg font-bold text-white leading-tight drop-shadow-md">
                      {srv.title}
                    </h3>
                    <span className="text-xs text-luxury-gold font-semibold block mt-0.5">
                      Tab: {srv.shortTitle || srv.title}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3.5">
                  <p className="text-xs text-luxury-muted leading-relaxed line-clamp-2">
                    {srv.description}
                  </p>

                  {/* Scope Items Preview */}
                  <div className="space-y-1.5 pt-2 border-t border-luxury-border">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-charcoal flex items-center justify-between">
                      <span>Execution Scopes</span>
                      <span className="text-luxury-muted font-normal">({scopeItemsCount} items)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(srv.subservices || []).slice(0, 3).map((sub, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-luxury-surface border border-luxury-border text-luxury-walnut font-medium truncate max-w-[200px]">
                          ✓ {sub}
                        </span>
                      ))}
                      {scopeItemsCount > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-luxury-gold/10 text-luxury-gold-dark font-bold">
                          +{scopeItemsCount - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inquiry Form Fields Badge */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-900">
                    <span className="text-[11px] font-bold flex items-center gap-1.5">
                      <ListFilter className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Form Space Options:</span>
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-white/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {propertyOptionsCount} Tailored Types
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-luxury-border bg-luxury-surface/50 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-luxury-muted truncate max-w-[130px]" title={srv.id}>
                  ID: {srv.id}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Service & Form</span>
                  </button>

                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
