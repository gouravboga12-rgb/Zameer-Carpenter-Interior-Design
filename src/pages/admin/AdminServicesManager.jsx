import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Image as ImageIcon, Sparkles, X, Save } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function AdminServicesManager() {
  const { services, addService, updateService, deleteService } = useAdminData();
  const [editingService, setEditingService] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    setFormData({
      title: '',
      shortTitle: '',
      iconName: 'Home',
      highlight: 'Turnkey Solution',
      description: '',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      subservicesText: 'Complete Interior Design\nCustom Carpentry\nLighting & Ceilings'
    });
    setEditingService(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (srv) => {
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

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Vertical</span>
        </button>
      </div>

      {/* Service Create / Edit Modal Modal Form */}
      {(isCreating || editingService) && (
        <div className="bg-luxury-card p-6 rounded-3xl border-2 border-luxury-gold/50 shadow-xl space-y-4 relative">
          <div className="flex items-center justify-between border-b border-luxury-border pb-3">
            <h3 className="font-heading text-lg font-bold text-luxury-walnut flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span>{editingService ? `Edit Service: ${editingService.title}` : 'Create New Service Vertical'}</span>
            </h3>

            <button
              onClick={() => { setIsCreating(false); setEditingService(null); }}
              className="p-1 rounded-full bg-luxury-surface hover:bg-luxury-border text-luxury-walnut"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                  Cloudinary / Image URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                  />
                  <label className="px-3 py-3 rounded-xl bg-luxury-gold text-luxury-walnut font-bold text-xs uppercase cursor-pointer hover:bg-yellow-400 shrink-0">
                    <span>{uploading ? '...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
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
            <div className="relative aspect-[16/9] bg-luxury-walnut">
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
