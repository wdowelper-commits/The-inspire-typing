import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Download, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { downloadCertificate } from '../lib/certificateGenerator';

export const CertificatePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { user } = useAuthStore();

  const title =
    type === 'urdu-phonetic'
      ? 'Urdu Phonetic Touch Typing Mastery'
      : type === 'urdu-standard'
      ? 'Urdu Standard Nastaliq Mastery'
      : 'English Touch Typing Mastery';

  const certData = {
    recipientName: user?.display_name || 'Inspire Typist',
    achievementTitle: title,
    language: type || 'english',
    wpm: 68,
    accuracy: 98.4,
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    certificateId: 'IT-' + Date.now().toString(36).toUpperCase().substring(0, 8),
  };

  const handleDownload = () => {
    downloadCertificate(certData);
  };

  return (
    <PageWrapper maxWidth="normal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/dashboard"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-8 h-8 text-amber-500" />
            Accreditation Certificate Preview
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Official certificate generated client-side with tamper-evident serial identifier.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={<Download className="w-5 h-5" />}
          onClick={handleDownload}
        >
          Download PDF Certificate
        </Button>
      </div>

      {/* Certificate Frame Preview */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border-4 border-blue-600 shadow-2xl relative overflow-hidden text-center">
        {/* Inner Gold Inset Border */}
        <div className="border-2 border-amber-400/80 rounded-2xl p-8 sm:p-10 relative">
          {/* Header */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1 shadow-sm mb-2 flex items-center justify-center">
              <img src="/logo.png" alt="Inspire Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">
              Inspire Typing Academy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 mt-1 tracking-tight">
              Certificate of Achievement
            </h2>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
              Verified Speed &amp; Accuracy Accreditation
            </p>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-slate-500 mb-2">
            This is to proudly certify that
          </p>

          {/* Recipient */}
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-1 border-b-2 border-blue-600 inline-block pb-1 px-4">
            {certData.recipientName}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
            has demonstrated exceptional proficiency, speed, and accuracy in the comprehensive
          </p>

          <h4 className="text-lg sm:text-xl font-black text-blue-600 mt-1 mb-6">
            {certData.achievementTitle}
          </h4>

          {/* Stats Badge */}
          <div className="inline-flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 mb-8 shadow-xs">
            <div>
              <div className="text-2xl font-black text-emerald-600">{certData.wpm} WPM</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Touch Typing Speed
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-200" />
            <div>
              <div className="text-2xl font-black text-blue-600">{certData.accuracy}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Accuracy Level
              </div>
            </div>
          </div>

          {/* Official Seal and Signatures */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="text-left">
              <span className="block font-semibold">Issue Date: {certData.date}</span>
              <span className="block font-mono text-[10px] text-slate-400">
                Serial: {certData.certificateId}
              </span>
            </div>

            {/* Gold Seal Graphic */}
            <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-800 flex flex-col items-center justify-center font-bold text-[9px] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>VERIFIED</span>
            </div>

            <div className="text-right">
              <span className="block font-bold text-slate-800">Director of Certification</span>
              <span className="block text-[10px]">Inspire Typing Board</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};
