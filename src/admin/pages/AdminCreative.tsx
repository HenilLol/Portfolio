import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Palette,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminConfirmModal } from '../components/AdminConfirmModal';
import { AdminNotification, type NotificationType } from '../components/AdminNotification';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getCreativeWorks,
  createCreativeWork,
  updateCreativeWork,
  deleteCreativeWork,
  toggleCreativePublished,
  reorderCreativeWorks,
} from '@/services/creative';
import type { CreativeWork, CreativeCategory, CreativeWorkStatus } from '@/types/models';

const CATEGORIES: Exclude<CreativeCategory, 'ALL'>[] = [
  'VIDEO',
  'MOTION',
  'GRAPHICS',
  'PHOTOGRAPHY',
  'ASTROPHOTOGRAPHY',
  'EXPERIMENTS',
];

const STATUSES: CreativeWorkStatus[] = [
  'ARCHIVE',
  'EXPERIMENT',
  'ONGOING',
  'STUDY',
  'PLACEHOLDER',
];

const ASPECT_RATIOS: ('16/9' | '4/3' | '1/1' | '9/16' | '21/9')[] = [
  '16/9',
  '4/3',
  '1/1',
  '9/16',
  '21/9',
];

export const AdminCreative: React.FC = () => {
  const [works, setWorks] = useState<CreativeWork[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<CreativeWork | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<CreativeWork | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'EXPERIMENTS' as Exclude<CreativeCategory, 'ALL'>,
    year: '2024',
    status: 'EXPERIMENT' as CreativeWorkStatus,
    medium: 'WebGL / GLSL Shader Pass',
    description: '',
    shortDescription: '',
    tools: 'GLSL, Three.js, WebGL',
    aspectRatio: '16/9' as '16/9' | '4/3' | '1/1' | '9/16' | '21/9',
    order: 1,
    featured: false,
    published: true,
  });

  const loadAllCreative = async () => {
    try {
      setLoading(true);
      const data = await getCreativeWorks({ publishedOnly: false });
      setWorks(data);
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load creative works',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCreative();
  }, []);

  const openCreateModal = () => {
    setEditingWork(null);
    const nextOrder = works.length > 0 ? Math.max(...works.map((w) => w.order)) + 1 : 1;
    setFormData({
      title: '',
      slug: '',
      category: 'EXPERIMENTS',
      year: new Date().getFullYear().toString(),
      status: 'EXPERIMENT',
      medium: 'WebGL / GLSL Shader Pass',
      description: '',
      shortDescription: '',
      tools: 'GLSL, Three.js, WebGL',
      aspectRatio: '16/9',
      order: nextOrder,
      featured: false,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (work: CreativeWork) => {
    setEditingWork(work);
    setFormData({
      title: work.title,
      slug: work.slug,
      category: work.category || 'EXPERIMENTS',
      year: work.year || '2024',
      status: work.status || 'EXPERIMENT',
      medium: work.medium || '',
      description: work.description,
      shortDescription: work.shortDescription || '',
      tools: (work.tools || []).join(', '),
      aspectRatio: work.aspectRatio || '16/9',
      order: work.order,
      featured: work.featured,
      published: work.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const slugClean = formData.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!slugClean) {
      setNotification({ type: 'error', message: 'Slug is required and must be alphanumeric.' });
      setSubmitting(false);
      return;
    }

    const toolsArr = formData.tools
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingWork) {
        const updated = await updateCreativeWork(editingWork.id, {
          title: formData.title,
          slug: slugClean,
          category: formData.category,
          year: formData.year,
          status: formData.status,
          medium: formData.medium,
          description: formData.description,
          shortDescription: formData.shortDescription,
          tools: toolsArr,
          aspectRatio: formData.aspectRatio,
          order: Number(formData.order),
          featured: formData.featured,
          published: formData.published,
        });

        setWorks((prev) =>
          prev.map((w) => (w.id === editingWork.id ? { ...w, ...updated } : w))
        );
        setNotification({
          type: 'success',
          message: `Creative study "${formData.title}" updated successfully.`,
        });
      } else {
        const created = await createCreativeWork({
          title: formData.title,
          slug: slugClean,
          category: formData.category,
          year: formData.year,
          status: formData.status,
          medium: formData.medium,
          description: formData.description,
          shortDescription: formData.shortDescription,
          tools: toolsArr,
          aspectRatio: formData.aspectRatio,
          order: Number(formData.order),
          featured: formData.featured,
          published: formData.published,
        });

        setWorks((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setNotification({
          type: 'success',
          message: `Creative study "${formData.title}" created successfully.`,
        });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      // Offline fallback
      const fallbackWork: CreativeWork = {
        id: editingWork?.id || `local-creative-${Date.now()}`,
        title: formData.title,
        slug: slugClean,
        category: formData.category,
        year: formData.year,
        status: formData.status,
        medium: formData.medium,
        description: formData.description,
        shortDescription: formData.shortDescription,
        tools: toolsArr,
        aspectRatio: formData.aspectRatio,
        order: Number(formData.order),
        featured: formData.featured,
        published: formData.published,
        createdAt: new Date().toISOString(),
      };

      if (editingWork) {
        setWorks((prev) =>
          prev.map((w) => (w.id === editingWork.id ? fallbackWork : w))
        );
      } else {
        setWorks((prev) => [...prev, fallbackWork].sort((a, b) => a.order - b.order));
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

  const handleTogglePublish = async (work: CreativeWork) => {
    const nextState = work.published === false;
    try {
      await toggleCreativePublished(work.id, nextState);
      setWorks((prev) =>
        prev.map((w) => (w.id === work.id ? { ...w, published: nextState } : w))
      );
      setNotification({
        type: 'success',
        message: `Creative work "${work.title}" ${nextState ? 'published' : 'moved to draft'}.`,
      });
    } catch {
      setWorks((prev) =>
        prev.map((w) => (w.id === work.id ? { ...w, published: nextState } : w))
      );
      setNotification({
        type: 'info',
        message: `[Offline Mode] Toggled publish state for "${work.title}".`,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCreativeWork(deleteTarget.id);
      setWorks((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setNotification({
        type: 'success',
        message: `Creative study "${deleteTarget.title}" deleted.`,
      });
    } catch {
      setWorks((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setNotification({
        type: 'info',
        message: `[Offline Mode] Removed "${deleteTarget.title}" from local view.`,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= works.length) return;

    const newWorks = [...works];
    const currentItem = newWorks[index];
    const targetItem = newWorks[targetIndex];

    const tempOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = tempOrder;

    newWorks[index] = targetItem;
    newWorks[targetIndex] = currentItem;

    setWorks(newWorks);

    try {
      await reorderCreativeWorks([
        { id: currentItem.id, order: currentItem.order },
        { id: targetItem.id, order: targetItem.order },
      ]);
    } catch {
      // Offline mode silent continue
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Creative Lab Works"
        subtitle="Manage visual research, shaders, astrophotography, and generative experiments."
        action={
          <Button onClick={openCreateModal} size="sm" className="gap-1.5">
            <Plus size={14} /> New Creative Work
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

      {/* Creative Works List */}
      <div className="border border-border-subtle bg-background-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between font-mono text-[11px] text-foreground-muted uppercase tracking-wider">
          <span>Creative Lab Archive ({works.length})</span>
          <span>Order / Discipline / Controls</span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-foreground-muted animate-pulse">
            LOADING CREATIVE LAB WORKS...
          </div>
        ) : works.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Palette size={28} className="mx-auto text-foreground-muted opacity-60" />
            <div className="font-mono text-xs text-foreground-muted">No creative works found.</div>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {works.map((work, index) => (
              <div
                key={work.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 border border-border-subtle text-foreground-muted">
                      #{work.order}
                    </span>
                    <h4 className="font-editorial text-base font-semibold text-foreground uppercase tracking-tight">
                      {work.title}
                    </h4>
                    {work.category && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 border border-accent/40 text-accent uppercase font-bold">
                        {work.category}
                      </span>
                    )}
                    {work.status && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 text-foreground-secondary uppercase">
                        {work.status}
                      </span>
                    )}
                    <Badge variant={work.published !== false ? 'accent' : 'outline'} className="text-[10px]">
                      {work.published !== false ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-foreground-muted">
                    /{work.slug} • {work.medium} • {work.year}
                  </p>
                  <p className="font-mono text-[11px] text-foreground-secondary line-clamp-1">
                    {work.shortDescription || work.description}
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
                      disabled={index === works.length - 1}
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
                    onClick={() => handleTogglePublish(work)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title={work.published !== false ? 'Unpublish' : 'Publish'}
                  >
                    {work.published !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(work)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(work)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-red-400 cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-xl border border-border-subtle bg-background-surface p-6 shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-accent uppercase block">
                  Creative Lab Editor
                </span>
                <h3 className="font-editorial text-xl font-bold uppercase tracking-tight text-foreground">
                  {editingWork ? `Edit: ${editingWork.title}` : 'New Creative Study'}
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
                    Study Title *
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
                        slug: editingWork ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      }));
                    }}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="e.g. Chromatic Wave Dispersion"
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
                    placeholder="chromatic-wave-dispersion"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Discipline / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
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
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Medium / Technique *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="WebGL / GLSL Shader Pass"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  >
                    {ASPECT_RATIOS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Short Description (Card Teaser)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="GPU ray dispersion shader pass simulating optical prism phenomena."
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Full Technical Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Real-time simulation details and algorithms..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Tools (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="GLSL, Three.js, WebGL"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="creative-published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="creative-published" className="font-mono text-xs text-foreground cursor-pointer">
                    Published (Visible in Creative Lab)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="creative-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="creative-featured" className="font-mono text-xs text-foreground cursor-pointer">
                    Featured Visual
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? 'Saving...' : editingWork ? 'Save Changes' : 'Create Study'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete Study "${deleteTarget?.title}"`}
        message={`Are you sure you want to delete the creative study "${deleteTarget?.title}" (/${deleteTarget?.slug})?`}
        confirmLabel="Delete Study"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
