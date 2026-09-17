import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
  FolderKanban,
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminConfirmModal } from '../components/AdminConfirmModal';
import { AdminNotification, type NotificationType } from '../components/AdminNotification';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectPublished,
  reorderProjects,
} from '@/services/projects';
import type { Project } from '@/types/models';

type ProjectCategory = Project['category'];
type ProjectStatus = NonNullable<Project['status']>;

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: 'ai-systems', label: 'AI Systems' },
  { id: 'systems-data', label: 'Systems & Data' },
  { id: 'creative-development', label: 'Creative Development' },
  { id: 'web-engineering', label: 'Web Engineering' },
  { id: 'systems', label: 'Systems' },
  { id: 'experimental', label: 'Experimental' },
];

const STATUSES: ProjectStatus[] = [
  'ACTIVE ARCHITECTURE',
  'STABLE PROTOTYPE',
  'IN DEVELOPMENT',
  'COMPLETED BLUEPRINT',
];

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    shortTitle: '',
    tagline: '',
    category: 'ai-systems' as ProjectCategory,
    status: 'IN DEVELOPMENT' as ProjectStatus,
    year: '2024',
    role: '',
    specIndex: '01',
    shortDescription: '',
    description: '',
    technologies: '',
    tags: '',
    coverImage: '/favicon.svg',
    featured: false,
    published: true,
    order: 1,
  });

  const loadAllProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects({ publishedOnly: false });
      setProjects(data);
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load projects',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    const nextOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.order)) + 1 : 1;
    setFormData({
      slug: '',
      title: '',
      shortTitle: '',
      tagline: '',
      category: 'ai-systems',
      status: 'IN DEVELOPMENT',
      year: new Date().getFullYear().toString(),
      role: 'System Architect & Frontend Engineer',
      specIndex: String(nextOrder).padStart(2, '0'),
      shortDescription: '',
      description: '',
      technologies: 'TypeScript, React, Vite',
      tags: 'Architecture, Systems',
      coverImage: '/favicon.svg',
      featured: false,
      published: true,
      order: nextOrder,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      slug: project.slug,
      title: project.title,
      shortTitle: project.shortTitle || '',
      tagline: project.tagline || '',
      category: project.category,
      status: project.status || 'IN DEVELOPMENT',
      year: project.year || '2024',
      role: project.role || '',
      specIndex: project.specIndex || '01',
      shortDescription: project.shortDescription,
      description: project.description,
      technologies: project.technologies.join(', '),
      tags: (project.tags || []).join(', '),
      coverImage: project.coverImage,
      featured: project.featured,
      published: project.published,
      order: project.order,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    // Form validation
    const slugClean = formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!slugClean) {
      setNotification({ type: 'error', message: 'Slug is required and must be alphanumeric.' });
      setSubmitting(false);
      return;
    }

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const tagsArray = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingProject) {
        // Update
        const updated = await updateProject(editingProject.id, {
          slug: slugClean,
          title: formData.title,
          shortTitle: formData.shortTitle || formData.title,
          tagline: formData.tagline,
          category: formData.category,
          status: formData.status,
          year: formData.year,
          role: formData.role,
          specIndex: formData.specIndex,
          shortDescription: formData.shortDescription,
          description: formData.description,
          technologies: techArray,
          tags: tagsArray,
          coverImage: formData.coverImage,
          featured: formData.featured,
          published: formData.published,
          order: Number(formData.order),
        });

        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...p, ...updated } : p))
        );
        setNotification({ type: 'success', message: `Project "${formData.title}" updated successfully.` });
      } else {
        // Create
        const newProject = await createProject({
          slug: slugClean,
          title: formData.title,
          shortTitle: formData.shortTitle || formData.title,
          tagline: formData.tagline,
          category: formData.category,
          status: formData.status,
          year: formData.year,
          role: formData.role,
          specIndex: formData.specIndex,
          shortDescription: formData.shortDescription,
          description: formData.description,
          technologies: techArray,
          tags: tagsArray,
          coverImage: formData.coverImage,
          gallery: [formData.coverImage],
          featured: formData.featured,
          published: formData.published,
          order: Number(formData.order),
        });

        if (newProject) {
          setProjects((prev) => [...prev, newProject].sort((a, b) => a.order - b.order));
        }
        setNotification({ type: 'success', message: `Project "${formData.title}" created successfully.` });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      // In offline mode, update state locally so the workflow can be tested
      const fallbackProject: Project = {
        id: editingProject?.id || `local-${Date.now()}`,
        slug: slugClean,
        title: formData.title,
        shortTitle: formData.shortTitle || formData.title,
        tagline: formData.tagline,
        category: formData.category,
        status: formData.status,
        year: formData.year,
        role: formData.role,
        specIndex: formData.specIndex,
        shortDescription: formData.shortDescription,
        description: formData.description,
        technologies: techArray,
        tags: tagsArray,
        coverImage: formData.coverImage,
        gallery: [formData.coverImage],
        featured: formData.featured,
        published: formData.published,
        order: Number(formData.order),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingProject) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? fallbackProject : p))
        );
      } else {
        setProjects((prev) => [...prev, fallbackProject].sort((a, b) => a.order - b.order));
      }

      setNotification({
        type: 'warning',
        message: `Saved to local memory [Offline Mode]: ${err instanceof Error ? err.message : 'Database offline'}`,
      });
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      const nextState = !project.published;
      await toggleProjectPublished(project.id, nextState);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: nextState } : p))
      );
      setNotification({
        type: 'success',
        message: `Project "${project.title}" ${nextState ? 'published' : 'moved to draft'}.`,
      });
    } catch {
      // Offline local fallback
      const nextState = !project.published;
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: nextState } : p))
      );
      setNotification({
        type: 'info',
        message: `[Offline Mode] Toggled publish state for "${project.title}".`,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setNotification({
        type: 'success',
        message: `Project "${deleteTarget.title}" deleted.`,
      });
    } catch {
      // Offline local fallback
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setNotification({
        type: 'info',
        message: `[Offline Mode] Removed project "${deleteTarget.title}" from local view.`,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newProjects = [...projects];
    const currentItem = newProjects[index];
    const targetItem = newProjects[targetIndex];

    const tempOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = tempOrder;

    newProjects[index] = targetItem;
    newProjects[targetIndex] = currentItem;

    setProjects(newProjects);

    try {
      await reorderProjects([
        { id: currentItem.id, order: currentItem.order },
        { id: targetItem.id, order: targetItem.order },
      ]);
    } catch {
      // Offline mode silent continue
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        categoryFilter === 'ALL' || project.category === categoryFilter;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [projects, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Projects Management"
        subtitle="Catalog, curate, publish, and reorder portfolio projects."
        action={
          <Button onClick={openCreateModal} size="sm" className="gap-1.5">
            <Plus size={14} /> New Project
          </Button>
        }
      />

      {/* Notifications */}
      {notification && (
        <AdminNotification
          type={notification.type}
          message={notification.message}
          onDismiss={() => setNotification(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-background-surface border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'border-accent text-accent bg-accent/10'
                : 'border-border-subtle text-foreground-muted hover:text-foreground'
            }`}
          >
            All ({projects.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border whitespace-nowrap cursor-pointer ${
                categoryFilter === cat.id
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border-subtle text-foreground-muted hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="border border-border-subtle bg-background-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between font-mono text-[11px] text-foreground-muted uppercase tracking-wider">
          <span>Catalog Records ({filteredProjects.length})</span>
          <span>Order / Status / Controls</span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-foreground-muted animate-pulse">
            LOADING PROJECT RECORDS...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FolderKanban size={28} className="mx-auto text-foreground-muted opacity-60" />
            <div className="font-mono text-xs text-foreground-muted">No projects found matching criteria.</div>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 border border-border-subtle text-foreground-muted">
                      #{project.order}
                    </span>
                    <h4 className="font-editorial text-base font-semibold text-foreground uppercase tracking-tight">
                      {project.title}
                    </h4>
                    {project.featured && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-accent/10 text-accent uppercase font-bold">
                        Featured
                      </span>
                    )}
                    <Badge variant={project.published ? 'accent' : 'outline'} className="text-[10px]">
                      {project.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-foreground-muted line-clamp-1">
                    /{project.slug} • {project.category} • {project.year}
                  </p>
                  <p className="font-mono text-[11px] text-foreground-secondary line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Order Controls */}
                  <div className="flex items-center border border-border-subtle mr-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1.5 text-foreground-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredProjects.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1.5 text-foreground-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Toggle Published */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(project)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title={project.published ? 'Unpublish' : 'Publish'}
                  >
                    {project.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Public Link */}
                  <a
                    href={`/project/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent"
                    title="View Public Route"
                  >
                    <ExternalLink size={14} />
                  </a>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(project)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(project)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-red-400 cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-2xl border border-border-subtle bg-background-surface p-6 shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-accent uppercase block">
                  Project Record Editor
                </span>
                <h3 className="font-editorial text-xl font-bold uppercase tracking-tight text-foreground">
                  {editingProject ? `Edit: ${editingProject.title}` : 'Create New Project'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-foreground-muted hover:text-foreground text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title,
                        slug: editingProject ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }));
                    }}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g. HENEOXY"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    URL Slug * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g. heneoxy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g. 2024 or ACTIVE"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Tagline / Architecture Subtitle
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="e.g. Autonomous Personal Computing & Agentic Desktop Environment"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Role / Responsibility
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="e.g. System Architect & Frontend Engineer"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Short Description (Card Summary) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Concise summary for discovery views..."
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Full Description (Detailed Narrative) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Detailed engineering overview..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="TypeScript, React, Vite, Tailwind CSS"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="Agentic Workflows, System UI"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="project-published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="project-published" className="font-mono text-xs text-foreground cursor-pointer">
                    Published (Publicly Visible)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="project-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="project-featured" className="font-mono text-xs text-foreground cursor-pointer">
                    Featured Flagship
                  </label>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-foreground-muted mb-0.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full h-8 px-2 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete Project "${deleteTarget?.title}"`}
        message={`Are you sure you want to permanently delete this project record (/${deleteTarget?.slug})? This action cannot be undone.`}
        confirmLabel="Delete Project"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
