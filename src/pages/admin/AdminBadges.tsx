import React, { useState } from 'react';
import { Award, Save, CheckCircle2, Plus, X, Trash2, Zap, Trophy, ShieldCheck, Clock, Flame, Medal } from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DEFAULT_BADGES } from '../../data/badges';
import { Badge, BadgeTriggerType, Language } from '../../types';
import { supabase } from '../../lib/supabase';

export const AdminBadges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [selectedBadge, setSelectedBadge] = useState<Badge>(DEFAULT_BADGES[0]);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newBadgeForm, setNewBadgeForm] = useState({
    name: '',
    description: '',
    icon_name: 'Award',
    trigger_type: 'wpm_threshold',
    trigger_value: 50,
    trigger_language: '',
  });

  const handleUpdate = (field: keyof Badge, val: any) => {
    setSelectedBadge((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    setBadges((prev) =>
      prev.map((b) => (b.id === selectedBadge.id ? selectedBadge : b))
    );

    if (supabase) {
      try {
        await supabase
          .from('badges')
          .upsert([
            {
              id: selectedBadge.id,
              name: selectedBadge.name,
              description: selectedBadge.description,
              icon_name: selectedBadge.icon_name,
              trigger_type: selectedBadge.trigger_type,
              trigger_value: selectedBadge.trigger_value,
              trigger_language: selectedBadge.trigger_language || null,
            },
          ]);
      } catch (err) {
        console.warn('Failed to upsert badge in Supabase', err);
      }
    }

    setSavedSuccess(`Badge "${selectedBadge.name}" updated!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  const handleCreateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeForm.name.trim() || !newBadgeForm.description.trim()) return;

    const newBadge: Badge = {
      id: 'badge-' + Date.now().toString(36),
      name: newBadgeForm.name.trim(),
      description: newBadgeForm.description.trim(),
      icon_name: newBadgeForm.icon_name,
      trigger_type: newBadgeForm.trigger_type as BadgeTriggerType,
      trigger_value: Number(newBadgeForm.trigger_value),
      trigger_language: newBadgeForm.trigger_language ? (newBadgeForm.trigger_language as Language) : null,
    };

    setBadges((prev) => [newBadge, ...prev]);
    setSelectedBadge(newBadge);

    if (supabase) {
      try {
        await supabase.from('badges').insert([
          {
            id: newBadge.id,
            name: newBadge.name,
            description: newBadge.description,
            icon_name: newBadge.icon_name,
            trigger_type: newBadge.trigger_type,
            trigger_value: newBadge.trigger_value,
            trigger_language: newBadge.trigger_language || null,
          },
        ]);
      } catch (err) {
        console.warn('Failed to insert new badge in Supabase', err);
      }
    }

    setIsAddModalOpen(false);
    setNewBadgeForm({
      name: '',
      description: '',
      icon_name: 'Award',
      trigger_type: 'wpm_threshold',
      trigger_value: 50,
      trigger_language: '',
    });
    setSavedSuccess(`Badge "${newBadge.name}" created!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  return (
    <PageWrapper maxWidth="wide">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-7 h-7 text-amber-500" />
                Badge &amp; Milestone Manager
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure trigger conditions, milestone thresholds, and gamification rewards.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Badge
            </Button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List */}
            <div className="lg:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {badges.map((b) => {
                const isSelected = b.id === selectedBadge.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBadge(b)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 font-bold text-amber-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold">{b.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{b.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {b.trigger_type.split('_')[0]} ({b.trigger_value})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Editor */}
            <div className="lg:col-span-7">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Edit Badge: {selectedBadge.name}</h3>
                    <p className="text-[11px] font-mono text-slate-400">ID: {selectedBadge.id}</p>
                  </div>
                  <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
                    Save Badge
                  </Button>
                </div>

                <Input
                  label="Badge Name"
                  value={selectedBadge.name}
                  onChange={(e) => handleUpdate('name', e.target.value)}
                />

                <Input
                  label="Description"
                  value={selectedBadge.description}
                  onChange={(e) => handleUpdate('description', e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Trigger Type
                    </label>
                    <select
                      value={selectedBadge.trigger_type}
                      onChange={(e) => handleUpdate('trigger_type', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="wpm_threshold">WPM Threshold</option>
                      <option value="lesson_complete_all">Lessons Completed</option>
                      <option value="accuracy_threshold">Accuracy Threshold</option>
                      <option value="streak_days">Streak Days</option>
                      <option value="tests_count">Tests Taken Count</option>
                    </select>
                  </div>

                  <Input
                    label="Trigger Value"
                    type="number"
                    value={selectedBadge.trigger_value}
                    onChange={(e) => handleUpdate('trigger_value', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Icon Identifier
                  </label>
                  <select
                    value={selectedBadge.icon_name}
                    onChange={(e) => handleUpdate('icon_name', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Award">Award</option>
                    <option value="Trophy">Trophy</option>
                    <option value="Zap">Zap</option>
                    <option value="Flame">Flame</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="Clock">Clock</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Target">Target</option>
                  </select>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ADD NEW BADGE MODAL */}
      {isAddModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: 'none' }}
            onClick={() => setIsAddModalOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-2xl max-w-md w-[90vw] p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Badge</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBadge} className="space-y-4 text-xs">
              <Input
                label="Badge Name"
                placeholder="e.g. Master Typist"
                value={newBadgeForm.name}
                onChange={(e) => setNewBadgeForm({ ...newBadgeForm, name: e.target.value })}
                required
              />

              <Input
                label="Description"
                placeholder="e.g. Achieve 100 WPM on any typing test"
                value={newBadgeForm.description}
                onChange={(e) => setNewBadgeForm({ ...newBadgeForm, description: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trigger Type</label>
                  <select
                    value={newBadgeForm.trigger_type}
                    onChange={(e) => setNewBadgeForm({ ...newBadgeForm, trigger_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="wpm_threshold">WPM Threshold</option>
                    <option value="lesson_complete_all">Lessons Completed</option>
                    <option value="accuracy_threshold">Accuracy Threshold</option>
                    <option value="streak_days">Streak Days</option>
                    <option value="tests_count">Tests Taken Count</option>
                  </select>
                </div>

                <Input
                  label="Trigger Value"
                  type="number"
                  value={newBadgeForm.trigger_value}
                  onChange={(e) => setNewBadgeForm({ ...newBadgeForm, trigger_value: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Badge Icon</label>
                <select
                  value={newBadgeForm.icon_name}
                  onChange={(e) => setNewBadgeForm({ ...newBadgeForm, icon_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Award">Award</option>
                  <option value="Trophy">Trophy</option>
                  <option value="Zap">Zap</option>
                  <option value="Flame">Flame</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Clock">Clock</option>
                  <option value="Sparkles">Sparkles</option>
                  <option value="Target">Target</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Create Badge
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </PageWrapper>
  );
};
