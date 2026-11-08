/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';
import { Spinner } from './components/ui/Spinner';
import { AICoachModal } from './components/ai/AICoachModal';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const LessonsPage = lazy(() => import('./pages/LessonsPage').then((m) => ({ default: m.LessonsPage })));
const LessonDetail = lazy(() => import('./pages/LessonDetail').then((m) => ({ default: m.LessonDetail })));
const TestPage = lazy(() => import('./pages/TestPage').then((m) => ({ default: m.TestPage })));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage').then((m) => ({ default: m.LeaderboardPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const CertificatePage = lazy(() => import('./pages/CertificatePage').then((m) => ({ default: m.CertificatePage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsers })));
const AdminLessons = lazy(() => import('./pages/admin/AdminLessons').then((m) => ({ default: m.AdminLessons })));
const AdminBadges = lazy(() => import('./pages/admin/AdminBadges').then((m) => ({ default: m.AdminBadges })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

export default function App() {
  const [aiCoachOpen, setAICoachOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar onOpenAICoach={() => setAICoachOpen(true)} />

        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size="lg" />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home onOpenAICoach={() => setAICoachOpen(true)} />} />
              <Route path="/lessons" element={<Navigate to="/lessons/english" replace />} />
              <Route path="/lessons/:language" element={<LessonsPage />} />
              <Route path="/lessons/:language/:lessonId" element={<LessonDetail />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<AuthPage initialMode="login" />} />
              <Route path="/signup" element={<AuthPage initialMode="signup" />} />

              {/* Protected Typist Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificate/:type"
                element={
                  <ProtectedRoute>
                    <CertificatePage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={<Navigate to="/admin" replace />}
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/lessons"
                element={
                  <AdminRoute>
                    <AdminLessons />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/badges"
                element={
                  <AdminRoute>
                    <AdminBadges />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <AdminSettings />
                  </AdminRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>

        <Footer />

        {/* Global AI Typing Coach Modal */}
        <AICoachModal isOpen={aiCoachOpen} onClose={() => setAICoachOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
