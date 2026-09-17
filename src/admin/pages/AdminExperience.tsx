import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Briefcase,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminConfirmModal } from '../components/AdminConfirmModal';
import { AdminNotification, type NotificationType } from '../components/AdminNotification';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  toggleExperiencePublished,
  reorderExperiences,
} from '@/services/experience';
import type { Experience } from '@/types/models';

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    location: '',
    startDate: '2023-01-01',
    endDate: '',
    current: true,
    description: '',
    highlights: '',
    technologies: '',
    order: 1,
    published: true,
  });

  const loadAllExperiences = async () => {
    try {
      setLoading(true);
      const data = await getExperiences({ publishedOnly: false });
      setExperiences(data);
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load experiences',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    const nextOrder = experiences.length > 0 ? Math.max(...experiences.map((e) => e.order)) + 1 : 1;
    setFormData({
      role: '',
      company: '',
      location: 'Remote',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      current: true,
      description: '',
      highlights: 'Scalable frontend architecture\nDeterministic workflows',
      technologies: 'React, TypeScript, Three.js',
      order: nextOrder,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      role: exp.role,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      current: exp.current,
      description: exp.description,
      highlights: (exp.highlights || []).join('\n'),
      technologies: (exp.technologies || []).join(', '),
      order: exp.order,
      published: exp.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const highlightsArr = formData.highlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const techArr = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingExp) {
        const updated = await updateExperience(editingExp.id, {
          role: formData.role,
          company: formData.company,
          location: formData.location,
          startDate: formData.startDate,
          endDate: formData.current ? undefined : formData.endDate || undefined,
          current: formData.current,
          description: formData.description,
          highlights: highlightsArr,
          technologies: techArr,
          order: Number(formData.order),
          published: formData.published,
        });

        setExperiences((prev) =>
          prev.map((item) => (item.id === editingExp.id ? { ...item, ...updated } : item))
        );
        setNotification({
          type: 'success',
          message: `Experience at "${formData.company}" updated successfully.`,
        });
      } else {
        const created = await createExperience({
          role: formData.role,
          company: formData.company,
          location: formData.location,
          startDate: formData.startDate,
          endDate: formData.current ? undefined : formData.endDate || undefined,
          current: formData.current,
          description: formData.description,
          highlights: highlightsArr,
          technologies: techArr,
          order: Number(formData.order),
          published: formData.published,
        });

        setExperiences((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setNotification({
          type: 'success',
          message: `Experience at "${formData.company}" created successfully.`,
        });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      // Offline fallback state update
      const fallbackExp: Experience = {
        id: editingExp?.id || `local-exp-${Date.now()}`,
        role: formData.role,
        company: formData.company,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.current ? undefined : formData.endDate || undefined,
        current: formData.current,
        description: formData.description,
        highlights: highlightsArr,
        technologies: techArr,
        order: Number(formData.order),
        published: formData.published,
        createdAt: new Date().toISOString(),
      };

      if (editingExp) {
        setExperiences((prev) =>
          prev.map((item) => (item.id === editingExp.id ? fallbackExp : item))
        );
      } else {
        setExperiences((prev) => [...prev, fallbackExp].sort((a, b) => a.order - b.order));
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

  const handleTogglePublish = async (exp: Experience) => {
    const nextState = exp.published === false;
    try {
      await toggleExperiencePublished(exp.id, nextState);
      setExperiences((prev) =>
        prev.map((item) => (item.id === exp.id ? { ...item, published: nextState } : item))
      );
      setNotification({
        type: 'success',
        message: `Experience at "${exp.company}" ${nextState ? 'published' : 'moved to draft'}.`,
      });
    } catch {
      setExperiences((prev) =>
        prev.map((item) => (item.id === exp.id ? { ...item, published: nextState } : item))
      );
      setNotification({
        type: 'info',
        message: `[Offline Mode] Toggled publish state for "${exp.company}".`,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExperience(deleteTarget.id);
      setExperiences((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setNotification({
        type: 'success',
        message: `Experience record at "${deleteTarget.company}" deleted.`,
      });
    } catch {
      setExperiences((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setNotification({
        type: 'info',
        message: `[Offline Mode] Removed "${deleteTarget.company}" from local view.`,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const newExps = [...experiences];
    const currentItem = newExps[index];
    const targetItem = newExps[targetIndex];

    const tempOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = tempOrder;

    newExps[index] = targetItem;
    newExps[targetIndex] = currentItem;

    setExperiences(newExps);

    try {
      await reorderExperiences([
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
        title="Experience Milestones"
        subtitle="Manage career history, organizations, roles, and highlights."
        action={
          <Button onClick={openCreateModal} size="sm" className="gap-1.5">
            <Plus size={14} /> Add Experience
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

      {/* Experience List */}
      <div className="border border-border-subtle bg-background-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between font-mono text-[11px] text-foreground-muted uppercase tracking-wider">
          <span>Positions & Roles ({experiences.length})</span>
          <span>Order / Status / Controls</span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-foreground-muted animate-pulse">
            LOADING EXPERIENCE ENTRIES...
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Briefcase size={28} className="mx-auto text-foreground-muted opacity-60" />
            <div className="font-mono text-xs text-foreground-muted">No experience entries found.</div>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 border border-border-subtle text-foreground-muted">
                      #{exp.order}
                    </span>
                    <h4 className="font-editorial text-base font-semibold text-foreground uppercase tracking-tight">
                      {exp.role}
                    </h4>
                    <span className="font-mono text-xs text-accent">@ {exp.company}</span>
                    {exp.current && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 uppercase font-bold">
                        Present
                      </span>
                    )}
                    <Badge variant={exp.published !== false ? 'accent' : 'outline'} className="text-[10px]">
                      {exp.published !== false ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-foreground-muted">
                    {exp.location} • {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'N/A'}
                  </p>
                  <p className="font-mono text-[11px] text-foreground-secondary line-clamp-2">
                    {exp.description}
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
                      disabled={index === experiences.length - 1}
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
                    onClick={() => handleTogglePublish(exp)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title={exp.published !== false ? 'Unpublish' : 'Publish'}
                  >
                    {exp.published !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(exp)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(exp)}
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
                  Experience Editor
                </span>
                <h3 className="font-editorial text-xl font-bold uppercase tracking-tight text-foreground">
                  {editingExp ? `Edit: ${editingExp.company}` : 'Add Experience Entry'}
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
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="Creative Developer & Architect"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Company / Practice *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="Independent Practice"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="Remote / India"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={formData.current}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="exp-current"
                  checked={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                  className="accent-cyan-400"
                />
                <label htmlFor="exp-current" className="font-mono text-xs text-foreground cursor-pointer">
                  Current Position (Ongoing)
                </label>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Summary of responsibilities and impact..."
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Key Highlights (One per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Scalable frontend architecture&#10;Deterministic state machines"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="React, TypeScript, Three.js"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="exp-published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="exp-published" className="font-mono text-xs text-foreground cursor-pointer">
                    Published (Publicly Visible)
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
                  {submitting ? 'Saving...' : editingExp ? 'Save Changes' : 'Create Entry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete Experience at "${deleteTarget?.company}"`}
        message={`Are you sure you want to delete the role "${deleteTarget?.role}" at ${deleteTarget?.company}?`}
        confirmLabel="Delete Experience"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
