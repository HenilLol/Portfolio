import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
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
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  toggleSkillPublished,
  reorderSkills,
} from '@/services/skills';
import type { Skill } from '@/types/models';

type SkillCategory = Skill['category'];
type SkillCluster = NonNullable<Skill['cluster']>;
type SkillStatus = NonNullable<Skill['status']>;

const CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'creative-coding', label: 'Creative Coding' },
  { id: 'backend', label: 'Backend' },
  { id: 'tooling', label: 'Tooling' },
  { id: 'architecture', label: 'Architecture' },
];

const CLUSTERS: SkillCluster[] = ['CORE', 'WEB', 'CREATIVE', 'AI', 'SYSTEMS'];
const STATUSES: SkillStatus[] = ['USING', 'LEARNING', 'EXPLORING', 'FAMILIAR'];

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification state
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend' as SkillCategory,
    cluster: 'CORE' as SkillCluster,
    status: 'USING' as SkillStatus,
    description: '',
    proficiency: 90,
    order: 1,
    featured: false,
    published: true,
  });

  const loadAllSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills({ publishedOnly: false });
      setSkills(data);
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to load skills',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    const nextOrder = skills.length > 0 ? Math.max(...skills.map((s) => s.order)) + 1 : 1;
    setFormData({
      name: '',
      category: 'frontend',
      cluster: 'CORE',
      status: 'USING',
      description: '',
      proficiency: 90,
      order: nextOrder,
      featured: false,
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      cluster: skill.cluster || 'CORE',
      status: skill.status || 'USING',
      description: skill.description || '',
      proficiency: skill.proficiency ?? 90,
      order: skill.order,
      featured: skill.featured,
      published: skill.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    try {
      if (editingSkill) {
        const updated = await updateSkill(editingSkill.id, {
          name: formData.name,
          category: formData.category,
          cluster: formData.cluster,
          status: formData.status,
          description: formData.description,
          proficiency: Number(formData.proficiency),
          order: Number(formData.order),
          featured: formData.featured,
          published: formData.published,
        });

        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? { ...s, ...updated } : s))
        );
        setNotification({
          type: 'success',
          message: `Skill "${formData.name}" updated successfully.`,
        });
      } else {
        const created = await createSkill({
          name: formData.name,
          category: formData.category,
          cluster: formData.cluster,
          status: formData.status,
          description: formData.description,
          proficiency: Number(formData.proficiency),
          order: Number(formData.order),
          featured: formData.featured,
          published: formData.published,
        });

        setSkills((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        setNotification({
          type: 'success',
          message: `Skill "${formData.name}" created successfully.`,
        });
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      // Offline fallback
      const fallbackSkill: Skill = {
        id: editingSkill?.id || `local-skill-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        cluster: formData.cluster,
        status: formData.status,
        description: formData.description,
        proficiency: Number(formData.proficiency),
        order: Number(formData.order),
        featured: formData.featured,
        published: formData.published,
        createdAt: new Date().toISOString(),
      };

      if (editingSkill) {
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkill.id ? fallbackSkill : s))
        );
      } else {
        setSkills((prev) => [...prev, fallbackSkill].sort((a, b) => a.order - b.order));
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

  const handleTogglePublish = async (skill: Skill) => {
    const nextState = skill.published === false;
    try {
      await toggleSkillPublished(skill.id, nextState);
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, published: nextState } : s))
      );
      setNotification({
        type: 'success',
        message: `Skill "${skill.name}" ${nextState ? 'published' : 'moved to draft'}.`,
      });
    } catch {
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, published: nextState } : s))
      );
      setNotification({
        type: 'info',
        message: `[Offline Mode] Toggled publish state for "${skill.name}".`,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSkill(deleteTarget.id);
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setNotification({
        type: 'success',
        message: `Skill "${deleteTarget.name}" deleted.`,
      });
    } catch {
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setNotification({
        type: 'info',
        message: `[Offline Mode] Removed "${deleteTarget.name}" from local view.`,
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= skills.length) return;

    const newSkills = [...skills];
    const currentItem = newSkills[index];
    const targetItem = newSkills[targetIndex];

    const tempOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = tempOrder;

    newSkills[index] = targetItem;
    newSkills[targetIndex] = currentItem;

    setSkills(newSkills);

    try {
      await reorderSkills([
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
        title="Technical Skills"
        subtitle="Manage competency clusters, technology status, and knowledge graphs."
        action={
          <Button onClick={openCreateModal} size="sm" className="gap-1.5">
            <Plus size={14} /> Add Skill
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

      {/* Skills List */}
      <div className="border border-border-subtle bg-background-surface overflow-hidden">
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between font-mono text-[11px] text-foreground-muted uppercase tracking-wider">
          <span>Registered Skills ({skills.length})</span>
          <span>Order / Cluster / Controls</span>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-xs text-foreground-muted animate-pulse">
            LOADING TECHNICAL SKILLS...
          </div>
        ) : skills.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Sparkles size={28} className="mx-auto text-foreground-muted opacity-60" />
            <div className="font-mono text-xs text-foreground-muted">No skills found.</div>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 border border-border-subtle text-foreground-muted">
                      #{skill.order}
                    </span>
                    <h4 className="font-editorial text-base font-semibold text-foreground uppercase tracking-tight">
                      {skill.name}
                    </h4>
                    {skill.cluster && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 border border-accent/40 text-accent uppercase font-bold">
                        {skill.cluster}
                      </span>
                    )}
                    {skill.status && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white/5 text-foreground-secondary uppercase">
                        {skill.status}
                      </span>
                    )}
                    <Badge variant={skill.published !== false ? 'accent' : 'outline'} className="text-[10px]">
                      {skill.published !== false ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  <p className="font-mono text-xs text-foreground-muted">
                    {skill.category} {skill.proficiency ? `• Proficiency: ${skill.proficiency}%` : ''}
                  </p>
                  {skill.description && (
                    <p className="font-mono text-[11px] text-foreground-secondary line-clamp-1">
                      {skill.description}
                    </p>
                  )}
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
                      disabled={index === skills.length - 1}
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
                    onClick={() => handleTogglePublish(skill)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title={skill.published !== false ? 'Unpublish' : 'Publish'}
                  >
                    {skill.published !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 border border-border-subtle text-foreground-secondary hover:text-accent cursor-pointer"
                    title="Edit Record"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(skill)}
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
        title={editingSkill ? `Edit: ${editingSkill.name}` : 'Register New Skill'}
        subtitle="Technical Skill Editor"
        maxWidthClass="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="e.g. React / TypeScript"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
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
                    Cluster *
                  </label>
                  <select
                    value={formData.cluster}
                    onChange={(e) => setFormData({ ...formData, cluster: e.target.value as SkillCluster })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  >
                    {CLUSTERS.map((c) => (
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SkillStatus })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Description / Focus Area
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  placeholder="Component architecture, scalable type systems, and custom hooks..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                    Proficiency (0 - 100%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                    className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground"
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
                    id="skill-published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="skill-published" className="font-mono text-xs text-foreground cursor-pointer">
                    Published (Visible in Skills Graph)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="skill-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-cyan-400"
                  />
                  <label htmlFor="skill-featured" className="font-mono text-xs text-foreground cursor-pointer">
                    Featured Focus
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? 'Saving...' : editingSkill ? 'Save Changes' : 'Register Skill'}
                </Button>
              </div>
            </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={`Delete Skill "${deleteTarget?.name}"`}
        message={`Are you sure you want to remove the skill "${deleteTarget?.name}" from the technical knowledge graph?`}
        confirmLabel="Delete Skill"
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
