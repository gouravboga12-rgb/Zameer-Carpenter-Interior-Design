import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Film, Image as ImageIcon, Sparkles, Upload, Play, X, Save, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { PORTFOLIO_CATEGORIES } from '../../data/portfolioData';

export default function AdminProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = useAdminData();
  const [editingProject, setEditingProject] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
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
    setUploadError('');
    setFormData({
      title: '',
      category: 'Complete Interiors',
      location: 'Tolichowki, Hyderabad',
      description: '',
      materials: 'IS:710 Marine Plywood & German Hardware',
      scope: 'Full Turnkey Execution',
      image: '',
      type: type,
      videoUrl: '',
      poster: '',
      duration: '0:45'
    });
    setEditingProject(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (p) => {
    setUploadError('');
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

    setUploadError('');

    // File Size Validation
    const isVideo = fieldName === 'videoUrl' || file.type.startsWith('video/');
    const maxBytes = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024; // 10MB for video, 5MB for photo
    const maxMbText = isVideo ? '10MB' : '5MB';

    if (file.size > maxBytes) {
      const actualMb = (file.size / (1024 * 1024)).toFixed(1);
      setUploadError(`File size (${actualMb}MB) exceeds the maximum limit of ${maxMbText}. Please select a smaller file.`);
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setFormData(prev => ({
        ...prev,
        [fieldName]: url,
        ...(fieldName === 'image' && !prev.poster ? { poster: url } : {})
      }));
    } catch (err) {
      setUploadError('File upload failed: ' + err.message);
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
        image: formData.image || formData.poster,
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
        image: formData.image || formData.poster,
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

  const isVideoForm = formData.type === 'video';

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-luxury-card p-5 rounded-2xl border border-luxury-gold/30 shadow-sm">
        <div>
          <h2 className="font-heading text-xl font-bold text-luxury-walnut">
            Recent Projects & Media Library ({projects.length} Items)
          </h2>
          <p className="text-xs text-luxury-muted mt-0.5">
            Upload new project photos (under 5MB) and video walkthroughs (under 10MB).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenCreate('image')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
          
          <button
            onClick={() => handleOpenCreate('video')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition-all"
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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
              <span>{editingProject ? `Edit Project: ${editingProject.title}` : `Add New ${isVideoForm ? 'Video Tour' : 'Photo Project'}`}</span>
            </h3>

            <button
              onClick={() => { setIsCreating(false); setEditingProject(null); }}
              className="p-1 rounded-full bg-luxury-surface hover:bg-luxury-border text-luxury-walnut cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Error Alert */}
          {uploadError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{uploadError}</span>
            </div>
          )}

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

            {/* Direct File Upload Component with File Size Notice */}
            {!isVideoForm ? (
              /* PHOTO UPLOAD BOX (Max 5MB) */
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-luxury-gold" />
                    <span>Upload Project Photo</span>
                  </label>
                  <span className="text-[11px] font-bold text-luxury-gold-dark bg-luxury-gold/15 px-2.5 py-0.5 rounded-full border border-luxury-gold/30">
                    Max File Size: Under 5MB
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-luxury-surface border-2 border-dashed border-luxury-gold/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 text-luxury-gold-dark flex items-center justify-center shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-luxury-walnut">
                        {formData.image ? 'Photo Uploaded / Selected' : 'Choose an image file from your device'}
                      </p>
                      <span className="text-[11px] text-luxury-muted block">
                        Supports JPG, PNG, WEBP (Max 5MB)
                      </span>
                    </div>
                  </div>

                  <label className="px-5 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-400 text-luxury-walnut font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shrink-0 transition-transform active:scale-95">
                    <span>{uploading ? 'Uploading Image...' : 'Browse Image File'}</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
                  </label>
                </div>

                {formData.image && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Image Ready: {formData.image}</span>
                  </div>
                )}
              </div>
            ) : (
              /* VIDEO TOUR UPLOAD BOX (Max 10MB) - NO IMAGE INPUT HERE */
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                    <Film className="w-4 h-4" />
                    <span>Upload Video Tour MP4</span>
                  </label>
                  <span className="text-[11px] font-bold text-red-700 bg-red-500/15 px-2.5 py-0.5 rounded-full border border-red-500/30">
                    Max File Size: Under 10MB
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/5 border-2 border-dashed border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-600 flex items-center justify-center shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-luxury-walnut">
                        {formData.videoUrl ? 'Video Tour Uploaded / Selected' : 'Choose an MP4 video walkthrough from your device'}
                      </p>
                      <span className="text-[11px] text-luxury-muted block">
                        Supports MP4, MOV, WEBM (Max 10MB)
                      </span>
                    </div>
                  </div>

                  <label className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md shrink-0 transition-transform active:scale-95">
                    <span>{uploading ? 'Uploading Video...' : 'Browse MP4 Video'}</span>
                    <input type="file" accept="video/mp4,video/*" onChange={(e) => handleFileUpload(e, 'videoUrl')} className="hidden" />
                  </label>
                </div>

                {formData.videoUrl && (
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/30 truncate">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Video Ready: {formData.videoUrl}</span>
                  </div>
                )}
              </div>
            )}

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
                className="px-5 py-2.5 rounded-xl bg-luxury-surface border border-luxury-border text-luxury-charcoal font-semibold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow-md cursor-pointer disabled:opacity-50"
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
                  src={item.poster || item.image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-transparent to-black/20" />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {isVideo ? (
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Video Tour</span>
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
                    className="px-3 py-1.5 rounded-lg bg-luxury-walnut text-luxury-gold hover:bg-black font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-700 hover:bg-red-500 hover:text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors cursor-pointer"
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
