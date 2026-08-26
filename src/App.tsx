import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SuperAppProvider, useSuperApp } from './context/SuperAppContext';
import { OmniBrainProvider } from './context/OmniBrainContext';
import { TopHeader } from './components/shell/TopHeader';
import { BottomNavBar } from './components/shell/BottomNavBar';
import { AppLauncherModal } from './components/shell/AppLauncherModal';
import { OmniBrainDrawer } from './components/shell/OmniBrainDrawer';
import { ToastContainer } from './components/shell/ToastContainer';
import { AuthPage } from './components/auth/AuthPage';

// Mini-App Views
import { SuperAppHome } from './components/hub/SuperAppHome';
import { MediaStudioView } from './components/media/MediaStudioView';
import { AstrologyView } from './components/astrology/AstrologyView';
import { SocialFeedView } from './components/social/SocialFeedView';
import { RealEstateView } from './components/realestate/RealEstateView';
import { MatrimonyView } from './components/matrimony/MatrimonyView';
import { TutorView } from './components/tutor/TutorView';
import { LiveChatMessenger } from './components/chat/LiveChatMessenger';
import { DigitalWalletView } from './components/wallet/DigitalWalletView';
import { TasksAndCalendar } from './components/productivity/TasksAndCalendar';
import { UtilitiesView } from './components/utilities/UtilitiesView';
import { SettingsView } from './components/settings/SettingsView';

const SuperAppContent: React.FC = () => {
  const { activeMiniApp, isAuthenticated } = useSuperApp();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

  // If user is not authenticated, show the Login/Registration screen
  if (!isAuthenticated) {
    return (
      <>
        <AuthPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activeMiniApp) {
      case 'home':
        return <SuperAppHome />;
      case 'media_studio':
        return <MediaStudioView />;
      case 'astrology':
        return <AstrologyView />;
      case 'social':
        return <SocialFeedView />;
      case 'realestate':
        return <RealEstateView />;
      case 'matrimony':
        return <MatrimonyView />;
      case 'tutor':
        return <TutorView />;
      case 'chat':
        return <LiveChatMessenger />;
      case 'wallet':
        return <DigitalWalletView />;
      case 'productivity':
        return <TasksAndCalendar />;
      case 'utilities':
        return <UtilitiesView />;
      case 'settings':
        return <SettingsView />;
      case 'brain':
      default:
        return <SuperAppHome />;
    }
  };

  const isChatView = activeMiniApp === 'chat';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased overflow-x-hidden">
      {/* Sticky Top Header */}
      <TopHeader onOpenLauncher={() => setIsLauncherOpen(true)} />

      {/* Main Mini-App Viewport with Safe Bottom Padding */}
      <main className={`flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-7 ${isChatView ? 'pb-20 sm:pb-24' : 'pb-28 sm:pb-32'}`}>
        {renderActiveView()}
      </main>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar onOpenLauncher={() => setIsLauncherOpen(true)} />

      {/* Mini-App Launcher Modal */}
      <AppLauncherModal
        isOpen={isLauncherOpen}
        onClose={() => setIsLauncherOpen(false)}
      />

      {/* OmniBrain Autonomous Agent Sidecar Drawer */}
      <OmniBrainDrawer />

      {/* Floating System Toast */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <SuperAppProvider>
        <OmniBrainProvider>
          <SuperAppContent />
        </OmniBrainProvider>
      </SuperAppProvider>
    </ThemeProvider>
  );
}

export default App;
