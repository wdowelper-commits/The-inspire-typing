import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Search,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Input } from '../../components/ui/Input';
import { ENGLISH_LESSONS } from '../../data/englishLessons';
import { URDU_PHONETIC_LESSONS } from '../../data/urduPhoneticLessons';
import { URDU_STANDARD_LESSONS } from '../../data/urduStandardLessons';
import { Language, LessonBundle } from '../../types';
import { supabase } from '../../lib/supabase';

export const AdminLessons: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<Language>('english');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Lesson datasets in state
  const [englishLessons, setEnglishLessons] = useState<LessonBundle[]>(ENGLISH_LESSONS);
  const [urduPhoneticLessons, setUrduPhoneticLessons] = useState<LessonBundle[]>(URDU_PHONETIC_LESSONS);
  const [urduStandardLessons, setUrduStandardLessons] = useState<LessonBundle[]>(URDU_STANDARD_LESSONS);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<LessonBundle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LessonBundle | null>(null);

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    language: 'english' as Language,
    lesson_number: 1,
    sub_lesson_number: 1,
    title: '',
    description: '',
    content: '',
  });

  const getListByLang = (l: Language) => {
    switch (l) {
      case 'urdu-phonetic':
        return urduPhoneticLessons;
      case 'urdu-standard':
        return urduStandardLessons;
      default:
        return englishLessons;
    }
  };

  const setListByLang = (l: Language, updater: (prev: LessonBundle[]) => LessonBundle[]) => {
    if (l === 'urdu-phonetic') setUrduPhoneticLessons(updater);
    else if (l === 'urdu-standard') setUrduStandardLessons(updater);
    else setEnglishLessons(updater);
  };

  const currentList = getListByLang(selectedLang);

  const filteredLessons = useMemo(() => {
    return currentList.filter(
      (b) =>
        b.lesson.title.toLowerCase().includes(search.toLowerCase()) ||
        b.lesson.lesson_code.toLowerCase().includes(search.toLowerCase()) ||
        (b.lesson.description && b.lesson.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [currentList, search]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    const list = getListByLang(selectedLang);
    const maxNum = list.length > 0 ? Math.max(...list.map((b) => b.lesson.lesson_number)) : 1;
    setFormData({
      language: selectedLang,
      lesson_number: maxNum + 1,
      sub_lesson_number: 1,
      title: '',
      description: '',
      content: '',
    });
    setIsAddModalOpen(true);
  };

  // Save New Lesson
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Please enter both title and practice content.');
      return;
    }

    const lessonCode = `${formData.language}-${formData.lesson_number}-${formData.sub_lesson_number}`;
    const newLessonId = 'les-' + Date.now();
    const newBundle: LessonBundle = {
      lesson: {
        id: newLessonId,
        language: formData.language,
        lesson_number: Number(formData.lesson_number),
        sub_lesson_number: Number(formData.sub_lesson_number),
        lesson_code: lessonCode,
        title: formData.title.trim(),
        description: formData.description.trim() || `${formData.title} practice exercises`,
        sort_order: formData.lesson_number * 10 + formData.sub_lesson_number,
      },
      text: {
        id: 'lt-' + Date.now(),
        lesson_id: newLessonId,
        content: formData.content.trim(),
      },
    };

    setListByLang(formData.language, (prev) => [newBundle, ...prev]);

    // Save to Supabase if configured
    if (supabase) {
      try {
        await supabase.from('lessons').insert([newBundle.lesson]);
        await supabase.from('lesson_texts').insert([newBundle.text]);
      } catch (err) {
        console.warn('Failed to insert into Supabase', err);
      }
    }

    setIsAddModalOpen(false);
    showToast(`Lesson "${newBundle.lesson.title}" created successfully!`);
  };

  // Open Edit Modal
  const handleOpenEdit = (bundle: LessonBundle) => {
    setEditingBundle(bundle);
    setFormData({
      language: bundle.lesson.language,
      lesson_number: bundle.lesson.lesson_number,
      sub_lesson_number: bundle.lesson.sub_lesson_number,
      title: bundle.lesson.title,
      description: bundle.lesson.description || '',
      content: bundle.text.content,
    });
  };

  // Save Edit
  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBundle) return;

    const updatedBundle: LessonBundle = {
      ...editingBundle,
      lesson: {
        ...editingBundle.lesson,
        title: formData.title.trim(),
        description: formData.description.trim(),
      },
      text: {
        ...editingBundle.text,
        content: formData.content.trim(),
      },
    };

    setListByLang(editingBundle.lesson.language, (prev) =>
      prev.map((b) => (b.lesson.id === editingBundle.lesson.id ? updatedBundle : b))
    );

    if (supabase) {
      try {
        await supabase
          .from('lessons')
          .update({
            title: updatedBundle.lesson.title,
            description: updatedBundle.lesson.description,
          })
          .eq('id', updatedBundle.lesson.id);

        await supabase
          .from('lesson_texts')
          .update({ content: updatedBundle.text.content })
          .eq('lesson_id', updatedBundle.lesson.id);
      } catch (err) {
        console.warn('Failed to update Supabase lesson', err);
      }
    }

    setEditingBundle(null);
    showToast(`Lesson "${updatedBundle.lesson.title}" updated successfully!`);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setListByLang(deleteTarget.lesson.language, (prev) =>
      prev.filter((b) => b.lesson.id !== deleteTarget.lesson.id)
    );

    if (supabase) {
      try {
        await supabase.from('lessons').delete().eq('id', deleteTarget.lesson.id);
      } catch (err) {
        console.warn('Failed to delete Supabase lesson', err);
      }
    }

    showToast(`Lesson "${deleteTarget.lesson.title}" deleted.`);
    setDeleteTarget(null);
  };

  const tabs = [
    { id: 'english', label: 'English Curriculum' },
    { id: 'urdu-phonetic', label: 'اردو Phonetic' },
    { id: 'urdu-standard', label: 'اردو Standard' },
  ];

  const isUrdu = selectedLang.startsWith('urdu');

  return (
    <PageWrapper maxWidth="wide">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-emerald-600" />
                Lesson Content Manager
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Full CRUD control: add new lessons, update typing texts, and configure exercises.
              </p>
            </div>

            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
              Add New Lesson
            </Button>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Track Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={selectedLang}
            onChange={(id) => {
              setSelectedLang(id as Language);
              setSearch('');
            }}
          />

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lessons by title, code..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredLessons.length} lessons in {tabs.find((t) => t.id === selectedLang)?.label}
            </span>
          </div>

          {/* Lessons Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Title &amp; Description</th>
                    <th className="py-3 px-4">Language Track</th>
                    <th className="py-3 px-4 text-center">Sub-Lesson</th>
                    <th className="py-3 px-4 text-center">Text Length</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLessons.map((b) => (
                    <tr key={b.lesson.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {b.lesson.lesson_code}
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{b.lesson.title}</span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {b.lesson.description || 'No description'}
                        </span>
                      </td>

                      <td className="py-3 px-4 capitalize text-slate-700">
                        {b.lesson.language.replace('-', ' ')}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        Level {b.lesson.lesson_number}.{b.lesson.sub_lesson_number}
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-slate-500">
                        {b.text.content.length} chars
                      </td>

                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ADD LESSON MODAL */}
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-2xl max-w-lg w-[90vw] max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add New Typing Lesson</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Language Track</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="english">English</option>
                  <option value="urdu-phonetic">Urdu Phonetic</option>
                  <option value="urdu-standard">Urdu Standard</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Lesson Number"
                  type="number"
                  min={1}
                  value={formData.lesson_number}
                  onChange={(e) => setFormData({ ...formData, lesson_number: parseInt(e.target.value) || 1 })}
                />
                <Input
                  label="Sub-Lesson Number"
                  type="number"
                  min={1}
                  max={3}
                  value={formData.sub_lesson_number}
                  onChange={(e) => setFormData({ ...formData, sub_lesson_number: parseInt(e.target.value) || 1 })}
                />
              </div>

              <Input
                label="Lesson Title"
                placeholder="e.g. Home Row Mastery"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                label="Description"
                placeholder="e.g. Master resting positions for index fingers"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Typing Practice Content (Target String)
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter characters or sentences to type..."
                  dir={formData.language.startsWith('urdu') ? 'rtl' : 'ltr'}
                  className={`w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 ${
                    formData.language.startsWith('urdu') ? 'font-urdu-typing text-xl' : 'font-mono-typing text-sm'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Create Lesson
                </Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* EDIT LESSON MODAL */}
      {editingBundle && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: 'none' }}
            onClick={() => setEditingBundle(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-2xl max-w-lg w-[90vw] max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Lesson</h3>
                <span className="font-mono text-xs text-blue-600">{editingBundle.lesson.lesson_code}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingBundle(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateLesson} className="space-y-4 text-xs">
              <Input
                label="Lesson Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Typing Practice Content (Target String)
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  dir={editingBundle.lesson.language.startsWith('urdu') ? 'rtl' : 'ltr'}
                  className={`w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 ${
                    editingBundle.lesson.language.startsWith('urdu')
                      ? 'font-urdu-typing text-xl'
                      : 'font-mono-typing text-sm'
                  }`}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setEditingBundle(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: 'none' }}
            onClick={() => setDeleteTarget(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-2xl max-w-md w-[90vw] p-6 shadow-2xl border border-slate-200 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Lesson Confirmation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Are you sure you want to delete <span className="font-bold text-slate-800">{deleteTarget.lesson.title}</span> (<code>{deleteTarget.lesson.lesson_code}</code>)? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={handleConfirmDelete}>
                Delete Permanently
              </Button>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
};
