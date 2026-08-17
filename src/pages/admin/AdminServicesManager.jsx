import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Image as ImageIcon, Sparkles, X, Save, Upload, AlertTriangle } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function AdminServicesManager() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortTitle: '',
    iconName: 'Home',
    highlight: 'Turnkey Solution',
    description: '',
    image: '',
    subservicesText: ''
  });

  const handleOpenCreate = () => {
    setUploadError('');
    setFormData({
      title: '',
      shortTitle: '',
      iconName: 'Home',
      highlight: 'Turnkey Solution',
      description: '',
      image: '',
      subservicesText: 'Complete Interior Design\nCustom Carpentry\nLighting & Ceilings'
    });
    setEditingService(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (srv) => {
    setUploadError('');
    setEditingService(srv);
    setFormData({
      title: srv.title,
      shortTitle: srv.shortTitle,
      iconName: srv.iconName || 'Home',
      highlight: srv.highlight || 'Turnkey Solution',
      description: srv.description,
      image: srv.image,
      subservicesText: (srv.subservices || []).join('\n')
    });
    setIsCreating(false);
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

    if (editingService) {
      await updateService(editingService.id, {
        title: formData.title,
        shortTitle: formData.shortTitle || formData.title,
        iconName: formData.iconName,
        highlight: formData.highlight,
        description: formData.description,
        image: formData.image,
        subservices: subs
      });
    } else {
      await addService({
        title: formData.title,
        shortTitle: formData.shortTitle || formData.title,
        iconName: formData.iconName,
        highlight: formData.highlight,
        description: formData.description,
        image: formData.image,
        subservices: subs
      });
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
            Add, update, or edit service titles, execution scope, and high-res imagery.
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
        <div className="bg-luxury-card p-6 rounded-3xl border-2 border-luxury-gold/50 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between border-b border-luxury-border pb-3">
            <h3 className="font-heading text-lg font-bold text-luxury-walnut flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span>{editingService ? `Edit Service: ${editingService.title}` : 'Create New Service Vertical'}</span>
            </h3>

            <button
              onClick={() => { setIsCreating(false); setEditingService(null); }}
              className="p-1 rounded-full bg-luxury-surface hover:bg-luxury-border text-luxury-walnut cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="e.g. 3D Renders Included"
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
                    <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 text-luxury-gold-dark flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-luxury-walnut">
                        Upload Service Cover Photo
                      </p>
                      <span className="text-[11px] text-luxury-muted block">
                        Supports JPG, PNG, WEBP from your computer or device (Max 5MB)
                      </span>
                    </div>
                  </div>

                  <label className="px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-400 text-luxury-walnut font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shrink-0 transition-transform active:scale-95">
                    <span>{uploading ? 'Uploading Image...' : 'Browse Image File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive service description..."
                className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                Detailed Execution Scope Items (One per line)
              </label>
              <textarea
                rows={4}
                value={formData.subservicesText}
                onChange={(e) => setFormData({ ...formData, subservicesText: e.target.value })}
                placeholder="Apartment & Villa Interiors&#10;Bedroom Interior Design&#10;Living Room Interiors"
                className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingService(null); }}
                className="px-5 py-2.5 rounded-xl bg-luxury-surface border border-luxury-border text-luxury-charcoal font-semibold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Service</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-luxury-card rounded-2xl overflow-hidden border border-luxury-border shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-luxury-walnut">
              <img
                src={srv.image}
                alt={srv.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-transparent to-black/20" />
              
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-luxury-walnut/90 border border-luxury-gold/50 text-luxury-gold text-[10px] font-bold uppercase">
                  {srv.highlight}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-[#FDFBF7]">
                <h3 className="font-heading font-bold text-base text-white truncate">{srv.title}</h3>
                <p className="text-[11px] text-luxury-gold font-semibold">{srv.shortTitle}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-luxury-muted line-clamp-2 leading-relaxed">
                {srv.description}
              </p>

              <div className="space-y-1 pt-2 border-t border-luxury-border">
                <span className="text-[10px] font-bold uppercase text-luxury-charcoal block">Scope Items:</span>
                <div className="flex flex-wrap gap-1">
                  {(srv.subservices || []).map((sub, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-luxury-surface border border-luxury-border text-luxury-muted">
                      ✓ {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-luxury-surface border-t border-luxury-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-luxury-muted">ID: {srv.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="px-3 py-1.5 rounded-lg bg-luxury-walnut text-luxury-gold hover:bg-black font-bold text-xs uppercase flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.title)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
