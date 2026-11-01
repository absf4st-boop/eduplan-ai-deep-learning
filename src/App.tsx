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
import {
  auth,
  signOutFirebase,
  subscribeToUserProfile,
  subscribeToUserDocuments,
  loadUserFromFirestore,
  loadDocumentsFromFirestore,
  loadStudentsFromFirestore
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [publishGuideOpen, setPublishGuideOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize session on mount and attach onSnapshot listeners after Firebase Authentication
  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      setCurrentUserState(session);
    }

    let unsubProfile: (() => void) | null = null;
    let unsubDocs: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      // Clean up previous Firestore listeners if any
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (unsubDocs) {
        unsubDocs();
        unsubDocs = null;
      }

      if (fUser) {
        // 1. UTAMA: Tarik data profil pengguna langsung dari Firebase Firestore
        try {
          const cloudProfile = await loadUserFromFirestore(fUser.uid);
          const cloudDocs = await loadDocumentsFromFirestore(fUser.uid);
          const cloudStudents = await loadStudentsFromFirestore(fUser.uid);

          if (cloudProfile && cloudProfile.name) {
            const alignedUser: UserAccount = {
              ...cloudProfile,
              id: fUser.uid,
              email: fUser.email || cloudProfile.email,
              lastLogin: new Date().toISOString(),
            };
            setCurrentUserState(alignedUser);
            setCurrentUser(alignedUser);
          } else {
            const active = getActiveSession();
            if (active && !active.isDemo) {
              const aligned: UserAccount = {
                ...active,
                id: fUser.uid,
                email: fUser.email || active.email,
              };
              setCurrentUserState(aligned);
              setCurrentUser(aligned);
            }
          }

          // Sinkronkan dokumen dari Firestore ke cache lokal perangkat ini
          if (cloudDocs && cloudDocs.length > 0) {
            localStorage.setItem('eduplan_documents_v2', JSON.stringify(cloudDocs));
            window.dispatchEvent(new CustomEvent('eduplan:documents-updated', { detail: cloudDocs }));
          }

          // Sinkronkan siswa dari Firestore ke cache lokal perangkat ini
          if (cloudStudents && cloudStudents.length > 0) {
            localStorage.setItem(`eduplan_students_v2_${fUser.uid}`, JSON.stringify(cloudStudents));
          }
        } catch (err) {
          console.error('Error fetching initial Firestore data:', err);
        }

        // 2. Pasang onSnapshot listener untuk Profil Pengguna
        unsubProfile = subscribeToUserProfile(fUser.uid, (firestoreUser) => {
          if (firestoreUser) {
            setCurrentUserState((prev) => {
              const merged = {
                ...(prev || {}),
                ...firestoreUser,
                id: fUser.uid,
              };
              localStorage.setItem('eduplan_current_user_v2', JSON.stringify(merged));
              return merged as UserAccount;
            });
          }
        });

        // 3. Pasang onSnapshot listener untuk Dokumen Kurikulum
        unsubDocs = subscribeToUserDocuments(fUser.uid, (firestoreDocs) => {
          if (firestoreDocs) {
            try {
              localStorage.setItem('eduplan_documents_v2', JSON.stringify(firestoreDocs));
              window.dispatchEvent(
                new CustomEvent('eduplan:documents-updated', { detail: firestoreDocs })
              );
            } catch (e) {
              console.error('Failed to sync Firestore docs to localStorage', e);
            }
          }
        });
      }

      setIsInitializing(false);
    });

    setIsInitializing(false);
    return () => {
      unsubscribeAuth();
      if (unsubProfile) unsubProfile();
      if (unsubDocs) unsubDocs();
    };
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
    signOutFirebase();
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
