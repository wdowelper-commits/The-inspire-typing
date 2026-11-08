import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Keyboard, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageWrapper maxWidth="normal">
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
          <Keyboard className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mt-1 mb-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The typing lesson or page you were looking for doesn't exist or has moved.
        </p>
        <Link to="/">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </PageWrapper>
  );
};
