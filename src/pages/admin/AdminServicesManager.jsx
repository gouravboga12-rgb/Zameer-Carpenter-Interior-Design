import React, { useState, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle2, Image as ImageIcon, Sparkles, 
  X, Save, Upload, AlertTriangle, ListFilter, Sliders, FileText, Check,
  ArrowUp, ArrowDown, HelpCircle, FormInput, Type, Phone, Mail, Hash,
  ChevronDown, RotateCcw, PlusCircle
} from 'lucide-react';
import { useAdminData, getDefaultFormFieldsForService } from '../../context/AdminDataContext';
import { uploadToCloudinary } from '../../utils/cloudinary';

const FIELD_TYPE_LABELS = {
  text: 'Single-line Text',
  tel: 'Phone Number (+91)',
  email: 'Email Address',
  number: 'Number (Digits Only)',
  select: 'Dropdown Select',
  textarea: 'Multi-line Textarea',
  file: 'Image / File Upload (Floor Plan)'
};

const FIELD_TYPE_ICONS = {
  text: Type,
  tel: Phone,
  email: Mail,
  number: Hash,
  select: ListFilter,
  textarea: FileText,
  file: ImageIcon
};

export default function AdminServicesManager() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState('catalog'); // 'catalog' | 'inquiry-form'
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const formRef = useRef(null);

  // Field Editor Sub-State (For Adding or Editing a specific field inside the form)
  const [editingFieldIndex, setEditingFieldIndex] = useState(null); // number | null
  const [isAddingField, setIsAddingField] = useState(false);
  const [fieldFormData, setFieldFormData] = useState({
    id: '',
    label: '',
    type: 'text',
    placeholder: '',
    required: true,
    optionsText: ''
  });

  // Main Service Form State
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    iconName: 'Home',
    highlight: 'Turnkey Solution',
    description: '',
    image: '',
    subservicesText: '',
    featuresText: '',
    formHeading: '',
    formSubtitle: '',
    submitButtonText: '',
    formFields: []
  });

  const handleOpenCreate = () => {
    setUploadError('');
    setActiveFormTab('catalog');
    setIsAddingField(false);
    setEditingFieldIndex(null);

    const defaultFields = getDefaultFormFieldsForService('new-service', 'New Service');

    setFormData({
      title: '',
      shortTitle: '',
      iconName: 'Home',
      highlight: 'Turnkey Solution',
      description: '',
      image: '',
      subservicesText: 'Complete Interior Design\nCustom Carpentry\nLighting & False Ceilings\n3D Render Visualization\nTurnkey Handover',
      featuresText: 'Custom 3D walkthroughs before woodwork begins\nPrecision laser site measurements & structural planning\nSeamless integration of furniture, electricals & lighting\nSingle-point turnkey accountability with on-time handover',
      formHeading: 'Request On-Site Measurement & 3D Consultation',
      formSubtitle: 'Schedule a free laser site measurement and get a transparent itemized estimate.',
      submitButtonText: 'Request Free Quote',
      formFields: defaultFields
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
    setIsAddingField(false);
    setEditingFieldIndex(null);
    setEditingService(srv);

    const currentFields = (srv.formFields && srv.formFields.length > 0)
      ? srv.formFields
      : getDefaultFormFieldsForService(srv.id, srv.shortTitle || srv.title, srv.propertyTypes);

    setFormData({
      title: srv.title || '',
      shortTitle: srv.shortTitle || srv.title || '',
      iconName: srv.iconName || 'Home',
      highlight: srv.highlight || 'Turnkey Solution',
      description: srv.description || '',
      image: srv.image || '',
      subservicesText: (srv.subservices || []).join('\n'),
      featuresText: (srv.features || []).join('\n'),
      formHeading: srv.formHeading || `Get Free Quote for ${srv.shortTitle || srv.title}`,
      formSubtitle: srv.formSubtitle || `Schedule a free laser site measurement and get a transparent itemized estimate for ${srv.title}.`,
      submitButtonText: srv.submitButtonText || `Request Free Quote for ${srv.shortTitle || srv.title}`,
      formFields: JSON.parse(JSON.stringify(currentFields))
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

  // --- FORM FIELDS CRUD HANDLERS ---

  const handleOpenAddField = () => {
    setEditingFieldIndex(null);
    setFieldFormData({
      id: '',
      label: '',
      type: 'text',
      placeholder: '',
      required: true,
      optionsText: 'Option 1\nOption 2\nOption 3'
    });
    setIsAddingField(true);
  };

  const handleOpenEditField = (index) => {
    const target = formData.formFields[index];
    if (!target) return;
    setEditingFieldIndex(index);
    setFieldFormData({
      id: target.id || '',
      label: target.label || '',
      type: target.type || 'text',
      placeholder: target.placeholder || '',
      required: target.required !== false,
      optionsText: (target.options || []).join('\n')
    });
    setIsAddingField(false);
  };

  const handleSaveField = (e) => {
    e.preventDefault();
    if (!fieldFormData.label.trim()) return;

    // Generate unique ID slug if empty
    const generatedId = fieldFormData.id.trim() || 
      fieldFormData.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, '') ||
      'field_' + Date.now();

    const options = fieldFormData.type === 'select'
      ? fieldFormData.optionsText.split('\n').map(o => o.trim()).filter(Boolean)
      : [];

    const fieldObj = {
      id: generatedId,
      label: fieldFormData.label.trim(),
      type: fieldFormData.type,
      placeholder: fieldFormData.placeholder.trim(),
      required: Boolean(fieldFormData.required),
      ...(fieldFormData.type === 'select' ? { options } : {})
    };

    if (editingFieldIndex !== null) {
      // Update existing field
      const updatedFields = [...formData.formFields];
      updatedFields[editingFieldIndex] = fieldObj;
      setFormData(prev => ({ ...prev, formFields: updatedFields }));
    } else {
      // Add new field
      setFormData(prev => ({ ...prev, formFields: [...prev.formFields, fieldObj] }));
    }

    setIsAddingField(false);
    setEditingFieldIndex(null);
  };

  const handleDeleteField = (index) => {
    const target = formData.formFields[index];
    if (window.confirm(`Are you sure you want to delete the inquiry field "${target.label}"?`)) {
      const updatedFields = formData.formFields.filter((_, idx) => idx !== index);
      setFormData(prev => ({ ...prev, formFields: updatedFields }));
      if (editingFieldIndex === index) {
        setEditingFieldIndex(null);
      }
    }
  };

  const handleMoveField = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= formData.formFields.length) return;
    const updated = [...formData.formFields];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setFormData(prev => ({ ...prev, formFields: updated }));
  };

  const handleResetToStandardFields = () => {
    if (window.confirm('Reset this service inquiry form to the standard 6 default fields (Name, Phone, Email, Space Type, Address, Notes)?')) {
      const srvId = editingService ? editingService.id : 'default';
      const srvTitle = formData.shortTitle || formData.title || 'this service';
      const defaults = getDefaultFormFieldsForService(srvId, srvTitle);
      setFormData(prev => ({ ...prev, formFields: defaults }));
      setIsAddingField(false);
      setEditingFieldIndex(null);
    }
  };

  // --- SAVE WHOLE SERVICE VERTICAL ---

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

    // Extract property types from select field if exists
    const propertyTypeField = formData.formFields.find(f => f.id === 'propertyType' || f.type === 'select');
    const pTypes = (propertyTypeField && propertyTypeField.options && propertyTypeField.options.length > 0)
      ? propertyTypeField.options
      : ['1 BHK Apartment', '2 BHK Apartment', '3 BHK Apartment', 'Villa / Duplex', 'Other'];

    const payload = {
      title: formData.title,
      shortTitle: formData.shortTitle || formData.title,
      iconName: formData.iconName,
      highlight: formData.highlight,
      description: formData.description,
      image: formData.image,
      subservices: subs,
      features: feats,
      propertyTypes: pTypes,
      formFields: formData.formFields,
      formHeading: formData.formHeading || `Get Free Quote for ${formData.shortTitle || formData.title}`,
      formSubtitle: formData.formSubtitle || `Schedule a free laser site measurement and get a transparent itemized estimate.`,
      submitButtonText: formData.submitButtonText || `Request Free Quote for ${formData.shortTitle || formData.title}`
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
            Add or edit service catalog details, execution scopes, and tailored customer inquiry form fields (Full CRUD).
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
          className="bg-luxury-card p-6 sm:p-8 rounded-3xl border-2 border-luxury-gold shadow-2xl space-y-6 relative scroll-mt-24 ring-4 ring-luxury-gold/30 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-luxury-border pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                {editingService ? 'Edit Existing Service' : 'New Service Creator'}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-luxury-walnut flex items-center gap-2 mt-0.5">
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
              <span>2. Dedicated Inquiry Form Fields (CRUD Builder)</span>
              <span className="px-2 py-0.5 rounded-full bg-luxury-gold/20 text-[10px] font-extrabold text-luxury-gold-dark">
                {formData.formFields.length} Fields
              </span>
            </button>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
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

            {/* TAB 2: DEDICATED INQUIRY FORM CONFIGURATION (FULL CRUD BUILDER) */}
            {activeFormTab === 'inquiry-form' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Info Callout */}
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-800">
                      <ListFilter className="w-4 h-4" />
                      <span>Form Fields & Options Builder (Full CRUD)</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      Add custom fields, edit existing fields, modify dropdown options, reorder, or delete unnecessary fields.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleResetToStandardFields}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                      title="Reset to default 6 fields"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset to Defaults</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenAddField}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm cursor-pointer transition-transform active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Add New Field</span>
                    </button>
                  </div>
                </div>

                {/* Form General Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-luxury-surface p-4 rounded-2xl border border-luxury-border">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Inquiry Form Header Title
                    </label>
                    <input
                      type="text"
                      value={formData.formHeading}
                      onChange={(e) => setFormData({ ...formData, formHeading: e.target.value })}
                      placeholder={`e.g. Get Free Quote for ${formData.shortTitle || formData.title || 'this service'}`}
                      className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Form Subtitle / Explainer
                    </label>
                    <input
                      type="text"
                      value={formData.formSubtitle}
                      onChange={(e) => setFormData({ ...formData, formSubtitle: e.target.value })}
                      placeholder="e.g. Schedule a free laser site measurement and get a transparent estimate."
                      className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                      Submit Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.submitButtonText}
                      onChange={(e) => setFormData({ ...formData, submitButtonText: e.target.value })}
                      placeholder={`e.g. Request Free Quote for ${formData.shortTitle || 'Service'}`}
                      className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Inline Field Editor Modal / Box (When creating or editing a single field) */}
                {(isAddingField || editingFieldIndex !== null) && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/70 border-2 border-luxury-gold shadow-lg space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-luxury-gold/30 pb-3">
                      <div className="flex items-center gap-2">
                        <Edit2 className="w-4 h-4 text-luxury-gold-dark" />
                        <h4 className="font-heading text-sm sm:text-base font-bold text-luxury-walnut">
                          {editingFieldIndex !== null 
                            ? `Edit Field: "${formData.formFields[editingFieldIndex]?.label}"` 
                            : 'Create New Form Field'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsAddingField(false); setEditingFieldIndex(null); }}
                        className="p-1 rounded-full text-luxury-muted hover:text-luxury-walnut hover:bg-white/80"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Field Label */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                          Field Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fieldFormData.label}
                          onChange={(e) => setFieldFormData({ ...fieldFormData, label: e.target.value })}
                          placeholder="e.g. Estimated Budget, Carpet Area (Sq Ft)"
                          className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                        />
                      </div>

                      {/* Field Type */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                          Input Field Type
                        </label>
                        <select
                          value={fieldFormData.type}
                          onChange={(e) => setFieldFormData({ ...fieldFormData, type: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-semibold focus:border-luxury-gold focus:outline-none"
                        >
                          <option value="text">Single-line Text</option>
                          <option value="tel">Phone Number (+91 format)</option>
                          <option value="email">Email Address</option>
                          <option value="number">Number / Digits Only</option>
                          <option value="select">Dropdown Select (Custom Options)</option>
                          <option value="textarea">Multi-line Textarea (Notes / Remarks)</option>
                          <option value="file">Image / Floor Plan Upload (File / Photo)</option>
                        </select>
                      </div>

                      {/* Field Key / ID */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                          Field Key ID <span className="text-luxury-muted font-normal lowercase">(optional identifier)</span>
                        </label>
                        <input
                          type="text"
                          value={fieldFormData.id}
                          onChange={(e) => setFieldFormData({ ...fieldFormData, id: e.target.value })}
                          placeholder="e.g. estimated_budget, carpet_area"
                          className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-mono focus:border-luxury-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Placeholder Text */}
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                          Placeholder Text
                        </label>
                        <input
                          type="text"
                          value={fieldFormData.placeholder}
                          onChange={(e) => setFieldFormData({ ...fieldFormData, placeholder: e.target.value })}
                          placeholder="e.g. Enter room dimensions, preferred finish..."
                          className="w-full p-2.5 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                        />
                      </div>

                      {/* Mandatory / Required Checkbox */}
                      <div className="flex items-center gap-3 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={fieldFormData.required}
                            onChange={(e) => setFieldFormData({ ...fieldFormData, required: e.target.checked })}
                            className="w-4 h-4 accent-luxury-gold rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold text-luxury-walnut">
                            Mandatory Field (Customer must fill before submitting)
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Options list if type is 'select' */}
                    {fieldFormData.type === 'select' && (
                      <div className="space-y-1.5 pt-2 border-t border-luxury-gold/20">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal block flex items-center justify-between">
                          <span>Dropdown Choices (1 per line)</span>
                          <span className="text-[10px] text-luxury-gold-dark font-bold">
                            {fieldFormData.optionsText.split('\n').filter(Boolean).length} Options
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          value={fieldFormData.optionsText}
                          onChange={(e) => setFieldFormData({ ...fieldFormData, optionsText: e.target.value })}
                          placeholder="1 BHK Apartment&#10;2 BHK Apartment&#10;3 BHK Apartment&#10;Villa / Duplex House"
                          className="w-full p-3 rounded-xl bg-white border border-luxury-border text-xs text-luxury-walnut font-mono focus:border-luxury-gold focus:outline-none"
                        />
                        <span className="text-[10px] text-luxury-muted block">
                          Each line will be rendered as a choice in the dropdown menu.
                        </span>
                      </div>
                    )}

                    {/* Sub-form action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-luxury-gold/30">
                      <button
                        type="button"
                        onClick={() => { setIsAddingField(false); setEditingFieldIndex(null); }}
                        className="px-4 py-2 rounded-xl bg-white border border-luxury-border text-luxury-charcoal hover:bg-gray-100 text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveField}
                        className="px-5 py-2 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold text-xs font-bold shadow-xs cursor-pointer"
                      >
                        {editingFieldIndex !== null ? 'Save Field Changes' : 'Add Field to Form'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Fields Visual List (Interactive CRUD Cards) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-luxury-gold" />
                      <span>Active Form Fields ({formData.formFields.length} Defined)</span>
                    </span>
                    <span className="text-[11px] text-luxury-muted">
                      Use arrows to reorder • Click edit (✏️) to modify
                    </span>
                  </div>

                  {formData.formFields.length === 0 ? (
                    <div className="p-8 text-center bg-luxury-surface rounded-2xl border-2 border-dashed border-luxury-border space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                      <h4 className="font-heading text-sm font-bold text-luxury-walnut">No Fields Configured</h4>
                      <p className="text-xs text-luxury-muted">Click "+ Add New Field" or "Reset to Defaults" above.</p>
                    </div>
                  ) : (
                    formData.formFields.map((field, idx) => {
                      const TypeIcon = FIELD_TYPE_ICONS[field.type] || Type;
                      const typeLabel = FIELD_TYPE_LABELS[field.type] || field.type;
                      const isEditingThis = editingFieldIndex === idx;

                      return (
                        <div
                          key={field.id || idx}
                          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            isEditingThis 
                              ? 'bg-luxury-gold/15 border-luxury-gold shadow-md' 
                              : 'bg-luxury-surface hover:bg-white border-luxury-border hover:border-luxury-gold/50 shadow-2xs'
                          }`}
                        >
                          {/* Left Details */}
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            {/* Sequence Badge */}
                            <span className="w-7 h-7 rounded-lg bg-luxury-walnut text-luxury-gold text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                              #{idx + 1}
                            </span>

                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-heading text-sm font-bold text-luxury-walnut truncate">
                                  {field.label}
                                </h5>

                                {field.required ? (
                                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold border border-red-200">
                                    Required *
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200">
                                    Optional
                                  </span>
                                )}

                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold-dark text-[10px] font-bold border border-luxury-gold/30">
                                  <TypeIcon className="w-3 h-3" />
                                  <span>{typeLabel}</span>
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-luxury-muted">
                                <span className="font-mono text-[10px] bg-black/5 px-1.5 py-0.5 rounded">
                                  key: {field.id}
                                </span>

                                {field.placeholder && (
                                  <span className="italic truncate max-w-xs sm:max-w-sm">
                                    "{field.placeholder}"
                                  </span>
                                )}

                                {field.type === 'select' && (
                                  <span className="font-bold text-emerald-700">
                                    • {(field.options || []).length} choices ({(field.options || []).slice(0, 2).join(', ')}...)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Up, Down, Edit, Delete */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveField(idx, -1)}
                              className="p-1.5 rounded-lg bg-white hover:bg-luxury-border disabled:opacity-30 text-luxury-walnut border border-luxury-border cursor-pointer transition-colors"
                              title="Move field up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={idx === formData.formFields.length - 1}
                              onClick={() => handleMoveField(idx, 1)}
                              className="p-1.5 rounded-lg bg-white hover:bg-luxury-border disabled:opacity-30 text-luxury-walnut border border-luxury-border cursor-pointer transition-colors"
                              title="Move field down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Field */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditField(idx)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-luxury-walnut hover:bg-black text-luxury-gold text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                              title="Edit field settings & options"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Field */}
                            <button
                              type="button"
                              onClick={() => handleDeleteField(idx)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 border border-red-200 cursor-pointer transition-colors"
                              title="Delete field"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
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
                <span>{editingService ? 'Update Service & Form Builder' : 'Save New Service'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid Catalog */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => {
          const formFieldsCount = (srv.formFields || []).length || 6;
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
                      <span>Inquiry Form Fields:</span>
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-white/70 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {formFieldsCount} Dynamic Fields
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
