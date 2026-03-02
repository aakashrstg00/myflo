import { useAppStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Circle, Calendar, BarChart2, Settings } from 'lucide-react';

export const BottomTabBar = () => {
    const { activeTab, setActiveTab } = useAppStore();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[var(--color-sand)] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
            <div className="flex justify-around items-center h-20 px-4 max-w-lg mx-auto">
                <Tab icon="home" label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <Tab icon="calendar" label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                <Tab icon="insights" label="Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
                <Tab icon="settings" label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>
        </div>
    );
};

// Simplified icon component using lucide-react
const Tab = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick: () => void }) => {

    const IconComponent = () => {
        switch (icon) {
            case 'home': return <Circle strokeWidth={active ? 2.5 : 2} size={24} />;
            case 'calendar': return <Calendar strokeWidth={active ? 2.5 : 2} size={24} />;
            case 'insights': return <BarChart2 strokeWidth={active ? 2.5 : 2} size={24} />;
            case 'settings': return <Settings strokeWidth={active ? 2.5 : 2} size={24} />;
            default: return null;
        }
    };

    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center space-y-1 w-16 h-16 rounded-2xl transition-all relative cursor-pointer ${active ? 'text-[var(--color-terracotta)]' : 'text-[var(--color-slate)] opacity-60 hover:opacity-100'}`}>
            <AnimatePresence>
                {active && (
                    <motion.div
                        layoutId="activeTabBackground"
                        className="absolute inset-0 bg-[var(--color-sand)] rounded-2xl z-[-1]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </AnimatePresence>
            <IconComponent />
            <span className={`text-[10px] tracking-wide uppercase ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
        </button>
    );
};
