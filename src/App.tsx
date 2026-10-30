/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, SavedDocument } from './types';
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getSavedDocuments,
  saveDocument,
  deleteDocument,
  DEMO_USER,
} from './services/storage';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { PublishGuideModal } from './components/PublishGuideModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';

export default function App() {
  const [currentUser, setUser] = useState<UserAccount>(() => getCurrentUser());
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('dashboard');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [publishGuideOpen, setPublishGuideOpen] = useState<boolean>(false);

  // Saved documents scoped by current user id
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);

  // Reload documents whenever user changes
  useEffect(() => {
    if (currentUser) {
      const docs = getSavedDocuments(currentUser.id);
      setSavedDocs(docs);
    }
  }, [currentUser]);

  const handleAuthSuccess = (user: UserAccount, isNewRegistration: boolean) => {
    setUser(user);
    setAuthModalOpen(false);
    setCurrentView('dashboard');
    if (isNewRegistration) {
      // Prompt user to customize their teacher & school profile right away
      setProfileModalOpen(true);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setUser(DEMO_USER); // revert to clean demo profile
    setCurrentView('landing');
  };

  const handleSaveDoc = (doc: SavedDocument) => {
    saveDocument(doc);
    setSavedDocs(getSavedDocuments(currentUser.id));
  };

  const handleDeleteDoc = (docId: string) => {
    deleteDocument(docId);
    setSavedDocs(getSavedDocuments(currentUser.id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-900 selection:text-white">
      {/* Top Banner when viewing Landing Page but logged in */}
      {currentView === 'landing' && (
        <div className="bg-blue-950 text-amber-300 px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2">
          <span>Mode Pratinjau Landing Page.</span>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="underline font-bold text-white hover:text-amber-200"
          >
            Buka Dashboard Administrasi Guru →
          </button>
        </div>
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenRegister={() => {
              setAuthMode('register');
              setAuthModalOpen(true);
            }}
            onOpenLogin={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            onOpenPublishGuide={() => setPublishGuideOpen(true)}
          />
        ) : (
          <DashboardView
            currentUser={currentUser}
            savedDocuments={savedDocs}
            onSaveDocument={handleSaveDoc}
            onDeleteDocument={handleDeleteDoc}
            onOpenProfile={() => setProfileModalOpen(true)}
            onLogout={handleLogout}
            onOpenPublishGuide={() => setPublishGuideOpen(true)}
          />
        )}
      </div>

      {/* Footer on landing page or main views */}
      {currentView === 'landing' && (
        <Footer onOpenPublishGuide={() => setPublishGuideOpen(true)} />
      )}

      {/* Always Easy to Find WhatsApp Floating Support */}
      <WhatsAppButton />

      {/* Auth Modal (Login / Register / OTP 6-Digit / Forgot Password) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Profile & School Identity Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        currentUser={currentUser}
        onClose={() => setProfileModalOpen(false)}
        onSaved={(updated) => setUser(updated)}
      />

      {/* Netlify & GitHub Deployment Guide Modal */}
      <PublishGuideModal
        isOpen={publishGuideOpen}
        onClose={() => setPublishGuideOpen(false)}
      />
    </div>
  );
}
