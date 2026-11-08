import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, AlertOctagon, Megaphone } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

export const AdminSettings: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcementText, setAnnouncementText] = useState(
    'Welcome to Inspire Typing! Bilingual Urdu & English typing lessons are completely free.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = async () => {
    if (supabase) {
      try {
        await supabase.from('site_settings').upsert([
          { key: 'maintenance_mode', value: String(maintenanceMode), updated_at: new Date().toISOString() },
          { key: 'announcement_text', value: announcementText, updated_at: new Date().toISOString() },
        ]);
      } catch (err) {
        console.warn('Failed to save to Supabase site_settings', err);
      }
    }

    try {
      localStorage.setItem(
        'inspire_site_settings',
        JSON.stringify({ maintenanceMode, announcementText })
      );
    } catch {
      // Ignore
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageWrapper maxWidth="wide">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Settings className="w-7 h-7 text-slate-700" />
              Platform Site Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure platform availability, global notifications, and maintenance mode status.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Platform site settings saved successfully!</span>
            </div>
          )}

          <Card className="p-6 space-y-6">
            {/* Maintenance Mode Toggle */}
            <div className="flex items-start justify-between pb-6 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Maintenance Mode</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    When enabled, guest users see a maintenance banner while administrators retain full access.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Announcement Banner Text */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Global Announcement Banner Text
                </label>
              </div>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Broadcast a message across all user pages..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                This announcement text is shown at the top of public lesson and test pages.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                icon={<Save className="w-4 h-4" />}
                onClick={handleSaveSettings}
              >
                Save Site Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};
