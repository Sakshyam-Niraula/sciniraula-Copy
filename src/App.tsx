import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { SubjectPage } from './components/labs/SubjectPage';
import { LaboratoryWorkspace } from './components/workspace/LaboratoryWorkspace';
import { SearchModal } from './components/common/SearchModal';
import { BookmarksDrawer } from './components/common/BookmarksDrawer';
import { SubjectId, UserProgress } from './types';
import { loadUserProgress, toggleBookmarkStorage, markCompletedStorage, recordVisitedStorage } from './services/storage';

export function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentParam, setCurrentParam] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress());
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Sync scroll to top on navigation
  const handleNavigate = (view: string, param?: any) => {
    setCurrentView(view);
    setCurrentParam(param || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'experiment' && param) {
      const updated = recordVisitedStorage(param);
      setUserProgress(updated);
    }
  };

  const handleToggleBookmark = (id: string) => {
    const updated = toggleBookmarkStorage(id);
    setUserProgress(updated);
  };

  const handleMarkCompleted = (id: string) => {
    const updated = markCompletedStorage(id);
    setUserProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col selection:bg-sky-500 selection:text-slate-950">
      {/* Global Navigation Header */}
      <Navbar
        currentView={currentView === 'subject' ? `subject-${currentParam}` : currentView}
        onNavigate={handleNavigate}
        bookmarkCount={userProgress.bookmarkedIds.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onNavigate={handleNavigate} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            userProgress={userProgress}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'subject' && (
          <SubjectPage
            subjectId={(currentParam as SubjectId) || 'physics'}
            onNavigate={handleNavigate}
            userProgress={userProgress}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView === 'experiment' && (
          <LaboratoryWorkspace
            experimentId={currentParam || 'projectile-motion'}
            onNavigate={handleNavigate}
            userProgress={userProgress}
            onToggleBookmark={handleToggleBookmark}
            onMarkCompleted={handleMarkCompleted}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Search Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectExperiment={(id) => handleNavigate('experiment', id)}
      />

      {/* Bookmarks Side Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedIds={userProgress.bookmarkedIds}
        onSelectExperiment={(id) => handleNavigate('experiment', id)}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
}

export default App;
