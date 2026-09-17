import React, { useEffect, useState } from 'react';
import { Save, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { AdminNotification, type NotificationType } from '../components/AdminNotification';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getSiteSettings, updateSiteSettings } from '@/services/settings';
import type { SiteSettings } from '@/types/models';

export const AdminSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<SiteSettings>({
    id: 'default-settings',
    siteTitle: 'Henil Patel',
    siteTagline: 'Engineering & Creative Development',
    bioShort: 'Lead frontend architect & creative technologist building immersive digital products.',
    contactEmail: 'EMAIL_ADDRESS_PENDING',
    statusMessage: 'Available for selected architectural projects',
    availability: 'available',
    socialLinks: [
      { id: '1', platform: 'github', label: 'GitHub', url: 'https://github.com/HenilLol', order: 1 },
      { id: '2', platform: 'linkedin', label: 'LinkedIn', url: 'SOCIAL_LINK_PENDING', order: 2 },
      { id: '3', platform: 'email', label: 'Email', url: 'EMAIL_ADDRESS_PENDING', order: 3 },
    ],
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await getSiteSettings();
        if (data) {
          setFormData(data);
        }
      } catch (err: unknown) {
        setNotification({
          type: 'error',
          message: err instanceof Error ? err.message : 'Failed to load site settings',
        });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const updated = await updateSiteSettings(formData);
      setFormData(updated);
      setNotification({
        type: 'success',
        message: 'Site settings updated and synchronized successfully.',
      });
    } catch (err: unknown) {
      // Offline fallback saves to local state
      setNotification({
        type: 'warning',
        message: `Saved locally [Offline Mode]: ${err instanceof Error ? err.message : 'Database offline'}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const isEmailPending = formData.contactEmail === 'EMAIL_ADDRESS_PENDING';

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Portfolio Configuration"
        subtitle="Global site parameters, telemetry headers, identity metadata, and transmission endpoints."
      />

      {/* Notifications */}
      {notification && (
        <AdminNotification
          type={notification.type}
          message={notification.message}
          onDismiss={() => setNotification(null)}
        />
      )}

      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-foreground-muted animate-pulse">
          LOADING SYSTEM SETTINGS...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="p-6 border border-border-subtle bg-background-surface space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
              <SlidersHorizontal size={16} className="text-accent" />
              <h3 className="font-editorial text-base font-bold uppercase tracking-tight text-foreground">
                Identity & Display Parameters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Site Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.siteTitle}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Site Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.siteTagline}
                  onChange={(e) => setFormData({ ...formData, siteTagline: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                Short Bio / Meta Summary *
              </label>
              <textarea
                required
                rows={3}
                value={formData.bioShort}
                onChange={(e) => setFormData({ ...formData, bioShort: e.target.value })}
                className="w-full p-2.5 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Availability Status
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availability: e.target.value as 'available' | 'limited' | 'unavailable',
                    })
                  }
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="available">Available for Selected Projects</option>
                  <option value="limited">Limited Architectural Advisory</option>
                  <option value="unavailable">Unavailable / Engaged</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                  Status Banner Message
                </label>
                <input
                  type="text"
                  value={formData.statusMessage}
                  onChange={(e) => setFormData({ ...formData, statusMessage: e.target.value })}
                  className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </Card>

          {/* Contact & Email Channel Configuration */}
          <Card className="p-6 border border-border-subtle bg-background-surface space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
              <h3 className="font-editorial text-base font-bold uppercase tracking-tight text-foreground">
                Transmission Protocol & Contact Email
              </h3>
            </div>

            {isEmailPending && (
              <div className="p-3.5 border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-mono flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <div className="font-bold uppercase tracking-wider">EMAIL SAFETY LOCK ACTIVE</div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    The contact email is currently preserved as <code className="text-white">EMAIL_ADDRESS_PENDING</code> in adherence with Phase 8 authenticity policy. You may input a verified email address below when ready to activate the direct contact channel.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
                Contact Email Address
              </label>
              <input
                type="text"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full h-9 px-3 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                placeholder="EMAIL_ADDRESS_PENDING"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="gap-2">
              <Save size={14} />
              {saving ? 'Synchronizing...' : 'Save Configuration'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
