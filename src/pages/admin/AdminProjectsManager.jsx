import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Film, Image as ImageIcon, Sparkles, Upload, Play, X, Save, MapPin } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { PORTFOLIO_CATEGORIES } from '../../data/portfolioData';

export default function AdminProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = useAdminData();
  const [editingProject, setEditingProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('All');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Complete Interiors',
    location: 'Tolichowki, Hyderabad',
    description: '',
    materials: 'IS:710 Marine Plywood & German Hardware',
    scope: 'Full Turnkey Execution',
    image: '',
    type: 'image',
    videoUrl: '',
    poster: '',
    duration: '0:45'
  });

  const handleOpenCreate = (type = 'image') => {
    setFormData({
      title: '',
      category: 'Complete Interiors',
      location: 'Tolichowki, Hyderabad',
      description: '',
      materials: 'IS:710 Marine Plywood & German Hardware',
      scope: 'Full Turnkey Execution',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      type: type,
      videoUrl: type === 'video' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : '',
      poster: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      duration: '0:45'
    });
    setEditingProject(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      category: p.category,
      location: p.location,
      description: p.description,
      materials: p.materials,
      scope: p.scope,
      image: p.image,
      type: p.type || 'image',
      videoUrl: p.videoUrl || '',
      poster: p.poster || p.image,
      duration: p.duration || '0:45'
    });
    setIsCreating(false);
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({
        ...prev,
        [fieldName]: url,
        ...(fieldName === 'image' && !prev.poster ? { poster: url } : {})
      }));
    } catch (err) {
      alert('File upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingProject) {
      await updateProject(editingProject.id, {
        title: formData.title,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        materials: formData.materials,
        scope: formData.scope,
        image: formData.image,
        type: formData.type,
        videoUrl: formData.videoUrl,
        poster: formData.poster || formData.image,
        duration: formData.duration
      });
    } else {
      await addProject({
        title: formData.title,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        materials: formData.materials,
        scope: formData.scope,
        image: formData.image,
        type: formData.type,
        videoUrl: formData.videoUrl,
        poster: formData.poster || formData.image,
        duration: formData.duration
      });
    }

    setIsCreating(false);
    setEditingProject(null);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProject(id);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (selectedFilterCategory === 'Video Walkthroughs') return p.type === 'video' || !!p.videoUrl;
    if (selectedFilterCategory !== 'All') return p.category === selectedFilterCategory;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-luxury-card p-5 rounded-2xl border border-luxury-gold/30 shadow-sm">
        <div>
          <h2 className="font-heading text-xl font-bold text-luxury-walnut">
            Recent Projects & Media Library ({projects.length} Items)
          </h2>
          <p className="text-xs text-luxury-muted mt-0.5">
            Upload new project photos and video walkthroughs directly via Cloudinary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenCreate('image')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
          
          <button
            onClick={() => handleOpenCreate('video')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md"
          >
            <Film className="w-4 h-4" />
            <span>Upload Video</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {PORTFOLIO_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedFilterCategory === cat
                ? 'bg-luxury-walnut text-luxury-gold border border-luxury-gold shadow-sm'
                : 'bg-luxury-card text-luxury-muted border border-luxury-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Create / Edit Project Modal Form */}
      {(isCreating || editingProject) && (
        <div className="bg-luxury-card p-6 rounded-3xl border-2 border-luxury-gold/50 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-border pb-3">
            <h3 className="font-heading text-lg font-bold text-luxury-walnut flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-luxury-gold" />
              <span>{editingProject ? `Edit Project: ${editingProject.title}` : `Add New ${formData.type === 'video' ? 'Video Tour' : 'Photo Project'}`}</span>
            </h3>

            <button
              onClick={() => { setIsCreating(false); setEditingProject(null); }}
              className="p-1 rounded-full bg-luxury-surface hover:bg-luxury-border text-luxury-walnut"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Calacatta Gold Modular Kitchen"
                  className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                  Category Vertical
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                >
                  <option value="Complete Interiors">Complete Interiors</option>
                  <option value="Modular Kitchens">Modular Kitchens</option>
                  <option value="Custom Wardrobes">Custom Wardrobes</option>
                  <option value="Living Rooms">Living Rooms</option>
                  <option value="Bespoke Woodcraft">Bespoke Woodcraft</option>
                  <option value="Commercial & Renovation">Commercial & Renovation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                  Location / Suburb
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Tolichowki, Hyderabad"
                  className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                  Media Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                >
                  <option value="image">Photo Project</option>
                  <option value="video">Video Walkthrough</option>
                </select>
              </div>
            </div>

            {/* Media Upload Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                  Image URL / Cloudinary Photo Upload
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
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                  </label>
                </div>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                    Video MP4 URL / Cloudinary Video Upload
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://...mp4"
                      className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
                    />
                    <label className="px-3 py-3 rounded-xl bg-red-600 text-white font-bold text-xs uppercase cursor-pointer hover:bg-red-700 shrink-0">
                      <span>{uploading ? '...' : 'Upload MP4'}</span>
                      <input type="file" accept="video/mp4,video/*" onChange={(e) => handleFileUpload(e, 'videoUrl')} className="hidden" />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1">
                Short 1-Line Description
              </label>
              <textarea
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Concise 1-line project summary..."
                className="w-full p-3 rounded-xl bg-luxury-surface border border-luxury-border text-xs text-luxury-walnut font-medium focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingProject(null); }}
                className="px-5 py-2.5 rounded-xl bg-luxury-surface border border-luxury-border text-luxury-charcoal font-semibold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((item) => {
          const isVideo = item.type === 'video' || !!item.videoUrl;

          return (
            <div
              key={item.id}
              className="bg-luxury-card rounded-2xl overflow-hidden border border-luxury-border shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] bg-luxury-walnut overflow-hidden">
                <img
                  src={item.poster || item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-transparent to-black/20" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {isVideo ? (
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Video</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-luxury-walnut/90 border border-luxury-gold/50 text-luxury-gold text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-[#FDFBF7]">
                  <h3 className="font-heading font-bold text-sm text-white truncate">{item.title}</h3>
                  <span className="text-[11px] text-gray-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-luxury-gold" />
                    {item.location}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-luxury-muted line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-3 bg-luxury-surface border-t border-luxury-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-luxury-muted">ID: {item.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 rounded-lg bg-luxury-walnut text-luxury-gold hover:bg-black font-bold text-xs uppercase flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
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
