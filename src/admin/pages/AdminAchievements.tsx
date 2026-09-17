import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Award,
  Eye,
  EyeOff,
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';
import { AdminNotification, type NotificationType } from '../components/AdminNotification';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleAchievementPublished,
  reorderAchievements,
} from '@/services/achievements';
import type { Achievement } from '@/types/models';

export const AdminAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: new Date().getFullYear(),
    description: '',
    credentialUrl: '',
    order: 1,
    published: true,
  });

  const loadAllAchievements = async () => {
    try {
      setLoading(true);
      const data = await getAchievements({ publishedOnly: false });
      setAchievements(data);
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load achievements',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAchievements();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    const nextOrder = achievements.length > 0 ? Math.max(...achievements.map((a) => a.order)) + 1 : 1;
    setFormData({
      title: '',
      issuer: 'System Architecture',
      year: new Date().getFullYear(),
      description: '',
      credentialUrl: '',
      order: nextOrder,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Achievement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      issuer: item.issuer,
      year: item.year,
      description: item.description,
      credentialUrl: item.credentialUrl || '',
      order: item.order,
      published: item.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      if (editingItem) {
        const updated = await updateAchievement(editingItem.id, {
          title: formData.title,
          issuer: formData.issuer,
          year: Number(formData.year),
          description: formData.description,
          credentialUrl: formData.credentialUrl || undefined,
          order: Number(formData.order),
          published: formData.published,
        });

        setAchievements((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...updated } : item))
        );
        setNotification({
          type: 'success',
          message: `Achievement "${formData.title}" updated successfully.`,
        });
      } else {
        const created = await createAchievement({
          title: formData.title,
          issuer: formData.issuer,
          year: Number(formData.year),
          description: formData.description,
          credentialUrl: formData.credentialUrl || undefined,
          order: Number(formData.order),
          published: formData.published,
        });

        setAchievements((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setNotification({
          type: 'success',
          message: `Achievement "${formData.title}" created successfully.`,
        });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      // Offline fallback
      const fallbackItem: Achievement = {
        id: editingItem?.id || `local-ach-${Date.now()}`,
        title: formData.title,
        issuer: formData.issuer,
        year: Number(formData.year),
        description: formData.description,
        credentialUrl: formData.credentialUrl || undefined,
        order: Number(formData.order),
        published: formData.published,
        createdAt: new Date().toISOString(),
      };

      if (editingItem) {
        setAchievements((prev) =>
          prev.map((item) => (item.id === editingItem.id ? fallbackItem : item))
        );
      } else {
        setAchievements((prev) => [...prev, fallbackItem].sort((a, b) => a.order - b.order));
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

  const handleTogglePublish = async (item: Achievement) => {
    const nextState = item.published === false;
    try {
      await toggleAchievementPublished(item.id, nextState);
      setAchievements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, published: nextState } : a))
      );
      setNotification({
        type: 'success',
        message: `Achievement "${item.title}" ${nextState ? 'published' : 'moved to draft'}.`,
      });
    } catch {
      setAchievements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, published: nextState } : a))
      );
      setNotification({
        type: 'info',
        message: `[Offline Mode] Toggled publish state for "${item.title}".`,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAchievement(deleteTarget.id);
      setAchievements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setNotification({
        type: 'success',
        message: `Achievement "${deleteTarget.title}" deleted.`,
      });
    } catch {
      setAchievements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
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
    if (targetIndex < 0 || targetIndex >= achievements.length) return;

    const newItems = [...achievements];
    const currentItem = newItems[index];
    const targetItem = newItems[targetIndex];

    const tempOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = tempOrder;

    newItems[index] = targetItem;
    newItems[targetIndex] = currentItem;

    setAchievements(newItems);

    try {
      await reorderAchievements([
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
        title="Achievements & Milestones"
        subtitle="Manage verified awards, architectural achievements, and certifications."
        action={
          <Button onClick={openCreateModal} size="sm" className="gap-1.5">
            <Plus size={14} /> Add Achievement
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

      {/* Achievements List */}
      <div className="border border-border-subtle bg-background-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between font-mono text-[11px] text-foreground-muted uppercase tracking-wider">
          <span>Verified Achievements ({achievements.length})</span>
          <span>Order / Year / Controls</span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-foreground-muted animate-pulse">
            LOADING ACHIEVEMENTS...
          </div>
        ) : achievements.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Award size={28} className="mx-auto text-foreground-muted opacity-60" />
            <div className="font-mono text-xs text-foreground-muted">No achievements registered.</div>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {achievements.map((item, index) => (
              <div
                key={item.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 border border-border-subtle text-foreground-muted">
                      #{item.order}
                    </span>
                    <h4 className="font-editorial text-base font-semibold text-foreground uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 border border-accent/40 text-accent uppercase font-bold">
                      {item.year}
                    </span>
                    <Badge variant={item.published !== false ? 'accent' : 'outline'} className="text-[10px]">
                      {item.published !== false ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-foreground-muted">
                    Issued by: {item.issuer}
                  </p>
                  <p className="font-mono text-[11px] text-foreground-secondary line-clamp-2">
                    {item.description}
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
                      disabled={index === achievements.length - 1}
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
                    onClick={() => handleTogglePublish(item)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title={item.published !== false ? 'Unpublish' : 'Publish'}
                  >
                    {item.published !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
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
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit: ${editingItem.title}` : 'Add Achievement Entry'}
        subtitle="Achievement Editor"
        maxWidthClass="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Digital Experience Foundation"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Issuer / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                    placeholder="System Architecture"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
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
                  placeholder="Details and context of the recognition or milestone..."
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Credential / Verification Link
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ach-published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="ach-published" className="font-mono text-xs text-foreground cursor-pointer">
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
                  {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Entry'}
                </Button>
              </div>
            </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete Achievement "${deleteTarget?.title}"`}
        message={`Are you sure you want to remove the achievement "${deleteTarget?.title}"?`}
        confirmLabel="Delete Achievement"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
