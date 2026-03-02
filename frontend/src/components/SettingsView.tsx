import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, Download, Trash2, LogOut, Users, PlusCircle, X } from 'lucide-react';

export const SettingsView = () => {
    const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 relative"
            >
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-2xl font-light text-[var(--color-slate)]">Settings</h2>
                </div>

                <div className="space-y-6">

                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-widest text-[var(--color-slate)]/60 font-semibold px-2 mb-2">Algorithm Training</h3>
                        <div className="glass-card divide-y divide-[var(--color-sand)]">
                            <div
                                onClick={() => setIsLoggingModalOpen(true)}
                                className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-[var(--color-sand)]/30 transition-colors group"
                            >
                                <div className="text-[var(--color-slate)] group-hover:text-[var(--color-terracotta)] transition-colors"><PlusCircle size={20} /></div>
                                <div>
                                    <div className="font-medium text-[var(--color-slate)]">Log Past Cycles</div>
                                    <div className="text-xs text-[var(--color-slate)]/60">Help Aura learn your unique baseline</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-widest text-[var(--color-slate)]/60 font-semibold px-2 mb-2">Account</h3>
                        <div className="glass-card divide-y divide-[var(--color-sand)]">
                            <SettingItem icon={<Users size={20} />} label="Partner Sharing" text="Manage invited partners" />
                            <SettingItem icon={<Bell size={20} />} label="Notifications" text="Push and email settings" />
                            <SettingItem className="text-red-500" icon={<LogOut size={20} />} label="Sign out" text="Sign out of your account" />
                        </div>
                    </div>

                    {/* <div className="space-y-2">
                        <h3 className="text-xs uppercase tracking-widest text-[var(--color-slate)]/60 font-semibold px-2 mb-2">Data & Export</h3>
                        <div className="glass-card divide-y divide-[var(--color-sand)]">
                            <SettingItem icon={<Download size={20} />} label="Export Data" text="Download CSV/JSON of logs" />
                            <div className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-[var(--color-sand)]/30 transition-colors group">
                                <div className="text-red-400 group-hover:text-red-500 transition-colors"><Trash2 size={20} /></div>
                                <div>
                                    <div className="font-medium text-red-500">Delete Account & Data</div>
                                    <div className="text-xs text-[var(--color-slate)]/60">Permanently erase all health data</div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </motion.div>

            <AnimatePresence>
                {isLoggingModalOpen && (
                    <PastCycleModal onClose={() => setIsLoggingModalOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

const PastCycleModal = ({ onClose }: { onClose: () => void }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [maxPastMonths, setMaxPastMonths] = useState<number | null>(null);

    // Fetch config for max past months allowed
    useState(() => {
        fetch('http://localhost:4000/api/config')
            .then(res => res.json())
            .then(data => {
                if (data.maxPastMonthsCycleLogging !== undefined) {
                    setMaxPastMonths(data.maxPastMonthsCycleLogging);
                }
            })
            .catch(console.error);
    });

    // Calculate minimum allowed date string (YYYY-MM-DD)
    const getMinDateString = () => {
        if (maxPastMonths === null) return undefined;
        const d = new Date();
        d.setMonth(d.getMonth() - maxPastMonths);
        return d.toISOString().split('T')[0];
    };

    const minDateStr = getMinDateString();

    const handleSave = async () => {
        if (!startDate || !endDate) return;
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('http://localhost:4000/api/cycles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start_date: startDate, end_date: endDate })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to log cycle');
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (e: any) {
            setStatus('error');
            setErrorMessage(e.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-[var(--color-background)] w-full max-w-sm rounded-[32px] p-6 shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[var(--color-slate)]/50 hover:text-[var(--color-slate)]"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-light text-[var(--color-slate)] mb-1">Log Past Cycle</h3>
                <p className="text-sm text-[var(--color-slate)]/60 mb-6 w-10/12">
                    Entering previous periods helps Aura personalize your predictions.
                    {maxPastMonths !== null && ` You can log up to ${maxPastMonths} months in the past.`}
                </p>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-medium text-[var(--color-slate)]/80">Started On</label>
                        <input
                            type="date"
                            min={minDateStr}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-white border border-[var(--color-sand)] rounded-xl px-4 py-3 text-sm text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-sage-dark)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-medium text-[var(--color-slate)]/80">Ended On</label>
                        <input
                            type="date"
                            min={minDateStr}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-white border border-[var(--color-sand)] rounded-xl px-4 py-3 text-sm text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-sage-dark)]"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSave}
                        disabled={status === 'loading' || status === 'success'}
                        className={`w-full py-4 rounded-xl font-medium transition-all ${status === 'success' ? 'bg-[var(--color-sage)] text-white' :
                            'bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta)]/90 text-white'
                            }`}
                    >
                        {status === 'loading' ? 'Saving...' :
                            status === 'success' ? 'Logged Successfully!' :
                                'Save Cycle Data'}
                    </button>
                    {status === 'error' && <p className="text-red-500 text-xs text-center mt-3">{errorMessage || 'Failed to connect to server.'}</p>}
                </div>
            </motion.div>
        </motion.div>
    );
};

const SettingItem = ({ icon, label, text, className }: { icon: React.ReactNode, label: string, text: string, className?: string }) => {
    return (
        <div className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-[var(--color-sand)]/30 transition-colors group ${className || ''}`}>
            <div className={`${className || 'text-[var(--color-slate)]'} group-hover:text-[var(--color-terracotta)] transition-colors`}>{icon}</div>
            <div>
                <div className={`font-medium ${className || 'text-[var(--color-slate)]'}`}>{label}</div>
                <div className="text-xs text-[var(--color-slate)]/60">{text}</div>
            </div>
        </div>
    );
};
