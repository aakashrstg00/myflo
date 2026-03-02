import { CycleRing } from '@/components/CycleRing';
import { QuickLogTray } from '@/components/SymptomChip';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { differenceInDays, format } from 'date-fns';

export const HomeView = () => {
    const { user, cycles, predictions } = useAppStore();

    // Calculate current cycle progression based on mock data
    // Assuming the last element is the current active cycle
    const currentCycle = cycles.length > 0 ? cycles[cycles.length - 1] : null;
    let dayOfCycle = 1;
    let totalDays = predictions?.averageCycleLength;

    if (currentCycle) dayOfCycle = differenceInDays(new Date(), new Date(currentCycle.start_date)) + 1;

    let phase = 'Menstrual';
    if (totalDays) {
        const percentage = dayOfCycle / totalDays;
        if (percentage <= 0.25) {
            phase = 'Menstrual';
        } else if (percentage <= 0.50) {
            phase = 'Follicular';
        } else if (percentage <= 0.75) {
            phase = 'Ovulation';
        } else {
            phase = 'Luteal';
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
        >
            <div className="text-center space-y-1 mt-4">
                <h2 className="text-3xl font-light text-[var(--color-slate)]">Hello, {user?.name || 'Aakash'}.</h2>
                <p className="text-[var(--color-slate)]/60 text-sm tracking-wide uppercase font-medium">{format(new Date(), 'EEEE, MMMM d')}</p>
            </div>

            {/* Dashboard View */}
            <div className="flex flex-col items-center">
                <CycleRing dayOfCycle={dayOfCycle} cycleDays={predictions?.averagePeriodLength} totalDays={totalDays} phase={phase} />
            </div>

            {/* <div className="flex justify-center text-xs font-mono text-[var(--color-slate)]/40 bg-[var(--color-sand)] p-2 rounded-xl border border-[var(--color-sand)] shadow-sm">
                {apiStatus}
            </div> */}

            <QuickLogTray />

            {/* Quick Insights Snippet */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--color-slate)] px-2">Today's Insight</h3>
                <div className="glass-card p-5 border-l-4 border-l-[var(--color-terracotta)]">
                    <p className="text-sm text-[var(--color-slate)]/70 leading-relaxed">
                        Data from your last 2 cycles averaged {totalDays} days. You are on day {dayOfCycle}, predicting a stable {phase} phase.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
