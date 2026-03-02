import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BottomTabBar } from '@/components/BottomTabBar';
import { useAppStore } from '@/store';

import { HomeView } from '@/components/HomeView';
import { CalendarView } from '@/components/CalendarView';
import { InsightsView } from '@/components/InsightsView';
import { SettingsView } from '@/components/SettingsView';

function App() {
  const [apiStatus, setApiStatus] = useState("Connecting to backend...");
  const [showProfile, setShowProfile] = useState(false);
  const { activeTab, setUser, setCycles, setPredictions, user } = useAppStore();

  useEffect(() => {
    // Quick API hit to demonstrate it's working
    fetch('http://localhost:4000/api/health')
      .then(res => res.json())
      .then(data => setApiStatus("Backend Status: " + data.status))
      .catch(() => setApiStatus("Backend Status: Offline (Start the BE module)"));

    // Fetch mock user and cycle data
    fetch('http://localhost:4000/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(console.error);

    fetch('http://localhost:4000/api/cycles')
      .then(res => res.json())
      .then(data => setCycles(data.cycles))
      .catch(console.error);

    fetch('http://localhost:4000/api/predictions')
      .then(res => res.json())
      .then(data => setPredictions(data.predictions))
      .catch(console.error);

  }, [setUser, setCycles, setPredictions]);

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] text-[var(--color-foreground)] pb-24 font-sans antialiased overflow-x-hidden relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--color-sand)] rounded-bl-[100px]-md border-none to-transparent opacity-80 pointer-events-none" />

      {/* Top Navigation */}
      <header className="px-6 py-2 flex justify-between items-center relative z-50 glass backdrop-blur-3xl sticky top-0 border-b border-[var(--color-sand)] shadow-sm">
        <h1 className="text-xl font-medium tracking-tight text-[var(--color-slate)]">Project Aura</h1>

        <div className="relative">
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-[var(--color-sage)]/20 shadow-inner flex items-center justify-center border border-[var(--color-sage)]/30 text-[var(--color-sage-dark)] cursor-pointer hover:bg-[var(--color-sage)]/30 transition-colors"
          >
            {user?.name?.[0] || "?"}
          </div>

          <AnimatePresence>
            {showProfile && user && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-white/60 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-[var(--color-sand)]"
              >
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-[var(--color-slate)] text-base">{user.name}</span>
                  <span className="text-[var(--color-slate)]/70 text-xs truncate" title={user.email}>{user.email}</span>
                  {user.created_at && (
                    <span className="text-[var(--color-slate)]/50 text-[10px] uppercase tracking-wider mt-3 pt-3 border-t border-[var(--color-sand)] block">
                      Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 py-8 pb-32 max-w-lg mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && <HomeView key="home" />}
          {activeTab === 'calendar' && <CalendarView key="calendar" />}
          {activeTab === 'insights' && <InsightsView key="insights" />}
          {activeTab === 'settings' && <SettingsView key="settings" />}
        </AnimatePresence>
      </main>

      {/* Bottom Bar */}
      <BottomTabBar />
    </div>
  );
}

export default App;
