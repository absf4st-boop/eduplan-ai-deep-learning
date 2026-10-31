import React, { useState, useEffect } from 'react';
import { UserAccount } from './types';
import {
  getActiveSession,
  setCurrentUser,
  clearCurrentUser,
  getDemoUser,
  saveRegisteredUser
} from './services/storage';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { PublishGuideModal } from './components/PublishGuideModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import './services/firebase';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [publishGuideOpen, setPublishGuideOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const session = getActiveSession();
    // Only automatically stay logged in if there is an explicit user session
    if (session) {
      setCurrentUserState(session);
    }
    setIsInitializing(false);
  }, []);

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserAccount, isNewRegistration: boolean = false) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUserState(null);
  };

  const handleUserUpdated = (updated: UserAccount) => {
    setCurrentUserState(updated);
    saveRegisteredUser(updated);
    setCurrentUser(updated);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-sm font-semibold animate-pulse">
          Memuat EDU PLAN AI...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Main View: If user is logged in, show Dashboard. Otherwise show Landing Page directly (no preview banner) */}
      {currentUser ? (
        <DashboardView
          user={currentUser}
          onLogout={handleLogout}
          onUserUpdated={handleUserUpdated}
        />
      ) : (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onOpenPublishGuide={() => setPublishGuideOpen(true)}
        />
      )}

      {/* Floating WhatsApp Help Button (always visible and easy to access) */}
      <WhatsAppButton phoneNumber="6285725080078" />

      {/* Auth Modal (Login / Register OTP) */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authInitialTab}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* GitHub & Netlify Publish Guide Modal */}
      <PublishGuideModal
        isOpen={publishGuideOpen}
        onClose={() => setPublishGuideOpen(false)}
      />
    </div>
  );
}
