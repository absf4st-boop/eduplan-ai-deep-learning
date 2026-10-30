/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, SavedDocument } from './types';
import {
  getActiveSession,
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
  const [currentUser, setUser] = useState<UserAccount | null>(() => getActiveSession());
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>(() => {
    return getActiveSession() ? 'dashboard' : 'landing';
  });

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
    } else {
      setSavedDocs([]);
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
    setUser(null);
    setCurrentView('landing');
  };

  const handleSaveDoc = (doc: SavedDocument) => {
    if (!currentUser) return;
    saveDocument(doc);
    setSavedDocs(getSavedDocuments(currentUser.id));
  };

  const handleDeleteDoc = (docId: string) => {
    if (!currentUser) return;
    deleteDocument(docId);
    setSavedDocs(getSavedDocuments(currentUser.id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-900 selection:text-white">
      {/* Main View Router */}
      <div className="flex-1">
        {currentView === 'landing' || !currentUser ? (
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
            onAutoLogin={(user) => handleAuthSuccess(user, false)}
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

      {/* Footer on landing page */}
      {(currentView === 'landing' || !currentUser) && (
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
      {currentUser && (
        <ProfileModal
          isOpen={profileModalOpen}
          currentUser={currentUser}
          onClose={() => setProfileModalOpen(false)}
          onSaved={(updated) => setUser(updated)}
        />
      )}

      {/* Netlify & GitHub Deployment Guide Modal */}
      <PublishGuideModal
        isOpen={publishGuideOpen}
        onClose={() => setPublishGuideOpen(false)}
      />
    </div>
  );
}
